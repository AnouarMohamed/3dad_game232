import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';

import { FOOD_EMOJIS } from '../constants/food';
import { StickmanSprite } from './StickmanSprite';

interface FoodGameProps {
  onComplete: (score: number) => void;
}

interface FoodItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

export function FoodGame({ onComplete }: FoodGameProps) {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [stickmanPos, setStickmanPos] = useState({ x: 50, y: 70 });
  const [cursorSpeed, setCursorSpeed] = useState(0);

  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const stickmanPosRef = useRef(stickmanPos);
  const cursorSpeedRef = useRef(0);
  const pendingXRef = useRef(50);
  const pendingSpeedRef = useRef(0);
  const mouseRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemIdCounter = useRef(0);

  const flushMouseUpdates = () => {
    mouseRafRef.current = null;

    const nextX = pendingXRef.current;
    const nextSpeed = pendingSpeedRef.current;

    setStickmanPos((prev) => {
      if (prev.x === nextX) {
        return prev;
      }

      const next = { ...prev, x: nextX };
      stickmanPosRef.current = next;
      return next;
    });

    if (cursorSpeedRef.current !== nextSpeed) {
      cursorSpeedRef.current = nextSpeed;
      setCursorSpeed(nextSpeed);
    }
  };

  // Handle Mouse Movement and Speed Calculation
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;

    // Speed calculation
    const now = Date.now();
    const dt = now - lastMousePos.current.time;
    if (dt > 0) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;
      pendingSpeedRef.current = Math.min(10, speed * 5); // Scaled speed
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    pendingXRef.current = Math.max(5, Math.min(95, x));

    if (mouseRafRef.current === null) {
      mouseRafRef.current = requestAnimationFrame(flushMouseUpdates);
    }
  };

  // Reset speed when mouse stops
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMousePos.current.time > 100 && cursorSpeedRef.current !== 0) {
        cursorSpeedRef.current = 0;
        pendingSpeedRef.current = 0;
        setCursorSpeed(0);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (mouseRafRef.current !== null) {
        cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  // Spawn Food
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 10) {
          return prev;
        }

        return [
          ...prev,
          {
            id: itemIdCounter.current++,
            x: Math.random() * 80 + 10,
            y: -10,
            vx: (Math.random() - 0.5) * 1.2, // Increased initial drift
            vy: Math.random() * 0.3 + 0.2, // Slower initial fall to allow drift to show
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15, // Faster rotation variety
            emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
          },
        ];
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Move Food and Collision Detection
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setItems((prev) => {
        const gravity = 0.04;
        const friction = 0.99;
        const nextItems = prev.map((item) => {
          // Add a bit of horizontal "wobble" based on time/sine
          const wobble = Math.sin(Date.now() / 200 + item.id) * 0.1;

          let nextVx = item.vx * friction + wobble;
          let nextVy = item.vy + gravity;
          let nextX = item.x + nextVx;
          let nextY = item.y + nextVy;
          let nextRotation = item.rotation + item.rotationSpeed;

          // Bounce off walls
          if (nextX < 5 || nextX > 95) {
            nextVx *= -0.8;
            nextX = Math.max(5, Math.min(95, nextX));
          }

          // Slight bounce off an invisible "cushion" near the bottom
          // but only once to keep them moving
          if (nextY > 90 && item.vy > 0) {
            nextVy *= -0.4; // Lose most energy on bounce
            nextY = 90;
          }

          return {
            ...item,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            rotation: nextRotation,
          };
        });

        const currentStickmanPos = stickmanPosRef.current;

        // Collision detection
        const caught = nextItems.find((item) => {
          const xDist = Math.abs(item.x - currentStickmanPos.x);
          const yDist = Math.abs(item.y - currentStickmanPos.y);

          // Stickman is roughly 10% wide and 15% tall in relative units
          return xDist < 8 && yDist < 12;
        });

        if (caught) {
          setScore((s) => s + 1);

          // Sparkle effect at collision point
          confetti({
            particleCount: 10,
            spread: 30,
            origin: { x: caught.x / 100, y: caught.y / 100 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
            scalar: 0.5,
          });

          return nextItems.filter((item) => item.id !== caught.id);
        }

        return nextItems.filter((item) => item.y < 110);
      });
    }, 40);

    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    if (score >= 10) {
      onComplete(score);
    }
  }, [score, onComplete]);

  return (
    <div className="space-y-4 w-full">
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300">
        <motion.div className="h-full bg-orange-500" initial={{ width: 0 }} animate={{ width: `${(score / 10) * 100}%` }} />
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-96 glass rounded-3xl overflow-hidden cursor-none shadow-inner"
      >
        <div className="absolute top-4 left-4 font-bold text-slate-600 z-10 flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/20">
          {'\u{1F354} Snacks:'} {score} / 10
        </div>

        {/* Stickman in Game */}
        <motion.div
          className="absolute pointer-events-none"
          animate={{ left: `${stickmanPos.x}%`, top: `${stickmanPos.y}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <StickmanSprite walking={cursorSpeed > 0.1} speed={cursorSpeed} className="scale-75" />
        </motion.div>

        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                left: `${item.x}%`,
                top: `${item.y}%`,
                rotate: item.rotation,
              }}
              exit={{ scale: 0 }}
              className="absolute text-4xl pointer-events-none"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {score === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
            <p className="font-handwriting text-2xl">Move your mouse to feed him!</p>
          </div>
        )}
      </div>
    </div>
  );
}
