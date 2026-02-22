# 3dad Game

A dreamy React + TypeScript mini-game with a Rust/WASM food engine.

## Scripts

- `npm run dev` - run local dev server
- `npm run lint` - type-check (`tsc --noEmit`)
- `npm run build` - production build
- `npm run build:food-wasm` - rebuild `src/wasm/food_engine/food_engine.wasm` from `wasm/food-engine`

## Notes

- Runtime uses the prebuilt wasm file from `src/wasm/food_engine/food_engine.wasm`.
- Rust source stays in `wasm/food-engine` so wasm can be rebuilt when needed.
