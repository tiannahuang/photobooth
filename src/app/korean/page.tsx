"use client";

import { useState } from "react";
import type {
  KoreanLayout,
  WizardStep,
  Theme,
} from "@/types/photobooth";
import { LAYOUTS, DEFAULT_FRAME_COLOR } from "@/lib/constants";
import { LayoutSelector } from "@/components/korean/LayoutSelector";
import { KoreanCapture } from "@/components/korean/KoreanCapture";
import { PhotoReview } from "@/components/photobooth/PhotoReview";
import { FrameCustomizer } from "@/components/photobooth/FrameCustomizer";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { PhotoboothWizard } from "@/components/photobooth/PhotoboothWizard";

const STEPS: WizardStep[] = [
  "layout",
  "capture",
  "review",
  "customize",
  "download",
];

export default function KoreanPage() {
  const [step, setStep] = useState<WizardStep>("layout");
  const [layout, setLayout] = useState<KoreanLayout>("1x4-strip");
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);
  const [theme, setTheme] = useState<Theme | null>(null);

  const layoutConfig = LAYOUTS[layout];

  const handleLayoutSelect = (selected: KoreanLayout) => {
    setLayout(selected);
    setStep("capture");
  };

  const handleCaptureComplete = (
    capturedPhotos: string[],
    video: Blob | null
  ) => {
    setPhotos(capturedPhotos);
    setVideoBlob(video);
    setStep("review");
  };

  const handleRetakeAll = () => {
    setPhotos([]);
    setVideoBlob(null);
    setStep("capture");
  };

  const handleConfirmPhotos = () => {
    setStep("customize");
  };

  const handleCustomizeComplete = () => {
    setStep("download");
  };

  const handleStartOver = () => {
    setStep("layout");
    setPhotos([]);
    setVideoBlob(null);
    setFrameColor(DEFAULT_FRAME_COLOR);
    setTheme(null);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <PhotoboothWizard currentStep={stepIndex} totalSteps={STEPS.length}>
      {step === "layout" && (
        <LayoutSelector onSelect={handleLayoutSelect} selected={layout} />
      )}
      {step === "capture" && (
        <KoreanCapture
          layoutConfig={layoutConfig}
          onComplete={handleCaptureComplete}
        />
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
          layoutConfig={layoutConfig}
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
          layoutConfig={layoutConfig}
          frameColor={frameColor}
          theme={theme}
          videoBlob={videoBlob}
          onStartOver={handleStartOver}
        />
      )}
    </PhotoboothWizard>
  );
}
