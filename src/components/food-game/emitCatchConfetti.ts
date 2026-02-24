import { fireConfetti } from '../../lib/confetti';
import type { RustFoodEngine } from '../../wasm/food_engine/foodEngine';

import { clamp } from './constants';

/** Emits celebratory particles for successful catches on supported devices. */
export function emitCatchConfetti(engine: RustFoodEngine, caughtCount: number, liteMode: boolean) {
  if (caughtCount <= 0 || liteMode) {
    return;
  }

  void fireConfetti({
    particleCount: Math.min(24, 8 + caughtCount * 3),
    spread: 32,
    origin: {
      x: clamp(engine.getLastCatchX() / 100, 0, 1),
      y: clamp(engine.getLastCatchY() / 100, 0, 1),
    },
    colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
    scalar: 0.5,
  });
}
