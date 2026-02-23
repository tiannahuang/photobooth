"use client";

import { useState, useCallback, useRef } from "react";
import { useCamera } from "./useCamera";
import { useCountdown } from "./useCountdown";
import { PAUSE_BETWEEN_PHOTOS, FILTER_CSS } from "@/lib/constants";
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

function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "video/webm";
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
    frameIntervalRef.current = setInterval(drawFrame, 33); // ~30fps for clips
  }, []);

  const stopDrawLoop = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  const recordClip = useCallback((canvas: HTMLCanvasElement): {
    stop: () => Promise<Blob | null>;
  } => {
    const mimeType = getSupportedMimeType();
    const chunks: Blob[] = [];

    let recorder: MediaRecorder;
    try {
      const stream = canvas.captureStream(30);
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

    for (let i = 0; i < photoCount; i++) {
      if (!isSessionActive.current) break;

      setCurrentPhotoIndex(i);
      setStep("countdown");

      // Start per-photo clip recording during countdown
      let clipRecorder: { stop: () => Promise<Blob | null> } | null = null;
      if (enableVideo && mediaStream && camera.videoRef.current) {
        const canvas = ensureCanvas(camera.videoRef.current);
        startDrawLoop(camera.videoRef.current, canvas);
        clipRecorder = recordClip(canvas);
      }

      await startCountdown();

      if (!isSessionActive.current) {
        if (clipRecorder) {
          stopDrawLoop();
          await clipRecorder.stop();
        }
        break;
      }

      // Stop clip recording
      if (clipRecorder) {
        stopDrawLoop();
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

    // Create a combined session video from all clips (for session video download)
    if (enableVideo && capturedClips.length > 0) {
      const mimeType = getSupportedMimeType();
      const combined = new Blob(capturedClips, { type: mimeType });
      setVideoBlob(combined);
    }

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
  ]);

  const retakeAll = useCallback(() => {
    isSessionActive.current = false;
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
