use crate::constants::{
    CATCH_X_DISTANCE, CATCH_Y_DISTANCE, GRAVITY, ITEM_REMOVE_Y, STICKMAN_MAX_X, STICKMAN_MIN_X,
    STICKMAN_Y, WALL_BOUNCE_DAMPING,
};

#[derive(Copy, Clone)]
pub struct FoodItem {
    pub id: u32,
    pub x: f32,
    pub y: f32,
    pub vx: f32,
    pub vy: f32,
    pub rotation: f32,
    pub rotation_speed: f32,
    pub emoji_index: u32,
}

impl FoodItem {
    pub const EMPTY: Self = Self {
        id: 0,
        x: 0.0,
        y: 0.0,
        vx: 0.0,
        vy: 0.0,
        rotation: 0.0,
        rotation_speed: 0.0,
        emoji_index: 0,
    };

    #[inline]
    pub fn update(self, delta_frames: f32, drag_factor: f32) -> Self {
        let wobble = ((self.id as f32 * 17.0 + self.y * 2.0) * 0.08).sin() * 0.004 * delta_frames;

        let mut next_vx = (self.vx + wobble) * drag_factor;
        let next_vy = self.vy + GRAVITY * delta_frames;
        let mut next_x = self.x + next_vx * delta_frames;
        let next_y = self.y + next_vy * delta_frames;

        if !(STICKMAN_MIN_X..=STICKMAN_MAX_X).contains(&next_x) {
            next_vx *= -WALL_BOUNCE_DAMPING;
            next_x = next_x.clamp(STICKMAN_MIN_X, STICKMAN_MAX_X);
        }

        Self {
            x: next_x,
            y: next_y,
            vx: next_vx,
            vy: next_vy,
            rotation: self.rotation + self.rotation_speed * delta_frames,
            ..self
        }
    }

    #[inline]
    pub fn is_caught_by(self, stickman_x: f32) -> bool {
        (self.x - stickman_x).abs() < CATCH_X_DISTANCE && (self.y - STICKMAN_Y).abs() < CATCH_Y_DISTANCE
    }

    #[inline]
    pub fn is_active(self) -> bool {
        self.y < ITEM_REMOVE_Y
    }
}
