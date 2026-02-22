"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCaptureSession } from "@/hooks/useCaptureSession";
import { CameraViewfinder } from "@/components/photobooth/CameraViewfinder";
import { CountdownOverlay } from "@/components/photobooth/CountdownOverlay";

interface VintageCaptureProps {
  onComplete: (photos: string[]) => void;
}

export function VintageCapture({ onComplete }: VintageCaptureProps) {
  const session = useCaptureSession({
    photoCount: 4,
    enableVideo: false,
  });

  useEffect(() => {
    if (session.step === "review" && session.photos.length > 0) {
      onComplete(session.photos);
    }
  }, [session.step, session.photos, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-1">Vintage Booth</h2>
        <p className="text-sm text-muted-foreground">
          Photo {session.currentPhotoIndex + 1} of 4
        </p>
      </div>

      <div className="relative w-full">
        <CameraViewfinder
          videoRef={session.camera.videoRef}
          error={session.camera.error}
          isReady={session.camera.isReady}
        />
        <CountdownOverlay
          count={session.count}
          isRunning={session.isCountdownRunning}
        />
      </div>

      {session.photos.length > 0 && (
        <div className="flex gap-2">
          {session.photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-12 h-12 rounded overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`Captured ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}

      {session.step === "idle" && (
        <Button onClick={session.startSession} size="lg">
          Start Capture
        </Button>
      )}
    </div>
  );
}
