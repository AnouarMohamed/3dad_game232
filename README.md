# 3dad Game

A dreamy React + TypeScript mini-game experience with:

- a Rust/WASM-powered food minigame
- dialogue flow + character stage
- a moon poem ending sequence

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion (`motion/react`)
- Rust (compiled to WebAssembly) for the food game engine

## Project Layout

```text
src/
  components/            # Main game UIs
  features/experience/   # App flow, stage, header, background, welcome UI
  wasm/food_engine/      # WASM loader + bindings + compiled .wasm runtime asset
  constants/             # Dialogue, poems, food emoji sets
wasm/food-engine/        # Rust source for food game engine
```

## Prerequisites

- Node.js 20+ (recommended)
- npm
- Rust toolchain (only if you want to rebuild the WASM engine)

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

- `npm run dev` - Start local dev server
- `npm run lint` - Type-check (`tsc --noEmit`)
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run clean` - Remove `dist/`
- `npm run build:food-wasm` - Rebuild `src/wasm/food_engine/food_engine.wasm` from Rust source

## Rust/WASM Workflow

The app ships with a compiled WASM file:

- `src/wasm/food_engine/food_engine.wasm`

So local dev/build works without Rust by default.

If you edit Rust code in `wasm/food-engine/`, rebuild WASM:

```bash
npm run build:food-wasm
```

## Deploy (Vercel)

1. Connect this repository to a Vercel project.
2. Keep deploy branch as `main`.
3. Build command: `npm run build`
4. Output directory: `dist`

If Git checks fail with author-access errors, ensure the commit author's GitHub account has access to the Vercel project/team.

## Troubleshooting

- WASM not loading:
  - Confirm `src/wasm/food_engine/food_engine.wasm` exists in repo.
- Push rejected (non-fast-forward):
  - `git fetch origin`
  - `git rebase origin/main`
  - `git push origin main`

