"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type SelectedMode = "digital" | "vintage" | null;

function CurtainIllustration() {
  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 md:w-56"
    >
      {/* Rod */}
      <rect x="20" y="10" width="160" height="8" rx="4" fill="#444" />
      {/* Rod end caps */}
      <circle cx="20" cy="14" r="8" fill="#555" />
      <circle cx="180" cy="14" r="8" fill="#555" />

      {/* Rings */}
      {[40, 70, 100, 130, 160].map((cx) => (
        <circle
          key={cx}
          cx={cx}
          cy="14"
          r="10"
          fill="none"
          stroke="#666"
          strokeWidth="2.5"
        />
      ))}

      {/* Draped fabric */}
      <path
        d="M30 24 C30 24, 45 60, 40 120 C35 180, 30 220, 35 250 L165 250 C170 220, 165 180, 160 120 C155 60, 170 24, 170 24"
        fill="#e8e5e0"
        stroke="#ccc"
        strokeWidth="1"
      />

      {/* Fold lines for depth */}
      <path
        d="M55 30 C50 80, 55 140, 52 250"
        fill="none"
        stroke="#d4d0ca"
        strokeWidth="1.5"
      />
      <path
        d="M85 28 C82 90, 88 160, 85 250"
        fill="none"
        stroke="#d4d0ca"
        strokeWidth="1.5"
      />
      <path
        d="M115 28 C118 90, 112 160, 115 250"
        fill="none"
        stroke="#d4d0ca"
        strokeWidth="1.5"
      />
      <path
        d="M145 30 C150 80, 145 140, 148 250"
        fill="none"
        stroke="#d4d0ca"
        strokeWidth="1.5"
      />

      {/* Subtle scalloped top edge */}
      <path
        d="M30 24 C38 40, 50 28, 60 36 C70 44, 80 28, 90 34 C100 40, 110 28, 120 34 C130 40, 140 28, 150 36 C160 44, 168 30, 170 24"
        fill="#e8e5e0"
        stroke="#ccc"
        strokeWidth="1"
      />
    </svg>
  );
}

export function CurtainSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedMode>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (mode: "digital" | "vintage") => {
    if (isAnimating) return;
    setSelected(mode);
    setIsAnimating(true);
    setTimeout(() => {
      router.push(`/${mode}`);
    }, 700);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-100">
      {/* Title */}
      <div className="absolute top-12 inset-x-0 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
          Photobooth
        </h1>
        <p className="text-stone-500 text-sm md:text-base mt-1">
          Choose your experience
        </p>
      </div>

      <div className="flex h-full items-center justify-center">
        {/* Digital curtain (left) */}
        <AnimatePresence>
          {(!selected || selected === "digital") && (
            <motion.button
              className="flex-1 flex flex-col items-center justify-center cursor-pointer gap-4"
              onClick={() => handleSelect("digital")}
              whileHover={!isAnimating ? { scale: 1.03 } : undefined}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <CurtainIllustration />
              <div className="text-center">
                <span className="block text-2xl md:text-3xl font-bold text-stone-800">
                  Digital
                </span>
                <span className="text-stone-500 text-sm">
                  Life4Cuts style
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Divider */}
        {!selected && (
          <div className="w-px h-48 bg-stone-300 mx-2 md:mx-8 shrink-0" />
        )}

        {/* Vintage curtain (right) */}
        <AnimatePresence>
          {(!selected || selected === "vintage") && (
            <motion.button
              className="flex-1 flex flex-col items-center justify-center cursor-pointer gap-4"
              onClick={() => handleSelect("vintage")}
              whileHover={!isAnimating ? { scale: 1.03 } : undefined}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <CurtainIllustration />
              <div className="text-center">
                <span className="block text-2xl md:text-3xl font-bold text-stone-800">
                  Vintage
                </span>
                <span className="text-stone-500 text-sm">
                  Classic booth style
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
