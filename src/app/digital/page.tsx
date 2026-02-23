"use client";

import { useState } from "react";
import type {
  DigitalLayout,
  WizardStep,
  CaptureMode,
  Theme,
} from "@/types/photobooth";
import { LAYOUTS, DIGITAL_LAYOUTS, DEFAULT_FRAME_COLOR } from "@/lib/constants";
import { LayoutSelector } from "@/components/digital/LayoutSelector";
import { CaptureModePicker } from "@/components/digital/CaptureModePicker";
import { DigitalCapture } from "@/components/digital/DigitalCapture";
import { PhotoReview } from "@/components/photobooth/PhotoReview";
import { PhotoSelector } from "@/components/digital/PhotoSelector";
import { FrameCustomizer } from "@/components/photobooth/FrameCustomizer";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { PhotoboothWizard } from "@/components/photobooth/PhotoboothWizard";

const STEPS: WizardStep[] = [
  "layout",
  "capture-mode",
  "capture",
  "review",
  "select",
  "customize",
  "download",
];

export default function DigitalPage() {
  const [step, setStep] = useState<WizardStep>("layout");
  const [layout, setLayout] = useState<DigitalLayout>("1x4-strip");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("auto");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [clips, setClips] = useState<Blob[]>([]);
  const [selectedClips, setSelectedClips] = useState<Blob[]>([]);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);
  const [theme, setTheme] = useState<Theme | null>(null);

  const layoutConfig = LAYOUTS[layout];

  const handleLayoutSelect = (selected: DigitalLayout) => {
    setLayout(selected);
    setStep("capture-mode");
  };

  const handleCaptureModeSelect = (mode: CaptureMode) => {
    setCaptureMode(mode);
    setStep("capture");
  };

  const handleCaptureComplete = (
    capturedPhotos: string[],
    video: Blob | null,
    capturedClips: Blob[]
  ) => {
    setPhotos(capturedPhotos);
    setVideoBlob(video);
    setClips(capturedClips);
    setStep("review");
  };

  const handleRetakeAll = () => {
    setPhotos([]);
    setSelectedPhotos([]);
    setVideoBlob(null);
    setClips([]);
    setSelectedClips([]);
    setStep("capture");
  };

  const handleConfirmPhotos = () => {
    setStep("select");
  };

  const handleSelectConfirm = (selected: string[]) => {
    setSelectedPhotos(selected);
    // Map clips to match selected photo order
    const mapped = selected.map((photo) => clips[photos.indexOf(photo)]).filter(Boolean);
    setSelectedClips(mapped);
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
    setClips([]);
    setSelectedClips([]);
    setCaptureMode("auto");
    setFrameColor(DEFAULT_FRAME_COLOR);
    setTheme(null);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <PhotoboothWizard currentStep={stepIndex} totalSteps={STEPS.length}>
      {step === "layout" && (
        <LayoutSelector layouts={DIGITAL_LAYOUTS} onSelect={handleLayoutSelect} selected={layout} />
      )}
      {step === "capture-mode" && (
        <CaptureModePicker selected={captureMode} onSelect={handleCaptureModeSelect} />
      )}
      {step === "capture" && (
        <DigitalCapture
          layoutConfig={layoutConfig}
          captureMode={captureMode}
          onComplete={handleCaptureComplete}
        />
      )}
      {step === "review" && (
        <PhotoReview
          photos={photos}
          onRetake={handleRetakeAll}
          onConfirm={handleConfirmPhotos}
          layoutConfig={layoutConfig}
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
          mode="digital"
        />
      )}
      {step === "download" && (
        <DownloadScreen
          photos={selectedPhotos}
          layoutConfig={layoutConfig}
          frameColor={frameColor}
          theme={theme}
          videoBlob={videoBlob}
          clips={selectedClips}
          onStartOver={handleStartOver}
        />
      )}
    </PhotoboothWizard>
  );
}
