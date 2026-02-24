import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import type { DialogueLine, GameState } from '../../types/game';
import { DialogueCard } from './DialogueCard';
import { StageFallback } from './StageFallback';

const FoodGame = lazy(async () => {
  const mod = await import('../../components/FoodGame');
  return { default: mod.FoodGame };
});

interface GamePanelProps {
  gameState: GameState;
  dialogueIndex: number;
  isDialogueState: boolean;
  activeLine: DialogueLine | null;
  onNextDialogue: () => void;
  onGameComplete: () => void;
  liteMode: boolean;
}

export function GamePanel({
  gameState,
  dialogueIndex,
  isDialogueState,
  activeLine,
  onNextDialogue,
  onGameComplete,
  liteMode,
}: GamePanelProps) {
  return (
    <div className="w-full max-w-lg min-h-[200px]">
      <AnimatePresence mode="wait">
        {isDialogueState && activeLine && (
          <DialogueCard
            key={`${gameState}-${dialogueIndex}`}
            line={activeLine}
            onClick={onNextDialogue}
          />
        )}

        {gameState === 'MINIGAME' && (
          <motion.div
            key="minigame"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Suspense fallback={<StageFallback message="Loading snack game..." />}>
              <FoodGame onComplete={onGameComplete} liteMode={liteMode} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
