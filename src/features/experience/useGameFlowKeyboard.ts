import { useEffect } from 'react';

import type { GameState } from '../../types/game';
import { isAdvanceKey, isTypingTarget } from './gameFlowKeys';
import { isDialogueGameState } from './gameFlowSelectors';

interface UseGameFlowKeyboardOptions {
  getGameState: () => GameState;
  onStart: () => void;
  onAdvance: () => void;
}

/**
 * Registers keyboard shortcuts for starting and advancing the experience.
 * Kept separate from `useGameFlow` to keep event wiring isolated and testable.
 */
export function useGameFlowKeyboard({ getGameState, onStart, onAdvance }: UseGameFlowKeyboardOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isTypingTarget(event.target) || !isAdvanceKey(event)) {
        return;
      }

      const state = getGameState();
      if (state === 'START') {
        event.preventDefault();
        onStart();
        return;
      }

      if (isDialogueGameState(state)) {
        event.preventDefault();
        onAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getGameState, onAdvance, onStart]);
}
