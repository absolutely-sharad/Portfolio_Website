import React, { useState } from 'react';
import { portfolioData, Project } from './data/portfolio.ts';
import { StarfieldCanvas } from './components/StarfieldCanvas.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { AchievementsSection } from './components/AchievementsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { RecruiterView } from './components/RecruiterView.tsx';
import { AskSharadAssistant } from './components/AskSharadAssistant.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { NeuralPathRunner } from './components/game/NeuralPathRunner.tsx';
import { VideoStudioModal } from './components/VideoStudioModal.tsx';
import { ModelInspectorModal } from './components/models/ModelInspectorModal.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';

function MainPortfolio() {
  const [recruiterMode, setRecruiterMode] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState<boolean>(false);
  const [isModelInspectorOpen, setIsModelInspectorOpen] = useState<boolean>(false);
  const [inspectorModelIndex, setInspectorModelIndex] = useState<number>(0);

  const { isLight } = useTheme();

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
    <div className="relative min-h-screen bg-[#08090C] text-[#F8FAFC] transition-colors duration-200">
      {/* 3D Interactive Starfield (Hidden when in Recruiter Mode for maximum 2D reading speed) */}
      {!recruiterMode && <StarfieldCanvas interactive={true} isLight={isLight} />}

      {/* Main Top Navigation Bar */}
      <Navbar
        recruiterMode={recruiterMode}
        onToggleRecruiterMode={() => setRecruiterMode(!recruiterMode)}
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
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainPortfolio />
    </ThemeProvider>
  );
}
