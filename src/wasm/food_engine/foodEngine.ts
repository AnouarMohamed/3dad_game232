import { loadWasmExports } from './loadWasmExports';

export interface RustFoodEngine {
  setTargetX: (targetX: number, nowMs: number) => void;
  setKeyboardDirection: (direction: number) => void;
  step: (deltaMs: number, nowMs: number) => void;
  getScore: () => number;
  getStickmanX: () => number;
  getCursorSpeed: () => number;
  getItemCount: () => number;
  getItemsPacked: () => Float32Array;
  getCaughtCount: () => number;
  getLastCatchX: () => number;
  getLastCatchY: () => number;
}

export const createRustFoodEngine = async (seed: number): Promise<RustFoodEngine> => {
  const wasm = await loadWasmExports();
  wasm.init(seed >>> 0);

  const itemsPtrBytes = wasm.get_items_buffer_ptr() >>> 0;
  let cachedBuffer: ArrayBufferLike | null = null;
  let cachedLength = -1;
  let cachedView: Float32Array | null = null;

  const getItemsPacked = () => {
    const memoryBuffer = wasm.memory.buffer;
    const length = wasm.get_items_buffer_len() >>> 0;
    if (!cachedView || cachedBuffer !== memoryBuffer || cachedLength !== length) {
      cachedBuffer = memoryBuffer;
      cachedLength = length;
      cachedView = new Float32Array(memoryBuffer, itemsPtrBytes, length);
    }
    return cachedView;
  };

  return {
    setTargetX: wasm.set_target_x,
    setKeyboardDirection: wasm.set_keyboard_direction,
    step: wasm.step,
    getScore: wasm.get_score,
    getStickmanX: wasm.get_stickman_x,
    getCursorSpeed: wasm.get_cursor_speed,
    getItemCount: wasm.get_item_count,
    getItemsPacked,
    getCaughtCount: wasm.get_caught_count,
    getLastCatchX: wasm.get_last_catch_x,
    getLastCatchY: wasm.get_last_catch_y,
  };
};
