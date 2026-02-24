import { useCallback, useEffect, useMemo, type MouseEvent } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

import { createOrbConfigs, createParticleConfigs } from './config';

export function useParallax(enabled: boolean, liteMode: boolean) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Springs smooth quick pointer jumps to avoid harsh background movement.
  const springX = useSpring(mouseX, { stiffness: liteMode ? 35 : 50, damping: liteMode ? 26 : 30 });
  const springY = useSpring(mouseY, { stiffness: liteMode ? 35 : 50, damping: liteMode ? 26 : 30 });
  const interactiveParallax = enabled && !liteMode;

  const bgX1 = useTransform(springX, [-0.5, 0.5], liteMode ? [-8, 8] : [-20, 20]);
  const bgY1 = useTransform(springY, [-0.5, 0.5], liteMode ? [-8, 8] : [-20, 20]);
  const bgX2 = useTransform(springX, [-0.5, 0.5], liteMode ? [-12, 12] : [-40, 40]);
  const bgY2 = useTransform(springY, [-0.5, 0.5], liteMode ? [-12, 12] : [-40, 40]);
  const bgX3 = useTransform(springX, [-0.5, 0.5], liteMode ? [-16, 16] : [-60, 60]);
  const bgY3 = useTransform(springY, [-0.5, 0.5], liteMode ? [-16, 16] : [-60, 60]);

  const orbConfigs = useMemo(() => createOrbConfigs(liteMode ? 1 : 2), [liteMode]);
  const particleConfigs = useMemo(() => createParticleConfigs(liteMode ? 3 : 10), [liteMode]);

  useEffect(() => {
    // Snap layers back to center when parallax is disabled.
    if (!interactiveParallax) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [interactiveParallax, mouseX, mouseY]);

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!interactiveParallax) {
        return;
      }

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    },
    [interactiveParallax, mouseX, mouseY],
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
