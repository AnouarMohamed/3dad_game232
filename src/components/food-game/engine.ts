import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from 'react';

import { fireConfetti } from '../../lib/confetti';
import { createRustFoodEngine, type RustFoodEngine } from '../../wasm/food_engine/foodEngine';

import { STICKMAN_MAX_X, STICKMAN_MIN_X, TARGET_SCORE, clamp } from './constants';
import type { FoodItem } from './types';
import { unpackItems } from './unpackItems';
import { useKeyboardDirection } from './useKeyboardDirection';

interface UseFoodGameEngineResult {
  score: number;
  items: FoodItem[];
  stickmanX: number;
  cursorSpeed: number;
  isEngineReady: boolean;
  loadFailed: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  handlePointerMove: (e: PointerEvent<HTMLDivElement>) => void;
}

export function useFoodGameEngine(onComplete: (score: number) => void): UseFoodGameEngineResult {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [stickmanX, setStickmanX] = useState(50);
  const [cursorSpeed, setCursorSpeed] = useState(0);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const engineRef = useRef<RustFoodEngine | null>(null);
  const hasCompletedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const applyKeyboardDirection = useCallback((direction: number) => {
    engineRef.current?.setKeyboardDirection(direction);
  }, []);
  const { directionRef: keyboardDirectionRef } = useKeyboardDirection(applyKeyboardDirection);

  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const seed = Math.floor(Math.random() * 0xffffffff);
        const engine = await createRustFoodEngine(seed);
        if (isCancelled) {
          return;
        }

        engineRef.current = engine;
        hasCompletedRef.current = false;
        setLoadFailed(false);
        setIsEngineReady(true);
      } catch (error) {
        console.error('Failed to initialize Rust food engine', error);
        if (!isCancelled) {
          setLoadFailed(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
      engineRef.current = null;
    };
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !engineRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const nextTargetX = ((e.clientX - rect.left) / rect.width) * 100;
    engineRef.current.setTargetX(clamp(nextTargetX, STICKMAN_MIN_X, STICKMAN_MAX_X), performance.now());
  }, []);

  useEffect(() => {
    if (!isEngineReady || loadFailed) {
      return;
    }

    let frameId = 0;
    let lastFrameAt = performance.now();

    const tick = (now: number) => {
      const engine = engineRef.current;
      if (!engine) {
        return;
      }

      const deltaMs = Math.min(48, now - lastFrameAt);
      lastFrameAt = now;
      engine.setKeyboardDirection(keyboardDirectionRef.current);
      engine.step(deltaMs, now);

      const nextScore = engine.getScore();
      const nextItems = unpackItems(engine.getItemsPacked(), Math.max(0, Math.floor(engine.getItemCount())));
      const nextStickmanX = engine.getStickmanX();
      const nextCursorSpeed = engine.getCursorSpeed();

      setScore((prev) => (prev === nextScore ? prev : nextScore));
      setItems(nextItems);
      setStickmanX((prev) => (prev === nextStickmanX ? prev : nextStickmanX));
      setCursorSpeed((prev) => (prev === nextCursorSpeed ? prev : nextCursorSpeed));

      emitCatchConfetti(engine, engine.getCaughtCount());

      if (nextScore >= TARGET_SCORE && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete(nextScore);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isEngineReady, loadFailed, onComplete]);

  return {
    score,
    items,
    stickmanX,
    cursorSpeed,
    isEngineReady,
    loadFailed,
    containerRef,
    handlePointerMove,
  };
}

export { TARGET_SCORE, STICKMAN_Y } from './constants';
export type { FoodItem } from './types';

function emitCatchConfetti(engine: RustFoodEngine, caughtCount: number) {
  if (caughtCount <= 0) {
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
