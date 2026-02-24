import { useCallback, useState } from 'react';

import type { UseFoodGameEngineOptions, UseFoodGameEngineResult } from './engineContracts';
import { useEngineFrameLoop } from './useEngineFrameLoop';
import { useEngineLifecycle } from './useEngineLifecycle';
import { useEnginePointerTarget } from './useEnginePointerTarget';
import type { FoodItem } from './types';
import { useKeyboardDirection } from './useKeyboardDirection';

/** Public composition hook for the food-game runtime. */
export function useFoodGameEngine(
  onComplete: (score: number) => void,
  options: UseFoodGameEngineOptions = {},
): UseFoodGameEngineResult {
  const liteMode = options.liteMode ?? false;
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [stickmanX, setStickmanX] = useState(50);
  const [cursorSpeed, setCursorSpeed] = useState(0);

  const { engineRef, isEngineReady, loadFailed } = useEngineLifecycle();
  const { containerRef, pendingTargetXRef, handlePointerMove } = useEnginePointerTarget();

  const applyKeyboardDirection = useCallback((direction: number) => {
    engineRef.current?.setKeyboardDirection(direction);
  }, [engineRef]);
  const { directionRef: keyboardDirectionRef } = useKeyboardDirection(applyKeyboardDirection);

  useEngineFrameLoop({
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
  });

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
export type { UseFoodGameEngineOptions, UseFoodGameEngineResult } from './engineContracts';
export type { FoodItem } from './types';
