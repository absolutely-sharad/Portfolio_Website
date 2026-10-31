import React, { useMemo } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { GraduationCap, Award, Compass, Cpu, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateReadingTime } from '../utils/readingTime.ts';

export const AboutSection: React.FC = () => {
  const { personal, education } = portfolioData;

  const readingTime = useMemo(() => {
    const textPieces = [
      personal.bio,
      'I am an AI & Backend Engineer focused on closing the gap between cutting-edge LLM capabilities and resilient, low-latency production systems.',
      'As Co-founder of Infonix Cloud, I build autonomous customer agents, document pipelines, and scalable microservices that businesses rely on daily.',
      'My engineering philosophy centers on measurable impact over vanity demos: every model integration must improve throughput, reduce operational overhead, or eliminate customer friction.',
      'Whether orchestrating multi-agent tool loops or architecting distributed PostgreSQL databases with vector indexing, I prioritize deterministic reliability and clean API boundaries.',
      'Outside of building client infrastructure and training RAG pipelines, I actively grind algorithmic challenges (500+ LeetCode problems solved) and mentor aspiring student developers through collegiate hackathons and tech initiatives.',
      'Agentic Systems & RAG: Building deterministic tool-calling workflows, hybrid vector/BM25 retrieval, and hallucination guardrails.',
      'Production Backends: High-throughput REST/GraphQL APIs, rate-limiting middlewares, Redis caching, and normalized schema design.',
      education.degree,
      education.institution,
      education.period,
      education.grade,
      ...education.highlights,
      education.secondary ? `${education.secondary.qualification} ${education.secondary.institution} ${education.secondary.highlights}` : '',
    ];
    return calculateReadingTime(textPieces);
  }, [education, personal]);

  return (
    <section id="about" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with clean metadata & reading time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase">
              01 · Background & Education
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-slate-300 font-medium">{readingTime.text}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">{readingTime.words} words</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineering Rigor & Entrepreneurial Drive
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative Bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg"
          >
            <p>
              I am an AI & Backend Engineer focused on closing the gap between cutting-edge LLM capabilities and resilient, low-latency production systems. As Co-founder of Infonix Cloud, I build autonomous customer agents, document pipelines, and scalable microservices that businesses rely on daily.
            </p>
            <p>
              My engineering philosophy centers on measurable impact over vanity demos: every model integration must improve throughput, reduce operational overhead, or eliminate customer friction. Whether orchestrating multi-agent tool loops or architecting distributed PostgreSQL databases with vector indexing, I prioritize deterministic reliability and clean API boundaries.
            </p>
            <p className="text-slate-400 text-base">
              Outside of building client infrastructure and training RAG pipelines, I actively grind algorithmic challenges (500+ LeetCode problems solved on <span className="text-slate-300 font-mono">@sharadsingh0203</span>) and mentor aspiring student developers through collegiate hackathons and tech initiatives.
            </p>

            {/* Core Values / Focus Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[#38BDF8]/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                  <Cpu className="w-4 h-4 text-[#38BDF8]" />
                  <span>Agentic Systems & RAG</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Building deterministic tool-calling workflows, hybrid vector/BM25 retrieval, and hallucination guardrails.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[#38BDF8]/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
                  <Compass className="w-4 h-4 text-[#38BDF8]" />
                  <span>Production Backends</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-throughput REST/GraphQL APIs, rate-limiting middlewares, Redis caching, and normalized schema design.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Education & Academic Credentials */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Primary Degree Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0E1217] border border-white/[0.08] relative overflow-hidden shadow-xl shadow-black/40 hover:border-[#38BDF8]/30 transition-all">
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

              {/* Secondary School Foundation */}
              {education.secondary && (
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Foundation: {education.secondary.institution}</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {education.secondary.qualification} · {education.secondary.location}. {education.secondary.highlights}
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                <span>Location: {personal.location.split('(')[0].trim()}</span>
                <span className="text-[#38BDF8] font-medium">B.Tech Honors Track</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
