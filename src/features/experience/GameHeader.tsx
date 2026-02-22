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
      className="text-center mb-12"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        mini game for my major goat
      </h1>
      <motion.p
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-slate-400 font-medium font-handwriting text-3xl"
      >
        ilysm
      </motion.p>
    </motion.header>
  );
}
