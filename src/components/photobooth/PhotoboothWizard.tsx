"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface PhotoboothWizardProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export function PhotoboothWizard({
  currentStep,
  totalSteps,
  children,
}: PhotoboothWizardProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back
        </Link>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= currentStep ? "bg-foreground" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="w-12" />
      </header>
      <main className="flex-1 flex items-center justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
