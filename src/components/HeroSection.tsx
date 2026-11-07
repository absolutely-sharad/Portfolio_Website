import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { ArrowDownRight, FileText, Sparkles, CheckCircle2, Github, Linkedin, Mail } from 'lucide-react';
import { HeroNeuralCore3D } from './models/HeroNeuralCore3D.tsx';
import { motion } from 'framer-motion';
import { SectionAudioButton } from './SectionAudioButton.tsx';

interface HeroSectionProps {
  onOpenResumeModal: () => void;
  onOpenAssistant: () => void;
  onLaunchGame?: () => void;
  onOpenVideoStudio?: () => void;
  onOpenModelInspector?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenResumeModal,
  onOpenAssistant,
  onLaunchGame,
  onOpenVideoStudio,
  onOpenModelInspector,
}) => {
  const { personal, education } = portfolioData;

  return (
    <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Open-to-Work Availability Banner + AI Audio Overview Button */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-6 font-medium"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Open to Opportunities</span>
            </div>
            <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">·</span>
            <span className="text-zinc-600 dark:text-zinc-400">Targeting: {personal.targetRoles.join(' · ')}</span>
            <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">·</span>
            <span className="text-zinc-600 dark:text-zinc-400">CGPA {education.grade}</span>
          </div>

          <SectionAudioButton sectionId="hero" label="Listen to AI Overview" />
        </motion.div>

        {/* Hero 2-Column Split: Copy on Left, 3D Neural Core Model on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          {/* Left Column: Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.08] text-balance mb-6">
              Sharad Singh Kushwaha
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-semibold text-blue-600 dark:text-blue-400 mt-2">
                {personal.headline}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mb-8 text-balance font-normal">
              {personal.valueStatement}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 rounded-xl transition-all shadow-sm hover:scale-[1.02]"
              >
                <span>View Projects</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenResumeModal}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/10 rounded-xl transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4 text-zinc-500" />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Ask AI</span>
              </button>

              {onLaunchGame && (
                <button
                  type="button"
                  onClick={onLaunchGame}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/10 rounded-xl transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-zinc-400" />
                  <span>3D Arcade</span>
                </button>
              )}

              {/* Quick Social Anchors */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-zinc-200 dark:border-white/10">
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/10 rounded-lg transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/10 rounded-lg transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  className="p-2.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/10 rounded-lg transition-colors"
                  aria-label="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Model Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl bg-white/80 dark:bg-[#131519]/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 p-2 overflow-hidden shadow-lg dark:shadow-2xl">
              {/* Coordinated Top Header Bar: Prevents any element collision or text overlap */}
              <div className="absolute top-3 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-200 dark:border-white/10 pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">3D NEURAL CORE</span>
                  <span className="text-zinc-400 hidden sm:inline">·</span>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">WebGL PBR</span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="hidden xs:flex sm:flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-200 dark:border-white/10">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Drag to Orbit</span>
                  </div>

                  {onOpenModelInspector && (
                    <button
                      type="button"
                      onClick={onOpenModelInspector}
                      className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 hover:bg-blue-100 dark:hover:bg-blue-500/25 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30 transition-colors shrink-0"
                    >
                      3D Studio ↗
                    </button>
                  )}
                </div>
              </div>

              <HeroNeuralCore3D className="w-full" />
            </div>
          </motion.div>
        </div>

        {/* Impact KPI Strip (Adheres to 2-column split rules: full-width row below split) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-md"
        >
          <div className="border-r border-zinc-200/60 dark:border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-mono tabular-nums tracking-tight">
              9.50<span className="text-xs sm:text-sm text-zinc-500 font-sans"> (6th Sem)</span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              9.17 Cumulative · Polaris / Starex
            </div>
          </div>

          <div className="border-r border-zinc-200/60 dark:border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums tracking-tight">
              ~30%
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              Response Latency Reduction (Infonix)
            </div>
          </div>

          <div className="border-r border-zinc-200/60 dark:border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-mono tabular-nums tracking-tight">
              60+
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              Client Business Automations
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono tabular-nums tracking-tight">
              500+
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
              LeetCode DSA Problems Solved
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
