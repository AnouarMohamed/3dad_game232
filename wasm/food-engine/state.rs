use crate::constants::MAX_ITEMS;
use crate::item::FoodItem;
use crate::rng::XorShift32;

const START_X: f32 = 50.0;

pub struct EngineState {
    score: u32,
    items: [FoodItem; MAX_ITEMS],
    item_count: usize,
    stickman_x: f32,
    target_x: f32,
    cursor_speed: f32,
    keyboard_direction: i32,
    last_input_at_ms: f64,
    spawn_accumulator_ms: f32,
    item_id_counter: u32,
    rng: XorShift32,
    caught_count: u32,
    last_catch_x: f32,
    last_catch_y: f32,
}

impl EngineState {
    pub const fn new() -> Self {
        Self {
            score: 0,
            items: [FoodItem::EMPTY; MAX_ITEMS],
            item_count: 0,
            stickman_x: START_X,
            target_x: START_X,
            cursor_speed: 0.0,
            keyboard_direction: 0,
            last_input_at_ms: 0.0,
            spawn_accumulator_ms: 0.0,
            item_id_counter: 0,
            rng: XorShift32::new(1),
            caught_count: 0,
            last_catch_x: 0.0,
            last_catch_y: 0.0,
        }
    }

    pub fn reset(&mut self, seed: u32) {
        self.score = 0;
        self.items = [FoodItem::EMPTY; MAX_ITEMS];
        self.item_count = 0;
        self.stickman_x = START_X;
        self.target_x = START_X;
        self.cursor_speed = 0.0;
        self.keyboard_direction = 0;
        self.last_input_at_ms = 0.0;
        self.spawn_accumulator_ms = 0.0;
        self.item_id_counter = 0;
        self.rng.reseed(seed);
        self.caught_count = 0;
        self.last_catch_x = 0.0;
        self.last_catch_y = 0.0;
    }
}

#[inline]
fn round_to_3(value: f32) -> f32 {
    (value * 1000.0).round() / 1000.0
}

mod accessors;
mod items;
mod movement;
mod spawning;
