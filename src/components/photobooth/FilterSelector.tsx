"use client";

import { MODE_FILTERS, FILTER_LABELS } from "@/lib/constants";
import type { CameraFilter, PhotoboothMode } from "@/types/photobooth";

interface FilterSelectorProps {
  mode: PhotoboothMode;
  selected: CameraFilter;
  onSelect: (filter: CameraFilter) => void;
}

export function FilterSelector({
  mode,
  selected,
  onSelect,
}: FilterSelectorProps) {
  const filters = MODE_FILTERS[mode];

  return (
    <div className="flex gap-2 justify-center">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            selected === f
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {FILTER_LABELS[f]}
        </button>
      ))}
    </div>
  );
}
