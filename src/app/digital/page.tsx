"use client";

import { useState } from "react";
import type {
  DigitalLayout,
  WizardStep,
  Theme,
} from "@/types/photobooth";
import { LAYOUTS, DEFAULT_FRAME_COLOR } from "@/lib/constants";
import { LayoutSelector } from "@/components/digital/LayoutSelector";
import { DigitalCapture } from "@/components/digital/DigitalCapture";
import { PhotoReview } from "@/components/photobooth/PhotoReview";
import { PhotoSelector } from "@/components/digital/PhotoSelector";
import { FrameCustomizer } from "@/components/photobooth/FrameCustomizer";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { PhotoboothWizard } from "@/components/photobooth/PhotoboothWizard";

const STEPS: WizardStep[] = [
  "layout",
  "capture",
  "review",
  "select",
  "customize",
  "download",
];

export default function DigitalPage() {
  const [step, setStep] = useState<WizardStep>("layout");
  const [layout, setLayout] = useState<DigitalLayout>("1x4-strip");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);
  const [theme, setTheme] = useState<Theme | null>(null);

  const layoutConfig = LAYOUTS[layout];

  const handleLayoutSelect = (selected: DigitalLayout) => {
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
    setSelectedPhotos([]);
    setVideoBlob(null);
    setStep("capture");
  };

  const handleConfirmPhotos = () => {
    setStep("select");
  };

  const handleSelectConfirm = (selected: string[]) => {
    setSelectedPhotos(selected);
    setStep("customize");
  };

  const handleCustomizeComplete = () => {
    setStep("download");
  };

  const handleStartOver = () => {
    setStep("layout");
    setPhotos([]);
    setSelectedPhotos([]);
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
        <DigitalCapture
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
      {step === "select" && (
        <PhotoSelector
          allPhotos={photos}
          layoutConfig={layoutConfig}
          onConfirm={handleSelectConfirm}
          onRetake={handleRetakeAll}
        />
      )}
      {step === "customize" && (
        <FrameCustomizer
          photos={selectedPhotos}
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
          photos={selectedPhotos}
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
