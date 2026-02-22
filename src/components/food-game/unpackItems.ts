import { FOOD_EMOJIS } from '../../constants/food';

import { ITEM_STRIDE } from './constants';
import type { FoodItem } from './types';

export const unpackItems = (packed: Float32Array, count: number): FoodItem[] => {
  const nextItems: FoodItem[] = [];
  for (let index = 0; index < count; index += 1) {
    const base = index * ITEM_STRIDE;
    const emojiIndex = Math.floor(packed[base + 4]) % FOOD_EMOJIS.length;
    nextItems.push({
      id: Math.floor(packed[base]),
      x: packed[base + 1],
      y: packed[base + 2],
      vx: 0,
      vy: 0,
      rotation: packed[base + 3],
      rotationSpeed: 0,
      emoji: FOOD_EMOJIS[emojiIndex],
    });
  }
  return nextItems;
};
