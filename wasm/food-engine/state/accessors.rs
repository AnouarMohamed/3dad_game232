use crate::constants::{STICKMAN_MAX_X, STICKMAN_MIN_X};

use super::EngineState;

impl EngineState {
    #[inline]
    pub fn set_target_x(&mut self, target_x: f32, now_ms: f64) {
        self.target_x = target_x.clamp(STICKMAN_MIN_X, STICKMAN_MAX_X);
        self.last_input_at_ms = now_ms;
    }

    #[inline]
    pub fn set_keyboard_direction(&mut self, direction: i32) {
        self.keyboard_direction = direction.clamp(-1, 1);
    }

    #[inline]
    pub fn score(&self) -> u32 {
        self.score
    }

    #[inline]
    pub fn stickman_x(&self) -> f32 {
        self.stickman_x
    }

    #[inline]
    pub fn cursor_speed(&self) -> f32 {
        self.cursor_speed
    }

    #[inline]
    pub fn item_count(&self) -> u32 {
        self.item_count as u32
    }

    #[inline]
    pub fn caught_count(&self) -> u32 {
        self.caught_count
    }

    #[inline]
    pub fn last_catch_x(&self) -> f32 {
        self.last_catch_x
    }

    #[inline]
    pub fn last_catch_y(&self) -> f32 {
        self.last_catch_y
    }
}
