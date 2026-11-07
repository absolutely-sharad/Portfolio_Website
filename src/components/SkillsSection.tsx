import React from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { Cpu, Server, Layout, Database, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionAudioButton } from './SectionAudioButton.tsx';

const categoryIcons: Record<string, React.ReactNode> = {
  'AI & LLM Engineering': <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  'Backend & Systems': <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  'Frontend & 3D Web': <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  'Databases & Storage': <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  'DevOps & Tooling': <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
};

export const SkillsSection: React.FC = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="py-20 border-t border-zinc-200/80 dark:border-white/[0.08] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono">
              04 · Technical Stack
            </div>
            <SectionAudioButton sectionId="skills" label="Listen to Summary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Core Competencies & Stack
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
            Grouped by architectural discipline with zero vanity percentage bars.
          </p>
        </motion.div>

        {/* 5-Column Grid or 2/3 Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((group, idx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-zinc-200/60 dark:border-white/[0.06]">
                  {categoryIcons[group.category] || <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {group.category}
                  </h3>
                </div>

                {/* Clean unboxed skill items (NO static pill enclosures) */}
                <ul className="space-y-2.5">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 flex items-center justify-between group/item"
                    >
                      <span className="group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors font-medium">
                        {skill}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-white/20 group-hover/item:bg-blue-500 transition-colors" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-white/[0.04] text-[11px] text-zinc-400 font-mono">
                {group.items.length} Production Modules
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
