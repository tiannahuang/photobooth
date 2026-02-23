"use client";

import { useState } from "react";
import type { VintageLayout, WizardStep, Theme } from "@/types/photobooth";
import { LAYOUTS, VINTAGE_LAYOUTS, DEFAULT_FRAME_COLOR } from "@/lib/constants";
import { LayoutSelector } from "@/components/digital/LayoutSelector";
import { VintageCapture } from "@/components/vintage/VintageCapture";
import { FrameCustomizer } from "@/components/photobooth/FrameCustomizer";
import { DownloadScreen } from "@/components/photobooth/DownloadScreen";
import { PhotoboothWizard } from "@/components/photobooth/PhotoboothWizard";

const STEPS: WizardStep[] = ["layout", "capture", "customize", "download"];

export default function VintagePage() {
  const [step, setStep] = useState<WizardStep>("layout");
  const [layout, setLayout] = useState<VintageLayout>("vintage-strip");
  const [photos, setPhotos] = useState<string[]>([]);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);
  const [theme, setTheme] = useState<Theme | null>(null);

  const layoutConfig = LAYOUTS[layout];

  const handleLayoutSelect = (selected: VintageLayout) => {
    setLayout(selected);
    setStep("capture");
  };

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep("customize");
  };

  const handleCustomizeComplete = () => {
    setStep("download");
  };

  const handleStartOver = () => {
    setStep("layout");
    setPhotos([]);
    setFrameColor(DEFAULT_FRAME_COLOR);
    setTheme(null);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <PhotoboothWizard currentStep={stepIndex} totalSteps={STEPS.length}>
      {step === "layout" && (
        <LayoutSelector
          layouts={VINTAGE_LAYOUTS}
          onSelect={handleLayoutSelect}
          selected={layout}
        />
      )}
      {step === "capture" && (
        <VintageCapture
          layoutConfig={layoutConfig}
          onComplete={handleCaptureComplete}
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
          mode="vintage"
        />
      )}
      {step === "download" && (
        <DownloadScreen
          photos={photos}
          layoutConfig={layoutConfig}
          frameColor={frameColor}
          theme={theme}
          videoBlob={null}
          onStartOver={handleStartOver}
          mode="vintage"
        />
      )}
    </PhotoboothWizard>
  );
}
