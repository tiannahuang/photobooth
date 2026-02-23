"use client";

import { CaptureSession } from "@/components/photobooth/CaptureSession";
import { DIGITAL_CAPTURE_COUNT } from "@/lib/constants";
import type { LayoutConfig, CaptureMode } from "@/types/photobooth";

interface DigitalCaptureProps {
  layoutConfig: LayoutConfig;
  captureMode?: CaptureMode;
  onComplete: (photos: string[], videoBlob: Blob | null, clips: Blob[]) => void;
}

export function DigitalCapture({
  layoutConfig,
  captureMode = "auto",
  onComplete,
}: DigitalCaptureProps) {
  return (
    <CaptureSession
      layoutConfig={layoutConfig}
      title="Strike a Pose!"
      photoCount={DIGITAL_CAPTURE_COUNT}
      enableVideo={true}
      filterMode="digital"
      captureMode={captureMode}
      onComplete={onComplete}
    />
  );
}
