import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { KeyboardEvent } from 'react';

import type { DialogueLine } from '../../types/game';

interface DialogueCardProps {
  key?: string;
  line: DialogueLine;
  onClick: () => void;
}

export function DialogueCard({ line, onClick }: DialogueCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-black/25 backdrop-blur-xl p-6 sm:p-10 pt-11 sm:pt-14 rounded-[2rem] sm:rounded-[2.5rem] border border-white/15 cursor-pointer hover:bg-white/10 transition-all relative group shadow-[0_16px_50px_rgba(0,0,0,0.45)] touch-manipulation"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem] sm:rounded-t-[2.5rem] bg-gradient-to-r from-dream-purple via-dream-pink to-dream-blue" />
      <div className="absolute -top-4 left-6 sm:left-10 px-4 sm:px-6 py-2 bg-white text-slate-900 text-xs sm:text-sm font-bold rounded-full shadow-2xl z-10 uppercase tracking-widest">
        {line.character}
      </div>

      <p className="text-xl sm:text-2xl md:text-4xl font-medium leading-tight text-white font-sans drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
        {line.text}
      </p>

      <div className="mt-8 sm:mt-10 flex justify-end items-center gap-2 text-slate-400 font-bold text-[11px] sm:text-sm uppercase tracking-widest animate-pulse font-sans">
        Tap or Enter to continue <ArrowRight size={18} />
      </div>
    </motion.div>
  );
}
