/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useState } from 'react';

import {
  AtmosphereBackground,
  CharacterStage,
  ExperienceFooter,
  FloatingDecorations,
  GameHeader,
  GamePanel,
  StageFallback,
  useGameFlow,
  useParallax,
} from './features/experience';
import { usePerformanceMode } from './lib/usePerformanceMode';

const MoonGame = lazy(async () => {
  const mod = await import('./components/MoonGame');
  return { default: mod.MoonGame };
});

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const { isLiteMode } = usePerformanceMode();
  const {
    gameState,
    dialogueIndex,
    blushLevel,
    l3dadThought,
    isDialogueState,
    showCharacter,
    canSkipWalking,
    activeLine,
    startWalking,
    skipWalking,
    handleL3dadClick,
    nextDialogue,
    handleGameComplete,
    resetExperience,
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
  } = useParallax(gameState !== 'MINIGAME', isLiteMode);

  const toggleMuted = () => setIsMuted((prev) => !prev);
  const shouldTrackMouse = gameState !== 'MINIGAME' && !isLiteMode;

  return (
    <div
      onMouseMove={shouldTrackMouse ? handleGlobalMouseMove : undefined}
      className="min-h-screen bg-[#050505] font-sans text-slate-200 overflow-x-hidden selection:bg-purple-900/50 relative"
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
        liteMode={isLiteMode}
      />
      <FloatingDecorations liteMode={isLiteMode} />

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col items-center min-h-screen">
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
                canSkipWalking={canSkipWalking}
                blushLevel={blushLevel}
                l3dadThought={l3dadThought}
                onStartWalking={startWalking}
                onSkipWalking={skipWalking}
                onCharacterClick={handleL3dadClick}
              />
              <GamePanel
                gameState={gameState}
                dialogueIndex={dialogueIndex}
                isDialogueState={isDialogueState}
                activeLine={activeLine}
                onNextDialogue={nextDialogue}
                onGameComplete={handleGameComplete}
                liteMode={isLiteMode}
              />
            </>
          )}
        </div>

        <ExperienceFooter isMuted={isMuted} onReset={resetExperience} onToggleMute={toggleMuted} />
      </main>
    </div>
  );
}
