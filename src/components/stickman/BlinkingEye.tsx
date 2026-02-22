import { motion } from 'motion/react';

const BLINK_ANIMATION = { scaleY: [1, 1, 0.1, 1, 1] };
const BLINK_TRANSITION = { repeat: Infinity, duration: 3, times: [0, 0.8, 0.85, 0.9, 1] };

export function BlinkingEye() {
  return (
    <motion.div
      className="w-3.5 h-3.5 bg-slate-900 rounded-full shadow-sm"
      animate={BLINK_ANIMATION}
      transition={BLINK_TRANSITION}
    />
  );
}
