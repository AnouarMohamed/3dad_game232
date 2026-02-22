import { motion } from 'motion/react';

import { TARGET_SCORE } from './constants';

interface FoodGameProgressProps {
  score: number;
}

export function FoodGameProgress({ score }: FoodGameProgressProps) {
  const progress = Math.min(100, (score / TARGET_SCORE) * 100);

  return (
    <div className="relative h-4 rounded-full overflow-hidden border border-white/20 bg-slate-950/80">
      <motion.div
        className="h-full bg-gradient-to-r from-[#ff9ad5] via-[#ffd48e] to-[#93ddff] shadow-[0_0_18px_rgba(255,182,201,0.4)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 w-16 bg-gradient-to-r from-white/0 via-white/35 to-white/0"
        animate={{ x: ['-200%', '550%'] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
      />
    </div>
  );
}
