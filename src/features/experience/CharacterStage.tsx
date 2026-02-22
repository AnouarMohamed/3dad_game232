import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { StickmanSprite } from '../../components/StickmanSprite';
import { cn } from '../../lib/cn';
import type { GameState } from '../../types/game';

interface CharacterStageProps {
  gameState: GameState;
  showCharacter: boolean;
  blushLevel: number;
  l3dadThought: string | null;
  onStartWalking: () => void;
  onCharacterClick: () => void;
}

export function CharacterStage({
  gameState,
  showCharacter,
  blushLevel,
  l3dadThought,
  onStartWalking,
  onCharacterClick,
}: CharacterStageProps) {
  return (
    <div className="relative h-64 w-full flex items-center justify-center mb-8">
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.button
            key="start-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={onStartWalking}
            className="group relative px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Feed l3dad <ArrowRight size={20} />
            </span>
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
          </motion.button>
        )}

        {showCharacter && (
          <motion.div
            key="character"
            initial={gameState === 'WALKING' ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="relative"
          >
            <AnimatePresence>
              {l3dadThought && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-2xl z-20 whitespace-nowrap font-handwriting text-3xl text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {l3dadThought}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
            <StickmanSprite
              walking={gameState === 'WALKING'}
              cheering={gameState === 'FINAL'}
              className={cn(blushLevel > 0 && 'scale-110')}
              onClick={onCharacterClick}
              blushing={blushLevel > 0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
