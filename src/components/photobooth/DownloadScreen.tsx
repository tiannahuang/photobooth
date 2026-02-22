"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useComposition } from "@/hooks/useComposition";
import { downloadBlob } from "@/lib/canvas/export";
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

  const handleDownloadVideo = () => {
    if (videoBlob) {
      downloadBlob(videoBlob, `photobooth-video-${Date.now()}.webm`);
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
        {videoBlob && (
          <Button
            variant="outline"
            onClick={handleDownloadVideo}
            className="w-full"
          >
            Download Video
          </Button>
        )}
        <Button variant="ghost" onClick={onStartOver} className="w-full">
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}
