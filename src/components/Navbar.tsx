import React, { useState } from 'react';
import { FileText, Zap, Menu, X, Sparkles, Sun, Moon, Film, Box, Play } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface NavbarProps {
  recruiterMode: boolean;
  onToggleRecruiterMode: () => void;
  onOpenResumeModal: () => void;
  onOpenAssistant: () => void;
  onLaunchGame?: () => void;
  onOpenVideoStudio?: () => void;
  onOpenModelInspector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recruiterMode,
  onToggleRecruiterMode,
  onOpenResumeModal,
  onOpenAssistant,
  onLaunchGame,
  onOpenVideoStudio,
  onOpenModelInspector,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isLight } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090C]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, no adjacent descriptors) */}
        <a
          href="#hero"
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-[#38BDF8] transition-colors whitespace-nowrap shrink-0"
        >
          Sharad Singh Kushwaha
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#about"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            About
          </a>
          <a
            href="#experience"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Experience
          </a>
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Skills
          </a>
          <a
            href="#achievements"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Achievements
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play 3D Village Run Button */}
          {onLaunchGame && !recruiterMode && (
            <button
              type="button"
              onClick={onLaunchGame}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] rounded-lg shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all whitespace-nowrap shrink-0"
              title="Launch full-screen Village Run 3D endless runner arcade"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play 3D</span>
            </button>
          )}

          {/* AI Video Studio Button */}
          {onOpenVideoStudio && !recruiterMode && (
            <button
              type="button"
              onClick={onOpenVideoStudio}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#38BDF8]/40 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Generate cinematic reels with Gemini Omni 1.1 Flash via Interactions API"
            >
              <Film className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>AI Video</span>
            </button>
          )}

          {/* 3D Model Inspector Button */}
          {onOpenModelInspector && !recruiterMode && (
            <button
              type="button"
              onClick={() => onOpenModelInspector()}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#38BDF8]/40 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Inspect 3D composite models with studio PBR lighting"
            >
              <Box className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>3D Models</span>
            </button>
          )}

          {/* High-Contrast Light / Space Dark Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all border whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] ${
              isLight
                ? 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border-white/10 hover:border-[#38BDF8]/40'
            }`}
            title={isLight ? 'Switch to Dark Galaxy Theme' : 'Switch to High-Contrast Light Theme (WCAG AAA)'}
            aria-label={isLight ? 'Switch to Dark Galaxy Theme' : 'Switch to High-Contrast Light Theme'}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* Recruiter Mode Toggle */}
          <button
            type="button"
            onClick={onToggleRecruiterMode}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border whitespace-nowrap shrink-0 ${
              recruiterMode
                ? 'bg-[#38BDF8] text-[#08090C] border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border-white/10 hover:border-[#38BDF8]/40'
            }`}
            title="Toggle fast 30-second 2D recruiter summary"
          >
            <Zap className={`w-3.5 h-3.5 ${recruiterMode ? 'fill-[#08090C]' : 'text-[#38BDF8]'}`} />
            <span>{recruiterMode ? '3D View' : 'Recruiter Mode'}</span>
          </button>

          {/* Resume Modal Button */}
          <button
            type="button"
            onClick={onOpenResumeModal}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span>Resume</span>
          </button>

          {/* Ask AI button in header */}
          <button
            type="button"
            onClick={onOpenAssistant}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0E1217] px-4 py-3 space-y-2">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            About
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            Experience
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            Projects
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            Skills
          </a>
          <a
            href="#achievements"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            Achievements
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-slate-300 hover:text-[#38BDF8]"
          >
            Contact
          </a>

          {/* Mobile Theme Toggle Button */}
          <div className="py-2 border-t border-white/10">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold rounded-lg bg-white/[0.05] border border-white/10 text-slate-200"
            >
              <span className="flex items-center gap-2">
                {isLight ? <Moon className="w-4 h-4 text-amber-700" /> : <Sun className="w-4 h-4 text-[#38BDF8]" />}
                <span>{isLight ? 'Switch to Dark Mode' : 'High-Contrast Light Mode'}</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                {isLight ? 'Active' : 'WCAG AAA'}
              </span>
            </button>
          </div>

          {/* Mobile Interactive 3D & Video Row */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            {onLaunchGame && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchGame();
                }}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#08090C] bg-[#38BDF8] rounded-lg shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play 3D</span>
              </button>
            )}

            {onOpenVideoStudio && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideoStudio();
                }}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-white/10 border border-white/15 rounded-lg"
              >
                <Film className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>AI Video</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-white/10 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#38BDF8] bg-[#38BDF8]/15 rounded-lg border border-[#38BDF8]/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
