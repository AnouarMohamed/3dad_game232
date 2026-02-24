import type { MutableRefObject, PointerEvent, RefObject } from 'react';

import type { RustFoodEngine } from '../../wasm/food_engine/foodEngine';
import type { FoodItem } from './types';

/** User-configurable runtime toggles for the food engine hook. */
export interface UseFoodGameEngineOptions {
  liteMode?: boolean;
}

/** Public state contract consumed by `FoodGame` UI components. */
export interface UseFoodGameEngineResult {
  score: number;
  items: FoodItem[];
  stickmanX: number;
  cursorSpeed: number;
  isEngineReady: boolean;
  loadFailed: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
}

/** Bootstrapped WASM engine handle and loading status. */
export interface EngineLifecycle {
  engineRef: MutableRefObject<RustFoodEngine | null>;
  isEngineReady: boolean;
  loadFailed: boolean;
}
