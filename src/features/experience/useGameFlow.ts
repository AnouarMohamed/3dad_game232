import { useCallback, useEffect, useState } from 'react';

import { DIALOGUE_LINES, FINAL_DIALOGUE } from '../../constants/dialogue';
import type { GameState } from '../../types/game';
import { CHARACTER_STATES, THOUGHT_DURATION_MS, WALK_DURATION_MS } from './config';
import { isAdvanceKey, isTypingTarget } from './gameFlowKeys';
import { useManagedTimeout } from './useManagedTimeout';

export function useGameFlow() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [blushLevel, setBlushLevel] = useState(0);
  const [l3dadThought, setL3dadThought] = useState<string | null>(null);

  const walkTimeout = useManagedTimeout();
  const thoughtTimeout = useManagedTimeout();

  const isDialogueState = gameState === 'DIALOGUE' || gameState === 'FINAL';
  const showCharacter = CHARACTER_STATES.includes(gameState);
  const activeDialogue = gameState === 'FINAL' ? FINAL_DIALOGUE : DIALOGUE_LINES;
  const activeLine = activeDialogue[dialogueIndex] ?? null;
  const canSkipWalking = gameState === 'WALKING';

  const startWalking = useCallback(() => {
    setGameState('WALKING');
    walkTimeout.set(() => {
      setGameState('DIALOGUE');
      setDialogueIndex(0);
    }, WALK_DURATION_MS);
  }, [walkTimeout]);

  const handleL3dadClick = useCallback(() => {
    setBlushLevel((prev) => Math.min(prev + 1, 5));
    setL3dadThought('teehee!');

    thoughtTimeout.set(() => {
      setBlushLevel(0);
      setL3dadThought(null);
    }, THOUGHT_DURATION_MS);
  }, [thoughtTimeout]);

  const skipWalking = useCallback(() => {
    if (gameState !== 'WALKING') {
      return;
    }
    walkTimeout.clear();
    setGameState('DIALOGUE');
    setDialogueIndex(0);
  }, [gameState, walkTimeout]);

  const nextDialogue = useCallback(() => {
    if (!isDialogueState) {
      return;
    }

    const isLastLine = dialogueIndex >= activeDialogue.length - 1;
    if (!isLastLine) {
      setDialogueIndex((prev) => prev + 1);
      return;
    }

    setGameState(gameState === 'DIALOGUE' ? 'MINIGAME' : 'MOON_GAME');
  }, [activeDialogue.length, dialogueIndex, gameState, isDialogueState]);

  const handleGameComplete = useCallback(() => {
    setGameState('FINAL');
    setDialogueIndex(0);
  }, []);

  const resetExperience = useCallback(() => {
    walkTimeout.clear();
    thoughtTimeout.clear();
    setGameState('START');
    setDialogueIndex(0);
    setBlushLevel(0);
    setL3dadThought(null);
  }, [thoughtTimeout, walkTimeout]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isTypingTarget(event.target) || !isAdvanceKey(event)) {
        return;
      }

      if (gameState === 'START') {
        event.preventDefault();
        startWalking();
        return;
      }

      if (isDialogueState) {
        event.preventDefault();
        nextDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isDialogueState, nextDialogue, startWalking]);

  return {
    gameState,
    dialogueIndex,
    blushLevel,
    l3dadThought,
    isDialogueState,
    showCharacter,
    canSkipWalking,
    activeLine,
    startWalking,
    skipWalking,
    handleL3dadClick,
    nextDialogue,
    handleGameComplete,
    resetExperience,
  };
}
