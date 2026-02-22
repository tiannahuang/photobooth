"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useComposition } from "@/hooks/useComposition";
import { FRAME_COLORS } from "@/lib/constants";
import { themes } from "@/lib/themes/registry";
import type { LayoutConfig, Theme } from "@/types/photobooth";

interface FrameCustomizerProps {
  photos: string[];
  layoutConfig: LayoutConfig;
  frameColor: string;
  onFrameColorChange: (color: string) => void;
  theme: Theme | null;
  onThemeChange: (theme: Theme | null) => void;
  onComplete: () => void;
}

export function FrameCustomizer({
  photos,
  layoutConfig,
  frameColor,
  onFrameColorChange,
  theme,
  onThemeChange,
  onComplete,
}: FrameCustomizerProps) {
  const { previewUrl, isRendering } = useComposition({
    photos,
    layoutConfig,
    frameColor,
    theme,
  });

  return (
    <motion.div
      className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-4xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Preview */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-sm">
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="text-sm text-muted-foreground">Rendering...</div>
            </div>
          )}
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[calc(100vh-12rem)] w-auto mx-auto shadow-lg"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Loading preview...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6 w-full lg:w-64">
        <div>
          <h3 className="text-sm font-medium mb-3">Frame Color</h3>
          <div className="flex flex-wrap gap-2">
            {FRAME_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onFrameColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  frameColor === color
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Frame color ${color}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Theme</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onThemeChange(null)}
              className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                theme === null
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              None
            </button>
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => onThemeChange(t)}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  theme?.name === t.name
                    ? "bg-foreground text-background"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={onComplete} className="w-full">
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
