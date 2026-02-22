/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Heart, Star, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

import { DIALOGUE_LINES, FINAL_DIALOGUE } from './constants/dialogue';
import { FoodGame } from './components/FoodGame';
import { MoonGame } from './components/MoonGame';
import { StickmanSprite } from './components/StickmanSprite';
import { cn } from './lib/cn';
import type { GameState } from './types/game';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [blushLevel, setBlushLevel] = useState(0);
  const [l3dadThought, setL3dadThought] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Parallax transforms for different layers
  const bgX1 = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const bgY1 = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const bgX2 = useTransform(springX, [-0.5, 0.5], [-40, 40]);
  const bgY2 = useTransform(springY, [-0.5, 0.5], [-40, 40]);
  const bgX3 = useTransform(springX, [-0.5, 0.5], [-60, 60]);
  const bgY3 = useTransform(springY, [-0.5, 0.5], [-60, 60]);
  const parallaxEnabled = gameState !== 'MINIGAME';
  const orbConfigs = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) => ({
        id: `orb-${i}`,
        useMidLayer: i % 2 === 0,
        className: i % 2 === 0 ? 'bg-dream-purple w-[320px] h-[320px]' : 'bg-dream-blue w-[420px] h-[420px]',
        leftStops: Array.from({ length: 3 }, () => `${Math.random() * 100}%`),
        topStops: Array.from({ length: 3 }, () => `${Math.random() * 100}%`),
        duration: 34 + i * 12,
      })),
    [],
  );
  const particleConfigs = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.35 + 0.1,
        duration: Math.random() * 10 + 10,
      })),
    [],
  );

  useEffect(() => {
    if (!parallaxEnabled) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [mouseX, mouseY, parallaxEnabled]);

  const handleGlobalMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!parallaxEnabled) {
      return;
    }

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const handleL3dadClick = () => {
    setBlushLevel((prev) => Math.min(prev + 1, 5));
    setL3dadThought('teehee!');
    setTimeout(() => {
      setBlushLevel(0);
      setL3dadThought(null);
    }, 2000);
  };

  const nextDialogue = () => {
    if (gameState === 'DIALOGUE') {
      if (dialogueIndex < DIALOGUE_LINES.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setGameState('MINIGAME');
      }
    } else if (gameState === 'FINAL') {
      if (dialogueIndex < FINAL_DIALOGUE.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        setGameState('MOON_GAME');
      }
    }
  };

  const startWalking = () => {
    setGameState('WALKING');
    setTimeout(() => {
      setGameState('DIALOGUE');
      setDialogueIndex(0);
    }, 3000);
  };

  const handleGameComplete = () => {
    setGameState('FINAL');
    setDialogueIndex(0);
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="min-h-screen bg-[#050505] font-sans text-slate-200 overflow-hidden selection:bg-purple-900/50 relative"
    >
      {/* Surreal Atmosphere Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Layered Radial Gradients */}
        <motion.div
          style={{ x: bgX1, y: bgY1 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-[70%] h-[70%] rounded-full bg-dream-purple/20 blur-[150px]"
        />
        <motion.div
          style={{ x: bgX2, y: bgY2 }}
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full bg-dream-blue/10 blur-[120px]"
        />

        {/* Drifting Surreal Orbs */}
        {orbConfigs.map((orbConfig) => (
          <motion.div
            key={orbConfig.id}
            style={{
              x: orbConfig.useMidLayer ? bgX2 : bgX3,
              y: orbConfig.useMidLayer ? bgY2 : bgY3,
            }}
            animate={{
              left: orbConfig.leftStops,
              top: orbConfig.topStops,
              scale: [1, 1.35, 0.9, 1.1, 1],
              opacity: [0.04, 0.09, 0.04],
            }}
            transition={{
              duration: orbConfig.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute rounded-full blur-[90px] pointer-events-none',
              orbConfig.className,
            )}
          />
        ))}

        {/* Floating Particles */}
        {particleConfigs.map((particleConfig) => (
          <motion.div
            key={particleConfig.id}
            style={{
              x: bgX3,
              y: bgY3,
            }}
            initial={{
              left: particleConfig.left,
              top: particleConfig.top,
              opacity: particleConfig.opacity,
            }}
            animate={{
              top: [null, '-=120', '+=50', '-=120'],
              left: [null, '+=24', '-=24', '+=24'],
              opacity: [null, 0.45, 0.08, 0.45],
            }}
            transition={{
              duration: particleConfig.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_8px_white]"
          />
        ))}
      </div>

      {/* Background Interactive Elements */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        <motion.div
          whileHover={{ scale: 1.2, opacity: 1 }}
          onClick={() => confetti({ particleCount: 20, origin: { x: 0.1, y: 0.1 } })}
          className="absolute top-10 left-10 animate-float pointer-events-auto cursor-pointer opacity-20"
        >
          <Heart className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" size={48} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, opacity: 1 }}
          onClick={() => confetti({ particleCount: 20, origin: { x: 0.9, y: 0.8 } })}
          className="absolute bottom-20 right-10 animate-float pointer-events-auto cursor-pointer opacity-20"
          style={{ animationDelay: '1s' }}
        >
          <Star className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" size={64} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, opacity: 1 }}
          onClick={() => confetti({ particleCount: 20, origin: { x: 0.25, y: 0.5 } })}
          className="absolute top-1/2 left-1/4 animate-float pointer-events-auto cursor-pointer opacity-20"
          style={{ animationDelay: '2s' }}
        >
          <Sparkles className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" size={32} />
        </motion.div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-10 flex flex-col items-center min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.02, 1],
          }}
          transition={{
            opacity: { duration: 0.8 },
            y: { duration: 0.8 },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            mini game for my major goat
          </h1>
          <motion.p
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-slate-400 font-medium font-handwriting text-3xl"
          >
            ilysm
          </motion.p>
        </motion.header>

        {/* Game Stage */}
        <div className="w-full flex-grow flex flex-col items-center justify-center relative">
          {gameState === 'MOON_GAME' ? (
            <MoonGame />
          ) : (
            <>
              {/* Character */}
              <div className="relative h-64 w-full flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                  {gameState === 'START' && (
                    <motion.button
                      key="start-btn"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={startWalking}
                      className="group relative px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Feed l3dad <ArrowRight size={20} />
                      </span>
                      <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                    </motion.button>
                  )}

                  {(gameState === 'WALKING' || gameState === 'DIALOGUE' || gameState === 'MINIGAME' || gameState === 'FINAL') && (
                    <motion.div
                      key="character"
                      initial={gameState === 'WALKING' ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                      className="relative"
                    >
                      <AnimatePresence>
                        {l3dadThought && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0, y: 20 }}
                            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-2xl z-20 whitespace-nowrap font-handwriting text-3xl text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                          >
                            {l3dadThought}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <StickmanSprite
                        walking={gameState === 'WALKING'}
                        cheering={gameState === 'FINAL'}
                        className={cn(blushLevel > 0 && 'scale-110')}
                        onClick={handleL3dadClick}
                        blushing={blushLevel > 0}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dialogue / Game UI */}
              <div className="w-full max-w-lg min-h-[200px]">
                <AnimatePresence mode="wait">
                  {(gameState === 'DIALOGUE' || gameState === 'FINAL') && (
                    <motion.div
                      key={`dialogue-${dialogueIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onClick={nextDialogue}
                      className="bg-white/10 backdrop-blur-xl p-10 pt-14 rounded-[3rem] border border-white/20 cursor-pointer hover:bg-white/15 transition-all relative group shadow-2xl"
                    >
                      <div className="absolute -top-4 left-10 px-6 py-2 bg-white text-slate-900 text-sm font-bold rounded-full shadow-2xl z-10 uppercase tracking-widest">
                        {gameState === 'DIALOGUE'
                          ? DIALOGUE_LINES[dialogueIndex].character
                          : FINAL_DIALOGUE[dialogueIndex].character}
                      </div>

                      <p className="text-2xl md:text-4xl font-medium leading-tight text-white font-sans">
                        {gameState === 'DIALOGUE' ? DIALOGUE_LINES[dialogueIndex].text : FINAL_DIALOGUE[dialogueIndex].text}
                      </p>

                      <div className="mt-10 flex justify-end items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse font-sans">
                        Tap to wander <ArrowRight size={18} />
                      </div>
                    </motion.div>
                  )}

                  {gameState === 'MINIGAME' && (
                    <motion.div
                      key="minigame"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full"
                    >
                      <FoodGame onComplete={handleGameComplete} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Footer Controls */}
        <footer className="mt-auto pt-10 flex justify-center gap-4 relative z-20">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 glass rounded-full text-slate-400 hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </footer>
      </main>
    </div>
  );
}
