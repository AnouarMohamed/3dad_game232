import { useCallback, useEffect, useRef } from 'react';

type TimeoutHandler = () => void;

interface ManagedTimeout {
  set: (handler: TimeoutHandler, delayMs: number) => void;
  clear: () => void;
}

export function useManagedTimeout(): ManagedTimeout {
  // Single mutable timer handle that survives renders.
  const timeoutRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current === null) {
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const set = useCallback(
    (handler: TimeoutHandler, delayMs: number) => {
      // Replace any existing timer to keep behavior deterministic.
      clear();
      timeoutRef.current = window.setTimeout(handler, delayMs);
    },
    [clear],
  );

  // Always clear on unmount to avoid orphaned callbacks.
  useEffect(() => clear, [clear]);

  return { set, clear };
}
