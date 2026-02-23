"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LayoutConfig } from "@/types/photobooth";

interface PhotoSelectorProps {
  allPhotos: string[];
  layoutConfig: LayoutConfig;
  onConfirm: (selected: string[]) => void;
  onRetake: () => void;
}

export function PhotoSelector({
  allPhotos,
  layoutConfig,
  onConfirm,
  onRetake,
}: PhotoSelectorProps) {
  const slotCount = layoutConfig.photoCount;
  // Each slot stores an index into allPhotos, or null if empty
  const [slotAssignments, setSlotAssignments] = useState<(number | null)[]>(
    () => Array(slotCount).fill(null)
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  // Drag-and-drop state
  const [dragSlotIndex, setDragSlotIndex] = useState<number | null>(null);
  const draggingRef = useRef(false);

  const assignedIndices = new Set(
    slotAssignments.filter((v): v is number => v !== null)
  );

  const handlePoolPhotoTap = useCallback(
    (photoIndex: number) => {
      if (activeSlotIndex !== null) {
        // A filled slot is active — assign this pool photo to that slot
        setSlotAssignments((prev) => {
          const next = [...prev];
          next[activeSlotIndex] = photoIndex;
          return next;
        });
        setActiveSlotIndex(null);
        return;
      }

      // If this photo is already assigned to a slot, do nothing
      if (assignedIndices.has(photoIndex)) return;

      // Find the next empty slot and fill it
      setSlotAssignments((prev) => {
        const emptyIdx = prev.indexOf(null);
        if (emptyIdx === -1) return prev;
        const next = [...prev];
        next[emptyIdx] = photoIndex;
        return next;
      });
    },
    [activeSlotIndex, assignedIndices]
  );

  const handleSlotTap = useCallback(
    (slotIdx: number) => {
      // Suppress tap if we just finished dragging
      if (draggingRef.current) {
        draggingRef.current = false;
        return;
      }

      const current = slotAssignments[slotIdx];

      if (current === null) {
        // Empty slot — if another slot is active, move it here
        if (activeSlotIndex !== null && slotAssignments[activeSlotIndex] !== null) {
          setSlotAssignments((prev) => {
            const next = [...prev];
            next[slotIdx] = prev[activeSlotIndex!];
            next[activeSlotIndex!] = null;
            return next;
          });
          setActiveSlotIndex(null);
        }
        return;
      }

      if (activeSlotIndex === slotIdx) {
        // Tap same active slot — remove photo from slot
        setSlotAssignments((prev) => {
          const next = [...prev];
          next[slotIdx] = null;
          return next;
        });
        setActiveSlotIndex(null);
        return;
      }

      if (activeSlotIndex !== null && slotAssignments[activeSlotIndex] !== null) {
        // Another filled slot is active — swap
        setSlotAssignments((prev) => {
          const next = [...prev];
          const temp = next[activeSlotIndex!];
          next[activeSlotIndex!] = next[slotIdx];
          next[slotIdx] = temp;
          return next;
        });
        setActiveSlotIndex(null);
        return;
      }

      // Select this slot as active
      setActiveSlotIndex(slotIdx);
    },
    [slotAssignments, activeSlotIndex]
  );

  // Drag-and-drop handlers for frame slots
  const handleDragStart = useCallback((slotIdx: number) => {
    setDragSlotIndex(slotIdx);
    draggingRef.current = true;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetSlotIdx: number) => {
      if (dragSlotIndex === null || dragSlotIndex === targetSlotIdx) {
        setDragSlotIndex(null);
        return;
      }

      // Swap the two slots
      setSlotAssignments((prev) => {
        const next = [...prev];
        const temp = next[dragSlotIndex];
        next[dragSlotIndex] = next[targetSlotIdx];
        next[targetSlotIdx] = temp;
        return next;
      });
      setDragSlotIndex(null);
      setActiveSlotIndex(null);
    },
    [dragSlotIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDragSlotIndex(null);
    // Reset dragging flag after a tick so onClick can check it
    setTimeout(() => {
      draggingRef.current = false;
    }, 0);
  }, []);

  const handleAutoFill = useCallback(() => {
    setSlotAssignments((prev) => {
      const next = [...prev];
      const used = new Set(next.filter((v): v is number => v !== null));
      const available = allPhotos
        .map((_, i) => i)
        .filter((i) => !used.has(i));

      for (let i = 0; i < next.length; i++) {
        if (next[i] === null && available.length > 0) {
          next[i] = available.shift()!;
        }
      }
      return next;
    });
    setActiveSlotIndex(null);
  }, [allPhotos]);

  const handleClear = useCallback(() => {
    setSlotAssignments(Array(slotCount).fill(null));
    setActiveSlotIndex(null);
  }, [slotCount]);

  const allFilled = slotAssignments.every((v) => v !== null);

  const handleConfirm = () => {
    const selected = slotAssignments.map((idx) =>
      idx !== null ? allPhotos[idx] : ""
    );
    onConfirm(selected);
  };

  // Compute frame preview dimensions based on layout aspect ratio
  const frameAspect = layoutConfig.canvasWidth / layoutConfig.canvasHeight;
  const slotAspect = layoutConfig.slots[0].width / layoutConfig.slots[0].height;

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full max-w-6xl mx-auto px-4 h-[calc(100vh-8rem)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold">Arrange Your Photos</h2>
      <p className="text-sm text-muted-foreground">
        Tap a photo to fill the next slot. Tap a slot to select it, then tap
        another slot to swap or tap again to remove. Drag slots to reorder.
      </p>

      <div className="grid grid-cols-[3fr_2fr] flex-1 gap-8 w-full min-h-0">
        {/* Left: Photo pool + actions */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Action buttons row */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleAutoFill}>
              Auto Fill
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>

          {/* Photo pool — scrollable grid */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-4 gap-2">
              {allPhotos.map((photo, i) => {
                const isUsed = assignedIndices.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => handlePoolPhotoTap(i)}
                    className={`relative rounded-lg overflow-hidden transition-all ${
                      isUsed
                        ? "opacity-40 ring-1 ring-border"
                        : "ring-2 ring-transparent hover:ring-foreground/30"
                    }`}
                    style={{ aspectRatio: slotAspect }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {i + 1}
                    </div>
                    {isUsed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="text-white text-xs font-medium">Used</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Frame layout preview */}
        <div className="flex flex-col items-center justify-center gap-2 px-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Frame Preview</span>
          <div
            className="relative w-full bg-muted/30 border border-border rounded-lg overflow-hidden touch-none"
            style={{ aspectRatio: frameAspect }}
            onDragOver={handleDragOver}
          >
            {layoutConfig.slots.map((slot, i) => {
              const left = (slot.x / layoutConfig.canvasWidth) * 100;
              const top = (slot.y / layoutConfig.canvasHeight) * 100;
              const width = (slot.width / layoutConfig.canvasWidth) * 100;
              const height = (slot.height / layoutConfig.canvasHeight) * 100;
              const photoIdx = slotAssignments[i];
              const isActive = activeSlotIndex === i;
              const isDragging = dragSlotIndex === i;

              return (
                <button
                  key={i}
                  onClick={() => handleSlotTap(i)}
                  draggable={photoIdx !== null}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={handleDragEnd}
                  className={`absolute overflow-hidden transition-all ${
                    isDragging
                      ? "opacity-50 ring-2 ring-blue-400"
                      : isActive
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : "ring-1 ring-border"
                  }`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                  }}
                >
                  {photoIdx !== null ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={allPhotos[photoIdx]}
                      alt={`Slot ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm / Retake — full width below grid */}
      <div className="flex gap-3 w-full">
        <Button variant="outline" onClick={onRetake} className="flex-1">
          Retake
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!allFilled}
          className="flex-1"
        >
          {allFilled
            ? "Confirm"
            : `Fill ${slotAssignments.filter((v) => v === null).length} more`}
        </Button>
      </div>
    </motion.div>
  );
}
