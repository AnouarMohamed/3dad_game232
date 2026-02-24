import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { FOOD_EMOJIS } from '../constants/food';

import { FoodGameArena } from './food-game/FoodGameArena';
import { FoodGameProgress } from './food-game/FoodGameProgress';
import { TARGET_SCORE, useFoodGameEngine } from './food-game/engine';

interface FoodGameProps {
  onComplete: (score: number) => void;
  liteMode: boolean;
}

export function FoodGame({ onComplete, liteMode }: FoodGameProps) {
  const {
    score,
    items,
    stickmanX,
    cursorSpeed,
    isEngineReady,
    loadFailed,
    containerRef,
    handlePointerMove,
  } = useFoodGameEngine(onComplete, { liteMode });
  const [featuredFoodIndex, setFeaturedFoodIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFeaturedFoodIndex((prev) => (prev + 1) % FOOD_EMOJIS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  if (loadFailed) {
    return (
      <div className="glass rounded-3xl border border-rose-300/30 p-5 text-center text-rose-200">
        <p className="font-semibold">Could not load the Rust food engine.</p>
        <p className="text-sm mt-1 text-rose-100/80">Refresh once and try again.</p>
      </div>
    );
  }

  if (!isEngineReady) {
    return (
      <div className="glass rounded-3xl border border-white/15 p-5 text-center text-slate-200 space-y-2">
        <p className="font-semibold text-lg">Loading snack engine...</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preparing dream kitchen</p>
      </div>
    );
  }

  const remaining = Math.max(0, TARGET_SCORE - score);
  const flowLabel = cursorSpeed > 2.8 ? 'Fast' : cursorSpeed > 1.2 ? 'Smooth' : 'Calm';

  return (
    <div className="relative space-y-4 w-full select-none">
      <div className="absolute inset-x-8 sm:inset-x-14 -top-8 h-40 rounded-full bg-pink-400/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-16 sm:inset-x-28 -top-1 h-32 rounded-full bg-sky-400/12 blur-3xl pointer-events-none" />

      <section className="relative glass rounded-3xl border border-white/15 p-4 sm:p-5 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -top-16 -left-10 w-44 h-44 rounded-full bg-pink-400/20 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-20 -right-12 w-52 h-52 rounded-full bg-sky-400/20 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Dream Kitchen Mode</p>
            <h3 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-100">Midnight Order Rush</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-300/90">
              Keep feeding l3dad before the snack stream fades out.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Goal</p>
            <p className="text-2xl font-bold text-slate-100">
              {score}
              <span className="text-slate-400">/{TARGET_SCORE}</span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FoodGameProgress score={score} />
        </div>

        <div className="relative mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs sm:text-sm font-medium text-slate-200">
          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="uppercase tracking-[0.16em] text-[10px] text-slate-400">Featured</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={featuredFoodIndex}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="text-2xl"
              >
                {FOOD_EMOJIS[featuredFoodIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="uppercase tracking-[0.16em] text-[10px] text-slate-400">Remaining</span>
            <span className="text-amber-100 font-semibold">{remaining}</span>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="uppercase tracking-[0.16em] text-[10px] text-slate-400">In Air</span>
            <span className="text-pink-200 font-semibold">{items.length}</span>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 flex items-center justify-between">
            <span className="uppercase tracking-[0.16em] text-[10px] text-slate-400">Flow</span>
            <span className="text-cyan-200 font-semibold">{flowLabel}</span>
          </div>
        </div>
      </section>

      <FoodGameArena
        score={score}
        items={items}
        stickmanX={stickmanX}
        cursorSpeed={cursorSpeed}
        containerRef={containerRef}
        onPointerMove={handlePointerMove}
        liteMode={liteMode}
      />

      <div className="glass rounded-2xl border border-white/15 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-300">
        <span>
          Goal: <strong className="text-slate-100">{TARGET_SCORE}</strong> snacks
        </span>
        <span>
          Controls: <strong className="text-slate-100">pointer or A / D</strong>
        </span>
        <span>
          Style: <strong className="text-pink-200">dreamy neon</strong>
        </span>
      </div>
    </div>
  );
}
