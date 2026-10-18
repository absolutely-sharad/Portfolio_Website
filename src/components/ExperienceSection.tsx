import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { Briefcase, TrendingUp, CheckCircle, Calendar, MapPin } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experiences } = portfolioData;

  return (
    <section id="experience" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-2">
            02 · Career & Industry Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Impact-Driven Engineering Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Track record of shipping production AI workflows, high-reliability backends, and full-stack solutions.
          </p>
        </div>

        {/* Timeline list */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-[2px] before:bg-white/[0.08]">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-10 sm:pl-12 group">
              {/* Timeline marker */}
              <div
                className={`absolute left-1.5 sm:left-2 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  exp.current
                    ? 'border-[#38BDF8] bg-[#08090C]'
                    : 'border-slate-600 bg-[#08090C] group-hover:border-[#38BDF8]'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    exp.current ? 'bg-[#38BDF8]' : 'bg-slate-500 group-hover:bg-[#38BDF8]'
                  }`}
                />
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0E1217] border border-white/[0.08] hover:border-[#38BDF8]/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="text-[11px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-base font-medium text-slate-300 mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{exp.period}</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Key Impact Metrics Banner */}
                <div className="mb-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Quantifiable Results</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exp.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-[#38BDF8] font-bold">›</span>
                        <span className="font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative Highlights */}
                <ul className="space-y-2 mb-5">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Technology Badges (Clean unboxed inline text with separators) */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Stack:</span>
                  {exp.technologies.map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span className="text-slate-300 hover:text-white transition-colors">{tech}</span>
                      {tIdx < exp.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
