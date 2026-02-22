import { useCallback, useEffect, useMemo, type MouseEvent } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

import { createOrbConfigs, createParticleConfigs } from './config';

export function useParallax(enabled: boolean) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const bgX1 = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const bgY1 = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const bgX2 = useTransform(springX, [-0.5, 0.5], [-40, 40]);
  const bgY2 = useTransform(springY, [-0.5, 0.5], [-40, 40]);
  const bgX3 = useTransform(springX, [-0.5, 0.5], [-60, 60]);
  const bgY3 = useTransform(springY, [-0.5, 0.5], [-60, 60]);

  const orbConfigs = useMemo(createOrbConfigs, []);
  const particleConfigs = useMemo(createParticleConfigs, []);

  useEffect(() => {
    if (!enabled) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [enabled, mouseX, mouseY]);

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!enabled) {
        return;
      }

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    },
    [enabled, mouseX, mouseY],
  );

  return {
    handleGlobalMouseMove,
    bgX1,
    bgY1,
    bgX2,
    bgY2,
    bgX3,
    bgY3,
    orbConfigs,
    particleConfigs,
  };
}
