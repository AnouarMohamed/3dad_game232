import type { Options } from 'canvas-confetti';
import type confetti from 'canvas-confetti';

let confettiPromise: Promise<typeof confetti> | null = null;
let canUseConfetti: boolean | null = null;

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
}

async function getConfetti() {
  confettiPromise ??= import('canvas-confetti').then((mod) =>
    ('default' in mod ? mod.default : mod) as unknown as typeof confetti,
  );
  return confettiPromise;
}

export async function fireConfetti(options: Options) {
  if (typeof window === 'undefined') {
    return;
  }

  if (canUseConfetti === null) {
    const nav = navigator as NavigatorHints;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileLike = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;
    const lowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const saveData = nav.connection?.saveData === true;
    // One-time capability gate keeps celebratory effects from hurting performance.
    canUseConfetti = !(prefersReducedMotion || isMobileLike || lowCpu || lowMemory || saveData);
  }

  if (!canUseConfetti) {
    return;
  }

  const confetti = await getConfetti();
  confetti(options);
}
