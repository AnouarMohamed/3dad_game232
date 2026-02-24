import { useEffect, useRef, useState } from 'react';

import { createRustFoodEngine, type RustFoodEngine } from '../../wasm/food_engine/foodEngine';
import type { EngineLifecycle } from './engineContracts';

/** Lazily initializes the WASM engine and tracks loading state. */
export function useEngineLifecycle(): EngineLifecycle {
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const engineRef = useRef<RustFoodEngine | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const seed = Math.floor(Math.random() * 0xffffffff);
        const engine = await createRustFoodEngine(seed);
        if (cancelled) {
          return;
        }

        engineRef.current = engine;
        setLoadFailed(false);
        setIsEngineReady(true);
      } catch (error) {
        console.error('Failed to initialize Rust food engine', error);
        if (!cancelled) {
          setLoadFailed(true);
          setIsEngineReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      engineRef.current = null;
    };
  }, []);

  return { engineRef, isEngineReady, loadFailed };
}
