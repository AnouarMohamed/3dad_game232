use crate::constants::{
    ACTIVE_SPEED_THRESHOLD, AIR_DRAG, FOLLOW_STRENGTH_PER_FRAME, FRAME_TIME_MS, KEYBOARD_SPEED_HINT,
    KEYBOARD_STEP_PER_FRAME, MAX_CURSOR_SPEED, MAX_STEP_MS, MIN_MOVE_DELTA, MOVEMENT_SPEED_SCALE,
    SPEED_IDLE_TIMEOUT_MS, STICKMAN_MAX_X, STICKMAN_MIN_X,
};

use super::{round_to_3, EngineState};

impl EngineState {
    pub fn step(&mut self, delta_ms: f32, now_ms: f64) {
        let clamped_delta_ms = delta_ms.clamp(0.0, MAX_STEP_MS);
        let delta_frames = clamped_delta_ms / FRAME_TIME_MS;
        let drag_factor = AIR_DRAG.powf(delta_frames);

        self.advance_target_from_keyboard(delta_frames, now_ms);

        let movement_delta = self.follow_target(delta_frames);
        self.update_cursor_speed(movement_delta, now_ms);

        self.spawn_accumulator_ms += clamped_delta_ms;
        self.spawn_pending_items();
        self.process_items(delta_frames, drag_factor);
    }

    #[inline]
    fn advance_target_from_keyboard(&mut self, delta_frames: f32, now_ms: f64) {
        if self.keyboard_direction == 0 {
            return;
        }

        self.target_x =
            (self.target_x + self.keyboard_direction as f32 * KEYBOARD_STEP_PER_FRAME * delta_frames)
                .clamp(STICKMAN_MIN_X, STICKMAN_MAX_X);
        self.last_input_at_ms = now_ms;
    }

    #[inline]
    fn follow_target(&mut self, delta_frames: f32) -> f32 {
        let follow_factor = (FOLLOW_STRENGTH_PER_FRAME * delta_frames).min(1.0);
        let next_x = self.stickman_x + (self.target_x - self.stickman_x) * follow_factor;
        let movement_delta = (next_x - self.stickman_x).abs();

        if movement_delta > MIN_MOVE_DELTA {
            self.stickman_x = next_x;
        }

        movement_delta
    }

    #[inline]
    fn update_cursor_speed(&mut self, movement_delta: f32, now_ms: f64) {
        let movement_speed = (movement_delta * MOVEMENT_SPEED_SCALE).min(MAX_CURSOR_SPEED);
        let is_idle = now_ms - self.last_input_at_ms > SPEED_IDLE_TIMEOUT_MS;

        self.cursor_speed = if self.keyboard_direction != 0 {
            round_to_3(movement_speed.max(KEYBOARD_SPEED_HINT))
        } else if !is_idle || movement_speed > ACTIVE_SPEED_THRESHOLD {
            round_to_3(movement_speed)
        } else {
            0.0
        };
    }
}
