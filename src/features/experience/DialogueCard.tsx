import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import type { DialogueLine } from '../../types/game';

interface DialogueCardProps {
  key?: string;
  line: DialogueLine;
  onClick: () => void;
}

export function DialogueCard({ line, onClick }: DialogueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-xl p-10 pt-14 rounded-[3rem] border border-white/20 cursor-pointer hover:bg-white/15 transition-all relative group shadow-2xl"
    >
      <div className="absolute -top-4 left-10 px-6 py-2 bg-white text-slate-900 text-sm font-bold rounded-full shadow-2xl z-10 uppercase tracking-widest">
        {line.character}
      </div>

      <p className="text-2xl md:text-4xl font-medium leading-tight text-white font-sans">{line.text}</p>

      <div className="mt-10 flex justify-end items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse font-sans">
        Tap to wander <ArrowRight size={18} />
      </div>
    </motion.div>
  );
}
