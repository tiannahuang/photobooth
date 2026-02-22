"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { renderComposition } from "@/lib/canvas/renderer";
import { downloadCanvas } from "@/lib/canvas/export";
import type { LayoutConfig, Theme } from "@/types/photobooth";

export interface UseCompositionOptions {
  photos: string[];
  layoutConfig: LayoutConfig;
  frameColor: string;
  theme: Theme | null;
}

export interface UseCompositionReturn {
  previewUrl: string | null;
  isRendering: boolean;
  downloadImage: () => void;
}

export function useComposition({
  photos,
  layoutConfig,
  frameColor,
  theme,
}: UseCompositionOptions): UseCompositionReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (photos.length === 0) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsRendering(true);
      try {
        const canvas = await renderComposition(photos, layoutConfig, {
          frameColor,
          theme,
        });
        canvasRef.current = canvas;
        setPreviewUrl(canvas.toDataURL("image/jpeg", 0.92));
      } catch (err) {
        console.error("Composition render failed:", err);
      } finally {
        setIsRendering(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [photos, layoutConfig, frameColor, theme]);

  const downloadImage = useCallback(() => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current, `photobooth-${Date.now()}.jpg`);
    }
  }, []);

  return { previewUrl, isRendering, downloadImage };
}
