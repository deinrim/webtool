import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { TOOLS, getToolBySlug } from '../data/toolsRegistry';
import { Icon } from '../components/common/Icon';
import { Clock, Heart, Key, Settings, Trash2, Copy, Check, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { ToolHistoryItem } from '../types';

export const DashboardPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { user, favorites, toggleFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'favorites' | 'api-keys'>('overview');
  const [history, setHistory] = useState<ToolHistoryItem[]>([]);
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; createdAt: string; requestsUsed: number }[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    // Load history
    fetch(`/api/v1/history?userId=${user?.id || 'usr_demo'}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(() => {
        setHistory([
          {
            id: 'h_1',
            userId: 'usr_demo',
            toolSlug: 'image-compressor',
            toolName: 'Image Compressor',
            inputSummary: 'banner.png (2.4MB)',
            outputSummary: 'Saved 68% (768KB)',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'h_2',
            userId: 'usr_demo',
            toolSlug: 'roas-calculator',
            toolName: 'ROAS Calculator',
            inputSummary: 'Spend: $2,500, Rev: $11,250',
            outputSummary: 'ROAS: 4.5x (450%)',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      });

    // Load API keys
    fetch(`/api/v1/api-keys?userId=${user?.id || 'usr_demo'}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setApiKeys(data);
      })
      .catch(() => {
        setApiKeys([
          {
            id: 'key_1',
            name: 'Production Server',
            key: 'omni_live_9a8b7c6d5e4f3a2b1c',
            createdAt: '2026-03-01',
            requestsUsed: 1420,
          },
        ]);
      });
  }, [user]);

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const res = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'usr_demo', name: newKeyName }),
      });
      const data = await res.json();
      setApiKeys([...apiKeys, data]);
      setNewKeyName('');
    } catch {
      // Local fallback
      setApiKeys([
        ...apiKeys,
        {
          id: `key_${Date.now()}`,
          name: newKeyName,
          key: `omni_live_${Math.random().toString(36).substring(2, 12)}`,
          createdAt: new Date().toISOString().split('T')[0],
          requestsUsed: 0,
        },
      ]);
      setNewKeyName('');
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`/api/v1/history?userId=${user?.id || 'usr_demo'}`, { method: 'DELETE' });
      setHistory([]);
    } catch {
      setHistory([]);
    }
  };

  const favoriteTools = favorites.map(slug => getToolBySlug(slug)).filter(Boolean);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'User Dashboard' }]} onNavigate={onNavigate} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user ? user.fullName : 'Guest Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal favorites, audit task histories, and generate developer API keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-mono text-xs uppercase font-bold">
            {user?.plan || 'pro'} plan
          </span>
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('/admin')}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 my-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Settings },
          { id: 'favorites', label: `Favorites (${favorites.length})`, icon: Heart },
          { id: 'history', label: `Task History (${history.length})`, icon: Clock },
          { id: 'api-keys', label: 'Developer API Keys', icon: Key },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Total Tools Available</span>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">54</p>
              <span className="text-xs text-slate-500">Across 14 categories</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Tasks Executed</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">{history.length + 18}</p>
              <span className="text-xs text-slate-500">Processed this month</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Saved Presets</span>
              <p className="text-3xl font-extrabold text-purple-600 mt-2">{favorites.length}</p>
              <span className="text-xs text-slate-500">Quick-launch shortcuts</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteTools.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">No favorited tools yet.</p>
              <p className="text-xs mt-1">Click the heart icon on any tool card to add it to your quick-access panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTools.map(tool => (
                <div
                  key={tool!.id}
                  onClick={() => onNavigate(`/tools/${tool!.slug}`)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border hover:border-blue-500 transition cursor-pointer flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                        <Icon name={tool!.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{tool!.name}</h4>
                        <span className="text-[10px] uppercase font-mono text-slate-400">{tool!.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(tool!.slug);
                      }}
                      className="text-rose-500 p-1 hover:bg-rose-50 rounded"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">{tool!.description}</p>
                  <span className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Recent Task Execution Log</span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No recent execution history recorded. Run any tool to populate your activity log.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
              {history.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.toolName}</span>
                    <span className="text-slate-500 block">Input: {item.inputSummary}</span>
                    <span className="text-emerald-600 font-medium block">Result: {item.outputSummary}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    <button
                      onClick={() => onNavigate(`/tools/${item.toolSlug}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 font-semibold"
                    >
                      Re-run
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Developer API Keys */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider mb-1">
              Programmatic REST API
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Integrate OmniTools compression, PDF manipulation, and calculators into your own backend pipelines via HTTP REST endpoints.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="API Key Name (e.g. Production CI/CD)"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              className="w-full sm:w-80 p-2.5 text-xs rounded-xl border"
            />
            <button
              onClick={handleCreateApiKey}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Generate New Key
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
            {apiKeys.map(k => (
              <div key={k.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{k.name}</span>
                  <span className="font-mono text-slate-500 block mt-0.5">{k.key}</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">Created on {k.createdAt} • {k.requestsUsed} requests used</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(k.key);
                    setCopiedKey(k.id);
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 font-semibold"
                >
                  {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === k.id ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
