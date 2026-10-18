import React, { useState } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { FileText, Copy, Check, ArrowLeft, ExternalLink, Github, Mail, Linkedin, Sparkles } from 'lucide-react';

interface RecruiterViewProps {
  onToggleBack: () => void;
  onOpenResumeModal: () => void;
  onOpenAssistant: () => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  onToggleBack,
  onOpenResumeModal,
  onOpenAssistant,
}) => {
  const [copied, setCopied] = useState(false);
  const { personal, education, experiences, projects, skills, achievements } = portfolioData;

  const handleCopySummary = () => {
    const text = `
SHARAD SINGH KUSHWAHA — AI & BACKEND ENGINEER
Email: ${personal.email} | LinkedIn: ${personal.linkedin} | GitHub: ${personal.github}
Target Roles: ${personal.targetRoles.join(', ')}
Academics: B.Tech CSE at Polaris School of Technology (Starex University) — CGPA: 9.17/10

IMPACT SNAPSHOT:
- Co-founder at Infonix Cloud: Built Gemini AI agent cutting customer ticket response times by ~30%.
- Automated workflows for 60+ business clients using Python/NLP pipelines.
- Shipped full-stack production MVPs in 2-4 week sprint cycles across React, Node, Laravel, Flutter.
- 500+ LeetCode problems solved; FCPL Runner-Up; CodeChef Starters 123 Rank 1467.

KEY PROJECTS:
1. AI Job-Hunt Copilot (Gemini 2.5 Flash, pgvector, FastAPI, Next.js) — Slashed application prep time by 75%, 2.4x callback rate.
2. StudyOS (React, Node, Express, Supabase, Pinecone) — Adopted by 850+ students with 18% retention score gain.
3. Gemini Pro Chat App (React 19, @google/genai, SSE) — Sub-150ms time-to-first-token on 10k+ character contexts.
4. Village Run 3D (Three.js, WebGL) — 60 FPS on low-power devices with sub-2.5MB bundle.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-200 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Navigation Bar for Recruiter View */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <button
          type="button"
          onClick={onToggleBack}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to 3D Space View</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#38BDF8] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Recruiter Bio'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Resume PDF</span>
          </button>
        </div>
      </div>

      {/* Recruiter Summary Card */}
      <header className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {personal.name}
            </h1>
            <div className="text-lg font-semibold text-[#38BDF8] mt-0.5">
              {personal.headline}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
              <a href={`mailto:${personal.email}`} className="text-[#38BDF8] hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" /> {personal.email}
              </a>
              <span aria-hidden="true">·</span>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                <Github className="w-3 h-3" /> GitHub
              </a>
              <span aria-hidden="true">·</span>
              <span>{personal.location}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-right shrink-0">
            <div className="text-xs text-slate-400">Academic Standing</div>
            <div className="text-xl font-mono font-bold text-white tabular-nums">
              {education.grade}
            </div>
            <div className="text-[11px] text-[#38BDF8] font-medium">
              Polaris School of Tech
            </div>
          </div>
        </div>

        {/* 30-Second Elevator Pitch */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-3 border-t border-white/[0.06]">
          <strong>30-Second Snapshot:</strong> AI & Backend Engineer with hands-on production experience building autonomous agent pipelines, vector search systems, and high-throughput microservices. Co-founder of Infonix Cloud, where I designed Gemini-based customer support agents cutting response latency by ~30% and shipped automation pipelines for 60+ business clients. Top 1% student (9.17/10 CGPA) with 500+ LeetCode problems solved.
        </p>

        {/* Target Roles */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-white">Target Roles:</span>
          {personal.targetRoles.map((role, idx) => (
            <React.Fragment key={role}>
              <span className="text-[#38BDF8] font-medium">{role}</span>
              {idx < personal.targetRoles.length - 1 && <span>·</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Key Numbers / Proof Grid */}
      <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0E1217] border border-white/[0.08]">
          <div className="text-2xl font-bold font-mono text-[#38BDF8] tabular-nums">~30%</div>
          <div className="text-xs text-slate-400 mt-1">Faster Customer Response</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1217] border border-white/[0.08]">
          <div className="text-2xl font-bold font-mono text-white tabular-nums">60+</div>
          <div className="text-xs text-slate-400 mt-1">Client Business Automations</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1217] border border-white/[0.08]">
          <div className="text-2xl font-bold font-mono text-[#38BDF8] tabular-nums">500+</div>
          <div className="text-xs text-slate-400 mt-1">LeetCode DSA Solved</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1217] border border-white/[0.08]">
          <div className="text-2xl font-bold font-mono text-white tabular-nums">9.17</div>
          <div className="text-xs text-slate-400 mt-1">B.Tech CSE CGPA</div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#38BDF8] mb-6">
          Impact-First Experience
        </h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="pb-6 border-b border-white/[0.06] last:border-none last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="text-base font-bold text-white">
                  {exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {exp.period} · {exp.location}
                </div>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 mb-3">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#38BDF8] font-bold">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-300">Stack:</strong> {exp.technologies.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#38BDF8] mb-6">
          Key Projects & Measurable Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  <span className="text-[11px] text-[#38BDF8] font-mono">{proj.category}</span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {proj.solution}
                </p>
                <div className="text-xs text-[#38BDF8] font-semibold mb-3">
                  Result: {proj.measurableResult}
                </div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{proj.stack.slice(0, 3).join(', ')}</span>
                <div className="flex items-center gap-2">
                  <a href={proj.liveDemo} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline flex items-center gap-1">
                    Demo <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                    Code <Github className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#38BDF8] mb-4">
          Technical Skills Directory
        </h2>
        <div className="space-y-2.5 text-xs sm:text-sm">
          {skills.map((s) => (
            <div key={s.category} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-bold text-white w-44 shrink-0">{s.category}:</span>
              <span className="text-slate-300">{s.items.join(' · ')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
