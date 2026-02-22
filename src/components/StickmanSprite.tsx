import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '../lib/cn';
import { BlinkingEye } from './stickman/BlinkingEye';
import { buildStickmanMotion } from './stickman/motion';

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
  const {
    walkDuration,
    cycleDuration,
    legDuration,
    rootAnimate,
    rootTransition,
    headAnimate,
    armAnimate,
    legs,
  } = buildStickmanMotion({ cheering, walking, speed });

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={cn('relative w-24 h-40 flex flex-col items-center group', className)}
      animate={rootAnimate}
      transition={rootTransition}
    >
      <motion.div
        className="absolute inset-0 -m-4 bg-orange-300/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      <motion.div
        className="w-24 h-24 border-4 border-white rounded-full bg-white relative flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.5)]"
        animate={headAnimate}
        transition={{ repeat: Infinity, duration: walking ? walkDuration : 3, ease: 'easeInOut' }}
      >
        <div className="absolute top-4 flex gap-6 z-10">
          <BlinkingEye />
          <BlinkingEye />
        </div>

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

        <motion.div
          className="absolute bottom-2 w-14 h-8 border-2 border-slate-900 rounded-b-2xl bg-white flex items-start justify-center overflow-hidden z-0"
          animate={cheering ? { height: [8, 16, 8] } : {}}
        >
          {teeth && (
            <div className="flex gap-0.5 pt-0.5">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="w-2 h-5 bg-slate-100 border-x border-b border-slate-300"
                  style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="w-1 h-16 bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        animate={walking ? { rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: walkDuration }}
      />

      <motion.div
        className="absolute top-20 w-16 h-1 bg-white/90 origin-center shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        animate={armAnimate}
        transition={{ repeat: Infinity, duration: cycleDuration, ease: 'linear' }}
      />

      <div className="flex gap-8 -mt-1">
        {legs.map((leg) => (
          <motion.div
            key={leg.id}
            className="w-1 h-12 bg-white/90 origin-top shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            animate={leg.animate}
            transition={{ repeat: Infinity, duration: legDuration, ease: 'linear' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export const StickmanSprite = memo(StickmanSpriteComponent);
