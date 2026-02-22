export interface FoodEngineExports {
  memory: WebAssembly.Memory;
  init: (seed: number) => void;
  set_target_x: (targetX: number, nowMs: number) => void;
  set_keyboard_direction: (direction: number) => void;
  step: (deltaMs: number, nowMs: number) => void;
  get_score: () => number;
  get_stickman_x: () => number;
  get_cursor_speed: () => number;
  get_item_count: () => number;
  get_items_buffer_ptr: () => number;
  get_items_buffer_len: () => number;
  get_caught_count: () => number;
  get_last_catch_x: () => number;
  get_last_catch_y: () => number;
}
