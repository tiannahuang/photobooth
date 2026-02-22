"use client";

import { useState } from "react";
import type { WizardStep, Theme } from "@/types/photobooth";
import { LAYOUTS, DEFAULT_FRAME_COLOR } from "@/lib/constants";
import { VintageCapture } from "@/components/vintage/VintageCapture";
import { PhotoReview } from "@/components/photobooth/PhotoReview";
import { FrameCustomizer } from "@/components/photobooth/FrameCustomizer";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { PhotoboothWizard } from "@/components/photobooth/PhotoboothWizard";

const STEPS: WizardStep[] = ["capture", "review", "customize", "download"];
const LAYOUT_CONFIG = LAYOUTS["vintage-strip"];

export default function VintagePage() {
  const [step, setStep] = useState<WizardStep>("capture");
  const [photos, setPhotos] = useState<string[]>([]);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);
  const [theme, setTheme] = useState<Theme | null>(null);

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep("review");
  };

  const handleRetakeAll = () => {
    setPhotos([]);
    setStep("capture");
  };

  const handleConfirmPhotos = () => {
    setStep("customize");
  };

  const handleCustomizeComplete = () => {
    setStep("download");
  };

  const handleStartOver = () => {
    setStep("capture");
    setPhotos([]);
    setFrameColor(DEFAULT_FRAME_COLOR);
    setTheme(null);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <PhotoboothWizard currentStep={stepIndex} totalSteps={STEPS.length}>
      {step === "capture" && (
        <VintageCapture onComplete={handleCaptureComplete} />
      )}
      {step === "review" && (
        <PhotoReview
          photos={photos}
          onRetake={handleRetakeAll}
          onConfirm={handleConfirmPhotos}
        />
      )}
      {step === "customize" && (
        <FrameCustomizer
          photos={photos}
          layoutConfig={LAYOUT_CONFIG}
          frameColor={frameColor}
          onFrameColorChange={setFrameColor}
          theme={theme}
          onThemeChange={setTheme}
          onComplete={handleCustomizeComplete}
        />
      )}
      {step === "download" && (
        <DownloadScreen
          photos={photos}
          layoutConfig={LAYOUT_CONFIG}
          frameColor={frameColor}
          theme={theme}
          videoBlob={null}
          onStartOver={handleStartOver}
        />
      )}
    </PhotoboothWizard>
  );
}
