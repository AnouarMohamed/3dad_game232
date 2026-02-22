use crate::constants::{ITEM_STRIDE, MAX_ITEMS};
use crate::item::FoodItem;

use super::EngineState;

impl EngineState {
    pub(super) fn process_items(&mut self, delta_frames: f32, drag_factor: f32) {
        self.caught_count = 0;
        let mut write_index = 0usize;

        for read_index in 0..self.item_count {
            let updated = self.items[read_index].update(delta_frames, drag_factor);

            if updated.is_caught_by(self.stickman_x) {
                self.record_catch(updated);
                continue;
            }

            if !updated.is_active() {
                continue;
            }

            self.items[write_index] = updated;
            write_index += 1;
        }

        self.item_count = write_index;
        self.score = self.score.saturating_add(self.caught_count);
    }

    #[inline]
    fn record_catch(&mut self, item: FoodItem) {
        if self.caught_count == 0 {
            self.last_catch_x = item.x;
            self.last_catch_y = item.y;
        }
        self.caught_count += 1;
    }

    pub fn fill_item_buffer(&self, buffer: &mut [f32; MAX_ITEMS * ITEM_STRIDE]) -> usize {
        let mut packed_len = 0usize;
        for item_index in 0..self.item_count {
            let item = self.items[item_index];
            let base = item_index * ITEM_STRIDE;
            buffer[base] = item.id as f32;
            buffer[base + 1] = item.x;
            buffer[base + 2] = item.y;
            buffer[base + 3] = item.rotation;
            buffer[base + 4] = item.emoji_index as f32;
            packed_len = base + ITEM_STRIDE;
        }
        packed_len
    }
}
