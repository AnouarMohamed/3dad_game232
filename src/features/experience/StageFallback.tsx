interface StageFallbackProps {
  message: string;
}

export function StageFallback({ message }: StageFallbackProps) {
  return (
    <div className="w-full max-w-lg min-h-[200px] glass rounded-[2rem] border border-white/15 flex items-center justify-center px-6 py-8">
      <p className="text-slate-300 text-sm md:text-base uppercase tracking-[0.2em] animate-pulse text-center">
        {message}
      </p>
    </div>
  );
}
