import { motion } from 'motion/react';

export function GameHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, scale: [1, 1.02, 1] }}
      transition={{
        opacity: { duration: 0.8 },
        y: { duration: 0.8 },
        scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="text-center mb-8 sm:mb-12"
    >
      <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3.5 sm:px-4 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-[10px] md:text-xs uppercase tracking-[0.22em] text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-dream-pink shadow-[0_0_8px_rgba(255,183,197,0.85)]" />
        A little surprise
      </div>
      <h1 className="text-[2rem] leading-[1.05] sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        mini game for my major goat
      </h1>
      <motion.p
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-slate-400 font-medium font-handwriting text-2xl sm:text-3xl"
      >
        ilysm
      </motion.p>
    </motion.header>
  );
}
