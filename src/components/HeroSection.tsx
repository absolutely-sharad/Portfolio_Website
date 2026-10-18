import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { ArrowDownRight, FileText, Sparkles, CheckCircle2, Github, Linkedin, Mail } from 'lucide-react';

interface HeroSectionProps {
  onOpenResumeModal: () => void;
  onOpenAssistant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenResumeModal,
  onOpenAssistant,
}) => {
  const { personal, education } = portfolioData;

  return (
    <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Open-to-Work Availability Banner (Clean text, no static pill sandwiches) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mb-6 font-medium">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-semibold text-white">Open to Opportunities</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Targeting: {personal.targetRoles.join(' · ')}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">CGPA {education.grade}</span>
        </div>

        {/* Main Headline & Value Statement */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance mb-6">
            Sharad Singh Kushwaha
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#38BDF8] mt-2">
              {personal.headline}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mb-10 text-balance font-normal">
            {personal.valueStatement}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] rounded-xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
            >
              <span>View Projects</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenResumeModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-xl transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Download Resume</span>
            </button>

            <button
              type="button"
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/35 rounded-xl transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Ask my AI</span>
            </button>

            {/* Quick Social Anchors */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10">
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personal.email}`}
                className="p-2.5 text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Impact KPI Strip (Adheres to 2-column split rules: full-width row below split) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0E1217]/80 backdrop-blur-md border border-white/[0.08]">
          <div className="border-r border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              9.17<span className="text-base text-slate-400 font-sans"> / 10</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              B.Tech CSE · Polaris / Starex
            </div>
          </div>

          <div className="border-r border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] font-mono tabular-nums tracking-tight">
              ~30%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Response Latency Reduction (Infonix)
            </div>
          </div>

          <div className="border-r border-white/[0.06] pr-4 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              60+
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Client Business Automations
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] font-mono tabular-nums tracking-tight">
              500+
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              LeetCode DSA Problems Solved
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
