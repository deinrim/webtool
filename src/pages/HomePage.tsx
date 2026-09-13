import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Shield, Zap, CheckCircle2, Heart, ChevronRight, Star, TrendingUp, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES, TOOLS, getPopularTools } from '../data/toolsRegistry';
import { ToolDefinition } from '../types';
import { Icon } from '../components/common/Icon';
import { useAuth } from '../context/AuthContext';
import { AdBanner } from '../components/common/AdBanner';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { isFavorited, toggleFavorite } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const popularTools = getPopularTools();

  const filteredTools = TOOLS.filter(tool => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery =
      !filterQuery.trim() ||
      tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>54+ Free Online Utilities • Zero Installation • Client-Side Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Every Online Tool You Need, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              All in One Free Platform.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Compress images without losing quality, merge PDFs, build UTM parameters, calculate Google Ads ROAS, format code, and optimize SEO tags instantly.
          </p>

          {/* Big Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="group flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/5 hover:border-blue-500 transition cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
              <span className="text-sm text-slate-400 flex-1 text-left">
                Type what you need (e.g. "Compress Image", "Merge PDF", "ROAS", "QR Code")...
              </span>
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                ⌘K or /
              </kbd>
            </div>

            {/* Quick Pills */}
            <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {[
                { name: 'Image Compressor', slug: 'image-compressor' },
                { name: 'PDF Merge', slug: 'pdf-merge' },
                { name: 'ROAS Calculator', slug: 'roas-calculator' },
                { name: 'QR Generator', slug: 'qr-code-generator' },
                { name: 'UTM Builder', slug: 'utm-builder' },
                { name: 'Word Counter', slug: 'word-counter' },
              ].map(item => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(`/tools/${item.slug}`)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="header" />
      </div>

      {/* Popular Tools Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Most Popular Tools
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Tools used thousands of times daily by professionals and developers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/tools')}
            className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore all 54 tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.slice(0, 8).map(tool => {
            const favorited = isFavorited(tool.slug);
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
                      <Icon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {tool.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                    Use Tool <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mid Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="between-sections" />
      </div>

      {/* Browse by Categories Grid */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated toolkits organized for graphic designers, marketers, engineers, and students.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => {
              const toolCount = TOOLS.filter(t => t.category === cat.slug).length;
              return (
                <div
                  key={cat.slug}
                  onClick={() => onNavigate(`/categories/${cat.slug}`)}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <Icon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                  <span className="inline-block mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {toolCount} Tools Available →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filterable All Tools Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              All 50+ Free Online Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing {filteredTools.length} tools matching your criteria
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            {CATEGORIES.slice(0, 7).map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat.slug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.name.replace(' Tools', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => {
            const favorited = isFavorited(tool.slug);
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                    <Icon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition">
                        {tool.name}
                      </h4>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(tool.slug);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                    {tool.category}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
                    Open Tool <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Educational Articles & Guides */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Guides & Best Practices
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Learn how to optimize workflows, calculate PPC ROI, and master search engine meta tags.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read all articles →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                slug: 'how-to-compress-images-without-losing-quality',
                title: 'How to Compress Images Without Losing Visual Quality',
                excerpt: 'Understanding lossy vs lossless compression, WebP modern formats, and target sizes for 100% PageSpeed performance.',
                cat: 'Image Guide',
                readTime: '4 min read',
              },
              {
                slug: 'how-to-improve-google-ads-ctr-and-roas',
                title: 'Proven Strategies to Improve Google Ads CTR & Maximize ROAS',
                excerpt: 'Key formulas, negative keyword tips, and bid calculators to double your return on ad spend without extra budget.',
                cat: 'PPC & Ads',
                readTime: '6 min read',
              },
              {
                slug: 'mastering-utm-campaign-tracking-guide',
                title: 'The Ultimate Blueprint for UTM Campaign Tracking in 2026',
                excerpt: 'Never lose track of marketing traffic again. Consistent naming conventions and analytics attribution explained.',
                cat: 'Marketing',
                readTime: '5 min read',
              },
            ].map(post => (
              <div
                key={post.slug}
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 transition cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                    <span className="text-blue-600 dark:text-blue-400 uppercase font-bold">{post.cat}</span>
                    <span className="text-slate-400">{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <span>Read full guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
