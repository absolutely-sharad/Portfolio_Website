import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { GraduationCap, Award, Compass, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { personal, education } = portfolioData;

  return (
    <section id="about" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with clean unboxed metadata */}
        <div className="mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-2">
            01 · Background & Education
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineering Rigor & Entrepreneurial Drive
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative Bio */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
            <p>
              I am an AI & Backend Engineer focused on closing the gap between cutting-edge LLM capabilities and resilient, low-latency production systems. As Co-founder of Infonix Cloud, I build autonomous customer agents, document pipelines, and scalable microservices that businesses rely on daily.
            </p>
            <p>
              My engineering philosophy centers on measurable impact over vanity demos: every model integration must improve throughput, reduce operational overhead, or eliminate customer friction. Whether orchestrating multi-agent tool loops or architecting distributed PostgreSQL databases with vector indexing, I prioritize deterministic reliability and clean API boundaries.
            </p>
            <p className="text-slate-400 text-base">
              Outside of building client infrastructure and training RAG pipelines, I actively grind algorithmic challenges (500+ LeetCode problems solved) and mentor aspiring student developers through collegiate hackathons and tech initiatives.
            </p>

            {/* Core Values / Focus Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                  <Cpu className="w-4 h-4 text-[#38BDF8]" />
                  <span>Agentic Systems & RAG</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Building deterministic tool-calling workflows, hybrid vector/BM25 retrieval, and hallucination guardrails.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                  <Compass className="w-4 h-4 text-[#38BDF8]" />
                  <span>Production Backends</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-throughput REST/GraphQL APIs, rate-limiting middlewares, Redis caching, and normalized schema design.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Education & Academic Credentials */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0E1217] border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-semibold mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>Degree Program</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {education.degree}
                  </h3>
                  <div className="text-sm text-slate-400 mt-0.5">
                    {education.institution}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-[#38BDF8] font-mono tabular-nums">
                    {education.grade}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {education.period}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Academic Milestones
                </div>
                {education.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Award className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                <span>Location: {personal.location}</span>
                <span className="text-[#38BDF8] font-medium">B.Tech Honors Track</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
