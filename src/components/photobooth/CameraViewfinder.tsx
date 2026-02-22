"use client";

import { RefObject } from "react";

interface CameraViewfinderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  error: string | null;
  isReady: boolean;
}

export function CameraViewfinder({
  videoRef,
  error,
  isReady,
}: CameraViewfinderProps) {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/3] bg-black rounded-lg overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="text-white">
            <p className="text-lg font-medium mb-2">Camera Error</p>
            <p className="text-sm text-white/70">{error}</p>
          </div>
        </div>
      ) : !isReady ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-sm">Initializing camera...</div>
        </div>
      ) : null}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
}
