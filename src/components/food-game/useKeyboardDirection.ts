import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';

interface KeyboardDirectionState {
  directionRef: MutableRefObject<number>;
}

type DirectionSink = (direction: number) => void;

export function useKeyboardDirection(onDirectionChange: DirectionSink): KeyboardDirectionState {
  const directionRef = useRef(0);
  const leftPressedRef = useRef(false);
  const rightPressedRef = useRef(false);

  const syncDirection = useCallback(() => {
    const nextDirection =
      leftPressedRef.current === rightPressedRef.current ? 0 : leftPressedRef.current ? -1 : 1;
    directionRef.current = nextDirection;
    onDirectionChange(nextDirection);
  }, [onDirectionChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        leftPressedRef.current = true;
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        rightPressedRef.current = true;
      } else {
        return;
      }

      syncDirection();
      event.preventDefault();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const isLeft = event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a';
      const isRight = event.key === 'ArrowRight' || event.key.toLowerCase() === 'd';
      if (isLeft) {
        leftPressedRef.current = false;
      }
      if (isRight) {
        rightPressedRef.current = false;
      }
      if (isLeft || isRight) {
        syncDirection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [syncDirection]);

  return { directionRef };
}
