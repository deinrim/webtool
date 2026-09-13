import React from 'react';
import { Sparkles, Shield, Lock, Zap } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Privacy & Trust Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">100% Client-Side Privacy</h4>
              <p className="text-xs text-slate-500">Your files are processed securely in your browser and never sold or retained.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Lightning Fast Execution</h4>
              <p className="text-xs text-slate-500">No queues or waiting times for standard operations. Instant outputs.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Production Reliability</h4>
              <p className="text-xs text-slate-500">Built for developers, marketers, students, and businesses worldwide.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              OmniTools
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
            50+ powerful, free online web utilities for everyday tasks. Compress PDFs, optimize images, generate SEO tags, calculate PPC ROAS, format code, and boost productivity without complicated software.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Global • Multi-currency ready • No ads for Pro users</span>
          </div>
        </div>

        {/* Tools Col */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Top Categories</h5>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('/categories/image')} className="hover:text-blue-600 transition">Image Tools</button></li>
            <li><button onClick={() => onNavigate('/categories/pdf')} className="hover:text-blue-600 transition">PDF Tools</button></li>
            <li><button onClick={() => onNavigate('/categories/seo')} className="hover:text-blue-600 transition">SEO Tools</button></li>
            <li><button onClick={() => onNavigate('/categories/ppc')} className="hover:text-blue-600 transition">PPC & Ads Tools</button></li>
            <li><button onClick={() => onNavigate('/categories/marketing')} className="hover:text-blue-600 transition">Digital Marketing</button></li>
            <li><button onClick={() => onNavigate('/categories/developer')} className="hover:text-blue-600 transition">Developer Tools</button></li>
          </ul>
        </div>

        {/* Resources Col */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Resources</h5>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('/blog')} className="hover:text-blue-600 transition">Blog & Guides</button></li>
            <li><button onClick={() => onNavigate('/blog/how-to-compress-images-without-losing-quality')} className="hover:text-blue-600 transition">Image Guide</button></li>
            <li><button onClick={() => onNavigate('/blog/how-to-improve-google-ads-ctr-and-roas')} className="hover:text-blue-600 transition">PPC Formulas</button></li>
            <li><button onClick={() => onNavigate('/blog/mastering-utm-campaign-tracking-guide')} className="hover:text-blue-600 transition">UTM Blueprint</button></li>
            <li><button onClick={() => onNavigate('/pricing')} className="hover:text-blue-600 transition">Pricing Plans</button></li>
          </ul>
        </div>

        {/* Company & Legal Col */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Company & Legal</h5>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('/about')} className="hover:text-blue-600 transition">About Us</button></li>
            <li><button onClick={() => onNavigate('/contact')} className="hover:text-blue-600 transition">Contact Support</button></li>
            <li><button onClick={() => onNavigate('/privacy')} className="hover:text-blue-600 transition">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('/terms')} className="hover:text-blue-600 transition">Terms of Service</button></li>
            <li><button onClick={() => onNavigate('/disclaimer')} className="hover:text-blue-600 transition">Disclaimer</button></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 OmniTools Inc. All rights reserved. Designed for speed, privacy, and productivity.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Version 2.4.0 (Production)</span>
            <span>•</span>
            <button onClick={() => onNavigate('/privacy')} className="hover:underline">Privacy</button>
            <button onClick={() => onNavigate('/terms')} className="hover:underline">Terms</button>
            <button onClick={() => onNavigate('/contact')} className="hover:underline">Feedback</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
