import React from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';
import { useTTS } from '../context/TTSContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface SectionAudioButtonProps {
  sectionId: string;
  variant?: 'inline' | 'compact' | 'pill';
  label?: string;
  className?: string;
}

export const SectionAudioButton: React.FC<SectionAudioButtonProps> = ({
  sectionId,
  variant = 'pill',
  label = 'AI Audio Summary',
  className = '',
}) => {
  const { supported, activeSectionId, isPlaying, isPaused, speakSection } = useTTS();
  const { isLight } = useTheme();

  if (!supported) return null;

  const isCurrentSection = activeSectionId === sectionId;
  const isSpeakingNow = isCurrentSection && isPlaying;
  const isPausedNow = isCurrentSection && isPaused;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakSection(sectionId);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl border transition-all ${
          isSpeakingNow
            ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
            : isLight
            ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-400 hover:text-white'
        } ${className}`}
        title={isSpeakingNow ? 'Pause Audio Summary' : 'Listen to AI Summary (Web Speech API)'}
        aria-label={isSpeakingNow ? 'Pause section summary' : 'Listen to AI-generated section summary'}
      >
        {isSpeakingNow ? (
          <VolumeX className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border shrink-0 ${
        isSpeakingNow
          ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400'
          : isPausedNow
          ? 'bg-amber-400/15 border-amber-400/40 text-amber-500 dark:text-amber-300'
          : isLight
          ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 hover:text-zinc-900 shadow-sm'
          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-blue-500/40 text-zinc-400 hover:text-white'
      } ${className}`}
      title={
        isSpeakingNow
          ? 'Pause AI audio narration'
          : isPausedNow
          ? 'Resume AI audio narration'
          : 'Listen to AI-generated summary of this section (Web Speech API)'
      }
      aria-label={isSpeakingNow ? 'Pause AI audio summary' : 'Listen to AI audio summary'}
    >
      {/* Dynamic Icon or Wave Equalizer */}
      {isSpeakingNow ? (
        <span className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5 justify-center">
          <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-full" />
          <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-2/3" />
          <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-3/4" />
        </span>
      ) : isPausedNow ? (
        <Play className="w-3.5 h-3.5 fill-current text-amber-500 dark:text-amber-400" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
      )}

      <span className="font-medium">
        {isSpeakingNow ? 'Pause Audio' : isPausedNow ? 'Resume' : label}
      </span>
    </button>
  );
};
