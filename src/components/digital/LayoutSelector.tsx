"use client";

import { motion } from "framer-motion";
import { LAYOUTS } from "@/lib/constants";
import type { LayoutType } from "@/types/photobooth";

interface LayoutSelectorProps<T extends LayoutType = LayoutType> {
  layouts: T[];
  selected: T;
  onSelect: (layout: T) => void;
}

function LayoutThumbnail({ layout }: { layout: LayoutType }) {
  const config = LAYOUTS[layout];
  const scale = 80 / Math.max(config.canvasWidth, config.canvasHeight);

  return (
    <svg
      width={config.canvasWidth * scale}
      height={config.canvasHeight * scale}
      viewBox={`0 0 ${config.canvasWidth} ${config.canvasHeight}`}
      className="mx-auto"
    >
      <rect
        width={config.canvasWidth}
        height={config.canvasHeight}
        fill="currentColor"
        className="text-muted"
        rx={12}
      />
      {config.slots.map((slot, i) => (
        <rect
          key={i}
          x={slot.x}
          y={slot.y}
          width={slot.width}
          height={slot.height}
          fill="currentColor"
          className="text-muted-foreground/30"
          rx={4}
        />
      ))}
    </svg>
  );
}

export function LayoutSelector<T extends LayoutType>({
  layouts,
  selected,
  onSelect,
}: LayoutSelectorProps<T>) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto px-4">
      <h2 className="text-2xl font-semibold">Choose a Layout</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {layouts.map((layout) => (
          <motion.button
            key={layout}
            onClick={() => onSelect(layout)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              selected === layout
                ? "border-foreground bg-accent"
                : "border-transparent bg-muted/50 hover:bg-muted"
            }`}
          >
            <LayoutThumbnail layout={layout} />
            <span className="text-sm font-medium">
              {LAYOUTS[layout].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {LAYOUTS[layout].photoCount} photo
              {LAYOUTS[layout].photoCount > 1 ? "s" : ""}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
