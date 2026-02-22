import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { MOON_POEMS } from '../constants/moonPoems';
import { cn } from '../lib/cn';
import { StickmanSprite } from './StickmanSprite';

type MoonGamePhase = 'CHOOSING' | 'MOVING' | 'REVEALING';

export function MoonGame() {
  const [phase, setPhase] = useState<MoonGamePhase>('CHOOSING');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [l3dadX, setL3dadX] = useState(0);

  const handleChoice = (index: number) => {
    setSelectedIndex(index);
    setPhase('MOVING');

    // Card positions: -200, 0, 200
    const targetX = (index - 1) * 200;
    setL3dadX(targetX);

    setTimeout(() => {
      setPhase('REVEALING');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-handwriting text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          would you love me more IFFF
        </h2>
      </motion.div>

      <div className="relative w-full h-[400px] flex flex-col items-center">
        {phase === 'CHOOSING' && (
          <div className="flex gap-6 md:gap-12 z-10">
            {MOON_POEMS.map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => handleChoice(i)}
                className={cn(
                  'w-32 h-48 md:w-44 md:h-64 glass rounded-3xl border-2 border-white/20 flex items-center justify-center cursor-pointer hover:border-dream-pink/50 transition-all shadow-xl relative group overflow-hidden',
                  i === 2 && 'border-dream-purple/30',
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white font-handwriting text-5xl md:text-7xl opacity-30 group-hover:opacity-100 transition-opacity">?</span>
                {i === 2 && <Sparkles className="absolute top-4 right-4 text-dream-purple opacity-50" size={20} />}
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          animate={{ x: l3dadX }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute bottom-0"
        >
          <StickmanSprite walking={phase === 'MOVING'} blushing={phase === 'REVEALING'} cheering={phase === 'REVEALING'} />
          <AnimatePresence>
            {phase === 'REVEALING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-2xl z-20 whitespace-nowrap font-handwriting text-3xl text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                teehee!
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === 'REVEALING' && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 glass p-10 rounded-[3rem] border-2 border-white/20 max-w-xl text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dream-purple via-dream-pink to-dream-blue" />
            <p className="text-2xl md:text-4xl font-handwriting text-white whitespace-pre-line leading-relaxed">
              {MOON_POEMS[selectedIndex].text}
            </p>
            <button
              onClick={() => setPhase('CHOOSING')}
              className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-dream-pink font-bold transition-all text-lg"
            >
              Choose another?
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
