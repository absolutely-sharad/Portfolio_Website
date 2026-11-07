import React, { useState, useMemo } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import {
  Trophy,
  Award,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Code2,
  GitBranch,
  Github,
  Star,
  Cpu,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.tsx';
import { SectionAudioButton } from './SectionAudioButton.tsx';

export type AchievementBadgeFilter = 'all' | 'Certifications' | 'Awards' | 'Technical Milestones';
export type BadgeCategoryFilter = 'Certifications' | 'Awards' | 'Technical Milestones';

interface BadgeDefinition {
  id: string;
  title: string;
  issuer: string;
  category: string;
  filterType: BadgeCategoryFilter;
  metric: string;
  credentialId: string;
  date: string;
  accent: string;
  secondaryAccent: string;
  description: string;
  skillsValidated: string[];
  verificationUrl?: string;
  svgBadge: React.ReactNode;
}

export const AchievementsSection: React.FC = () => {
  const { githubStats } = portfolioData;
  const { isLight } = useTheme();
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [activeFilter, setActiveFilter] = useState<AchievementBadgeFilter>('all');

  // Generate 42 weeks of GitHub contribution matrix
  const contributionGrid = useMemo(() => {
    const weeks = 42;
    const daysPerWeek = 7;
    const grid: number[][] = [];
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const r = random();
        let level = 0;
        if (r > 0.35) level = 1;
        if (r > 0.65) level = 2;
        if (r > 0.85) level = 3;
        if (r > 0.95) level = 4;
        week.push(level);
      }
      grid.push(week);
    }
    return grid;
  }, []);

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 1:
        return isLight ? 'bg-blue-200' : 'bg-blue-500/25';
      case 2:
        return isLight ? 'bg-blue-300' : 'bg-blue-500/50';
      case 3:
        return isLight ? 'bg-blue-500' : 'bg-blue-500/75';
      case 4:
        return isLight ? 'bg-blue-600' : 'bg-blue-500';
      default:
        return isLight ? 'bg-zinc-200' : 'bg-white/[0.04]';
    }
  };

  // 6 Dynamic SVG Badges for Certifications & Technical Accomplishments
  const badges: BadgeDefinition[] = [
    {
      id: 'genai-specialist',
      title: 'Generative AI & LLM Systems',
      issuer: 'Gemini API & Autonomous Agents',
      category: 'AI Engineering',
      filterType: 'Certifications',
      metric: 'Gemini 2.5 & LangChain',
      credentialId: 'GENAI-2026-AUTONOMOUS',
      date: '2026 · Active',
      accent: '#38BDF8',
      secondaryAccent: '#818CF8',
      description:
        'Architected autonomous agent workflows, Server-Sent Events token streaming, multimodal document grounding, and pgvector embeddings for enterprise pipelines.',
      skillsValidated: [
        'Gemini API / @google/genai',
        'Autonomous Agents',
        'RAG Vector Retrieval',
        'Tool Calling & Function Calling',
        'Hallucination Guardrails',
      ],
      verificationUrl: 'https://github.com/absolutely-sharad/Ai_Job-Hunt_Copilot',
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
            <filter id="aiFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#aiGlow)" />
          {/* Animated Outer Orbit Ring */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <circle cx="50" cy="50" r="44" stroke="url(#aiGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="50" cy="6" r="2.5" fill="#38BDF8" />
            <circle cx="50" cy="94" r="2.5" fill="#C084FC" />
          </motion.g>
          {/* Octagonal Cyber Shield Base */}
          <polygon
            points="50,12 82,24 90,56 72,86 50,92 28,86 10,56 18,24"
            fill="#0B101B"
            stroke="url(#aiGrad)"
            strokeWidth="2.5"
            filter="url(#aiFilter)"
          />
          {/* Inner Facet Lines */}
          <polygon
            points="50,20 74,30 80,54 66,78 50,83 34,78 20,54 26,30"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
          {/* Neural Core Star / Synapse */}
          <motion.path
            d="M50 26L55 42L71 42L58 52L63 68L50 58L37 68L42 52L29 42L45 42Z"
            fill="url(#aiGrad)"
            filter="url(#aiFilter)"
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '50px 50px' }}
          />
          {/* Center Synaptic Node */}
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="2" fill="#38BDF8" />
        </svg>
      ),
    },
    {
      id: 'leetcode-500',
      title: '500+ LeetCode Algorithms Mastery',
      issuer: 'Data Structures & Algorithmic Rigor',
      category: 'Competitive Programming',
      filterType: 'Technical Milestones',
      metric: '500+ Solved',
      credentialId: 'LC-SHARADSINGH0203',
      date: '2026 · Verified',
      accent: '#F59E0B',
      secondaryAccent: '#F97316',
      description:
        'Demonstrated elite mastery in Graphs, Dynamic Programming, Trees, Heaps, and Backtracking under competitive time constraints (@sharadsingh0203).',
      skillsValidated: [
        'Data Structures & Algorithms',
        'Dynamic Programming',
        'Graph Theory & BFS/DFS',
        'Space & Time Complexity Optimization',
        'Binary Search & Two Pointers',
      ],
      verificationUrl: 'https://leetcode.com/sharadsingh0203/',
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <radialGradient id="lcGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#lcGlow)" />
          {/* Rotating Algorithmic Ticks */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <circle cx="50" cy="50" r="43" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 7" opacity="0.6" />
            <polygon points="50,7 53,11 47,11" fill="#FBBF24" />
            <polygon points="50,93 53,89 47,89" fill="#EA580C" />
          </motion.g>
          {/* Hexagonal Armor Shield */}
          <polygon
            points="50,14 84,32 84,68 50,86 16,68 16,32"
            fill="#120F09"
            stroke="url(#lcGrad)"
            strokeWidth="2.5"
          />
          {/* Binary Tree & Node Path SVG */}
          <path d="M50 30V44M50 44L34 56M50 44L66 56M34 56V66M66 56V66" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="30" r="4.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="34" cy="56" r="3.5" fill="#F59E0B" />
          <circle cx="66" cy="56" r="3.5" fill="#F59E0B" />
          <circle cx="34" cy="66" r="3" fill="#EA580C" />
          <circle cx="66" cy="66" r="3" fill="#EA580C" />
          <circle cx="50" cy="30" r="1.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: 'codechef-1467',
      title: 'CodeChef Starters Global Rank 1467',
      issuer: 'CodeChef Global Division',
      category: 'Competitive Programming',
      filterType: 'Technical Milestones',
      metric: 'Rank 1467 Global',
      credentialId: 'CC-STARTERS-123',
      date: 'Starters 123',
      accent: '#A855F7',
      secondaryAccent: '#C084FC',
      description:
        'Secured rank 1467 globally in timed algorithmic problem solving, tackling high-difficulty optimization questions under strict runtime constraints.',
      skillsValidated: [
        'Time-Constrained Coding',
        'Mathematical Modeling',
        'Greedy Algorithms',
        'Combinatorics & Number Theory',
      ],
      verificationUrl: 'https://codechef.com',
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ccGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <radialGradient id="ccGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#ccGlow)" />
          {/* Dual Counter-rotating Star Ring */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <circle cx="50" cy="50" r="43" stroke="url(#ccGrad)" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
          </motion.g>
          {/* Crest Shield */}
          <path
            d="M50 14L82 25V55C82 72 68 83 50 88C32 83 18 72 18 55V25L50 14Z"
            fill="#100A1A"
            stroke="url(#ccGrad)"
            strokeWidth="2.5"
          />
          {/* Star with Laurel Crest */}
          <motion.path
            d="M50 28L54.5 39.5L67 40.5L57.5 49L60.5 61L50 54.5L39.5 61L42.5 49L33 40.5L45.5 39.5Z"
            fill="url(#ccGrad)"
            animate={{ scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '50px 50px' }}
          />
          {/* Radiant Center Dot */}
          <circle cx="50" cy="48" r="3" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: 'fcpl-runnerup',
      title: 'FCPL Hackathon Runner-Up',
      issuer: 'Futuristic Coding & Programming League',
      category: 'Hackathon Award',
      filterType: 'Awards',
      metric: 'Runner-Up Podium',
      credentialId: 'FCPL-RUNNER-UP',
      date: 'Season Finalist',
      accent: '#10B981',
      secondaryAccent: '#34D399',
      description:
        'Secured 2nd place in FCPL collegiate hackathon among hundreds of developers, building and pitching a functioning end-to-end full-stack software prototype in 36 hours.',
      skillsValidated: [
        'Rapid MVP Architecture',
        'End-to-End System Integration',
        'High-Pressure Team Delivery',
        'Product Strategy & Technical Pitch',
      ],
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fcplGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <radialGradient id="fcplGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#fcplGlow)" />
          {/* Trophy Crest Shield */}
          <path
            d="M22 22H78V52C78 68 66 80 50 86C34 80 22 68 22 52V22Z"
            fill="#081410"
            stroke="url(#fcplGrad)"
            strokeWidth="2.5"
          />
          {/* Laurel Leaves left & right */}
          <path d="M28 40C26 48 30 56 36 60" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <path d="M72 40C74 48 70 56 64 60" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          {/* Trophy Cup */}
          <path d="M38 32H62V46C62 53 57 58 50 58C43 58 38 53 38 46V32Z" fill="url(#fcplGrad)" />
          <path d="M38 36H34C32 36 31 38 31 40C31 44 34 46 38 46" stroke="#34D399" strokeWidth="2" />
          <path d="M62 36H66C68 36 69 38 69 40C69 44 66 46 62 46" stroke="#34D399" strokeWidth="2" />
          <path d="M47 58V66H53V58" stroke="url(#fcplGrad)" strokeWidth="2.5" />
          <rect x="42" y="66" width="16" height="4" rx="1.5" fill="url(#fcplGrad)" />
          <circle cx="50" cy="42" r="2.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: 'academics-polaris',
      title: 'B.Tech CSE Academic Honors',
      issuer: 'Polaris School of Technology (Starex Univ)',
      category: 'Academic Distinction',
      filterType: 'Awards',
      metric: '9.50 (6th Sem) · 9.17 CGPA',
      credentialId: 'PST-CSE-HONORS-950-917',
      date: '2023–2027',
      accent: '#EAB308',
      secondaryAccent: '#FACC15',
      description:
        'Scored a stellar 9.50 CGPA in 6th semester and ranked in the top 1% across Computer Science & Engineering semesters at Polaris School of Technology (9.17 cumulative GPA).',
      skillsValidated: [
        'Computer Science Foundations',
        'Operating Systems & Memory Mgmt',
        'Database Management Systems (DBMS)',
        'Object-Oriented Programming (OOP)',
        'System Architecture',
      ],
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="acadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <radialGradient id="acadGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EAB308" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#acadGlow)" />
          {/* Medallion Ribbon Tails */}
          <polygon points="40,78 40,94 48,88 56,94 56,78" fill="#A16207" />
          <polygon points="44,78 44,92 50,86 56,92 56,78" fill="#CA8A04" />
          {/* Circular Honor Crest */}
          <circle cx="50" cy="46" r="32" fill="#151206" stroke="url(#acadGrad)" strokeWidth="3" />
          <circle cx="50" cy="46" r="26" stroke="#FDE047" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          {/* Mortarboard / Academic Laurel Icon */}
          <polygon points="50,30 68,38 50,46 32,38" fill="url(#acadGrad)" />
          <path d="M40 44V54C40 57 45 60 50 60C55 60 60 57 60 54V44" stroke="#FACC15" strokeWidth="2" fill="none" />
          <path d="M68 38V50" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <circle cx="68" cy="51" r="2" fill="#FDE047" />
          <circle cx="50" cy="38" r="2" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: 'systems-backend',
      title: 'High-Throughput Backend Architecture',
      issuer: 'Distributed Systems & Cloud Infrastructure',
      category: 'Systems Engineering',
      filterType: 'Certifications',
      metric: 'Sub-150ms P99 Latency',
      credentialId: 'SYS-DIST-NODE-PY',
      date: '2026 · Production',
      accent: '#06B6D4',
      secondaryAccent: '#3B82F6',
      description:
        'Engineered high-concurrency microservices with FastAPI, Node.js, PostgreSQL (pgvector), Docker, and Upstash Redis handling hundreds of automated workflows with zero downtime.',
      skillsValidated: [
        'High-Throughput Node.js & Python',
        'PostgreSQL & pgvector Optimization',
        'Redis Caching & Asynchronous Queues',
        'Docker & CI/CD Pipelines',
        'RESTful & GraphQL Architectures',
      ],
      svgBadge: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sysGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <radialGradient id="sysGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#08090C" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#sysGlow)" />
          {/* Cyber Server Octagon */}
          <polygon
            points="50,12 84,26 84,74 50,88 16,74 16,26"
            fill="#09141B"
            stroke="url(#sysGrad)"
            strokeWidth="2.5"
          />
          {/* Server Rack Rungs */}
          <rect x="30" y="28" width="40" height="9" rx="2" fill="#0C2533" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="36" cy="32.5" r="1.5" fill="#34D399" />
          <circle cx="42" cy="32.5" r="1.5" fill="#38BDF8" />
          <line x1="50" y1="32.5" x2="64" y2="32.5" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />

          <rect x="30" y="42" width="40" height="9" rx="2" fill="#0C2533" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="36" cy="46.5" r="1.5" fill="#34D399" />
          <circle cx="42" cy="46.5" r="1.5" fill="#38BDF8" />
          <line x1="50" y1="46.5" x2="64" y2="46.5" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />

          <rect x="30" y="56" width="40" height="9" rx="2" fill="#0C2533" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="36" cy="60.5" r="1.5" fill="#34D399" />
          <circle cx="42" cy="60.5" r="1.5" fill="#38BDF8" />
          <line x1="50" y1="60.5" x2="64" y2="60.5" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Central Animated Signal Conduit */}
          <motion.circle
            cx="50"
            cy="72"
            r="3"
            fill="#38BDF8"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      ),
    },
  ];

  const filteredBadges = useMemo(() => {
    if (activeFilter === 'all') return badges;
    return badges.filter((b) => b.filterType === activeFilter);
  }, [activeFilter, badges]);

  const filterTabs: { id: AchievementBadgeFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Badges', icon: Sparkles },
    { id: 'Certifications', label: 'Certifications', icon: ShieldCheck },
    { id: 'Awards', label: 'Awards', icon: Trophy },
    { id: 'Technical Milestones', label: 'Technical Milestones', icon: Code2 },
  ];

  return (
    <section id="achievements" className="py-20 border-t border-zinc-200/80 dark:border-white/[0.08] relative z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>05 · Verified Accomplishments & Certifications</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Engineering Credentials & Badges
              </h2>
              <p className="text-sm sm:text-base mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
                Cryptographically verifiable milestones, competitive algorithmic percentiles, and academic honors. Click any badge to inspect credentials.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
              <SectionAudioButton sectionId="achievements" label="Listen to Summary" />
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-500/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>6 Verified Badges</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Badge Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          {/* Filter Pills with Count Indicators */}
          <div
            className="p-1 rounded-xl flex flex-wrap items-center gap-1 border bg-zinc-100 dark:bg-[#131519] border-zinc-200 dark:border-white/10"
            role="tablist"
            aria-label="Filter credentials by category"
          >
            {filterTabs.map((tab) => {
              const count =
                tab.id === 'all'
                  ? badges.length
                  : badges.filter((b) => b.filterType === tab.id).length;
              const isActive = activeFilter === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/10 text-current'
                        : 'bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Counter Summary */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span>
              Showing <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredBadges.length}</span> of{' '}
              <span className="text-zinc-900 dark:text-white font-medium">{badges.length}</span> verified credentials
            </span>
          </div>
        </motion.div>

        {/* Dynamic SVG Badges Grid (Filtered with Animated Transitions) */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredBadges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedBadge(badge)}
                className="cursor-pointer group relative p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-sm overflow-hidden bg-white dark:bg-[#131519] border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                {/* Subtle Ambient Radial Highlight on Hover */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundColor: badge.accent }}
                />

                <div>
                  {/* Header: Category, Filter Tag and Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        {badge.category}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20">
                        {badge.filterType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Dynamic SVG Badge Hero Showcase */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:scale-105 transition-transform duration-300">
                      {badge.svgBadge}
                    </div>
                    <div>
                      <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight group-hover:text-[#38BDF8] transition-colors ${
                        isLight ? 'text-[#181A1D]' : 'text-white'
                      }`}>
                        {badge.metric}
                      </div>
                      <div className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {badge.issuer}
                      </div>
                    </div>
                  </div>

                  {/* Badge Title & Short Description */}
                  <h3 className={`text-base font-bold mb-2 group-hover:text-[#38BDF8] transition-colors ${
                    isLight ? 'text-[#181A1D]' : 'text-white'
                  }`}>
                    {badge.title}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 mb-4 ${
                    isLight ? 'text-[#4B5563]' : 'text-slate-400'
                  }`}>
                    {badge.description}
                  </p>
                </div>

                {/* Footer: Credential ID + Inspect Action */}
                <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isLight ? 'border-[#E5E1D8] text-[#4B5563]' : 'border-white/[0.06] text-slate-400'
                }`}>
                  <span className="text-[10px] text-slate-500">{badge.credentialId}</span>
                  <span className="text-xs font-semibold text-[#38BDF8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Live GitHub Engineering Contribution Heatmap Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08] shadow-xl shadow-black/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>GitHub Continuous Engineering Activity</span>
                  <span className="text-xs text-slate-400 font-mono font-normal">
                    @{githubStats.username}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Consistent open-source commits and algorithm repository updates
                </div>
              </div>
            </div>

            {/* GitHub Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{githubStats.totalRepos} Repos</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{githubStats.totalStars} Stars</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{githubStats.contributionDays} Days Active</span>
              </div>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-[650px] justify-between">
              {contributionGrid.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((level, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-2.5 h-2.5 rounded-sm transition-colors ${getHeatmapColor(level)}`}
                      title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${level > 0 ? `${level * 2} commits` : 'No commits'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
            <a
              href={`https://github.com/${githubStats.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-[#7dd3fc] transition-colors"
            >
              <span>Explore GitHub profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Less</span>
              <div className="flex gap-1">
                <span className={`w-2.5 h-2.5 rounded-sm ${isLight ? 'bg-slate-200' : 'bg-white/[0.04]'}`} />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/25" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/50" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/75" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              </div>
              <span className="text-[11px]">More</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badge Credential Inspection Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-lg w-full rounded-2xl bg-[#0E141F] border border-white/15 p-6 sm:p-7 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 shrink-0 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                  {selectedBadge.svgBadge}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Credential</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedBadge.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    {selectedBadge.issuer} · {selectedBadge.date}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                {selectedBadge.description}
              </p>

              {/* Skills Validated */}
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  Competencies & Skills Validated:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBadge.skillsValidated.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Details */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono">CREDENTIAL IDENTIFIER</span>
                  <span className="font-mono text-slate-300 font-semibold">{selectedBadge.credentialId}</span>
                </div>
                {selectedBadge.verificationUrl && (
                  <a
                    href={selectedBadge.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#38BDF8] text-[#08090C] font-bold text-xs hover:bg-[#7dd3fc] transition-colors shadow-sm"
                  >
                    <span>View Evidence</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
