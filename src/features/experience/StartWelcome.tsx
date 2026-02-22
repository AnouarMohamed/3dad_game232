import { ArrowRight, Sparkles, Stars } from 'lucide-react';
import { motion } from 'motion/react';

import { StickmanSprite } from '../../components/StickmanSprite';

interface StartWelcomeProps {
  onStart: () => void;
}

export function StartWelcome({ onStart }: StartWelcomeProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -top-16 -left-14 h-44 w-44 rounded-full bg-pink-400/25 blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, 8, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl"
        animate={{ x: [0, -22, 0], y: [0, -10, 0] }}
        transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 grid items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
            <Sparkles size={14} className="text-pink-200" />
            A little surprise
          </div>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl font-bold tracking-tight text-white">
            mini game for my major goat
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl text-slate-300/90 font-handwriting">
            ilysm
          </p>

          <button
            type="button"
            onClick={onStart}
            className="mt-6 group relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-gradient-to-r from-[#ff8fc6] via-[#ffb38a] to-[#8ecbff] px-6 py-3 text-sm sm:text-base font-bold text-slate-950 shadow-[0_14px_36px_rgba(252,176,121,0.45)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="relative z-10">Continue</span>
            <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-0 rounded-full bg-white/30 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">Press Enter to continue</p>
        </div>

        <motion.div
          className="mx-auto pointer-events-none"
          animate={{ y: [0, -6, 0], rotate: [0, 1.4, 0, -1.4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative">
            <StickmanSprite className="scale-[0.82] sm:scale-[0.9]" blushing teeth />
            <Stars size={18} className="absolute -top-1 right-2 text-amber-200/90" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
