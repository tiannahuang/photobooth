"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FlipHorizontal2 } from "lucide-react";
import { useCaptureSession } from "@/hooks/useCaptureSession";
import { CameraViewfinder } from "@/components/photobooth/CameraViewfinder";
import { CountdownOverlay } from "@/components/photobooth/CountdownOverlay";
import { getSlotAspectRatio, FILTER_CSS, DIGITAL_CAPTURE_COUNT } from "@/lib/constants";
import { FilterSelector } from "@/components/photobooth/FilterSelector";
import type { LayoutConfig } from "@/types/photobooth";

interface DigitalCaptureProps {
  layoutConfig: LayoutConfig;
  onComplete: (photos: string[], videoBlob: Blob | null, clips: Blob[]) => void;
}

export function DigitalCapture({
  layoutConfig,
  onComplete,
}: DigitalCaptureProps) {
  const slotAspectRatio = getSlotAspectRatio(layoutConfig);

  const session = useCaptureSession({
    photoCount: DIGITAL_CAPTURE_COUNT,
    enableVideo: true,
    targetAspectRatio: slotAspectRatio,
  });

  useEffect(() => {
    session.camera.startCamera();
    return () => session.camera.stopCamera();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session.step === "review" && session.photos.length > 0) {
      onComplete(session.photos, session.videoBlob, session.clips);
    }
  }, [session.step, session.photos, session.videoBlob, session.clips, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-1">Strike a Pose!</h2>
        <p className="text-sm text-muted-foreground">
          Photo {session.currentPhotoIndex + 1} of {DIGITAL_CAPTURE_COUNT}
        </p>
      </div>

      <div className="relative w-full">
        <CameraViewfinder
          videoRef={session.camera.videoRef}
          error={session.camera.error}
          isReady={session.camera.isReady}
          aspectRatio={slotAspectRatio}
          isMirrored={session.isMirrored}
          filterCss={FILTER_CSS[session.filter]}
        />
        <button
          onClick={() => session.setMirrored(!session.isMirrored)}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-colors ${
            session.isMirrored
              ? "bg-white/90 text-black shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              : "bg-black/40 text-white/50"
          }`}
          aria-label="Flip camera"
        >
          <FlipHorizontal2 className="w-5 h-5" />
        </button>
        <CountdownOverlay
          count={session.count}
          isRunning={session.isCountdownRunning}
        />
      </div>

      <FilterSelector
        mode="digital"
        selected={session.filter}
        onSelect={session.setFilter}
      />

      {/* Photo thumbnails */}
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
