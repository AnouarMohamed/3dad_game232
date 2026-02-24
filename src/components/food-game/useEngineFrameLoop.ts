import {
  useEffect,
  useRef,
  type MutableRefObject,
  type SetStateAction,
} from 'react';

import type { RustFoodEngine } from '../../wasm/food_engine/foodEngine';
import { TARGET_SCORE } from './constants';
import { emitCatchConfetti } from './emitCatchConfetti';
import type { FoodItem } from './types';
import { unpackItems } from './unpackItems';

const MIN_POSITION_DELTA = 0.02;
const MIN_SPEED_DELTA = 0.02;

interface UseEngineFrameLoopOptions {
  engineRef: MutableRefObject<RustFoodEngine | null>;
  isEngineReady: boolean;
  loadFailed: boolean;
  liteMode: boolean;
  keyboardDirectionRef: MutableRefObject<number>;
  pendingTargetXRef: MutableRefObject<number | null>;
  onComplete: (score: number) => void;
  setScore: (value: SetStateAction<number>) => void;
  setItems: (value: SetStateAction<FoodItem[]>) => void;
  setStickmanX: (value: SetStateAction<number>) => void;
  setCursorSpeed: (value: SetStateAction<number>) => void;
}

/** Runs the animation frame loop and commits UI state at a controlled cadence. */
export function useEngineFrameLoop({
  engineRef,
  isEngineReady,
  loadFailed,
  liteMode,
  keyboardDirectionRef,
  pendingTargetXRef,
  onComplete,
  setScore,
  setItems,
  setStickmanX,
  setCursorSpeed,
}: UseEngineFrameLoopOptions) {
  const hasCompletedRef = useRef(false);
  const uiStateRef = useRef({ score: 0, stickmanX: 50, cursorSpeed: 0 });

  useEffect(() => {
    if (!isEngineReady || loadFailed) {
      return;
    }

    hasCompletedRef.current = false;
    let frameId = 0;
    let lastFrameAt = performance.now();
    let lastUiCommitAt = lastFrameAt;
    const uiCommitIntervalMs = liteMode ? 50 : 16;

    const tick = (now: number) => {
      const engine = engineRef.current;
      if (!engine) {
        return;
      }

      const deltaMs = Math.min(48, now - lastFrameAt);
      lastFrameAt = now;

      const pendingTargetX = pendingTargetXRef.current;
      if (pendingTargetX !== null) {
        engine.setTargetX(pendingTargetX, now);
        pendingTargetXRef.current = null;
      }

      engine.setKeyboardDirection(keyboardDirectionRef.current);
      engine.step(deltaMs, now);

      const nextScore = engine.getScore();
      const nextStickmanX = engine.getStickmanX();
      const nextCursorSpeed = engine.getCursorSpeed();
      const shouldCommitUi =
        now - lastUiCommitAt >= uiCommitIntervalMs || nextScore !== uiStateRef.current.score;

      if (shouldCommitUi) {
        lastUiCommitAt = now;
        const nextItems = unpackItems(
          engine.getItemsPacked(),
          Math.max(0, Math.floor(engine.getItemCount())),
        );

        uiStateRef.current = {
          score: nextScore,
          stickmanX: nextStickmanX,
          cursorSpeed: nextCursorSpeed,
        };
        setScore((prev) => (prev === nextScore ? prev : nextScore));
        setItems(nextItems);
        setStickmanX((prev) =>
          Math.abs(prev - nextStickmanX) <= MIN_POSITION_DELTA ? prev : nextStickmanX,
        );
        setCursorSpeed((prev) =>
          Math.abs(prev - nextCursorSpeed) <= MIN_SPEED_DELTA ? prev : nextCursorSpeed,
        );
      }

      emitCatchConfetti(engine, engine.getCaughtCount(), liteMode);

      if (nextScore >= TARGET_SCORE && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete(nextScore);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [
    engineRef,
    isEngineReady,
    keyboardDirectionRef,
    liteMode,
    loadFailed,
    onComplete,
    pendingTargetXRef,
    setCursorSpeed,
    setItems,
    setScore,
    setStickmanX,
  ]);
}
