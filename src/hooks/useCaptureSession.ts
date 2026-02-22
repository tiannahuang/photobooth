"use client";

import { useState, useCallback, useRef } from "react";
import { useCamera } from "./useCamera";
import { useCountdown } from "./useCountdown";
import { useMediaRecorder } from "./useMediaRecorder";
import { PAUSE_BETWEEN_PHOTOS } from "@/lib/constants";
import type { CaptureStep } from "@/types/photobooth";

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

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const startSession = useCallback(async () => {
    isSessionActive.current = true;
    setPhotos([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);

    const mediaStream = await camera.startCamera();

    if (enableVideo && mediaStream) {
      startRecording(mediaStream);
    }

    const captured: string[] = [];

    for (let i = 0; i < photoCount; i++) {
      if (!isSessionActive.current) break;

      setCurrentPhotoIndex(i);
      setStep("countdown");
      await startCountdown();

      if (!isSessionActive.current) break;

      setStep("capturing");
      const photo = camera.capturePhoto();
      if (photo) {
        captured.push(photo);
        setPhotos([...captured]);
      }

      if (i < photoCount - 1) {
        await sleep(PAUSE_BETWEEN_PHOTOS);
      }
    }

    if (enableVideo) {
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
    startRecording,
    stopRecording,
  ]);

  const retakeAll = useCallback(() => {
    isSessionActive.current = false;
    setPhotos([]);
    setVideoBlob(null);
    setCurrentPhotoIndex(0);
    setStep("idle");
    camera.stopCamera();
  }, [camera]);

  return {
    step,
    photos,
    videoBlob,
    count,
    isCountdownRunning,
    currentPhotoIndex,
    camera,
    startSession,
    retakeAll,
  };
}
