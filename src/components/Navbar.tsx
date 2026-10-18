import React, { useState } from 'react';
import { FileText, Zap, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  recruiterMode: boolean;
  onToggleRecruiterMode: () => void;
  onOpenResumeModal: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recruiterMode,
  onToggleRecruiterMode,
  onOpenResumeModal,
  onOpenAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
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
        <div className="flex items-center gap-3 shrink-0">
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
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
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
          <div className="pt-2 border-t border-white/10 flex gap-2">
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
