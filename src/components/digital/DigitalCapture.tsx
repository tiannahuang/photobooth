"use client";

import { CaptureSession } from "@/components/photobooth/CaptureSession";
import { DIGITAL_CAPTURE_COUNT } from "@/lib/constants";
import type { LayoutConfig } from "@/types/photobooth";

interface DigitalCaptureProps {
  layoutConfig: LayoutConfig;
  onComplete: (photos: string[], videoBlob: Blob | null, clips: Blob[]) => void;
}

export function DigitalCapture({
  layoutConfig,
  onComplete,
}: DigitalCaptureProps) {
  return (
    <CaptureSession
      layoutConfig={layoutConfig}
      title="Strike a Pose!"
      photoCount={DIGITAL_CAPTURE_COUNT}
      enableVideo={true}
      filterMode="digital"
      onComplete={onComplete}
    />
  );
}
