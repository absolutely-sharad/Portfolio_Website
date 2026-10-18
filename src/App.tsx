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
import { ContactSection } from './components/ContactSection.tsx';
import { RecruiterView } from './components/RecruiterView.tsx';
import { AskSharadAssistant } from './components/AskSharadAssistant.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';

export default function App() {
  const [recruiterMode, setRecruiterMode] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

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

  return (
    <div className="relative min-h-screen bg-[#08090C] text-[#F8FAFC]">
      {/* 3D Interactive Starfield (Hidden when in Recruiter Mode for maximum 2D reading speed) */}
      {!recruiterMode && <StarfieldCanvas interactive={true} />}

      {/* Main Top Navigation Bar */}
      <Navbar
        recruiterMode={recruiterMode}
        onToggleRecruiterMode={() => setRecruiterMode(!recruiterMode)}
        onOpenResumeModal={() => setIsResumeOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
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
          />

          <AboutSection />

          <ExperienceSection />

          <ProjectsSection />

          <SkillsSection />

          <AchievementsSection />

          <ContactSection
            onOpenResumeModal={() => setIsResumeOpen(true)}
          />
        </main>
      )}

      {/* Autonomous "Ask Sharad" AI Assistant */}
      <AskSharadAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpen={() => setIsAssistantOpen(true)}
        onNavigateToSection={handleNavigateToSection}
        onOpenProjectModal={handleOpenProjectModal}
        onOpenResumeModal={() => setIsResumeOpen(true)}
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
    </div>
  );
}
