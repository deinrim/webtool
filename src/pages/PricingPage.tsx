import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Check, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PricingPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Plans & Pricing' }]} onNavigate={onNavigate} />

      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Start Free, Upgrade When You Need Power
        </h1>
        <p className="text-xs sm:text-base text-slate-500 mt-3">
          All 54 core tools are 100% free for everyone forever. Upgrade to Pro for zero ads, larger file ceilings, and developer API keys.
        </p>

        {/* Toggle */}
        <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${!annual ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${annual ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            Annual Billing <span className="text-[10px] text-emerald-600 font-bold ml-1">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free Explorer</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Forever Free
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Perfect for students, individuals, and occasional quick tasks.</p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {[
                'Full access to all 54 core web tools',
                '50MB maximum file size upload',
                '100% private client-side processing',
                'Local browser history & favorites',
                'Standard community support',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/tools')}
            className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50"
          >
            Start Using Free
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-600 dark:border-blue-500 shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
            Most Popular Choice
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Professional</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">For marketers, designers, developers, and agency freelancers.</p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {annual ? '$7.20' : '$9.00'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {[
                '100% Ad-Free Experience across all tools',
                '250MB maximum file size ceiling',
                'Priority background processing queue',
                'Developer REST API access (10,000 req/mo)',
                'Sync favorites & history across devices',
                'Batch image & PDF processing tools',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full mt-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition"
          >
            {user?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Business Plan */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Enterprise</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                TEAM
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">For agencies and companies requiring custom limits and multi-user seats.</p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {annual ? '$23.20' : '$29.00'}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {[
                'Everything in Pro Plan included',
                '500MB maximum file size ceiling',
                'Unlimited Developer API keys & 100k requests',
                'Team workspace & shared presets',
                '99.9% Service Level Agreement (SLA)',
                'Dedicated 24/7 priority email support',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/contact')}
            className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50"
          >
            Contact Business Sales
          </button>
        </div>
      </div>
    </div>
  );
};
