import { motion, type MotionValue } from 'motion/react';

import { cn } from '../../lib/cn';
import type { OrbConfig, ParticleConfig } from './config';

interface AtmosphereBackgroundProps {
  bgX1: MotionValue<number>;
  bgY1: MotionValue<number>;
  bgX2: MotionValue<number>;
  bgY2: MotionValue<number>;
  bgX3: MotionValue<number>;
  bgY3: MotionValue<number>;
  orbConfigs: OrbConfig[];
  particleConfigs: ParticleConfig[];
  liteMode: boolean;
}

export function AtmosphereBackground({
  bgX1,
  bgY1,
  bgX2,
  bgY2,
  bgX3,
  bgY3,
  orbConfigs,
  particleConfigs,
  liteMode,
}: AtmosphereBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#050505]" />

      {liteMode ? (
        <>
          <div
            style={{ transform: 'translate3d(0,0,0)' }}
            className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-dream-purple/12 blur-[90px]"
          />
          <div
            style={{ transform: 'translate3d(0,0,0)' }}
            className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-dream-blue/8 blur-[80px]"
          />
        </>
      ) : (
        <>
          <motion.div
            style={{ x: bgX1, y: bgY1 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-[70%] h-[70%] rounded-full bg-dream-purple/20 blur-[150px]"
          />
          <motion.div
            style={{ x: bgX2, y: bgY2 }}
            animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full bg-dream-blue/10 blur-[120px]"
          />
        </>
      )}

      {orbConfigs.map((orbConfig) => (
        <motion.div
          key={orbConfig.id}
          style={{
            x: orbConfig.layer === 'mid' ? bgX2 : bgX3,
            y: orbConfig.layer === 'mid' ? bgY2 : bgY3,
          }}
          animate={{
            left: orbConfig.leftStops,
            top: orbConfig.topStops,
            scale: [1, 1.35, 0.9, 1.1, 1],
            opacity: liteMode ? [0.025, 0.05, 0.025] : [0.04, 0.09, 0.04],
          }}
          transition={{
            duration: liteMode ? orbConfig.duration + 14 : orbConfig.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute rounded-full pointer-events-none',
            liteMode ? 'blur-[60px]' : 'blur-[90px]',
            orbConfig.className,
          )}
        />
      ))}

      {particleConfigs.map((particleConfig) => (
        <motion.div
          key={particleConfig.id}
          style={{ x: bgX3, y: bgY3 }}
          initial={{
            left: particleConfig.left,
            top: particleConfig.top,
            opacity: particleConfig.opacity,
          }}
          animate={{
            top: [null, '-=120', '+=50', '-=120'],
            left: [null, '+=24', '-=24', '+=24'],
            opacity: liteMode ? [null, 0.2, 0.03, 0.2] : [null, 0.45, 0.08, 0.45],
          }}
          transition={{
            duration: liteMode ? particleConfig.duration + 6 : particleConfig.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_8px_white]"
        />
      ))}
    </div>
  );
}
