"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  count: number;
  isRunning: boolean;
}

export function CountdownOverlay({ count, isRunning }: CountdownOverlayProps) {
  return (
    <AnimatePresence>
      {isRunning && count > 0 && (
        <motion.div
          key="countdown-overlay"
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              className="text-8xl font-bold text-white drop-shadow-lg"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-live="assertive"
              role="timer"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
      {isRunning && count === 0 && (
        <motion.div
          key="flash"
          className="absolute inset-0 bg-white z-10"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
}
