"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LayoutConfig } from "@/types/photobooth";

interface PhotoReviewProps {
  photos: string[];
  onRetake: () => void;
  onConfirm: () => void;
  layoutConfig?: LayoutConfig;
}

export function PhotoReview({ photos, onRetake, onConfirm, layoutConfig }: PhotoReviewProps) {
  const slotAspect = layoutConfig
    ? layoutConfig.slots[0].width / layoutConfig.slots[0].height
    : 4 / 3;

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold">Review Your Photos</h2>
      <div className="grid grid-cols-2 gap-3 w-full">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="rounded-lg overflow-hidden bg-muted"
            style={{ aspectRatio: slotAspect }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRetake}>
          Retake All
        </Button>
        <Button onClick={onConfirm}>Keep Photos</Button>
      </div>
    </motion.div>
  );
}
