#![allow(static_mut_refs)]

mod constants;
mod item;
mod rng;
mod state;

use constants::{ITEM_STRIDE, MAX_ITEMS};
use state::EngineState;

static mut STATE: EngineState = EngineState::new();
static mut ITEM_BUFFER: [f32; MAX_ITEMS * ITEM_STRIDE] = [0.0; MAX_ITEMS * ITEM_STRIDE];
static mut ITEM_BUFFER_LEN: usize = 0;

#[inline]
unsafe fn refresh_item_buffer() {
    ITEM_BUFFER_LEN = STATE.fill_item_buffer(&mut ITEM_BUFFER);
}

macro_rules! state_getter {
    ($name:ident, $ret:ty, $method:ident) => {
        #[no_mangle]
        pub extern "C" fn $name() -> $ret {
            unsafe { STATE.$method() }
        }
    };
}

#[no_mangle]
pub extern "C" fn init(seed: u32) {
    unsafe {
        STATE.reset(seed);
        refresh_item_buffer();
    }
}

#[no_mangle]
pub extern "C" fn set_target_x(target_x: f32, now_ms: f64) {
    unsafe {
        STATE.set_target_x(target_x, now_ms);
    }
}

#[no_mangle]
pub extern "C" fn set_keyboard_direction(direction: i32) {
    unsafe {
        STATE.set_keyboard_direction(direction);
    }
}

#[no_mangle]
pub extern "C" fn step(delta_ms: f32, now_ms: f64) {
    unsafe {
        STATE.step(delta_ms, now_ms);
        refresh_item_buffer();
    }
}

state_getter!(get_score, u32, score);
state_getter!(get_stickman_x, f32, stickman_x);
state_getter!(get_cursor_speed, f32, cursor_speed);
state_getter!(get_item_count, u32, item_count);
state_getter!(get_caught_count, u32, caught_count);
state_getter!(get_last_catch_x, f32, last_catch_x);
state_getter!(get_last_catch_y, f32, last_catch_y);

#[no_mangle]
pub extern "C" fn get_items_buffer_ptr() -> *const f32 {
    unsafe { ITEM_BUFFER.as_ptr() }
}

#[no_mangle]
pub extern "C" fn get_items_buffer_len() -> u32 {
    unsafe { ITEM_BUFFER_LEN as u32 }
}
