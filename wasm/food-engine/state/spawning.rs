use crate::constants::{EMOJI_COUNT, MAX_ITEMS, SPAWN_INTERVAL_MS};
use crate::item::FoodItem;

use super::EngineState;

impl EngineState {
    pub(super) fn spawn_pending_items(&mut self) {
        let spawn_count = (self.spawn_accumulator_ms / SPAWN_INTERVAL_MS) as usize;
        if spawn_count == 0 {
            return;
        }

        self.spawn_accumulator_ms -= spawn_count as f32 * SPAWN_INTERVAL_MS;
        for _ in 0..spawn_count {
            if self.item_count >= MAX_ITEMS {
                break;
            }
            self.spawn_item();
        }
    }

    fn spawn_item(&mut self) {
        let emoji_index = (self.rng.between(0.0, EMOJI_COUNT as f32).floor() as u32) % EMOJI_COUNT;
        let item = FoodItem {
            id: self.item_id_counter,
            x: self.rng.between(10.0, 90.0),
            y: -9.0,
            vx: self.rng.between(-0.18, 0.18),
            vy: self.rng.between(0.36, 0.62),
            rotation: self.rng.between(0.0, 360.0),
            rotation_speed: self.rng.between(-9.5, 9.5),
            emoji_index,
        };

        self.items[self.item_count] = item;
        self.item_count += 1;
        self.item_id_counter = self.item_id_counter.wrapping_add(1);
    }
}
