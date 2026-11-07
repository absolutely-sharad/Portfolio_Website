import React, { useMemo } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { Briefcase, TrendingUp, CheckCircle, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateReadingTime } from '../utils/readingTime.ts';
import { SectionAudioButton } from './SectionAudioButton.tsx';

export const ExperienceSection: React.FC = () => {
  const { experiences } = portfolioData;

  const readingTime = useMemo(() => {
    const textPieces: string[] = [];
    experiences.forEach((exp) => {
      textPieces.push(
        exp.role,
        exp.company,
        exp.location,
        ...exp.impactMetrics,
        ...exp.highlights,
        ...exp.technologies
      );
    });
    return calculateReadingTime(textPieces);
  }, [experiences]);

  return (
    <section id="experience" className="py-20 border-t border-zinc-200/80 dark:border-white/[0.08] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono">
              02 · Career & Industry Impact
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SectionAudioButton sectionId="experience" label="Listen to Summary" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">{readingTime.text}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500">{readingTime.words} words</span>
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Impact-Driven Engineering Experience
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
            Track record of shipping production AI workflows, high-reliability backends, and full-stack solutions.
          </p>
        </motion.div>

        {/* Timeline list */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-[2px] before:bg-zinc-200 dark:before:bg-white/[0.08]">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: idx * 0.12 }}
              className="relative pl-10 sm:pl-12 group"
            >
              {/* Timeline marker */}
              <div
                className={`absolute left-1.5 sm:left-2 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  exp.current
                    ? 'border-blue-600 dark:border-blue-500 bg-white dark:bg-[#0B0C0E]'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0B0C0E] group-hover:border-blue-500'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    exp.current ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-600 group-hover:bg-blue-500'
                  }`}
                />
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/30">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-base font-medium text-zinc-700 dark:text-zinc-300 mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-zinc-400 shrink-0" />
                      {exp.id === 'macroping' ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href="https://macroping.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>MacroPing</span>
                            <span className="text-[11px] font-mono text-zinc-500 font-normal">(macroping.vercel.app)</span>
                          </a>
                          <span aria-hidden="true" className="text-zinc-400">·</span>
                          <a
                            href="https://www.linkedin.com/company/144060088/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline decoration-zinc-400"
                          >
                            LinkedIn
                          </a>
                        </div>
                      ) : (
                        <span>{exp.company}</span>
                      )}
                    </div>
                  </div>

                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{exp.period}</span>
                    </div>
                    <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Key Impact Metrics Banner */}
                <div className="mb-5 p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.06]">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Quantifiable Results</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exp.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">›</span>
                        <span className="font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative Highlights */}
                <ul className="space-y-2 mb-5">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 flex items-start gap-2 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Technology Badges (Clean unboxed inline text with separators) */}
                <div className="pt-4 border-t border-zinc-200/80 dark:border-white/[0.06] flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-300">Stack:</span>
                  {exp.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">{tech}</span>
                      {tIdx < exp.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
