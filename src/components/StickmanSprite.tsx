import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '../lib/cn';

interface StickmanSpriteProps {
  className?: string;
  cheering?: boolean;
  walking?: boolean;
  teeth?: boolean;
  blushing?: boolean;
  onClick?: () => void;
  speed?: number;
}

function StickmanSpriteComponent({
  className,
  cheering = false,
  walking = false,
  teeth = true,
  blushing = false,
  onClick,
  speed = 0,
}: StickmanSpriteProps) {
  const isIdle = !walking && !cheering;

  // Dynamic duration based on speed (0 to 10 scale)
  const walkDuration = Math.max(0.1, 0.5 - speed * 0.045);
  // Lean angle increases with speed
  const leanAngle = walking ? Math.min(25, speed * 3) : 0;
  // Squash and stretch based on speed
  const stretchY = walking ? 1 + speed * 0.02 : 1;
  const squashX = walking ? 1 - speed * 0.01 : 1;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={cn('relative w-24 h-40 flex flex-col items-center group', className)}
      animate={
        cheering
          ? { y: [0, -40, 0], rotate: [0, -5, 5, 0], scaleX: 1, scaleY: 1 }
          : walking
            ? { rotate: leanAngle, y: [0, -6, 0], scaleX: squashX, scaleY: stretchY }
            : { y: [0, -3, 0], rotate: 0, scaleX: [1, 1.02, 1], scaleY: [1, 0.98, 1] }
      }
      transition={
        cheering
          ? { repeat: Infinity, duration: 0.4, ease: 'easeOut' }
          : walking
            ? {
                rotate: { type: 'spring', stiffness: 150, damping: 12 },
                y: { repeat: Infinity, duration: walkDuration, ease: 'easeInOut' },
                scaleX: { duration: 0.2 },
                scaleY: { duration: 0.2 },
              }
            : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
      }
    >
      {/* Surreal Aura */}
      <motion.div
        className="absolute inset-0 -m-4 bg-orange-300/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      {/* Head */}
      <motion.div
        className="w-24 h-24 border-4 border-white rounded-full bg-white relative flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.5)]"
        animate={
          isIdle
            ? { scale: [1, 1.04, 1], y: [0, -2, 0] }
            : walking
              ? { y: [0, -4, 0], rotate: [-4, 4, -4], scale: 1 + speed * 0.01 }
              : { y: 0 }
        }
        transition={{
          repeat: Infinity,
          duration: walking ? walkDuration : 3,
          ease: 'easeInOut',
        }}
      >
        {/* Eyes */}
        <div className="absolute top-4 flex gap-6 z-10">
          <motion.div
            className="w-3.5 h-3.5 bg-slate-900 rounded-full shadow-sm"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 0.85, 0.9, 1] }}
          />
          <motion.div
            className="w-3.5 h-3.5 bg-slate-900 rounded-full shadow-sm"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 0.85, 0.9, 1] }}
          />
        </div>

        {/* Blush */}
        <AnimatePresence>
          {blushing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 w-full flex justify-between px-4 z-5"
            >
              <div className="w-4 h-2 bg-pink-300 rounded-full blur-[2px]" />
              <div className="w-4 h-2 bg-pink-300 rounded-full blur-[2px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mouth with teeth */}
        <motion.div
          className="absolute bottom-2 w-14 h-8 border-2 border-slate-900 rounded-b-2xl bg-white flex items-start justify-center overflow-hidden z-0"
          animate={cheering ? { height: [8, 16, 8] } : {}}
        >
          {teeth && (
            <div className="flex gap-0.5 pt-0.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-2 h-5 bg-slate-100 border-x border-b border-slate-300"
                  style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Body */}
      <motion.div
        className="w-1 h-16 bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        animate={walking ? { rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: walkDuration }}
      />

      {/* Arms */}
      <motion.div
        className="absolute top-20 w-16 h-1 bg-white/90 origin-center shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        animate={
          cheering
            ? { rotate: [45, 135, 45], y: [-10, -20, -10] }
            : walking
              ? {
                  rotate: [-30 - speed * 5, 30 + speed * 5, -30 - speed * 5],
                  x: [-2 - speed, 2 + speed, -2 - speed],
                }
              : { rotate: [0, 8, 0], y: [0, -2, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: cheering ? 0.4 : walking ? walkDuration : 3,
          ease: 'linear',
        }}
      />

      {/* Legs */}
      <div className="flex gap-8 -mt-1">
        <motion.div
          className="w-1 h-12 bg-white/90 origin-top shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          animate={
            walking
              ? { rotate: [40 + speed * 4, -40 - speed * 4, 40 + speed * 4], y: [0, -4, 0] }
              : cheering
                ? { rotate: [10, -10, 10] }
                : { rotate: [0, 2, 0], scaleY: [1, 0.95, 1] }
          }
          transition={{
            repeat: Infinity,
            duration: walking ? walkDuration : isIdle ? 3 : 0.4,
            ease: 'linear',
          }}
        />
        <motion.div
          className="w-1 h-12 bg-white/90 origin-top shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          animate={
            walking
              ? { rotate: [-40 - speed * 4, 40 + speed * 4, -40 - speed * 4], y: [0, -4, 0] }
              : cheering
                ? { rotate: [-10, 10, -10] }
                : { rotate: [0, -2, 0], scaleY: [1, 0.95, 1] }
          }
          transition={{
            repeat: Infinity,
            duration: walking ? walkDuration : isIdle ? 3 : 0.4,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

export const StickmanSprite = memo(StickmanSpriteComponent);
