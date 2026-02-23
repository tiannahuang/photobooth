"use client";

import { motion } from "framer-motion";
import { Timer, Keyboard } from "lucide-react";
import type { CaptureMode } from "@/types/photobooth";

interface CaptureModePickerProps {
  selected: CaptureMode;
  onSelect: (mode: CaptureMode) => void;
}

const modes: { value: CaptureMode; icon: typeof Timer; label: string; description: string }[] = [
  {
    value: "auto",
    icon: Timer,
    label: "Auto Timer",
    description: "3s countdown per photo",
  },
  {
    value: "spacebar",
    icon: Keyboard,
    label: "Spacebar",
    description: "Press to capture each photo",
  },
];

export function CaptureModePicker({ selected, onSelect }: CaptureModePickerProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto px-4">
      <h2 className="text-2xl font-semibold">Capture Mode</h2>
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {modes.map(({ value, icon: Icon, label, description }) => (
          <motion.button
            key={value}
            onClick={() => onSelect(value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors w-36 sm:w-40 ${
              selected === value
                ? "border-foreground bg-accent"
                : "border-transparent bg-muted/50 hover:bg-muted"
            }`}
          >
            <Icon className="w-8 h-8" />
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
