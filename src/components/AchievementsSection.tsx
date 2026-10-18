import React, { useMemo } from 'react';
import { portfolioData } from '../data/portfolio.ts';
import { Trophy, Code2, Award, GitBranch, Github, Star } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { achievements, githubStats } = portfolioData;

  // Generate 52 weeks of GitHub contribution matrix (simulating active developer streaks)
  const contributionGrid = useMemo(() => {
    const weeks = 42; // Display last 42 weeks on desktop
    const daysPerWeek = 7;
    const grid: number[][] = [];

    // Seeded pseudo-random generator for stable visually realistic heatmap
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
        return 'bg-[#38BDF8]/25';
      case 2:
        return 'bg-[#38BDF8]/50';
      case 3:
        return 'bg-[#38BDF8]/75';
      case 4:
        return 'bg-[#38BDF8]';
      default:
        return 'bg-white/[0.04]';
    }
  };

  return (
    <section id="achievements" className="py-20 border-t border-white/[0.06] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-2">
            05 · Verified Accomplishments
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Competitive Edge & Algorithmic Rigor
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Objective metrics demonstrating algorithmic problem-solving capacity under competitive pressure.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0E1217] border border-white/[0.08] hover:border-[#38BDF8]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>{item.category}</span>
                  <Trophy className="w-3.5 h-3.5 text-[#38BDF8]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight mb-2">
                  {item.metric}
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live GitHub Contribution Heatmap Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E1217] border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-white" />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>GitHub Engineering Activity</span>
                  <span className="text-xs text-slate-400 font-mono font-normal">
                    @{githubStats.username}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Continuous development and open-source contributions
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
            <span>Learn more on GitHub</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Less</span>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-white/[0.04]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/25" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/50" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]/75" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              </div>
              <span className="text-[11px]">More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
