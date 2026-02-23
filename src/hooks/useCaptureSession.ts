"use client";

import { useState, useCallback, useRef } from "react";
import { useCamera } from "./useCamera";
import { useCountdown } from "./useCountdown";
import { useMediaRecorder } from "./useMediaRecorder";
import { PAUSE_BETWEEN_PHOTOS, FILTER_CSS } from "@/lib/constants";
import type { CaptureStep, CameraFilter } from "@/types/photobooth";

export interface UseCaptureSessionOptions {
  photoCount: number;
  enableVideo?: boolean;
}

export interface UseCaptureSessionReturn {
  step: CaptureStep;
  photos: string[];
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
}: UseCaptureSessionOptions): UseCaptureSessionReturn {
  const [step, setStep] = useState<CaptureStep>("idle");
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const camera = useCamera();
  const { count, isRunning: isCountdownRunning, startCountdown } = useCountdown();
  const { startRecording, stopRecording } = useMediaRecorder();
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

  const startCanvasRecording = useCallback(
    (video: HTMLVideoElement) => {
      if (!videoCanvasRef.current) {
        videoCanvasRef.current = document.createElement("canvas");
      }
      const canvas = videoCanvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw a frame immediately so the stream has content
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
      frameIntervalRef.current = setInterval(drawFrame, 500); // ~2fps

      const canvasStream = canvas.captureStream(2);
      startRecording(canvasStream);
    },
    [startRecording]
  );

  const stopCanvasRecording = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  const startSession = useCallback(async () => {
    isSessionActive.current = true;
    setPhotos([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);

    const mediaStream = await camera.startCamera();

    if (enableVideo && mediaStream && camera.videoRef.current) {
      startCanvasRecording(camera.videoRef.current);
    }

    const captured: string[] = [];

    for (let i = 0; i < photoCount; i++) {
      if (!isSessionActive.current) break;

      setCurrentPhotoIndex(i);
      setStep("countdown");
      await startCountdown();

      if (!isSessionActive.current) break;

      setStep("capturing");
      const photo = camera.capturePhoto(isMirroredRef.current, FILTER_CSS[filterRef.current]);
      if (photo) {
        captured.push(photo);
        setPhotos([...captured]);
      }

      if (i < photoCount - 1) {
        await sleep(PAUSE_BETWEEN_PHOTOS);
      }
    }

    if (enableVideo) {
      stopCanvasRecording();
      const blob = await stopRecording();
      setVideoBlob(blob);
    }

    camera.stopCamera();
    setStep("review");
    isSessionActive.current = false;
  }, [
    camera,
    enableVideo,
    photoCount,
    startCountdown,
    startCanvasRecording,
    stopCanvasRecording,
    stopRecording,
  ]);

  const retakeAll = useCallback(() => {
    isSessionActive.current = false;
    stopCanvasRecording();
    setPhotos([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);
    setStep("idle");
    camera.stopCamera();
  }, [camera, stopCanvasRecording]);

  return {
    step,
    photos,
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
