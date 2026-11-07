import React, { useState, useEffect } from 'react';
import { portfolioData, Project } from './data/portfolio.ts';
import { StarfieldCanvas } from './components/StarfieldCanvas.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { AchievementsSection } from './components/AchievementsSection.tsx';
import { TechNewsSection } from './components/TechNewsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { RecruiterView } from './components/RecruiterView.tsx';
import { AskSharadAssistant } from './components/AskSharadAssistant.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { NeuralPathRunner } from './components/game/NeuralPathRunner.tsx';
import { VideoStudioModal } from './components/VideoStudioModal.tsx';
import { ModelInspectorModal } from './components/models/ModelInspectorModal.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.tsx';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { TTSProvider } from './context/TTSContext.tsx';
import { ScrollSpyMargin } from './components/ScrollSpyMargin.tsx';
import { useScrollSpy } from './hooks/useScrollSpy.ts';

function MainPortfolio() {
  const [recruiterMode, setRecruiterMode] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState<boolean>(false);
  const [isModelInspectorOpen, setIsModelInspectorOpen] = useState<boolean>(false);
  const [inspectorModelIndex, setInspectorModelIndex] = useState<number>(0);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  const { isLight } = useTheme();
  const { activeId } = useScrollSpy(recruiterMode);

  // Global Keyboard Shortcut Listener
  // - Cmd+K or Ctrl+K: Toggle "Ask Sharad" AI Assistant
  // - Esc: Close any active modal in priority order
  // - Shift+? (when not typing in an input): Open Keyboard Shortcuts helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Cmd+K or Ctrl+K -> Toggle Ask Sharad Assistant
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAssistantOpen((prev) => !prev);
        return;
      }

      // 2. Escape -> Close active modal
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isModelInspectorOpen) {
          setIsModelInspectorOpen(false);
          return;
        }
        if (isVideoStudioOpen) {
          setIsVideoStudioOpen(false);
          return;
        }
        if (isGameOpen) {
          setIsGameOpen(false);
          return;
        }
        if (activeModalProject) {
          setActiveModalProject(null);
          return;
        }
        if (isResumeOpen) {
          setIsResumeOpen(false);
          return;
        }
        if (isAssistantOpen) {
          setIsAssistantOpen(false);
          return;
        }
      }

      // 3. Shift+? -> Toggle Shortcuts Guide (if not typing in input)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (!isInput && e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isModelInspectorOpen,
    isVideoStudioOpen,
    isGameOpen,
    activeModalProject,
    isResumeOpen,
    isAssistantOpen,
    isShortcutsOpen,
  ]);

  // Smooth navigation handler called by AI assistant or navbar
  const handleNavigateToSection = (sectionId: string) => {
    if (recruiterMode) {
      setRecruiterMode(false);
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleOpenProjectModal = (project: Project) => {
    setActiveModalProject(project);
  };

  const handleOpenModelInspector = (index: number = 0) => {
    setInspectorModelIndex(index);
    setIsModelInspectorOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F5] dark:bg-[#0B0C0E] text-[#121316] dark:text-[#F5F6F8] transition-colors duration-200">
      {/* Subtle Scroll Progress Indicator Bar at top of viewport */}
      <ScrollProgressBar recruiterMode={recruiterMode} />

      {/* Subtle Viewport Margin Scroll-Spy Tracker */}
      <ScrollSpyMargin
        activeId={activeId}
        onNavigate={handleNavigateToSection}
        recruiterMode={recruiterMode}
      />

      {/* 3D Interactive Starfield (Hidden when in Recruiter Mode for maximum 2D reading speed) */}
      {!recruiterMode && <StarfieldCanvas interactive={true} isLight={isLight} />}

      {/* Main Top Navigation Bar */}
      <Navbar
        recruiterMode={recruiterMode}
        onToggleRecruiterMode={() => setRecruiterMode(!recruiterMode)}
        activeSectionId={activeId}
        onNavigateToSection={handleNavigateToSection}
        onOpenResumeModal={() => setIsResumeOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onLaunchGame={() => setIsGameOpen(true)}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        onOpenModelInspector={() => handleOpenModelInspector(0)}
      />

      {/* Content Rendering: Recruiter Mode or 3D Visual Experience */}
      {recruiterMode ? (
        <main>
          <RecruiterView
            onToggleBack={() => setRecruiterMode(false)}
            onOpenResumeModal={() => setIsResumeOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        </main>
      ) : (
        <main className="relative z-10">
          <HeroSection
            onOpenResumeModal={() => setIsResumeOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onLaunchGame={() => setIsGameOpen(true)}
            onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
            onOpenModelInspector={() => handleOpenModelInspector(0)}
          />

          <AboutSection />

          <ExperienceSection />

          <ProjectsSection
            onLaunchGame={() => setIsGameOpen(true)}
            onOpenModelInspector={handleOpenModelInspector}
          />

          <SkillsSection />

          <AchievementsSection />

          <TechNewsSection />

          <ContactSection
            onOpenResumeModal={() => setIsResumeOpen(true)}
          />
        </main>
      )}

      {/* Autonomous "Ask Sharad" Multi-Turn Gemini Assistant */}
      <AskSharadAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpen={() => setIsAssistantOpen(true)}
        onNavigateToSection={handleNavigateToSection}
        onOpenProjectModal={handleOpenProjectModal}
        onOpenResumeModal={() => setIsResumeOpen(true)}
        onLaunchGame={() => setIsGameOpen(true)}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        onOpenModelInspector={() => handleOpenModelInspector(0)}
      />

      {/* 1-Click Printable ATS Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Standalone Project Deep-Dive Modal for AI Assistant Trigger */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

      {/* Interactive 3D Neural Path Runner Game Shell */}
      <NeuralPathRunner
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      {/* Gemini Omni 1.1 Flash Video Studio Modal */}
      <VideoStudioModal
        isOpen={isVideoStudioOpen}
        onClose={() => setIsVideoStudioOpen(false)}
      />

      {/* 3D Model Inspector Studio Modal */}
      <ModelInspectorModal
        isOpen={isModelInspectorOpen}
        initialModelIndex={inspectorModelIndex}
        onClose={() => setIsModelInspectorOpen(false)}
      />

      {/* Global Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Web Speech Text-to-Speech Player */}
      <FloatingAudioPlayer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TTSProvider>
        <MainPortfolio />
      </TTSProvider>
    </ThemeProvider>
  );
}
