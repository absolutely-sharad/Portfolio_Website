import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { Cpu, Server, Layout, Database, Wrench } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'AI & LLM Engineering': <Cpu className="w-4 h-4 text-[#38BDF8]" />,
  'Backend & Systems': <Server className="w-4 h-4 text-[#38BDF8]" />,
  'Frontend & 3D Web': <Layout className="w-4 h-4 text-[#38BDF8]" />,
  'Databases & Storage': <Database className="w-4 h-4 text-[#38BDF8]" />,
  'DevOps & Tooling': <Wrench className="w-4 h-4 text-[#38BDF8]" />,
};

export const SkillsSection: React.FC = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-2">
            04 · Technical Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Core Competencies & Stack
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Grouped by architectural discipline with zero vanity percentage bars.
          </p>
        </div>

        {/* 5-Column Grid or 2/3 Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((group) => (
            <div
              key={group.category}
              className="p-6 rounded-2xl bg-[#0E1217] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.06]">
                  {categoryIcons[group.category] || <Cpu className="w-4 h-4 text-[#38BDF8]" />}
                  <h3 className="text-base font-bold text-white">
                    {group.category}
                  </h3>
                </div>

                {/* Clean unboxed skill items (NO static pill enclosures) */}
                <ul className="space-y-2.5">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-xs sm:text-sm text-slate-300 flex items-center justify-between group/item"
                    >
                      <span className="group-hover/item:text-[#38BDF8] transition-colors font-medium">
                        {skill}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-[#38BDF8] transition-colors" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 font-mono">
                {group.items.length} Production Modules
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
