import { useCallback, useEffect, useRef } from 'react';

type TimeoutHandler = () => void;

interface ManagedTimeout {
  set: (handler: TimeoutHandler, delayMs: number) => void;
  clear: () => void;
}

export function useManagedTimeout(): ManagedTimeout {
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
      clear();
      timeoutRef.current = window.setTimeout(handler, delayMs);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return { set, clear };
}
