import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_SECTIONS, SectionRoute } from '../hooks/useScrollSpy.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface ScrollSpyMarginProps {
  activeId: string;
  onNavigate: (sectionId: string) => void;
  recruiterMode?: boolean;
}

export const ScrollSpyMargin: React.FC<ScrollSpyMarginProps> = ({
  activeId,
  onNavigate,
  recruiterMode = false,
}) => {
  const { isLight } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (recruiterMode) return null;

  const currentSection = NAV_SECTIONS.find((s) => s.id === activeId);
  const isPastHero = activeId !== 'hero';

  return (
    <>
      {/* 1. Vertical Margin Rail (Desktop Viewport Left Margin) */}
      <nav
        aria-label="Section Quick Navigation"
        className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-start gap-3 pointer-events-auto select-none"
      >
        <div className="relative flex flex-col items-start gap-2.5 py-3 px-2 rounded-2xl backdrop-blur-md bg-white/60 dark:bg-[#0B0C0E]/60 border border-zinc-200/50 dark:border-white/[0.05] shadow-sm transition-all duration-300 hover:bg-white/90 dark:hover:bg-[#131519]/90 hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-lg">
          {/* Subtle Ambient Rail Track */}
          <div className="absolute left-[13px] top-4 bottom-4 w-[1.5px] bg-zinc-200/80 dark:bg-white/[0.08] pointer-events-none" />

          {NAV_SECTIONS.map((section: SectionRoute) => {
            const isActive = activeId === section.id;
            const isHovered = hoveredId === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onNavigate(section.id)}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex items-center gap-2.5 py-1 px-1 rounded-lg text-left focus:outline-none transition-all duration-200"
                aria-current={isActive ? 'location' : undefined}
                aria-label={`Jump to ${section.label} section`}
              >
                {/* Visual Dot / Node on Track */}
                <div className="relative z-10 flex items-center justify-center w-3 h-3">
                  {isActive ? (
                    <motion.div
                      layoutId="activeMarginDot"
                      className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.7)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  ) : (
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        isHovered
                          ? 'scale-150 bg-zinc-600 dark:bg-zinc-300'
                          : 'bg-zinc-400/60 dark:bg-white/20'
                      }`}
                    />
                  )}
                </div>

                {/* Expanding Context Label */}
                <div className="overflow-hidden flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive || isHovered ? 1 : 0,
                      x: isActive || isHovered ? 0 : -6,
                      width: isActive || isHovered ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="whitespace-nowrap flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase pl-1"
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        isActive
                          ? 'text-[#6366F1] dark:text-[#818CF8]'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {section.order}
                    </span>
                    <span
                      className={`font-bold transition-colors ${
                        isActive
                          ? isLight
                            ? 'text-zinc-900'
                            : 'text-white'
                          : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'
                      }`}
                    >
                      {section.shortLabel || section.label}
                    </span>
                  </motion.div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Floating Subtle HUD Viewport Margin Label (Visible as user scrolls through sections) */}
      <AnimatePresence>
        {isPastHero && currentSection && (
          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 z-20 hidden md:flex items-center gap-2 pointer-events-none select-none"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider backdrop-blur-xl bg-white/85 dark:bg-[#131519]/85 border border-zinc-200/80 dark:border-white/10 shadow-lg text-zinc-600 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="text-zinc-400 dark:text-zinc-500">VIEWPORT //</span>
              <span className="font-bold text-[#6366F1] dark:text-[#818CF8]">
                {currentSection.order} · {currentSection.shortLabel || currentSection.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
