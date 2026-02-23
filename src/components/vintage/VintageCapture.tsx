"use client";

import { useCallback } from "react";
import { CaptureSession } from "@/components/photobooth/CaptureSession";
import type { LayoutConfig } from "@/types/photobooth";

interface VintageCaptureProps {
  layoutConfig: LayoutConfig;
  onComplete: (photos: string[]) => void;
}

export function VintageCapture({ layoutConfig, onComplete }: VintageCaptureProps) {
  const handleComplete = useCallback(
    (photos: string[]) => {
      onComplete(photos);
    },
    [onComplete]
  );

  return (
    <CaptureSession
      layoutConfig={layoutConfig}
      title="Vintage Booth"
      photoCount={layoutConfig.photoCount}
      enableVideo={false}
      filterMode="vintage"
      onComplete={handleComplete}
    />
  );
}
