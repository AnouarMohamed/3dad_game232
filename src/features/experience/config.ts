import { Heart, Sparkles, Star, type LucideIcon } from 'lucide-react';

import type { GameState } from '../../types/game';

export const WALK_DURATION_MS = 3000;
export const THOUGHT_DURATION_MS = 2000;

export const CHARACTER_STATES: readonly GameState[] = ['WALKING', 'DIALOGUE', 'MINIGAME', 'FINAL'];

export interface FloatingDecoration {
  id: string;
  icon: LucideIcon;
  iconClassName: string;
  className: string;
  size: number;
  delay?: string;
  origin: {
    x: number;
    y: number;
  };
}

export interface OrbConfig {
  id: string;
  layer: 'mid' | 'front';
  className: string;
  leftStops: string[];
  topStops: string[];
  duration: number;
}

export interface ParticleConfig {
  id: number;
  left: string;
  top: string;
  opacity: number;
  duration: number;
}

export const FLOATING_DECORATIONS: readonly FloatingDecoration[] = [
  {
    id: 'heart',
    icon: Heart,
    iconClassName: 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]',
    className: 'absolute top-10 left-10 animate-float pointer-events-auto cursor-pointer opacity-20',
    size: 48,
    origin: { x: 0.1, y: 0.1 },
  },
  {
    id: 'star',
    icon: Star,
    iconClassName: 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]',
    className: 'absolute bottom-20 right-10 animate-float pointer-events-auto cursor-pointer opacity-20',
    size: 64,
    delay: '1s',
    origin: { x: 0.9, y: 0.8 },
  },
  {
    id: 'sparkles',
    icon: Sparkles,
    iconClassName: 'text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    className: 'absolute top-1/2 left-1/4 animate-float pointer-events-auto cursor-pointer opacity-20',
    size: 32,
    delay: '2s',
    origin: { x: 0.25, y: 0.5 },
  },
];

export const createOrbConfigs = (): OrbConfig[] =>
  Array.from({ length: 2 }, (_, index) => ({
    id: `orb-${index}`,
    layer: index % 2 === 0 ? 'mid' : 'front',
    className:
      index % 2 === 0
        ? 'bg-dream-purple w-[320px] h-[320px]'
        : 'bg-dream-blue w-[420px] h-[420px]',
    leftStops: Array.from({ length: 3 }, () => `${Math.random() * 100}%`),
    topStops: Array.from({ length: 3 }, () => `${Math.random() * 100}%`),
    duration: 34 + index * 12,
  }));

export const createParticleConfigs = (): ParticleConfig[] =>
  Array.from({ length: 10 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.35 + 0.1,
    duration: Math.random() * 10 + 10,
  }));
