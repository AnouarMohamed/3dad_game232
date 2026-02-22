import type { FoodEngineExports } from './types';

let wasmExportsPromise: Promise<FoodEngineExports> | null = null;

const instantiateFromBytes = async (response: Response): Promise<FoodEngineExports> => {
  const bytes = await response.arrayBuffer();
  const result = await WebAssembly.instantiate(bytes, {});
  return result.instance.exports as unknown as FoodEngineExports;
};

export const loadWasmExports = async (): Promise<FoodEngineExports> => {
  if (wasmExportsPromise) {
    return wasmExportsPromise;
  }

  wasmExportsPromise = (async () => {
    const wasmUrl = new URL('./food_engine.wasm', import.meta.url);
    const response = await fetch(wasmUrl);

    if ('instantiateStreaming' in WebAssembly) {
      try {
        const streamResult = await WebAssembly.instantiateStreaming(response.clone(), {});
        return streamResult.instance.exports as unknown as FoodEngineExports;
      } catch {
        return instantiateFromBytes(response);
      }
    }

    return instantiateFromBytes(response);
  })();

  return wasmExportsPromise;
};
