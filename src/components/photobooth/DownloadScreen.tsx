"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComposition } from "@/hooks/useComposition";
import { downloadBlob } from "@/lib/canvas/export";
import { generateFrameVideo } from "@/lib/canvas/frameVideo";
import type { LayoutConfig, Theme } from "@/types/photobooth";

interface DownloadScreenProps {
  photos: string[];
  layoutConfig: LayoutConfig;
  frameColor: string;
  theme: Theme | null;
  videoBlob: Blob | null;
  onStartOver: () => void;
}

export function DownloadScreen({
  photos,
  layoutConfig,
  frameColor,
  theme,
  videoBlob,
  onStartOver,
}: DownloadScreenProps) {
  const { previewUrl, downloadImage } = useComposition({
    photos,
    layoutConfig,
    frameColor,
    theme,
  });

  const [frameVideoBlob, setFrameVideoBlob] = useState<Blob | null>(null);
  const [isGeneratingFrameVideo, setIsGeneratingFrameVideo] = useState(false);

  useEffect(() => {
    if (photos.length === 0) return;

    let cancelled = false;
    setIsGeneratingFrameVideo(true);

    generateFrameVideo(photos, layoutConfig, { frameColor, theme })
      .then((blob) => {
        if (!cancelled) setFrameVideoBlob(blob);
      })
      .finally(() => {
        if (!cancelled) setIsGeneratingFrameVideo(false);
      });

    return () => {
      cancelled = true;
    };
  }, [photos, layoutConfig, frameColor, theme]);

  const handleDownloadSessionVideo = () => {
    if (videoBlob) {
      downloadBlob(videoBlob, `photobooth-session-${Date.now()}.webm`);
    }
  };

  const handleDownloadFrameVideo = () => {
    if (frameVideoBlob) {
      downloadBlob(frameVideoBlob, `photobooth-strip-${Date.now()}.webm`);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold">Your Photos Are Ready!</h2>

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Final composition"
          className="max-h-[calc(100vh-16rem)] w-auto mx-auto shadow-lg"
        />
      ) : (
        <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Rendering...</span>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={downloadImage} className="w-full" size="lg">
          Download Photo
        </Button>

        {/* Frame strip video — always available once generated */}
        <Button
          variant="outline"
          onClick={handleDownloadFrameVideo}
          className="w-full"
          disabled={isGeneratingFrameVideo || !frameVideoBlob}
        >
          {isGeneratingFrameVideo ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Strip Video...
            </>
          ) : (
            "Download Strip Video"
          )}
        </Button>

        {/* Session video — only if one was recorded */}
        {videoBlob && (
          <Button
            variant="outline"
            onClick={handleDownloadSessionVideo}
            className="w-full"
          >
            Download Session Video
          </Button>
        )}

        <Button variant="ghost" onClick={onStartOver} className="w-full">
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}
