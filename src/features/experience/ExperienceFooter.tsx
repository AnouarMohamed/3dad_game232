import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface ExperienceFooterProps {
  isMuted: boolean;
  onReset: () => void;
  onToggleMute: () => void;
}

export function ExperienceFooter({ isMuted, onReset, onToggleMute }: ExperienceFooterProps) {
  return (
    <footer className="mt-auto pt-8 sm:pt-10 flex justify-center gap-4 relative z-20">
      <button
        onClick={onReset}
        className="p-3 glass rounded-full text-slate-400 hover:bg-white/10 transition-colors"
        aria-label="Restart experience"
        title="Restart"
      >
        <RotateCcw size={20} />
      </button>
      <button
        onClick={onToggleMute}
        className="p-3 glass rounded-full text-slate-400 hover:bg-white/10 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </footer>
  );
}
