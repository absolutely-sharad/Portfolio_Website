import React, { useRef } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { X, Printer, Download, Check, Copy } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const { personal, education, experiences, projects, skills, achievements } = portfolioData;

  if (!isOpen) return null;

  const handlePrint = () => {
    // Print window for saving as PDF
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `
# ${personal.name}
**${personal.headline}**
Email: ${personal.email} | LinkedIn: ${personal.linkedin} | GitHub: ${personal.github} | Location: ${personal.location}

---

## EXECUTIVE SUMMARY
${personal.valueStatement}

---

## EDUCATION
**${education.degree}** — ${education.institution} (${education.period})
- CGPA: ${education.grade}
${education.highlights.map((h) => `- ${h}`).join('\n')}

---

## EXPERIENCE
${experiences
  .map(
    (e) => `### ${e.role} — ${e.company} (${e.period})
${e.highlights.map((h) => `- ${h}`).join('\n')}
*Technologies: ${e.technologies.join(', ')}*`
  )
  .join('\n\n')}

---

## KEY PROJECTS
${projects
  .map(
    (p) => `### ${p.title}
- Problem: ${p.problem}
- Solution: ${p.solution}
- Measurable Result: ${p.measurableResult}
- Stack: ${p.stack.join(', ')}
- Links: Demo (${p.liveDemo}) | GitHub (${p.github})`
  )
  .join('\n\n')}

---

## TECHNICAL SKILLS
${skills.map((s) => `- **${s.category}**: ${s.items.join(', ')}`).join('\n')}

---

## ACHIEVEMENTS
${achievements.map((a) => `- **${a.title}**: ${a.description} (${a.metric})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0E1217] border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
      >
        {/* Modal Header & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10 no-print">
          <div>
            <h2 id="resume-title" className="text-xl sm:text-2xl font-bold text-white">
              Official ATS Resume
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified 1-page ATS layout ready for export or immediate PDF printing
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied MD' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
              aria-label="Close resume dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ATS Clean Printable Document Canvas */}
        <div
          ref={printableRef}
          className="bg-white text-slate-900 p-6 sm:p-10 rounded-xl font-sans text-xs sm:text-sm leading-relaxed shadow-lg print:shadow-none print:p-0 print:m-0"
        >
          {/* Header */}
          <div className="text-center pb-4 mb-4 border-b border-slate-300">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {personal.name}
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {personal.headline}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 mt-2">
              <a href={`mailto:${personal.email}`} className="text-blue-700 hover:underline">
                {personal.email}
              </a>
              <span>·</span>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                linkedin.com/in/sharad0203
              </a>
              <span>·</span>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                github.com/absolutely-sharad
              </a>
              <span>·</span>
              <span>{personal.location}</span>
            </div>
          </div>

          {/* Education */}
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Education
            </h2>
            <div className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-bold text-slate-900">{education.institution}</span> — {education.degree}
              </div>
              <div className="font-semibold text-slate-700 font-mono">
                CGPA: {education.grade} | {education.period}
              </div>
            </div>
            <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-700 mt-1 space-y-0.5">
              {education.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>

          {/* Experience */}
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span> — {exp.company}
                    </div>
                    <div className="text-slate-600 font-mono text-[11px]">
                      {exp.period} | {exp.location}
                    </div>
                  </div>
                  <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-700 mt-1 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-slate-600 mt-1">
                    <span className="font-semibold">Technologies:</span> {exp.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Featured Engineering Projects
            </h2>
            <div className="space-y-2.5">
              {projects.slice(0, 4).map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {proj.stack.slice(0, 4).join(', ')}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5">
                    {proj.solution} <strong>Outcome:</strong> {proj.measurableResult}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Technical Competencies
            </h2>
            <div className="text-[11px] sm:text-xs space-y-1 text-slate-700">
              {skills.map((s) => (
                <div key={s.category}>
                  <strong className="text-slate-900">{s.category}:</strong> {s.items.join(', ')}
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Honors & Competitive Highlights
            </h2>
            <ul className="list-disc list-inside text-[11px] sm:text-xs text-slate-700 space-y-0.5">
              {achievements.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}:</strong> {a.description}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
