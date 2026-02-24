import { DIALOGUE_LINES, FINAL_DIALOGUE } from '../../constants/dialogue';
import type { DialogueLine, GameState } from '../../types/game';

/** True when the current state advances through dialogue lines. */
export const isDialogueGameState = (state: GameState): boolean =>
  state === 'DIALOGUE' || state === 'FINAL';

/** Resolves the active dialogue list for the current experience stage. */
export const getDialogueForState = (state: GameState): readonly DialogueLine[] =>
  state === 'FINAL' ? FINAL_DIALOGUE : DIALOGUE_LINES;

/** Returns the currently visible dialogue line, if available. */
export const getActiveLineForState = (state: GameState, dialogueIndex: number): DialogueLine | null =>
  getDialogueForState(state)[dialogueIndex] ?? null;

/** Computes the next game stage once a dialogue sequence ends. */
export const getNextStateAfterDialogue = (state: Extract<GameState, 'DIALOGUE' | 'FINAL'>): GameState =>
  state === 'DIALOGUE' ? 'MINIGAME' : 'MOON_GAME';
