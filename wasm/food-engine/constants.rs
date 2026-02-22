pub const STICKMAN_Y: f32 = 70.0;

pub const FRAME_TIME_MS: f32 = 1000.0 / 60.0;
pub const MAX_STEP_MS: f32 = 48.0;
pub const SPAWN_INTERVAL_MS: f32 = 420.0;

pub const MAX_ITEMS: usize = 14;
pub const ITEM_STRIDE: usize = 5;
pub const EMOJI_COUNT: u32 = 7;

pub const STICKMAN_MIN_X: f32 = 6.0;
pub const STICKMAN_MAX_X: f32 = 94.0;
pub const CATCH_X_DISTANCE: f32 = 13.0;
pub const CATCH_Y_DISTANCE: f32 = 17.0;
pub const ITEM_REMOVE_Y: f32 = 106.0;

pub const FOLLOW_STRENGTH_PER_FRAME: f32 = 0.42;
pub const SPEED_IDLE_TIMEOUT_MS: f64 = 120.0;
pub const KEYBOARD_STEP_PER_FRAME: f32 = 1.85;
pub const KEYBOARD_SPEED_HINT: f32 = 3.2;
pub const MOVEMENT_SPEED_SCALE: f32 = 3.2;
pub const MAX_CURSOR_SPEED: f32 = 10.0;
pub const ACTIVE_SPEED_THRESHOLD: f32 = 0.03;
pub const MIN_MOVE_DELTA: f32 = 0.0001;

pub const GRAVITY: f32 = 0.024;
pub const AIR_DRAG: f32 = 0.9978;
pub const WALL_BOUNCE_DAMPING: f32 = 0.5;
