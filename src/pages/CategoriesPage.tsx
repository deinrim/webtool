import React, { useState } from 'react';
import { CATEGORIES, TOOLS, getCategoryBySlug, getToolsByCategory } from '../data/toolsRegistry';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Icon } from '../components/common/Icon';
import { useAuth } from '../context/AuthContext';
import { Heart, Search, ArrowRight, Sparkles } from 'lucide-react';
import { AdBanner } from '../components/common/AdBanner';

interface CategoryPageProps {
  categorySlug?: string;
  onNavigate: (route: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigate }) => {
  const { isFavorited, toggleFavorite } = useAuth();
  const [search, setSearch] = useState('');

  const currentCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const tools = currentCategory ? getToolsByCategory(currentCategory.slug) : TOOLS;

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs
        items={
          currentCategory
            ? [{ label: 'Categories', href: '/categories' }, { label: currentCategory.name }]
            : [{ label: 'All Tools Directory' }]
        }
        onNavigate={onNavigate}
      />

      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentCategory ? currentCategory.name : 'All Online Tools Directory'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {currentCategory
                ? currentCategory.description
                : 'Browse all 54 fast, client-side online tools for PDF, images, SEO, PPC, code, and calculation.'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search in this section..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      <AdBanner slot="header" />

      {/* Tools Grid */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => {
          const favorited = isFavorited(tool.slug);
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(`/tools/${tool.slug}`)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition">
                    <Icon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(tool.slug);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono uppercase">{tool.category}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                  Launch Tool <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AdBanner slot="footer" />
    </div>
  );
};
