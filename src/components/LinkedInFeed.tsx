import React, { useState } from 'react';
import {
  Linkedin,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.tsx';

interface LinkedInPost {
  id: string;
  category: 'ai' | 'hackathon' | 'algorithms' | 'academic';
  timestamp: string;
  relativeTime: string;
  content: string;
  highlights?: string[];
  tags: string[];
  metrics: {
    reactions: number;
    comments: number;
    shares: number;
  };
  link: string;
}

const POSTS: LinkedInPost[] = [
  {
    id: 'post-macroping-launch',
    category: 'ai',
    timestamp: 'Nov 2026',
    relativeTime: 'Just now · 🌐',
    content:
      'Excited to officially unveil MacroPing! 🥗⚡ (https://macroping.vercel.app/)\n\nWe built MacroPing to solve one of the biggest bottlenecks in fitness: tedious calorie counting and disconnected coach-client communication.\n\nWith MacroPing, gym-goers can track any meal simply by typing or snapping a photo—our multimodal AI vision pipelines extract accurate calories and macronutrient breakdowns in real time. For fitness coaches, a unified command center makes managing client workout splits and weekly nutrition compliance effortless.\n\nCheck out the company page on LinkedIn: https://www.linkedin.com/company/144060088/',
    highlights: [
      'Multimodal AI text & photo food recognition',
      'Instant calorie & macronutrient estimation',
      'Unified coach dashboard for client workout splits & nutrition compliance',
      'Free to start at macroping.vercel.app',
    ],
    tags: ['#MacroPing', '#Startup', '#AIVision', '#FitnessTech', '#NutritionAI', '#Nextjs', '#PostgreSQL'],
    metrics: {
      reactions: 284,
      comments: 53,
      shares: 38,
    },
    link: 'https://macroping.vercel.app/',
  },
  {
    id: 'post-infonix-ai',
    category: 'ai',
    timestamp: 'Oct 2026',
    relativeTime: '3d · Edited · 🌐',
    content:
      'Excited to share the architecture behind our autonomous customer support and lead qualification agent at Infonix Cloud! 🚀\n\nBy coupling Gemini 2.5 with structured function calling, pgvector semantic search, and Server-Sent Events (SSE) streaming, we slashed response latency by ~30% for 60+ active business clients.\n\nThe key breakthrough? Moving away from brittle prompt templates to deterministic tool execution loops with automated hallucination guardrails.',
    highlights: [
      'Sub-150ms time-to-first-token streaming',
      'Automated fallback routing for edge cases',
      'Production deployment across 60+ business clients',
    ],
    tags: ['#AIEngineering', '#GeminiAPI', '#AutonomousAgents', '#FastAPI', '#SystemDesign'],
    metrics: {
      reactions: 148,
      comments: 32,
      shares: 16,
    },
    link: 'https://www.linkedin.com/in/sharad0203/',
  },
  {
    id: 'post-fcpl-runnerup',
    category: 'hackathon',
    timestamp: 'Sep 2026',
    relativeTime: '2w · 🌐',
    content:
      'Honored to share that our team secured Runner-Up at the Futuristic Coding & Programming League (FCPL) hackathon! 🥈\n\nIn just 36 continuous hours of engineering, we architected and deployed a multi-tenant operational intelligence platform capable of ingesting high-throughput webhook streams without dropped frames.\n\nGrateful to my teammates and the judges for challenging our system design under intense concurrency pressure!',
    highlights: [
      'Built & pitched end-to-end full-stack prototype in 36 hours',
      'Ranked 2nd among hundreds of collegiate engineers',
      'Optimized with WebSockets and Redis queuing',
    ],
    tags: ['#Hackathon', '#FCPL', '#SystemArchitecture', '#FullStack', '#EngineeringRigor'],
    metrics: {
      reactions: 224,
      comments: 48,
      shares: 21,
    },
    link: 'https://www.linkedin.com/in/sharad0203/',
  },
  {
    id: 'post-leetcode-500',
    category: 'algorithms',
    timestamp: 'Aug 2026',
    relativeTime: '1mo · 🌐',
    content:
      'Milestone unlocked: Solved 500+ algorithmic problems on LeetCode! 🧠💻\n\nOver the past year, daily practice across Dynamic Programming, Graph Theory (Dijkstra, Topological Sort), and Segment Trees has profoundly changed how I write production code.\n\nAlgorithmic discipline is not just about passing interviews—it teaches you to spot memory leaks, cache thrashing, and suboptimal O(N²) bottlenecks before code ever touches staging.',
    highlights: [
      '500+ problems solved on @sharadsingh0203',
      'Specialized in Dynamic Programming & Graph Theory',
      'Global Rank 1467 in CodeChef Starters 123',
    ],
    tags: ['#LeetCode', '#DataStructures', '#Algorithms', '#CompetitiveCoding', '#SoftwareEngineering'],
    metrics: {
      reactions: 196,
      comments: 39,
      shares: 14,
    },
    link: 'https://www.linkedin.com/in/sharad0203/',
  },
  {
    id: 'post-polaris-honors',
    category: 'academic',
    timestamp: 'Jul 2026',
    relativeTime: '2mo · 🌐',
    content:
      'Ecstatic to share that I scored a 9.50 CGPA in my 6th semester at Polaris School of Technology (Starex University), maintaining a 9.17 cumulative CGPA across all engineering semesters! 🎓✨\n\nBalancing founding MacroPing, building AI infrastructure at Infonix Cloud, and deep-diving into distributed systems and compiler design has been an exhilarating journey. Huge thanks to faculty and peers!',
    highlights: [
      'Scored 9.50 CGPA in 6th semester (Departmental Top Rank in CSE)',
      '9.17 cumulative CGPA across all semesters',
      'Organized Polaris Innov-a-thon across 150+ high schools',
    ],
    tags: ['#PolarisSchoolOfTechnology', '#AcademicHonors', '#ComputerScience', '#Leadership', '#BTechCSE', '#CGPA'],
    metrics: {
      reactions: 342,
      comments: 71,
      shares: 34,
    },
    link: 'https://www.linkedin.com/in/sharad0203/',
  },
];

type CategoryFilter = 'all' | 'ai' | 'hackathon' | 'algorithms' | 'academic';

export const LinkedInFeed: React.FC = () => {
  const { isLight } = useTheme();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts =
    activeFilter === 'all'
      ? POSTS
      : POSTS.filter((post) => post.category === activeFilter);

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCopyLink = (post: LinkedInPost) => {
    navigator.clipboard.writeText(`https://www.linkedin.com/in/sharad0203/`);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-14 pt-12 border-t border-white/[0.08]">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#0A66C2] uppercase mb-1">
            <Linkedin className="w-4 h-4 fill-current" />
            <span>Professional Network & Thought Leadership</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Recent LinkedIn Activity & Insights
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Live technical updates, architecture decisions, and hackathon milestones shared directly with 1,200+ industry peers.
          </p>
        </div>

        {/* Profile Connect Button */}
        <a
          href="https://www.linkedin.com/in/sharad0203/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg shadow-[#0A66C2]/20 self-start sm:self-auto shrink-0"
        >
          <Linkedin className="w-4 h-4 fill-current" />
          <span>Connect on LinkedIn</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'ai', label: 'AI & Agents' },
          { id: 'hackathon', label: 'Hackathons' },
          { id: 'algorithms', label: 'Algorithms' },
          { id: 'academic', label: 'Academic Honors' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as CategoryFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-[#0A66C2] text-white shadow-sm'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const reactionCount = post.metrics.reactions + (isLiked ? 1 : 0);

            return (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-md ${
                  isLight
                    ? 'bg-white border-zinc-200 shadow-sm hover:border-zinc-300'
                    : 'bg-[#131519] border-white/[0.08] hover:border-[#0A66C2]/40 shadow-sm'
                }`}
              >
                <div>
                  {/* LinkedIn Member Author Lockup */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with live pulse badge */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0A66C2] to-blue-500 p-0.5 shadow-sm">
                          <div
                            className={`w-full h-full rounded-full flex items-center justify-center font-bold text-xs ${
                              isLight ? 'bg-white text-[#0A66C2]' : 'bg-[#111317] text-white'
                            }`}
                          >
                            SK
                          </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[9px] shadow-sm">
                          <Linkedin className="w-2.5 h-2.5 fill-current" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                            Sharad Singh Kushwaha
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">· 1st</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          AI & Backend Engineer · Co-founder @ Infonix Cloud
                        </p>
                        <span className="text-[10px] text-zinc-500 font-mono">{post.relativeTime}</span>
                      </div>
                    </div>

                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-[#0A66C2] p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                      title="Open on LinkedIn"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Post Content */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-4 ${
                      isLight ? 'text-zinc-700' : 'text-zinc-300'
                    }`}
                  >
                    {post.content}
                  </p>

                  {/* Highlights Pillbox */}
                  {post.highlights && post.highlights.length > 0 && (
                    <div
                      className={`p-3 rounded-xl mb-4 text-xs space-y-1.5 border ${
                        isLight
                          ? 'bg-zinc-50 border-zinc-200 text-zinc-700'
                          : 'bg-white/[0.03] border-white/[0.06] text-zinc-300'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                        Key Engineering Highlights:
                      </div>
                      {post.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A66C2] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[11px] font-medium ${
                          isLight ? 'text-blue-700' : 'text-blue-400'
                        } hover:underline cursor-pointer`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Reactions & Interactive Action Buttons */}
                <div>
                  <div
                    className={`pt-3 border-t flex items-center justify-between text-[11px] text-slate-400 mb-3 ${
                      isLight ? 'border-slate-100' : 'border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[8px]">
                          👍
                        </span>
                        <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">
                          ❤️
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px]">
                          💡
                        </span>
                      </div>
                      <span>{reactionCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{post.metrics.comments} comments</span>
                      <span>·</span>
                      <span>{post.metrics.shares} reposts</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div
                    className={`grid grid-cols-3 gap-1 pt-2 border-t ${
                      isLight ? 'border-slate-100' : 'border-white/[0.06]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isLiked
                          ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                          : isLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(post)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                      title="Copy profile link"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Embedded Feed Live Connect Banner */}
      <div
        className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-600'
            : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
            <Linkedin className="w-4 h-4 fill-current" />
          </div>
          <span>
            Looking for real-time recommendations, endorsements, and direct messaging?
          </span>
        </div>
        <a
          href="https://www.linkedin.com/in/sharad0203/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#0A66C2] font-bold hover:underline shrink-0"
        >
          <span>View Sharad's Full Profile</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
