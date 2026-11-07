import React, { useState } from 'react';
import { Zap, Sun, Moon, Menu, X, ArrowUpRight, Box } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { NAV_SECTIONS, SectionRoute } from '../hooks/useScrollSpy.ts';

interface NavbarProps {
  recruiterMode: boolean;
  onToggleRecruiterMode: () => void;
  activeSectionId?: string;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenResumeModal?: () => void;
  onOpenAssistant?: () => void;
  onLaunchGame?: () => void;
  onOpenVideoStudio?: () => void;
  onOpenModelInspector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recruiterMode,
  onToggleRecruiterMode,
  activeSectionId = 'hero',
  onNavigateToSection,
  onOpenResumeModal,
  onOpenModelInspector,
}) => {
  const { toggleTheme, isLight } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRouteClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-white/[0.08] bg-[#FAF9F5]/90 dark:bg-[#0B0C0E]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Name / Monogram */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleRouteClick('hero');
          }}
          className="group flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors shrink-0"
          title="Sharad Singh Kushwaha — AI & Backend Engineer"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-mono text-xs font-bold shadow-sm transition-all group-hover:scale-105">
            SK
          </div>
          <span className="font-bold tracking-tight hidden sm:inline">Sharad Singh Kushwaha</span>
          <span className="font-bold tracking-tight sm:hidden">Sharad</span>
        </a>

        {/* Desktop Section Routes */}
        {!recruiterMode && (
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 py-1 rounded-full bg-zinc-100/70 dark:bg-white/[0.03] border border-zinc-200/70 dark:border-white/[0.06]"
          >
            {NAV_SECTIONS.map((section: SectionRoute) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleRouteClick(section.id)}
                  className={`relative px-2.5 lg:px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'text-white font-semibold'
                      : isLight
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active Background Pill in Cyber Indigo */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.45)] -z-10"
                    />
                  )}
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Cluster: Theme, Recruiter Mode, and Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all border shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 ${
              isLight
                ? 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200 shadow-sm'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 hover:text-white border-white/10'
            }`}
            title={isLight ? 'Switch to Carbon Dark Theme' : 'Switch to Soft Ivory Light Theme'}
            aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* 3D Model Studio Trigger */}
          {onOpenModelInspector && (
            <button
              type="button"
              onClick={onOpenModelInspector}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all border shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 border-zinc-200'
                  : 'bg-white/[0.05] hover:bg-[#6366F1]/20 text-zinc-300 hover:text-white border-white/10 hover:border-[#6366F1]/30'
              }`}
              title="Open full-bleed 3D Studio & Procedural Scene Explorer"
              aria-label="Open 3D Studio"
            >
              <Box className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>3D Studio</span>
            </button>
          )}

          {/* Recruiter Mode Toggle */}
          <button
            type="button"
            onClick={onToggleRecruiterMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all border shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 ${
              recruiterMode
                ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-sm'
                : isLight
                ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 hover:text-white border-white/10'
            }`}
            title="Toggle fast 30-second 2D recruiter summary"
            aria-label={recruiterMode ? 'Switch to Visual View' : 'Switch to Fast Recruiter Mode'}
          >
            <Zap className={`w-3.5 h-3.5 ${recruiterMode ? 'fill-current' : 'text-[#6366F1]'}`} />
            <span className="hidden sm:inline">{recruiterMode ? '3D View' : 'Recruiter'}</span>
            <span className="sm:hidden">{recruiterMode ? '3D' : 'Recruiter'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          {!recruiterMode && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/10 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {!recruiterMode && mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-white/10 bg-[#FAF9F5]/98 dark:bg-[#0B0C0E]/98 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 py-1">
              Section Routes
            </div>
            {NAV_SECTIONS.map((section: SectionRoute) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleRouteClick(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-[#6366F1]/15 text-[#6366F1] dark:text-[#818CF8] font-bold border border-[#6366F1]/20'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-400">
                      {section.order}
                    </span>
                    <span>{section.label}</span>
                  </div>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 opacity-60" />
                  )}
                </button>
              );
            })}

            {onOpenModelInspector && (
              <div className="pt-2 border-t border-zinc-200 dark:border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenModelInspector();
                  }}
                  className="w-full flex items-center justify-between py-2 px-3 text-xs font-semibold text-white bg-[#6366F1] rounded-xl transition-all shadow-sm mb-1.5"
                >
                  <span className="flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Open 3D Studio & Inspector</span>
                  </span>
                  <span className="text-[10px] font-mono bg-black/25 px-2 py-0.5 rounded">Three.js PBR</span>
                </button>
              </div>
            )}

            {onOpenResumeModal && (
              <div className={onOpenModelInspector ? '' : 'pt-2 border-t border-zinc-200 dark:border-white/10 mt-2'}>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResumeModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 rounded-xl transition-all border border-zinc-200 dark:border-white/10"
                >
                  <span>Open ATS Resume PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
