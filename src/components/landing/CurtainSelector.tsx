"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type SelectedMode = "korean" | "vintage" | null;

export function CurtainSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedMode>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (mode: "korean" | "vintage") => {
    if (isAnimating) return;
    setSelected(mode);
    setIsAnimating(true);
    setTimeout(() => {
      router.push(`/${mode}`);
    }, 700);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Title overlay */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
              Photobooth
            </h1>
            <p className="text-white/60 text-sm md:text-base">
              Choose your experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full">
        {/* Korean curtain (left) */}
        <motion.button
          className="relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #e8395a 0%, #c62368 40%, #a01a5c 100%)",
          }}
          onClick={() => handleSelect("korean")}
          whileHover={!isAnimating ? { flex: 1.15 } : undefined}
          animate={
            selected === "korean"
              ? { x: "-100%" }
              : selected === "vintage"
                ? { x: "-100%" }
                : {}
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Fabric texture overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
            }}
          />
          <div className="relative z-10 text-center px-8">
            <span className="block text-3xl md:text-5xl font-bold text-white mb-2">
              Korean
            </span>
            <span className="text-white/70 text-sm md:text-base">
              Life4Cuts style
            </span>
          </div>
        </motion.button>

        {/* Vintage curtain (right) */}
        <motion.button
          className="relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #8b6914 0%, #6b5a2e 40%, #4a3f24 100%)",
          }}
          onClick={() => handleSelect("vintage")}
          whileHover={!isAnimating ? { flex: 1.15 } : undefined}
          animate={
            selected === "vintage"
              ? { x: "100%" }
              : selected === "korean"
                ? { x: "100%" }
                : {}
          }
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
            }}
          />
          <div className="relative z-10 text-center px-8">
            <span className="block text-3xl md:text-5xl font-bold text-white mb-2">
              Vintage
            </span>
            <span className="text-white/70 text-sm md:text-base">
              Classic booth style
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
