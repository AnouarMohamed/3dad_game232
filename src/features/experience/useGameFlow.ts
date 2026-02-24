import { useCallback, useEffect, useRef, useState } from 'react';

import type { GameState } from '../../types/game';
import { CHARACTER_STATES, THOUGHT_DURATION_MS, WALK_DURATION_MS } from './config';
import {
  getActiveLineForState,
  getDialogueForState,
  getNextStateAfterDialogue,
  isDialogueGameState,
} from './gameFlowSelectors';
import { useManagedTimeout } from './useManagedTimeout';
import { useGameFlowKeyboard } from './useGameFlowKeyboard';

/**
 * Owns experience state transitions while delegating pure selectors and keyboard wiring.
 * This keeps the hook compact while preserving deterministic control-flow.
 */
export function useGameFlow() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [blushLevel, setBlushLevel] = useState(0);
  const [l3dadThought, setL3dadThought] = useState<string | null>(null);

  // These refs let long-lived handlers read the latest state without re-registering listeners.
  const gameStateRef = useRef<GameState>('START');
  const dialogueIndexRef = useRef(0);

  const { set: setWalkTimeout, clear: clearWalkTimeout } = useManagedTimeout();
  const { set: setThoughtTimeout, clear: clearThoughtTimeout } = useManagedTimeout();

  const setGameStateSafe = useCallback((nextState: GameState) => {
    gameStateRef.current = nextState;
    setGameState(nextState);
  }, []);

  const setDialogueIndexSafe = useCallback((nextIndex: number) => {
    dialogueIndexRef.current = nextIndex;
    setDialogueIndex(nextIndex);
  }, []);

  // Defensive sync so refs stay correct even if new state paths are added later.
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    dialogueIndexRef.current = dialogueIndex;
  }, [dialogueIndex]);

  const isDialogueState = isDialogueGameState(gameState);
  const showCharacter = CHARACTER_STATES.includes(gameState);
  const activeLine = getActiveLineForState(gameState, dialogueIndex);
  const canSkipWalking = gameState === 'WALKING';

  const startWalking = useCallback(() => {
    if (gameStateRef.current !== 'START') {
      return;
    }

    setGameStateSafe('WALKING');
    setWalkTimeout(() => {
      setGameStateSafe('DIALOGUE');
      setDialogueIndexSafe(0);
    }, WALK_DURATION_MS);
  }, [setDialogueIndexSafe, setGameStateSafe, setWalkTimeout]);

  const handleL3dadClick = useCallback(() => {
    setBlushLevel((prev) => Math.min(prev + 1, 5));
    setL3dadThought('teehee!');

    setThoughtTimeout(() => {
      setBlushLevel(0);
      setL3dadThought(null);
    }, THOUGHT_DURATION_MS);
  }, [setThoughtTimeout]);

  const skipWalking = useCallback(() => {
    if (gameStateRef.current !== 'WALKING') {
      return;
    }

    clearWalkTimeout();
    setGameStateSafe('DIALOGUE');
    setDialogueIndexSafe(0);
  }, [clearWalkTimeout, setDialogueIndexSafe, setGameStateSafe]);

  const nextDialogue = useCallback(() => {
    const currentState = gameStateRef.current;
    if (!isDialogueGameState(currentState)) {
      return;
    }

    const currentDialogue = getDialogueForState(currentState);
    const currentIndex = dialogueIndexRef.current;
    const isLastLine = currentIndex >= currentDialogue.length - 1;

    if (!isLastLine) {
      setDialogueIndexSafe(currentIndex + 1);
      return;
    }

    setGameStateSafe(getNextStateAfterDialogue(currentState));
  }, [setDialogueIndexSafe, setGameStateSafe]);

  const handleGameComplete = useCallback(() => {
    setGameStateSafe('FINAL');
    setDialogueIndexSafe(0);
  }, [setDialogueIndexSafe, setGameStateSafe]);

  const resetExperience = useCallback(() => {
    clearWalkTimeout();
    clearThoughtTimeout();
    setGameStateSafe('START');
    setDialogueIndexSafe(0);
    setBlushLevel(0);
    setL3dadThought(null);
  }, [clearThoughtTimeout, clearWalkTimeout, setDialogueIndexSafe, setGameStateSafe]);

  const getGameState = useCallback(() => gameStateRef.current, []);
  useGameFlowKeyboard({ getGameState, onStart: startWalking, onAdvance: nextDialogue });

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
