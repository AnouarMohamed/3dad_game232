import { useEffect, useState } from 'react';

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
}

export interface PerformanceMode {
  isMobileLike: boolean;
  prefersReducedMotion: boolean;
  isLiteMode: boolean;
}

const defaultMode: PerformanceMode = {
  isMobileLike: false,
  prefersReducedMotion: false,
  isLiteMode: false,
};

export function usePerformanceMode(): PerformanceMode {
  const [mode, setMode] = useState<PerformanceMode>(defaultMode);

  useEffect(() => {
    // These media queries represent interaction and accessibility signals.
    const mobileMedia = window.matchMedia('(pointer: coarse), (max-width: 768px)');
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resolveMode = (): PerformanceMode => {
      const nav = navigator as NavigatorHints;
      const isMobileLike = mobileMedia.matches;
      const prefersReducedMotion = reducedMotionMedia.matches;
      const lowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
      const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
      const saveData = nav.connection?.saveData === true;
      // Lite mode is intentionally conservative to keep frame pacing stable.
      const isLiteMode = prefersReducedMotion || saveData || isMobileLike || lowCpu || lowMemory;

      return { isMobileLike, prefersReducedMotion, isLiteMode };
    };

    const handleChange = () => setMode(resolveMode());
    handleChange();

    let cleanup = () => {};

    try {
      mobileMedia.addEventListener('change', handleChange);
      reducedMotionMedia.addEventListener('change', handleChange);
      cleanup = () => {
        mobileMedia.removeEventListener('change', handleChange);
        reducedMotionMedia.removeEventListener('change', handleChange);
      };
    } catch {
      const legacyMobile = mobileMedia as MediaQueryList & {
        addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
        removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      };
      const legacyReduced = reducedMotionMedia as MediaQueryList & {
        addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
        removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      };

      legacyMobile.addListener?.(handleChange);
      legacyReduced.addListener?.(handleChange);
      cleanup = () => {
        legacyMobile.removeListener?.(handleChange);
        legacyReduced.removeListener?.(handleChange);
      };
    }

    return cleanup;
  }, []);

  return mode;
}
