import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Radio,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SectionAudioButton } from './SectionAudioButton.tsx';

export interface TechNewsArticle {
  id: string;
  headline: string;
  summary: string;
  category: string;
  source: string;
  url: string;
  published: string;
  keyTakeaway: string;
  tags: string[];
}

export interface GroundingCitation {
  title: string;
  url: string;
}

const CATEGORIES = [
  'All Radar',
  'AI & LLMs',
  'Cloud & Systems',
  'Web & Frameworks',
  'Open Source',
  'Dev Tools',
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export const TechNewsSection: React.FC = () => {
  const { isLight } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Radar');
  const [searchTopic, setSearchTopic] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [articles, setArticles] = useState<TechNewsArticle[]>([]);
  const [citations, setCitations] = useState<GroundingCitation[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'google_search_grounded' | 'cache' | 'curated_fallback'>('google_search_grounded');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch tech news from backend search grounded endpoint
  const fetchNews = useCallback(async (topic: string = 'All', forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const url = `/api/tech-news?topic=${encodeURIComponent(topic)}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && Array.isArray(data.articles)) {
        setArticles(data.articles);
        setCitations(data.citations || []);
        setSearchQueries(data.searchQueries || []);
        setDataSource(data.source || 'google_search_grounded');
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load tech news:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNews('All', false);
  }, [fetchNews]);

  // Handle custom search query submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) {
      setActiveQuery('');
      fetchNews(selectedCategory === 'All Radar' ? 'All' : selectedCategory, true);
    } else {
      setActiveQuery(searchTopic.trim());
      fetchNews(searchTopic.trim(), true);
    }
  };

  // Handle category switch
  const handleCategoryChange = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setSearchTopic('');
    setActiveQuery('');
    fetchNews(cat === 'All Radar' ? 'All' : cat, false);
  };

  // Filtered list
  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === 'All Radar') return true;
    return art.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featuredArticle = filteredArticles[0] || articles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <section id="technews" className="py-20 border-t border-zinc-200/80 dark:border-white/[0.08] relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase font-mono mb-2">
            <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>06 · Real-Time Tech Radar & Grounded Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Latest Tech News & Ecosystem Radar
          </h2>

          <p className="mt-2 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Live search-grounded intelligence powered by Google DeepMind&apos;s{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">Gemini 3.8 Flash</span> with native{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Google Search</span> verification. Real-time updates on
            autonomous agents, multimodal architectures, open-source models, and developer infrastructure.
          </p>
        </div>

        {/* Section Audio & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <SectionAudioButton
            sectionId="technews"
            label="Audio Briefing"
            variant="pill"
          />

          <button
            type="button"
            onClick={() => fetchNews(activeQuery || (selectedCategory === 'All Radar' ? 'All' : selectedCategory), true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border bg-white dark:bg-white/[0.05] hover:bg-zinc-50 dark:hover:bg-white/[0.09] border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 shadow-sm disabled:opacity-50"
            title="Refresh radar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Radar'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Custom Search Bar Row */}
      <div className="p-3 sm:p-4 rounded-2xl mb-8 border bg-zinc-100 dark:bg-[#131519] border-zinc-200 dark:border-white/10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category && !activeQuery;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="Search topic (e.g. DeepSeek, Gemini 3.8, PostgreSQL 17)..."
              className="w-full pl-9 pr-20 py-1.5 rounded-lg text-xs font-mono transition-all border outline-none bg-white dark:bg-[#0B0C0E] text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={isLoading || isRefreshing}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 disabled:opacity-50"
            >
              Search
            </button>
          </form>
        </div>

        {/* Status Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-zinc-200 dark:border-white/5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>
              Grounding Mode:{' '}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {dataSource === 'google_search_grounded'
                  ? 'Google Search Grounded (Live Web)'
                  : dataSource === 'cache'
                  ? 'Edge Cache (8m TTL)'
                  : 'Curated Verified Intelligence'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeQuery && (
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-500/20">
                Query: &quot;{activeQuery}&quot;
              </span>
            )}
            {lastUpdated && (
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="w-3 h-3" />
                Updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl border animate-pulse p-6 bg-white dark:bg-[#131519] border-zinc-200 dark:border-white/10"
            >
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded mb-2" />
              <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800/60 rounded mb-4" />
              <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border bg-white dark:bg-[#131519] border-zinc-200 dark:border-white/10">
          <Globe className="w-12 h-12 text-zinc-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            No articles found for &quot;{activeQuery || selectedCategory}&quot;
          </h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
            Try resetting your search query or selecting a broader category.
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange('All Radar')}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 transition-all"
          >
            Reset Radar
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Flagship Featured Headline Hero Card */}
          {featuredArticle && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all bg-white dark:bg-[#131519] border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Category, Source, and Status */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      FEATURED BREAKING
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600">·</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {featuredArticle.category}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600">·</span>
                    <span className="text-zinc-500">
                      {featuredArticle.source} · {featuredArticle.published}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 leading-snug text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {featuredArticle.headline}
                  </h3>

                  {/* Summary */}
                  <p className="text-base sm:text-lg leading-relaxed mb-5 text-zinc-600 dark:text-zinc-300">
                    {featuredArticle.summary}
                  </p>

                  {/* Engineering Takeaway Callout */}
                  {featuredArticle.keyTakeaway && (
                    <div className="p-4 rounded-xl mb-5 text-sm bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.06]">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Engineering Takeaway
                      </div>
                      <p className="italic font-normal text-zinc-700 dark:text-zinc-300">{featuredArticle.keyTakeaway}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {featuredArticle.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-xs font-mono border bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 flex lg:flex-col items-center justify-end gap-3 pt-2">
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800"
                  >
                    <span>Read Verified Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Search Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid of Remaining Stories */}
          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article, idx) => (
                <motion.div
                  key={article.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-white dark:bg-[#131519] border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
                >
                  <div>
                    {/* Top Meta Header */}
                    <div className="flex items-center justify-between gap-2 mb-3 text-[11px] font-mono">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {article.category}
                      </span>

                      <span className="text-zinc-400 truncate max-w-[130px]">
                        {article.source}
                      </span>
                    </div>

                    {/* Headline Link */}
                    <h4 className="text-base font-bold leading-snug tracking-tight mb-2 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-start gap-1"
                      >
                        <span>{article.headline}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-blue-500" />
                      </a>
                    </h4>

                    {/* Summary */}
                    <p className="text-xs leading-relaxed mb-4 line-clamp-3 text-zinc-600 dark:text-zinc-400">
                      {article.summary}
                    </p>

                    {/* Engineering Takeaway Callout */}
                    {article.keyTakeaway && (
                      <div className="p-2.5 rounded-lg mb-4 text-xs bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05] text-zinc-700 dark:text-zinc-300">
                        <span className="font-mono font-semibold text-[10px] uppercase text-blue-600 dark:text-blue-400 block mb-0.5">
                          Key Takeaway
                        </span>
                        <span className="italic">{article.keyTakeaway}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Row: Tags & Read Link */}
                  <div className="pt-3 border-t border-zinc-200/60 dark:border-white/5 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex flex-wrap gap-1 overflow-hidden h-5">
                      {article.tags?.slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono border bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verified Google Search Grounding Citations Drawer */}
      {citations.length > 0 && (
        <div className="mt-10 p-5 rounded-2xl border bg-zinc-50 dark:bg-[#131519] border-zinc-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Search Citations ({citations.length} Sources)</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Extracted from Google Search Grounding chunks for provenance verification
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {citations.map((cite, cIdx) => (
              <a
                key={cIdx}
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border bg-white dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 shadow-sm"
              >
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">{cite.title}</span>
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
              </a>
            ))}
          </div>

          {searchQueries.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-white/5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Live Queries:</span>
              {searchQueries.map((q, qIdx) => (
                <span key={qIdx} className="px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                  &ldquo;{q}&rdquo;
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
