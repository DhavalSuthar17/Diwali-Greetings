import { useCallback, useEffect, useRef, useState } from 'react';
import type { IntroStage, UseIntroSequenceReturn } from '../types';

/**
 * Total intro timeline duration in seconds (4.5s total)
 */
const TOTAL_DURATION_SEC = 4.5;

/**
 * Timing breakdown (in seconds):
 * 0.0s - 0.3s : launching (ground launch ignition)
 * 0.3s - 2.6s : ascending (rocket ascends towards zenith)
 * 2.6s - 2.75s: bursting (zenith blast flash)
 * 2.75s - 3.4s: blooming (firework petals expand, mandala blooms)
 * 3.4s - 4.5s : revealing (headline, Om, blessings fade in)
 * >= 4.5s     : settled (steady state ambient scene)
 */
function getStageForElapsed(elapsedSec: number): IntroStage {
  if (elapsedSec < 0.3) {
    return 'launching';
  }
  if (elapsedSec < 2.6) {
    return 'ascending';
  }
  if (elapsedSec < 2.75) {
    return 'bursting';
  }
  if (elapsedSec < 3.4) {
    return 'blooming';
  }
  if (elapsedSec < 4.5) {
    return 'revealing';
  }
  return 'settled';
}

/**
 * Checks whether user has enabled reduced motion preferences
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Hook to manage the cinematic intro rocket timeline with requestAnimationFrame.
 *
 * @param isStarted Boolean flag indicating if user tapped to begin
 * @returns { stage, progress, replay }
 */
export function useIntroSequence(isStarted: boolean): UseIntroSequenceReturn {
  const [stage, setStage] = useState<IntroStage>('idle');
  const [progress, setProgress] = useState<number>(0);

  const stageRef = useRef<IntroStage>('idle');
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isStartedRef = useRef<boolean>(isStarted);

  isStartedRef.current = isStarted;

  // Sync ref with state for internal RAF loop
  const updateStage = useCallback((nextStage: IntroStage) => {
    if (stageRef.current !== nextStage) {
      stageRef.current = nextStage;
      setStage(nextStage);
    }
  }, []);

  const cancelActiveAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const startTimeline = useCallback(() => {
    cancelActiveAnimation();

    // Respect prefers-reduced-motion: fast-forward to settled with a soft fade
    if (prefersReducedMotion()) {
      updateStage('launching');
      setProgress(0.5);
      const timer = window.setTimeout(() => {
        updateStage('settled');
        setProgress(1);
      }, 300);
      return () => clearTimeout(timer);
    }

    startTimeRef.current = null;
    updateStage('launching');
    setProgress(0);

    const step = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsedSec = (now - startTimeRef.current) / 1000;
      const currentProgress = Math.min(1, Math.max(0, elapsedSec / TOTAL_DURATION_SEC));
      setProgress(currentProgress);

      const nextStage = getStageForElapsed(elapsedSec);
      updateStage(nextStage);

      if (elapsedSec < TOTAL_DURATION_SEC) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        updateStage('settled');
        setProgress(1);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [cancelActiveAnimation, updateStage]);

  /**
   * Replay the intro ceremony from the launching stage
   */
  const replay = useCallback(() => {
    startTimeline();
  }, [startTimeline]);

  // Handle isStarted trigger
  useEffect(() => {
    if (!isStarted) {
      cancelActiveAnimation();
      updateStage('idle');
      setProgress(0);
      return;
    }

    // Only start if not already initiated
    if (stageRef.current === 'idle') {
      startTimeline();
    }

    return () => {
      cancelActiveAnimation();
    };
  }, [isStarted, startTimeline, cancelActiveAnimation, updateStage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelActiveAnimation();
    };
  }, [cancelActiveAnimation]);

  return {
    stage,
    progress,
    replay,
  };
}

export default useIntroSequence;
