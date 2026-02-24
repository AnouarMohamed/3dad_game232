import { motion } from 'motion/react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

import { StickmanSprite } from '../StickmanSprite';

import { STICKMAN_Y, TARGET_SCORE } from './constants';
import type { FoodItem } from './types';

interface FoodGameArenaProps {
  score: number;
  items: FoodItem[];
  stickmanX: number;
  cursorSpeed: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  liteMode: boolean;
}

export function FoodGameArena({
  score,
  items,
  stickmanX,
  cursorSpeed,
  containerRef,
  onPointerMove,
  liteMode,
}: FoodGameArenaProps) {
  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      className="relative w-full h-[24rem] sm:h-[28rem] rounded-[1.7rem] overflow-hidden border border-white/15 bg-[#080610]/90 touch-none cursor-crosshair shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,157,210,0.28),transparent_38%),radial-gradient(circle_at_80%_82%,rgba(142,216,255,0.24),transparent_36%),linear-gradient(180deg,rgba(12,11,22,0.78),rgba(5,5,12,0.95))]" />
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,0.42)_0.7px,transparent_1px)] [background-size:28px_28px]" />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-sm font-semibold text-slate-100 backdrop-blur-md">
        {'\u{1F354} Snacks:'} {score}/{TARGET_SCORE}
      </div>
      <div className="absolute top-4 right-4 z-10 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-md">
        Flow {cursorSpeed.toFixed(1)}
      </div>

      <div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-200/90 to-transparent shadow-[0_0_18px_rgba(255,215,130,0.75)]"
        style={{ top: `${Math.min(96, STICKMAN_Y + 7)}%` }}
      />
      <div
        className="absolute left-0 right-0 text-center text-[10px] tracking-[0.32em] uppercase text-amber-100/70 pointer-events-none"
        style={{ top: `${Math.min(97, STICKMAN_Y + 8)}%` }}
      >
        Catch line
      </div>

      {liteMode ? (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none h-20 w-20 rounded-full bg-pink-300/20 blur-xl"
          style={{ top: `${STICKMAN_Y - 2}%`, left: `${stickmanX - 2}%` }}
        />
      ) : (
        <motion.div
          aria-hidden="true"
          className="absolute pointer-events-none h-28 w-28 rounded-full bg-pink-300/25 blur-2xl"
          animate={{ left: [`${stickmanX - 6}%`, `${stickmanX + 2}%`, `${stickmanX - 6}%`] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: `${STICKMAN_Y - 2}%` }}
        />
      )}

      <div
        className="absolute pointer-events-none transition-[left] duration-75 ease-out"
        style={{ left: `${stickmanX}%`, top: `${STICKMAN_Y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <StickmanSprite walking={cursorSpeed > 0.15} speed={cursorSpeed} className="scale-75 md:scale-90" />
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl pointer-events-none drop-shadow-[0_0_20px_rgba(255,199,124,0.75)]"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {score === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none px-6 text-center">
          <p className="font-sans font-semibold tracking-wide text-xl md:text-2xl">Move your pointer to feed him!</p>
          <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.2em] text-slate-400/90">
            Drag to glide, A / D also works
          </p>
        </div>
      )}
    </div>
  );
}
