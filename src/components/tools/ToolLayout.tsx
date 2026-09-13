import React, { useState } from 'react';
import { ToolDefinition } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { SocialShare } from '../common/SocialShare';
import { AdBanner } from '../common/AdBanner';
import { Icon } from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { getRelatedTools } from '../../data/toolsRegistry';
import { Heart, ChevronDown, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  onNavigate: (route: string) => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children, onNavigate }) => {
  const { isFavorited, toggleFavorite } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const favorited = isFavorited(tool.slug);
  const relatedTools = getRelatedTools(tool, 4);

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* JSON-LD Structured Data for FAQ & Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: `${tool.category.toUpperCase()} Tools`, href: `/categories/${tool.category}` },
          { label: tool.name },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
            <Icon name={tool.icon} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {tool.name}
              </h1>
              {tool.isPopular && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  POPULAR
                </span>
              )}
              {tool.isNew && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  NEW
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                100% FREE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => toggleFavorite(tool.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
              favorited
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favorited ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Top Ad Slot */}
      <AdBanner slot="header" />

      {/* Interactive Tool Area (ABOVE THE FOLD) */}
      <div className="my-6 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {children}
      </div>

      {/* Result Ad Slot */}
      <AdBanner slot="result" />

      {/* Social Sharing bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SocialShare title={`Use ${tool.name} online for free - OmniTools`} />
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Private processing • No tracking data retained</span>
        </div>
      </div>

      {/* Middle Ad Slot */}
      <AdBanner slot="between-sections" />

      {/* SEO Content: Instructions, Features & How to use */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-10">
        <div className="lg:col-span-2 space-y-8">
          {/* How to use */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
              How to use {tool.name}
            </h2>
            <ol className="space-y-3">
              {tool.howToUse.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Key Features */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Key Features & Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {tool.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-2 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 transition"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: Related Tools & Ad Slot */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Related {tool.category.toUpperCase()} Tools
            </h3>
            <div className="space-y-2">
              {relatedTools.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => onNavigate(`/tools/${rel.slug}`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon name={rel.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600">
                        {rel.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {rel.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <AdBanner slot="sidebar" />
        </div>
      </div>
    </div>
  );
};
