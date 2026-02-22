import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type MutableRefObject,
  type PointerEvent,
  type RefObject,
} from 'react';

import { FOOD_EMOJIS } from '../../constants/food';
import { fireConfetti } from '../../lib/confetti';

export interface FoodItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

export const TARGET_SCORE = 10;
export const STICKMAN_Y = 70;

const MAX_ITEMS = 12;
const SPAWN_INTERVAL_MS = 500;
const SPEED_TIMEOUT_MS = 140;
const SPEED_CHECK_INTERVAL_MS = 80;
const FRAME_TIME_MS = 1000 / 60;

const STICKMAN_MIN_X = 7;
const STICKMAN_MAX_X = 93;
const CATCH_X_DISTANCE = 10;
const CATCH_Y_DISTANCE = 14;
const ITEM_REMOVE_Y = 108;

const GRAVITY = 0.025;
const AIR_DRAG = 0.996;
const WALL_BOUNCE_DAMPING = 0.65;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const spawnFoodItem = (id: number): FoodItem => ({
  id,
  x: randomBetween(10, 90),
  y: -10,
  vx: randomBetween(-0.24, 0.24),
  vy: randomBetween(0.35, 0.65),
  rotation: Math.random() * 360,
  rotationSpeed: randomBetween(-9, 9),
  emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
});

const updateFoodItem = (item: FoodItem, deltaFrames: number): FoodItem => {
  let nextVx = item.vx * Math.pow(AIR_DRAG, deltaFrames);
  let nextVy = item.vy + GRAVITY * deltaFrames;
  let nextX = item.x + nextVx * deltaFrames;
  let nextY = item.y + nextVy * deltaFrames;

  if (nextX < STICKMAN_MIN_X || nextX > STICKMAN_MAX_X) {
    nextVx *= -WALL_BOUNCE_DAMPING;
    nextX = clamp(nextX, STICKMAN_MIN_X, STICKMAN_MAX_X);
  }

  return {
    ...item,
    x: nextX,
    y: nextY,
    vx: nextVx,
    vy: nextVy,
    rotation: item.rotation + item.rotationSpeed * deltaFrames,
  };
};

const isCaughtByStickman = (item: FoodItem, stickmanX: number) =>
  Math.abs(item.x - stickmanX) < CATCH_X_DISTANCE && Math.abs(item.y - STICKMAN_Y) < CATCH_Y_DISTANCE;

const addSpawnedItems = (items: FoodItem[], spawnCount: number, idRef: MutableRefObject<number>) => {
  if (spawnCount <= 0 || items.length >= MAX_ITEMS) {
    return items;
  }

  const slots = MAX_ITEMS - items.length;
  const count = Math.min(slots, spawnCount);
  const spawned = Array.from({ length: count }, () => spawnFoodItem(idRef.current++));
  return [...items, ...spawned];
};

interface UseFoodGameEngineResult {
  score: number;
  items: FoodItem[];
  stickmanX: number;
  cursorSpeed: number;
  containerRef: RefObject<HTMLDivElement | null>;
  handlePointerMove: (e: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>) => void;
}

export function useFoodGameEngine(onComplete: (score: number) => void): UseFoodGameEngineResult {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [stickmanX, setStickmanX] = useState(50);
  const [cursorSpeed, setCursorSpeed] = useState(0);

  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const stickmanXRef = useRef(stickmanX);
  const cursorSpeedRef = useRef(0);
  const pendingXRef = useRef(50);
  const pendingSpeedRef = useRef(0);
  const mouseRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemIdCounter = useRef(0);

  const flushPointerUpdates = useCallback(() => {
    mouseRafRef.current = null;
    const nextX = pendingXRef.current;
    const nextSpeed = pendingSpeedRef.current;

    if (stickmanXRef.current !== nextX) {
      stickmanXRef.current = nextX;
      setStickmanX(nextX);
    }

    if (cursorSpeedRef.current !== nextSpeed) {
      cursorSpeedRef.current = nextSpeed;
      setCursorSpeed(nextSpeed);
    }
  }, []);

  const handlePointerMove = useCallback((e: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const now = Date.now();
    const dt = now - lastMousePos.current.time;

    if (dt > 0) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rawSpeed = Math.min(10, (dist / dt) * 4);
      pendingSpeedRef.current = pendingSpeedRef.current * 0.7 + rawSpeed * 0.3;
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    pendingXRef.current = clamp(x, STICKMAN_MIN_X, STICKMAN_MAX_X);

    if (mouseRafRef.current === null) {
      mouseRafRef.current = requestAnimationFrame(flushPointerUpdates);
    }
  }, [flushPointerUpdates]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMousePos.current.time > SPEED_TIMEOUT_MS && cursorSpeedRef.current !== 0) {
        cursorSpeedRef.current = 0;
        pendingSpeedRef.current = 0;
        setCursorSpeed(0);
      }
    }, SPEED_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (mouseRafRef.current !== null) {
        cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let lastFrameAt = performance.now();
    let spawnAccumulator = 0;

    const tick = (now: number) => {
      const deltaMs = Math.min(64, now - lastFrameAt);
      lastFrameAt = now;
      spawnAccumulator += deltaMs;

      const deltaFrames = deltaMs / FRAME_TIME_MS;
      setItems((prev) => {
        if (prev.length === 0 && spawnAccumulator < SPAWN_INTERVAL_MS) {
          return prev;
        }

        const spawnCount = Math.floor(spawnAccumulator / SPAWN_INTERVAL_MS);
        if (spawnCount > 0) {
          spawnAccumulator -= spawnCount * SPAWN_INTERVAL_MS;
        }

        let nextItems = addSpawnedItems(prev, spawnCount, itemIdCounter);
        nextItems = nextItems.map((item) => updateFoodItem(item, deltaFrames));

        const caught = nextItems.filter((item) => isCaughtByStickman(item, stickmanXRef.current));
        if (caught.length > 0) {
          setScore((s) => s + caught.length);
          const firstCaught = caught[0];
          void fireConfetti({
            particleCount: Math.min(26, 8 + caught.length * 4),
            spread: 36,
            origin: { x: firstCaught.x / 100, y: firstCaught.y / 100 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
            scalar: 0.5,
          });
          const caughtIds = new Set(caught.map((item) => item.id));
          nextItems = nextItems.filter((item) => !caughtIds.has(item.id));
        }

        return nextItems.filter((item) => item.y < ITEM_REMOVE_Y);
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (score >= TARGET_SCORE) {
      onComplete(score);
    }
  }, [onComplete, score]);

  return {
    score,
    items,
    stickmanX,
    cursorSpeed,
    containerRef,
    handlePointerMove,
  };
}
