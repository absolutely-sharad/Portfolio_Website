import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.tsx';

const SECTIONS = [
  { id: 'hero', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'technews', label: 'Tech News' },
  { id: 'contact', label: 'Contact' },
];

interface ScrollProgressBarProps {
  recruiterMode?: boolean;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ recruiterMode }) => {
  const { isLight } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState<string>('Overview');
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  // Sync scroll percentage and detect active section
  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1200);

      const scrollPos = window.scrollY + 220;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(SECTIONS[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, [recruiterMode]);

  // Keep numerical percentage updated
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none">
      {/* Background Track */}
      <div className={`w-full h-[2px] ${isLight ? 'bg-zinc-200' : 'bg-white/[0.08]'}`}>
        {/* Minimalist Progress Line */}
        <motion.div
          className={`h-full origin-left ${
            isLight
              ? 'bg-zinc-900'
              : 'bg-gradient-to-r from-[#6366F1] to-[#14B8A6]'
          }`}
          style={{ scaleX }}
        />
      </div>

      {/* Floating Micro Section Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{
          opacity: isScrolling && percent > 2 ? 1 : 0,
          y: isScrolling && percent > 2 ? 0 : -4,
        }}
        transition={{ duration: 0.15 }}
        className="absolute top-2.5 right-4 sm:right-8"
      >
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono backdrop-blur-md border ${
            isLight
              ? 'bg-white/95 text-zinc-700 border-zinc-200/80 shadow-sm'
              : 'bg-[#131519]/95 text-zinc-300 border-white/10 shadow-md'
          }`}
        >
          <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>{activeSection}</span>
          <span className="text-zinc-400">/</span>
          <span className="tabular-nums font-semibold text-indigo-600 dark:text-[#14B8A6]">{percent}%</span>
        </div>
      </motion.div>
    </div>
  );
};
