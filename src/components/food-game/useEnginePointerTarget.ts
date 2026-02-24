import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent,
  type RefObject,
} from 'react';

import { STICKMAN_MAX_X, STICKMAN_MIN_X, clamp } from './constants';

interface EnginePointerTarget {
  containerRef: RefObject<HTMLDivElement | null>;
  pendingTargetXRef: MutableRefObject<number | null>;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
}

/** Tracks pointer intent and exposes the latest normalized target position. */
export function useEnginePointerTarget(): EnginePointerTarget {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingTargetXRef = useRef<number | null>(null);
  const pointerRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const node = containerRef.current;
    const refreshRect = () => {
      pointerRectRef.current = node.getBoundingClientRect();
    };

    // Cache geometry to avoid repeated synchronous layout reads during pointer moves.
    refreshRect();
    const observer = new ResizeObserver(refreshRect);
    observer.observe(node);
    window.addEventListener('resize', refreshRect);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', refreshRect);
      pointerRectRef.current = null;
    };
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const rect = pointerRectRef.current ?? node.getBoundingClientRect();
    pointerRectRef.current = rect;
    if (rect.width <= 0) {
      return;
    }

    const nextTargetX = ((event.clientX - rect.left) / rect.width) * 100;
    // Store only the latest target; engine consumes this once per animation frame.
    pendingTargetXRef.current = clamp(nextTargetX, STICKMAN_MIN_X, STICKMAN_MAX_X);
  }, []);

  return { containerRef, pendingTargetXRef, handlePointerMove };
}
