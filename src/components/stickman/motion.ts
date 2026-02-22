interface BuildStickmanMotionInput {
  cheering: boolean;
  walking: boolean;
  speed: number;
}

export function buildStickmanMotion({ cheering, walking, speed }: BuildStickmanMotionInput) {
  const isIdle = !walking && !cheering;
  const walkDuration = Math.max(0.2, 0.42 - speed * 0.02);
  const leanAngle = walking ? Math.min(14, speed * 1.8) : 0;
  const stretchY = walking ? 1 + speed * 0.012 : 1;
  const squashX = walking ? 1 - speed * 0.006 : 1;
  const cycleDuration = cheering ? 0.4 : walking ? walkDuration : 3;

  const rootAnimate = cheering
    ? { y: [0, -40, 0], rotate: [0, -5, 5, 0], scaleX: 1, scaleY: 1 }
    : walking
      ? {
          rotate: [-leanAngle, leanAngle * 0.6, -leanAngle],
          y: [0, -4, 0],
          scaleX: [squashX, 1, squashX],
          scaleY: [stretchY, 1, stretchY],
        }
      : { y: [0, -3, 0], rotate: 0, scaleX: [1, 1.02, 1], scaleY: [1, 0.98, 1] };

  const rootTransition = cheering
    ? { repeat: Infinity, duration: 0.4, ease: 'easeOut' }
    : walking
      ? { repeat: Infinity, duration: walkDuration, ease: 'easeInOut' }
      : { repeat: Infinity, duration: 3, ease: 'easeInOut' };

  const headAnimate = isIdle
    ? { scale: [1, 1.04, 1], y: [0, -2, 0] }
    : walking
      ? { y: [0, -4, 0], rotate: [-4, 4, -4], scale: 1 + speed * 0.01 }
      : { y: 0 };

  const armAnimate = cheering
    ? { rotate: [45, 135, 45], y: [-10, -20, -10] }
    : walking
      ? {
          rotate: [-22 - speed * 2.2, 22 + speed * 2.2, -22 - speed * 2.2],
          x: [-1.4 - speed * 0.35, 1.4 + speed * 0.35, -1.4 - speed * 0.35],
        }
      : { rotate: [0, 8, 0], y: [0, -2, 0] };

  const legDuration = walking ? walkDuration : isIdle ? 3 : 0.4;
  const legs = [
    {
      id: 'left',
      animate: walking
        ? { rotate: [24 + speed * 2.2, -24 - speed * 2.2, 24 + speed * 2.2], y: [0, -2.6, 0] }
        : cheering
          ? { rotate: [10, -10, 10] }
          : { rotate: [0, 2, 0], scaleY: [1, 0.95, 1] },
    },
    {
      id: 'right',
      animate: walking
        ? { rotate: [-24 - speed * 2.2, 24 + speed * 2.2, -24 - speed * 2.2], y: [0, -2.6, 0] }
        : cheering
          ? { rotate: [-10, 10, -10] }
          : { rotate: [0, -2, 0], scaleY: [1, 0.95, 1] },
    },
  ] as const;

  return {
    isIdle,
    walkDuration,
    cycleDuration,
    legDuration,
    rootAnimate,
    rootTransition,
    headAnimate,
    armAnimate,
    legs,
  };
}
