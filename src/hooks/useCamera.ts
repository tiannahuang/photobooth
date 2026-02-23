"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { calculateCoverCrop } from "@/lib/canvas/crop";

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error: string | null;
  isReady: boolean;
  startCamera: () => Promise<MediaStream | null>;
  stopCamera: () => void;
  capturePhoto: (isMirrored?: boolean, filterCss?: string, targetAspectRatio?: number) => string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  const startCamera = useCallback(async (): Promise<MediaStream | null> => {
    if (streamRef.current) {
      return streamRef.current;
    }
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch {
          // play() can throw AbortError in React strict mode when the
          // component remounts — the <video autoPlay> attribute will
          // auto-play once ready, so this is safe to ignore.
        }
        setIsReady(true);
      }
      return mediaStream;
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please allow camera permissions.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found. Please connect a camera.");
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError("Failed to access camera.");
      }
      return null;
    }
  }, []);

  const capturePhoto = useCallback((isMirrored = true, filterCss?: string, targetAspectRatio?: number): string | null => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.filter = filterCss && filterCss !== "none" ? filterCss : "none";

    if (isMirrored) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0);
    }

    ctx.filter = "none";

    // Pre-crop to target aspect ratio so captured photo matches viewfinder
    if (targetAspectRatio) {
      const targetW = Math.round(canvas.height * targetAspectRatio);
      const targetH = canvas.height;
      const { sx, sy, sw, sh } = calculateCoverCrop(canvas.width, canvas.height, targetW, targetH);

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = Math.round(sw);
      cropCanvas.height = Math.round(sh);
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) return canvas.toDataURL("image/jpeg", 0.92);
      cropCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, cropCanvas.width, cropCanvas.height);
      return cropCanvas.toDataURL("image/jpeg", 0.92);
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return {
    videoRef,
    stream,
    error,
    isReady,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
