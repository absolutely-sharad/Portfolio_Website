import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SECTION_SUMMARIES, SectionSummary } from '../data/sectionSummaries.ts';

interface TTSContextType {
  supported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  activeSectionId: string | null;
  activeSummary: SectionSummary | null;
  playbackRate: number;
  speakSection: (sectionId: string) => void;
  speakCustomText: (text: string, title?: string) => void;
  togglePlayPause: () => void;
  stop: () => void;
  setPlaybackRate: (rate: number) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supported, setSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSummary, setActiveSummary] = useState<SectionSummary | null>(null);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  // Clear keep-alive timer
  const clearKeepAlive = () => {
    if (keepAliveIntervalRef.current !== null) {
      window.clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  };

  const stop = useCallback(() => {
    clearKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSectionId(null);
    setActiveSummary(null);
  }, []);

  // Workaround for Chrome bug where speech synthesis pauses after 15 seconds
  const startKeepAlive = () => {
    clearKeepAlive();
    keepAliveIntervalRef.current = window.setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  };

  // Helper to pick the best natural English voice
  const getPreferredVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer high-quality natural voices
    const preferred = voices.find(
      (v) =>
        (v.lang.startsWith('en') || v.lang === 'en_US' || v.lang === 'en-US') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen') ||
          v.name.includes('Arthur'))
    );

    if (preferred) return preferred;

    // Fallback to any English voice
    const englishVoice = voices.find((v) => v.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
  };

  const speakTextInternal = useCallback(
    (text: string, sectionId: string | null, summaryObj: SectionSummary | null) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      // Stop any current speech
      window.speechSynthesis.cancel();
      clearKeepAlive();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.pitch = 1.0;

      const voice = getPreferredVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setActiveSectionId(sectionId);
        setActiveSummary(summaryObj);
        startKeepAlive();
      };

      utterance.onend = () => {
        clearKeepAlive();
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSectionId(null);
        setActiveSummary(null);
      };

      utterance.onerror = (e) => {
        // Interrupted or cancelled is normal when stopping
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e.error);
        }
        clearKeepAlive();
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSectionId(null);
        setActiveSummary(null);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        setIsPaused(false);
        setIsPlaying(true);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [playbackRate]
  );

  const speakSection = useCallback(
    (sectionId: string) => {
      // If already speaking this section, toggle play/pause
      if (activeSectionId === sectionId) {
        if (isPlaying) {
          if ('speechSynthesis' in window) window.speechSynthesis.pause();
          setIsPaused(true);
          setIsPlaying(false);
          return;
        } else if (isPaused) {
          if ('speechSynthesis' in window) window.speechSynthesis.resume();
          setIsPaused(false);
          setIsPlaying(true);
          return;
        }
      }

      const summary = SECTION_SUMMARIES[sectionId];
      if (!summary) return;

      speakTextInternal(summary.text, sectionId, summary);
    },
    [activeSectionId, isPlaying, isPaused, speakTextInternal]
  );

  const speakCustomText = useCallback(
    (text: string, title: string = 'AI Summary') => {
      const customSummary: SectionSummary = {
        id: 'custom',
        title,
        shortLabel: 'AI Response',
        text,
      };
      speakTextInternal(text, 'custom', customSummary);
    },
    [speakTextInternal]
  );

  const togglePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, [isPlaying, isPaused]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      setPlaybackRateState(rate);
      if (utteranceRef.current) {
        utteranceRef.current.rate = rate;
      }
      // If currently speaking, restart with new rate for instant feedback
      if (activeSummary && (isPlaying || isPaused)) {
        speakTextInternal(activeSummary.text, activeSectionId, activeSummary);
      }
    },
    [activeSummary, activeSectionId, isPlaying, isPaused, speakTextInternal]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearKeepAlive();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <TTSContext.Provider
      value={{
        supported,
        isPlaying,
        isPaused,
        activeSectionId,
        activeSummary,
        playbackRate,
        speakSection,
        speakCustomText,
        togglePlayPause,
        stop,
        setPlaybackRate,
      }}
    >
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};
