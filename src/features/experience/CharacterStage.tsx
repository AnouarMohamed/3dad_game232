import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { StickmanSprite } from '../../components/StickmanSprite';
import { cn } from '../../lib/cn';
import type { GameState } from '../../types/game';

interface CharacterStageProps {
  gameState: GameState;
  showCharacter: boolean;
  canSkipWalking: boolean;
  blushLevel: number;
  l3dadThought: string | null;
  onStartWalking: () => void;
  onSkipWalking: () => void;
  onCharacterClick: () => void;
}

export function CharacterStage({
  gameState,
  showCharacter,
  canSkipWalking,
  blushLevel,
  l3dadThought,
  onStartWalking,
  onSkipWalking,
  onCharacterClick,
}: CharacterStageProps) {
  return (
    <div className="relative h-56 sm:h-64 w-full flex items-center justify-center mb-6 sm:mb-8">
      {canSkipWalking && (
        <button
          onClick={onSkipWalking}
          className="absolute right-0 top-0 z-30 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-slate-200 bg-black/30 backdrop-blur-md hover:bg-white/15 border border-white/20 rounded-full transition-colors"
        >
          Skip intro
        </button>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.button
            key="start-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={onStartWalking}
            className="group relative px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-lg sm:text-xl text-white transition-all hover:scale-[1.04] active:scale-95 bg-gradient-to-r from-orange-500 via-orange-400 to-pink-400 shadow-[0_10px_30px_rgba(251,146,60,0.45)]"
          >
            <span className="relative z-10 flex items-center gap-2 mb-1">
              Feed l3dad <ArrowRight size={20} />
            </span>
            <span className="relative z-10 block text-[10px] uppercase tracking-[0.22em] text-orange-50/80">
              Enter also works
            </span>
            <div className="absolute inset-0 rounded-full ring-1 ring-white/35" />
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-orange-300 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
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
