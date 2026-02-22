"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
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

  const [showVideo, setShowVideo] = useState(false);

  const videoUrl = useMemo(() => {
    if (!videoBlob) return null;
    return URL.createObjectURL(videoBlob);
  }, [videoBlob]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

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

      {videoBlob && !showVideo && (
        <button
          onClick={() => setShowVideo(true)}
          className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 flex items-center gap-4 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
            <Play className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-medium">Tap here to see video</p>
            <p className="text-sm text-muted-foreground">
              Watch your entire photo session
            </p>
          </div>
        </button>
      )}

      {showVideo && videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-lg"
        />
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
