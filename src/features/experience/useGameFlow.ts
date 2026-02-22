import { useCallback, useEffect, useRef, useState } from 'react';

import { DIALOGUE_LINES, FINAL_DIALOGUE } from '../../constants/dialogue';
import type { GameState } from '../../types/game';
import { CHARACTER_STATES, THOUGHT_DURATION_MS, WALK_DURATION_MS } from './config';

export function useGameFlow() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [blushLevel, setBlushLevel] = useState(0);
  const [l3dadThought, setL3dadThought] = useState<string | null>(null);

  const walkTimeoutRef = useRef<number | null>(null);
  const thoughtTimeoutRef = useRef<number | null>(null);

  const isDialogueState = gameState === 'DIALOGUE' || gameState === 'FINAL';
  const showCharacter = CHARACTER_STATES.includes(gameState);
  const activeDialogue = gameState === 'FINAL' ? FINAL_DIALOGUE : DIALOGUE_LINES;
  const activeLine = activeDialogue[dialogueIndex] ?? null;

  useEffect(
    () => () => {
      if (walkTimeoutRef.current !== null) {
        clearTimeout(walkTimeoutRef.current);
      }
      if (thoughtTimeoutRef.current !== null) {
        clearTimeout(thoughtTimeoutRef.current);
      }
    },
    [],
  );

  const startWalking = useCallback(() => {
    setGameState('WALKING');
    if (walkTimeoutRef.current !== null) {
      clearTimeout(walkTimeoutRef.current);
    }
    walkTimeoutRef.current = window.setTimeout(() => {
      setGameState('DIALOGUE');
      setDialogueIndex(0);
    }, WALK_DURATION_MS);
  }, []);

  const handleL3dadClick = useCallback(() => {
    setBlushLevel((prev) => Math.min(prev + 1, 5));
    setL3dadThought('teehee!');

    if (thoughtTimeoutRef.current !== null) {
      clearTimeout(thoughtTimeoutRef.current);
    }
    thoughtTimeoutRef.current = window.setTimeout(() => {
      setBlushLevel(0);
      setL3dadThought(null);
    }, THOUGHT_DURATION_MS);
  }, []);

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

  return {
    gameState,
    dialogueIndex,
    blushLevel,
    l3dadThought,
    isDialogueState,
    showCharacter,
    activeLine,
    startWalking,
    handleL3dadClick,
    nextDialogue,
    handleGameComplete,
  };
}
