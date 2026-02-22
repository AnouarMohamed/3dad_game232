/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import {
  AtmosphereBackground,
  CharacterStage,
  FloatingDecorations,
  GameHeader,
  GamePanel,
  StageFallback,
  useGameFlow,
  useParallax,
} from './features/experience';

const MoonGame = lazy(async () => {
  const mod = await import('./components/MoonGame');
  return { default: mod.MoonGame };
});

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const {
    gameState,
    dialogueIndex,
    blushLevel,
    l3dadThought,
    isDialogueState,
    showCharacter,
    activeLine,
    startWalking,
    handleL3dadClick,
    nextDialogue,
    handleGameComplete,
  } = useGameFlow();

  const {
    handleGlobalMouseMove,
    bgX1,
    bgY1,
    bgX2,
    bgY2,
    bgX3,
    bgY3,
    orbConfigs,
    particleConfigs,
  } = useParallax(gameState !== 'MINIGAME');

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="min-h-screen bg-[#050505] font-sans text-slate-200 overflow-hidden selection:bg-purple-900/50 relative"
    >
      <AtmosphereBackground
        bgX1={bgX1}
        bgY1={bgY1}
        bgX2={bgX2}
        bgY2={bgY2}
        bgX3={bgX3}
        bgY3={bgY3}
        orbConfigs={orbConfigs}
        particleConfigs={particleConfigs}
      />
      <FloatingDecorations />

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-10 flex flex-col items-center min-h-screen">
        <GameHeader />

        <div className="w-full flex-grow flex flex-col items-center justify-center relative">
          {gameState === 'MOON_GAME' ? (
            <Suspense fallback={<StageFallback message="Loading moon game..." />}>
              <MoonGame />
            </Suspense>
          ) : (
            <>
              <CharacterStage
                gameState={gameState}
                showCharacter={showCharacter}
                blushLevel={blushLevel}
                l3dadThought={l3dadThought}
                onStartWalking={startWalking}
                onCharacterClick={handleL3dadClick}
              />
              <GamePanel
                gameState={gameState}
                dialogueIndex={dialogueIndex}
                isDialogueState={isDialogueState}
                activeLine={activeLine}
                onNextDialogue={nextDialogue}
                onGameComplete={handleGameComplete}
              />
            </>
          )}
        </div>

        <footer className="mt-auto pt-10 flex justify-center gap-4 relative z-20">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="p-3 glass rounded-full text-slate-400 hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </footer>
      </main>
    </div>
  );
}
