import { motion } from 'motion/react';
import { StickmanSprite } from './StickmanSprite';
import { STICKMAN_Y, TARGET_SCORE, useFoodGameEngine } from './food-game/engine';

interface FoodGameProps {
  onComplete: (score: number) => void;
}

export function FoodGame({ onComplete }: FoodGameProps) {
  const { score, items, stickmanX, cursorSpeed, containerRef, handlePointerMove } = useFoodGameEngine(onComplete);

  return (
    <div className="space-y-4 w-full">
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300">
        <motion.div
          className="h-full bg-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${(score / TARGET_SCORE) * 100}%` }}
        />
      </div>

      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        className="relative w-full h-96 glass rounded-3xl overflow-hidden cursor-crosshair touch-none shadow-inner"
      >
        <div className="absolute top-4 left-4 font-bold text-slate-600 z-10 flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/20">
          {'\u{1F354} Snacks:'} {score} / {TARGET_SCORE}
        </div>

        <div
          className="absolute pointer-events-none transition-[left] duration-75 ease-out"
          style={{ left: `${stickmanX}%`, top: `${STICKMAN_Y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <StickmanSprite walking={cursorSpeed > 0.15} speed={cursorSpeed} className="scale-75" />
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-4xl pointer-events-none"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
            <p className="font-sans font-semibold tracking-wide text-xl md:text-2xl">Move your pointer to feed him!</p>
          </div>
        )}
      </div>
    </div>
  );
}
