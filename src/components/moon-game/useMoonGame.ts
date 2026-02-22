import { useCallback, useEffect, useRef, useState } from 'react';

import { MOON_POEMS } from '../../constants/moonPoems';
import { fireConfetti } from '../../lib/confetti';

export type MoonGamePhase = 'CHOOSING' | 'MOVING' | 'REVEALING';

const REVEAL_DELAY_MS = 1500;
const CARD_OFFSET_X = 200;
const CARD_COUNT = MOON_POEMS.length;
const CARD_CENTER_INDEX = (CARD_COUNT - 1) / 2;

interface UseMoonGameResult {
  phase: MoonGamePhase;
  selectedIndex: number | null;
  l3dadX: number;
  handleChoice: (index: number) => void;
  chooseAnother: () => void;
}

export function useMoonGame(): UseMoonGameResult {
  const [phase, setPhase] = useState<MoonGamePhase>('CHOOSING');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [l3dadX, setL3dadX] = useState(0);
  const revealTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (revealTimeoutRef.current !== null) {
        clearTimeout(revealTimeoutRef.current);
      }
    },
    [],
  );

  const revealChoice = useCallback(() => {
    setPhase('REVEALING');
    void fireConfetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff69b4', '#ff1493', '#ffc0cb'],
    });
  }, []);

  const handleChoice = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setPhase('MOVING');
      setL3dadX((index - CARD_CENTER_INDEX) * CARD_OFFSET_X);

      if (revealTimeoutRef.current !== null) {
        clearTimeout(revealTimeoutRef.current);
      }
      revealTimeoutRef.current = window.setTimeout(revealChoice, REVEAL_DELAY_MS);
    },
    [revealChoice],
  );

  const chooseAnother = useCallback(() => {
    setPhase('CHOOSING');
    setSelectedIndex(null);
    setL3dadX(0);
  }, []);

  return {
    phase,
    selectedIndex,
    l3dadX,
    handleChoice,
    chooseAnother,
  };
}

export { CARD_COUNT };
