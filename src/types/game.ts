export type GameState = 'START' | 'WALKING' | 'DIALOGUE' | 'MINIGAME' | 'FINAL' | 'MOON_GAME';

export interface DialogueLine {
  text: string;
  character: string;
  action?: () => void;
}
