import React, { useState, useRef } from 'react';
import { portfolioData, Project } from '../data/portfolio.ts';
import { ExternalLink, Github, ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import { ProjectModal } from './ProjectModal.tsx';

interface TiltCardProps {
  project: Project;
  onSelect: (p: Project) => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ project, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
      transition: 'transform 0.08s ease-out',
    });

    setGlareStyle({
      opacity: 0.15,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(56,189,248,0.4), transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      transition: 'transform 0.4s ease-out',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 0.4s ease-out' });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={style}
      className="group relative cursor-pointer rounded-2xl bg-[#0E1217] border border-white/[0.08] hover:border-[#38BDF8]/40 p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
    >
      {/* Dynamic 3D interactive light glare */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity"
        style={glareStyle}
      />

      <div>
        {/* Top Header & Category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-[#38BDF8] tracking-wider uppercase">
            {project.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-white transition-colors">
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors mb-2">
          {project.title}
        </h3>

        {/* Tagline / Problem Summary */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {project.tagline}
        </p>

        {/* Measurable Impact Banner */}
        <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          <div className="text-[11px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">
            Verified Result:
          </div>
          <div className="font-semibold text-white">
            {project.measurableResult}
          </div>
        </div>
      </div>

      <div>
        {/* Stack list with bullet separators */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mb-4">
          {project.stack.slice(0, 4).map((tech, idx) => (
            <React.Fragment key={tech}>
              <span className="text-slate-300">{tech}</span>
              {idx < Math.min(project.stack.length, 4) - 1 && (
                <span aria-hidden="true" className="text-slate-600">·</span>
              )}
            </React.Fragment>
          ))}
          {project.stack.length > 4 && (
            <span className="text-slate-500 font-mono">+{project.stack.length - 4}</span>
          )}
        </div>

        {/* Links (Prevent card modal trigger when clicked directly) */}
        <div className="flex items-center gap-3 pt-2">
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:text-[#7dd3fc] transition-colors"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-3 h-3" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioData;
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['all', 'AI / LLM', 'Full-Stack', '3D / Game'];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-2">
              03 · Featured Engineering
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Production AI & Systems Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Engineered with focus on autonomous agent loops, vector search, low-latency execution, and measurable outcomes.
            </p>
          </div>

          {/* Interactive filter segmented control (functional buttons, not static pills) */}
          <div className="flex items-center gap-1 p-1 bg-[#0E1217] border border-white/10 rounded-xl shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${
                  filter === cat
                    ? 'bg-[#38BDF8] text-[#08090C] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Interactive Project Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        {/* Architectural deep dive modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
