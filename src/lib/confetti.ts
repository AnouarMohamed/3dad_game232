import type { Options } from 'canvas-confetti';
import type confetti from 'canvas-confetti';

let confettiPromise: Promise<typeof confetti> | null = null;

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

  const confetti = await getConfetti();
  confetti(options);
}
