import { motion } from 'motion/react';

import { fireConfetti } from '../../lib/confetti';
import { FLOATING_DECORATIONS } from './config';

interface FloatingDecorationsProps {
  liteMode: boolean;
}

export function FloatingDecorations({ liteMode }: FloatingDecorationsProps) {
  if (liteMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-1 pointer-events-none">
      {FLOATING_DECORATIONS.map(({ id, icon: Icon, origin, className, iconClassName, delay, size }) => (
        <motion.div
          key={id}
          whileHover={{ scale: 1.2, opacity: 1 }}
          onClick={() => void fireConfetti({ particleCount: 20, origin })}
          className={className}
          style={delay ? { animationDelay: delay } : undefined}
        >
          <Icon className={iconClassName} size={size} />
        </motion.div>
      ))}
    </div>
  );
}
