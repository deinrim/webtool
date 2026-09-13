import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TOOLS } from '../data/toolsRegistry';
import { Shield, BarChart3, ToggleLeft, ToggleRight, MessageSquare, AlertTriangle, Users, Activity, CheckCircle } from 'lucide-react';

export const AdminPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'tools' | 'ads' | 'feedback'>('metrics');
  const [adsEnabled, setAdsEnabled] = useState({
    header: true,
    sidebar: true,
    betweenSections: true,
    footer: true,
  });
  const [toolOverrides, setToolOverrides] = useState<Record<string, boolean>>({});

  const toggleAd = (slot: keyof typeof adsEnabled) => {
    setAdsEnabled(prev => ({ ...prev, [slot]: !prev[slot] }));
  };

  const toggleTool = (slug: string) => {
    setToolOverrides(prev => ({ ...prev, [slug]: prev[slug] === false ? true : false }));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Admin Management Console' }]} onNavigate={onNavigate} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" /> OmniTools Platform Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, tool availability toggles, monetization controls, and user feedback triage.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 my-6 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'metrics', label: 'Platform Metrics', icon: BarChart3 },
          { id: 'tools', label: 'Tool Manager (54)', icon: Activity },
          { id: 'ads', label: 'Monetization & Ads', icon: ToggleRight },
          { id: 'feedback', label: 'User Feedback', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Tool Invocations</span>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">1,842,900</p>
              <span className="text-[11px] text-emerald-500 font-semibold">+18.4% this week</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Daily Active Users</span>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">42,120</p>
              <span className="text-[11px] text-slate-400">Global browser clients</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">System Availability</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">99.99%</p>
              <span className="text-[11px] text-emerald-500 font-semibold">Zero outages</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Execution Latency</span>
              <p className="text-3xl font-extrabold text-purple-600 mt-1">16ms</p>
              <span className="text-[11px] text-slate-400">Client-side execution</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Top 5 Most Executed Tools Today</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Image Compressor', count: '482,100 executions', pct: '26%' },
                { name: 'PDF Merge & Combiner', count: '310,400 executions', pct: '17%' },
                { name: 'Google Ads ROAS Calculator', count: '240,900 executions', pct: '13%' },
                { name: 'High-Res QR Code Generator', count: '194,200 executions', pct: '11%' },
                { name: 'UTM Campaign Builder', count: '142,000 executions', pct: '8%' },
              ].map(t => (
                <div key={t.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{t.count}</span>
                    <span className="font-bold text-indigo-600 w-10 text-right">{t.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tools Manager Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300">
            Control live status for all 54 registered tools. Disabling a tool redirects users to an informative maintenance banner.
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-900 overflow-hidden text-xs">
            {TOOLS.map(t => {
              const isEnabled = toolOverrides[t.slug] !== false;
              return (
                <div key={t.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">/{t.slug} • {t.category}</span>
                  </div>
                  <button
                    onClick={() => toggleTool(t.slug)}
                    className={`px-3 py-1 rounded-full font-semibold text-[11px] flex items-center gap-1 ${
                      isEnabled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isEnabled ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{isEnabled ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monetization / Ads Tab */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Google AdSense Placement Flags</h3>
            <p className="text-xs text-slate-500">
              Toggle specific ad zones dynamically. Pro subscribers automatically bypass all ad slots regardless of these flags.
            </p>

            <div className="space-y-3">
              {[
                { key: 'header', label: 'Top Leaderboard Slot (728x90)' },
                { key: 'sidebar', label: 'Tool Sidebar Skyscraper (300x250 / 300x600)' },
                { key: 'betweenSections', label: 'Homepage In-Feed Native Slot' },
                { key: 'footer', label: 'Bottom Banner Unit' },
              ].map(slot => (
                <div key={slot.key} className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs">
                  <span className="font-semibold">{slot.label}</span>
                  <button
                    onClick={() => toggleAd(slot.key as any)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      adsEnabled[slot.key as keyof typeof adsEnabled]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {adsEnabled[slot.key as keyof typeof adsEnabled] ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-900 overflow-hidden text-xs">
            {[
              {
                id: 'fb_1',
                user: 'sarah.m@agency.co',
                category: 'Feature Request',
                message: 'Could you add an option in the Image Compressor to output AVIF format as well? Awesome speed so far!',
                date: '2 hours ago',
              },
              {
                id: 'fb_2',
                user: 'dev_alex@startup.io',
                category: 'Praise',
                message: 'The ROAS and PPC calculators saved our team hours of manual spreadsheet building. Best free tools suite.',
                date: 'Yesterday',
              },
            ].map(fb => (
              <div key={fb.id} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{fb.user}</span>
                  <span className="text-[11px] text-slate-400">{fb.date}</span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 text-[10px] font-semibold">
                  {fb.category}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{fb.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
