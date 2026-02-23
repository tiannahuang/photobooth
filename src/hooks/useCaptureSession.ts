"use client";

import { useState, useCallback, useRef } from "react";
import { useCamera } from "./useCamera";
import { useCountdown } from "./useCountdown";
import { PAUSE_BETWEEN_PHOTOS, FILTER_CSS } from "@/lib/constants";
import { getSupportedMimeType } from "@/lib/mediaUtils";
import type { CaptureStep, CameraFilter } from "@/types/photobooth";

export interface UseCaptureSessionOptions {
  photoCount: number;
  enableVideo?: boolean;
  targetAspectRatio?: number;
}

export interface UseCaptureSessionReturn {
  step: CaptureStep;
  photos: string[];
  clips: Blob[];
  videoBlob: Blob | null;
  count: number;
  isCountdownRunning: boolean;
  currentPhotoIndex: number;
  camera: ReturnType<typeof useCamera>;
  isMirrored: boolean;
  setMirrored: (mirrored: boolean) => void;
  filter: CameraFilter;
  setFilter: (filter: CameraFilter) => void;
  startSession: () => Promise<void>;
  retakeAll: () => void;
}

export function useCaptureSession({
  photoCount,
  enableVideo = false,
  targetAspectRatio,
}: UseCaptureSessionOptions): UseCaptureSessionReturn {
  const [step, setStep] = useState<CaptureStep>("idle");
  const [photos, setPhotos] = useState<string[]>([]);
  const [clips, setClips] = useState<Blob[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const camera = useCamera();
  const { count, isRunning: isCountdownRunning, startCountdown } = useCountdown();
  const isSessionActive = useRef(false);
  const isMirroredRef = useRef(true);
  const [isMirrored, setIsMirroredState] = useState(true);
  const filterRef = useRef<CameraFilter>("none");
  const [filter, setFilterState] = useState<CameraFilter>("none");
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRecorderRef = useRef<{ recorder: MediaRecorder; chunks: Blob[] } | null>(null);

  const setMirrored = useCallback((mirrored: boolean) => {
    isMirroredRef.current = mirrored;
    setIsMirroredState(mirrored);
  }, []);

  const setFilter = useCallback((f: CameraFilter) => {
    filterRef.current = f;
    setFilterState(f);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const ensureCanvas = useCallback((video: HTMLVideoElement) => {
    if (!videoCanvasRef.current) {
      videoCanvasRef.current = document.createElement("canvas");
    }
    const canvas = videoCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    return canvas;
  }, []);

  const startDrawLoop = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      const f = FILTER_CSS[filterRef.current];
      ctx.filter = f && f !== "none" ? f : "none";
      ctx.save();
      if (isMirroredRef.current) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0);
      ctx.restore();
      ctx.filter = "none";
    };

    drawFrame();
    frameIntervalRef.current = setInterval(drawFrame, 67); // ~15fps for stop-motion feel
  }, []);

  const stopDrawLoop = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  const startSessionRecording = useCallback((canvas: HTMLCanvasElement) => {
    const mimeType = getSupportedMimeType();
    const chunks: Blob[] = [];

    try {
      const stream = canvas.captureStream(15);
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.start();
      sessionRecorderRef.current = { recorder, chunks };
    } catch {
      sessionRecorderRef.current = null;
    }
  }, []);

  const stopSessionRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const session = sessionRecorderRef.current;
      if (!session) {
        resolve(null);
        return;
      }
      const { recorder, chunks } = session;
      if (recorder.state === "inactive") {
        const mimeType = getSupportedMimeType();
        resolve(chunks.length > 0 ? new Blob(chunks, { type: mimeType }) : null);
        sessionRecorderRef.current = null;
        return;
      }
      recorder.onstop = () => {
        const mimeType = getSupportedMimeType();
        resolve(chunks.length > 0 ? new Blob(chunks, { type: mimeType }) : null);
        sessionRecorderRef.current = null;
      };
      recorder.stop();
    });
  }, []);

  const recordClip = useCallback((canvas: HTMLCanvasElement): {
    stop: () => Promise<Blob | null>;
  } => {
    const mimeType = getSupportedMimeType();
    const chunks: Blob[] = [];

    let recorder: MediaRecorder;
    try {
      const stream = canvas.captureStream(15);
      recorder = new MediaRecorder(stream, { mimeType });
    } catch {
      return { stop: async () => null };
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.start();

    return {
      stop: () =>
        new Promise<Blob | null>((resolve) => {
          if (recorder.state === "inactive") {
            resolve(null);
            return;
          }
          recorder.onstop = () => {
            resolve(new Blob(chunks, { type: mimeType }));
          };
          recorder.stop();
        }),
    };
  }, []);

  const startSession = useCallback(async () => {
    isSessionActive.current = true;
    setPhotos([]);
    setClips([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);

    const mediaStream = await camera.startCamera();

    const captured: string[] = [];
    const capturedClips: Blob[] = [];

    // Start canvas draw loop and continuous session recording once for the whole session
    let canvas: HTMLCanvasElement | null = null;
    if (enableVideo && mediaStream && camera.videoRef.current) {
      canvas = ensureCanvas(camera.videoRef.current);
      startDrawLoop(camera.videoRef.current, canvas);
      startSessionRecording(canvas);
    }

    for (let i = 0; i < photoCount; i++) {
      if (!isSessionActive.current) break;

      setCurrentPhotoIndex(i);
      setStep("countdown");

      // Start per-photo clip recording during countdown (draw loop already running)
      let clipRecorder: { stop: () => Promise<Blob | null> } | null = null;
      if (enableVideo && canvas) {
        clipRecorder = recordClip(canvas);
      }

      await startCountdown();

      if (!isSessionActive.current) {
        if (clipRecorder) await clipRecorder.stop();
        break;
      }

      // Stop per-photo clip recording
      if (clipRecorder) {
        const clipBlob = await clipRecorder.stop();
        if (clipBlob) {
          capturedClips.push(clipBlob);
          setClips([...capturedClips]);
        }
      }

      setStep("capturing");
      const photo = camera.capturePhoto(isMirroredRef.current, FILTER_CSS[filterRef.current], targetAspectRatio);
      if (photo) {
        captured.push(photo);
        setPhotos([...captured]);
      }

      if (i < photoCount - 1) {
        await sleep(PAUSE_BETWEEN_PHOTOS);
      }
    }

    // Stop continuous session recording → single valid WebM blob
    if (enableVideo) {
      const sessionBlob = await stopSessionRecording();
      if (sessionBlob) setVideoBlob(sessionBlob);
    }

    stopDrawLoop();
    camera.stopCamera();
    setStep("review");
    isSessionActive.current = false;
  }, [
    camera,
    enableVideo,
    photoCount,
    targetAspectRatio,
    startCountdown,
    ensureCanvas,
    startDrawLoop,
    stopDrawLoop,
    recordClip,
    startSessionRecording,
    stopSessionRecording,
  ]);

  const retakeAll = useCallback(() => {
    isSessionActive.current = false;
    // Clean up session recorder if still running
    if (sessionRecorderRef.current) {
      const { recorder } = sessionRecorderRef.current;
      if (recorder.state !== "inactive") recorder.stop();
      sessionRecorderRef.current = null;
    }
    stopDrawLoop();
    setPhotos([]);
    setClips([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);
    setStep("idle");
    camera.stopCamera();
  }, [camera, stopDrawLoop]);

  return {
    step,
    photos,
    clips,
    videoBlob,
    count,
    isCountdownRunning,
    currentPhotoIndex,
    camera,
    isMirrored,
    setMirrored,
    filter,
    setFilter,
    startSession,
    retakeAll,
  };
}
