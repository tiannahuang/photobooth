"use client";

import { useState, useCallback, useRef } from "react";
import { COUNTDOWN_DURATION } from "@/lib/constants";

export interface UseCountdownReturn {
  count: number;
  isRunning: boolean;
  startCountdown: (duration?: number) => Promise<void>;
  cancel: () => void;
}

export function useCountdown(): UseCountdownReturn {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const cancelRef = useRef(false);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setIsRunning(false);
    setCount(0);
  }, []);

  const startCountdown = useCallback(
    (duration: number = COUNTDOWN_DURATION): Promise<void> => {
      cancelRef.current = false;
      setIsRunning(true);
      setCount(duration);

      return new Promise<void>((resolve) => {
        let current = duration;

        const tick = () => {
          if (cancelRef.current) {
            resolve();
            return;
          }
          current -= 1;
          setCount(current);

          if (current <= 0) {
            setIsRunning(false);
            resolve();
          } else {
            setTimeout(tick, 1000);
          }
        };

        setTimeout(tick, 1000);
      });
    },
    []
  );

  return { count, isRunning, startCountdown, cancel };
}
