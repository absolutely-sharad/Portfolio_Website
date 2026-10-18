import React from 'react';
import { Project } from '../data/portfolio.ts';
import { X, ExternalLink, Github, CheckCircle, AlertCircle, Cpu, Zap } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0E1217] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-1">
              <span>{project.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Architectural Deep Dive</span>
            </div>
            <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {project.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measurable Impact Highlight */}
        <div className="my-6 p-4 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30">
          <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Measurable Outcome</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            {project.measurableResult}
          </div>
        </div>

        {/* Problem & Solution Breakdown */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>The Problem</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Engineering Solution</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* Tech Stack Breakdown */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span>Technology Stack & Modules</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-medium text-slate-200 bg-white/[0.06] border border-white/10 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] rounded-lg transition-all"
            >
              <span>Live Application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-lg transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View Source Code</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-2"
          >
            Close Overview (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
