import React, { useState } from 'react';
import { Project } from '../data/portfolio.ts';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
  Cpu,
  Zap,
  Box,
  Linkedin,
  Terminal,
  Code2,
  Share2,
} from 'lucide-react';
import { ProjectPlanet3D } from './models/ProjectPlanet3D.tsx';
import { CopyButton } from './common/CopyButton.tsx';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'snippets'>('architecture');

  if (!project) return null;

  // Generate tailored architecture code snippet for each project
  const getArchitectureSnippet = (p: Project): { title: string; filename: string; code: string } => {
    if (p.id.includes('copilot') || p.id.includes('job')) {
      return {
        title: 'Autonomous Multi-Agent Matching Pipeline',
        filename: 'agents/copilot_pipeline.py',
        code: `# Autonomous Job Matching & Resume Tailoring Loop
from google import genai
from pgvector.psycopg2 import register_vector
import psycopg2

ai = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def match_and_tailor(candidate_profile: dict, job_postings: list):
    """Vector similarity retrieval with pgvector HNSW indexing"""
    embeddings = ai.models.generate_embeddings(
        model="text-embedding-004",
        contents=[candidate_profile["experience_summary"]]
    )
    # Match top candidates with cosine distance <= 0.18
    tailored_resume = ai.models.generate_content(
        model="gemini-3.8-flash",
        contents=f"Generate ATS resume matching {job_postings[0]['requirements']}"
    )
    return tailored_resume.text`,
      };
    }

    if (p.id.includes('chat') || p.id.includes('gemini')) {
      return {
        title: 'Sub-150ms SSE Streaming Chat Handler',
        filename: 'server/gemini_stream.ts',
        code: `// Low-latency multimodal streaming with Server-Sent Events
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function streamChatResponse(prompt: string, history: any[], res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const stream = await ai.models.generateContentStream({
    model: 'gemini-3.8-flash',
    contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
  });

  for await (const chunk of stream) {
    res.write(\`data: \${JSON.stringify({ text: chunk.text })}\\n\\n\`);
  }
  res.end();
}`,
      };
    }

    if (p.id.includes('village') || p.id.includes('neural-path')) {
      return {
        title: '60 FPS Procedural Runner Simulation Loop',
        filename: 'engine/neural_runner.ts',
        code: `// Frame-rate independent Three.js procedural loop
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

export function tick(clock: THREE.Clock, playerCraft: THREE.Group) {
  const delta = Math.min(clock.getDelta(), 0.1);
  // Exponential damping for silky smooth lane transitions
  playerCraft.position.x += (targetLaneX - playerCraft.position.x) * (1 - Math.exp(-12 * delta));
  renderer.render(scene, camera);
}`,
      };
    }

    if (p.id.includes('macroping')) {
      return {
        title: 'Multimodal Meal Macro & Split Analyzer',
        filename: 'api/multimodal_nutrition.ts',
        code: `// Multimodal meal parsing with instant calorie & macro breakdown
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMealImage(imageBase64: string, userDietaryGoals: object) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      { role: 'user', parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        { text: 'Analyze this meal. Output calories, protein, carbs, fats, and split compliance JSON.' }
      ]}
    ],
  });
  return JSON.parse(response.text);
}`,
      };
    }

    return {
      title: 'Full-Stack Architecture Specification',
      filename: 'src/config/architecture.ts',
      code: `// High-performance typed system configuration
export interface ServiceConfig {
  databaseUrl: string;
  cacheTtlMs: number;
  corsOrigins: string[];
}

export const appConfig: ServiceConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/app',
  cacheTtlMs: 8 * 60 * 1000,
  corsOrigins: ['https://sharad.dev', 'http://localhost:3000'],
};`,
    };
  };

  const devSnippet = getArchitectureSnippet(project);
  const gitCloneCmd = project.github.includes('github.com')
    ? `git clone ${project.github}.git`
    : `git clone https://github.com/absolutely-sharad/${project.id}.git`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#131519] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#818CF8] uppercase tracking-wider mb-1 font-mono">
              <span>{project.category}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Architectural Deep Dive</span>
            </div>
            <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-300 mt-1">
              {project.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Model Artifact Viewport */}
        <div className="relative w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-b from-black/60 to-black/30 border border-white/10 overflow-hidden my-5 flex items-center justify-center">
          <div className="absolute top-3 left-4 text-xs font-mono text-zinc-400 z-10 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span className="text-white font-semibold">3D Model Artifact</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] text-zinc-400">Interactive WebGL</span>
          </div>
          <ProjectPlanet3D
            projectId={project.id}
            category={project.category}
            accent={project.accent}
            className="w-full h-full"
          />
        </div>

        {/* Measurable Impact Highlight */}
        <div className="my-5 p-4 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#818CF8] uppercase tracking-wider mb-1 font-mono">
              <Zap className="w-4 h-4 text-[#14B8A6]" />
              <span>Measurable Outcome</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-white">
              {project.measurableResult}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton
              text={project.liveDemo}
              title="Copy Live Application URL"
              label="Copy Live URL"
              variant="badge"
            />
            <CopyButton
              text={project.github}
              title="Copy Repository URL"
              label="Copy Repo URL"
              variant="badge"
            />
          </div>
        </div>

        {/* View Switcher Tabs: Overview vs Code Snippets */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'snippets'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white bg-white/[0.04]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Code Snippets & Quickstart</span>
          </button>
        </div>

        {/* Tab 1: Architecture Breakdown */}
        {activeTab === 'architecture' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>The Problem</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-2 font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Engineering Solution</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.solution}
              </p>
            </div>

            {/* Tech Stack Breakdown */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  <Cpu className="w-4 h-4 text-[#818CF8]" />
                  <span>Technology Stack & Modules</span>
                </div>
                <CopyButton
                  text={project.stack.join(', ')}
                  title="Copy Tech Stack list"
                  label="Copy Stack"
                  variant="badge"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium text-zinc-200 bg-white/[0.06] border border-white/10 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Code Snippets & Developer Quickstart */}
        {activeTab === 'snippets' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Terminal Clone Command Snippet Box */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/60">
              <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Terminal className="w-3.5 h-3.5 text-[#14B8A6]" />
                  <span className="font-semibold text-white">Terminal Quickstart Clone</span>
                </div>
                <CopyButton
                  text={gitCloneCmd}
                  title="Copy git clone command"
                  label="Copy Command"
                  variant="badge"
                />
              </div>
              <div className="p-4 font-mono text-xs text-zinc-300 space-y-1">
                <div className="flex items-center gap-2 text-[#818CF8]">
                  <span className="text-zinc-600 select-none"># 1. Clone repository</span>
                </div>
                <div className="text-white bg-white/[0.03] p-2 rounded-lg border border-white/5 select-all">
                  <span className="text-[#6366F1] font-bold select-none mr-2">$</span>
                  {gitCloneCmd}
                </div>
                <div className="flex items-center gap-2 text-[#818CF8] pt-2">
                  <span className="text-zinc-600 select-none"># 2. Install dependencies & launch</span>
                </div>
                <div className="text-zinc-300 bg-white/[0.03] p-2 rounded-lg border border-white/5 select-all">
                  <span className="text-[#6366F1] font-bold select-none mr-2">$</span>
                  cd {project.id} && npm install && npm run dev
                </div>
              </div>
            </div>

            {/* Architectural Code Implementation Snippet */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/60">
              <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Code2 className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span className="font-semibold text-white">{devSnippet.title}</span>
                  <span className="text-zinc-500 text-[10px]">({devSnippet.filename})</span>
                </div>
                <CopyButton
                  text={devSnippet.code}
                  title={`Copy ${devSnippet.filename} code snippet`}
                  label="Copy Snippet"
                  variant="badge"
                />
              </div>
              <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed select-all">
                <code>{devSnippet.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Action Links & Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg transition-all shadow-sm"
              >
                <span>Live Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <CopyButton
                text={project.liveDemo}
                title="Copy Live Application URL"
                variant="icon"
                className="p-2 border border-white/10 bg-white/[0.05] rounded-lg"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 rounded-lg transition-all"
              >
                {project.github.includes('linkedin.com') ? (
                  <>
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>Company Profile</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </>
                )}
              </a>
              <CopyButton
                text={project.github}
                title="Copy Repository URL"
                variant="icon"
                className="p-2 border border-white/10 bg-white/[0.05] rounded-lg"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 transition-colors focus:outline-none"
          >
            Close (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
