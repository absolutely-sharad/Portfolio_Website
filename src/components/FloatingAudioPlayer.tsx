import React from 'react';
import { Volume2, VolumeX, Pause, Play, Square, X, Sparkles, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTS } from '../context/TTSContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

export const FloatingAudioPlayer: React.FC = () => {
  const {
    supported,
    isPlaying,
    isPaused,
    activeSectionId,
    activeSummary,
    playbackRate,
    togglePlayPause,
    stop,
    setPlaybackRate,
  } = useTTS();
  const { isLight } = useTheme();

  if (!supported) return null;

  const isActive = activeSectionId !== null && (isPlaying || isPaused);

  const rates = [1.0, 1.25, 1.5, 0.85];

  const handleNextRate = () => {
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-4 sm:left-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md pointer-events-auto select-none"
        >
          <div
            className={`flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${
              isLight
                ? 'bg-white/95 border-zinc-300 text-zinc-800 shadow-lg'
                : 'bg-[#131519]/98 border-white/15 text-white shadow-2xl'
            }`}
          >
            {/* Animated Equalizer Visualizer */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 shrink-0">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-4 w-4 justify-center">
                  <span className="w-1 bg-blue-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-full" />
                  <span className="w-1 bg-blue-500 rounded-full animate-[bounce_0.9s_ease-in-out_infinite] h-3/5" />
                  <span className="w-1 bg-blue-500 rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-4/5" />
                </div>
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </div>

            {/* Title & Status */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                  {isPlaying ? 'Reading Aloud' : 'Narration Paused'}
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-[10px] text-zinc-400 font-mono">Web Speech</span>
              </div>
              <div
                className={`text-xs font-bold truncate ${
                  isLight ? 'text-zinc-900' : 'text-zinc-100'
                }`}
                title={activeSummary?.title || 'AI Summary'}
              >
                {activeSummary?.title || 'AI Summary'}
              </div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlayPause}
                className={`p-2 rounded-xl transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isPlaying ? 'Pause Narration' : 'Resume Narration'}
                aria-label={isPlaying ? 'Pause' : 'Resume'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>

              {/* Speed Rate Cycle */}
              <button
                type="button"
                onClick={handleNextRate}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/10'
                }`}
                title="Change Speech Speed"
              >
                {playbackRate}x
              </button>

              {/* Stop Button */}
              <button
                type="button"
                onClick={stop}
                className={`p-2 rounded-xl transition-all ${
                  isLight
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
                title="Stop Audio Narration"
                aria-label="Stop audio narration"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
