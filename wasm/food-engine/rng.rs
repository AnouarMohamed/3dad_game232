#[derive(Copy, Clone)]
pub struct XorShift32 {
    state: u32,
}

impl XorShift32 {
    pub const fn new(seed: u32) -> Self {
        Self {
            state: if seed == 0 { 1 } else { seed },
        }
    }

    #[inline]
    pub fn reseed(&mut self, seed: u32) {
        self.state = if seed == 0 { 1 } else { seed };
    }

    #[inline]
    pub fn next_u32(&mut self) -> u32 {
        let mut x = self.state;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        self.state = x;
        x
    }

    #[inline]
    pub fn next_unit_f32(&mut self) -> f32 {
        (self.next_u32() as f64 / u32::MAX as f64) as f32
    }

    #[inline]
    pub fn between(&mut self, min: f32, max: f32) -> f32 {
        min + self.next_unit_f32() * (max - min)
    }
}
