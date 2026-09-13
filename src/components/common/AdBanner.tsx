import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, X } from 'lucide-react';

interface AdBannerProps {
  slot: 'header' | 'between-sections' | 'sidebar' | 'result' | 'before-related' | 'footer';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '' }) => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);

  // Pro and business users see no ads
  if (user?.plan === 'pro' || user?.plan === 'business' || dismissed) {
    return null;
  }

  return (
    <div
      className={`relative my-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden text-center ${className}`}
      id={`ad-slot-${slot}`}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-400">
        <span>Advertisement</span>
        <button
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition"
          title="Hide Ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="py-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
            Support OmniTools Free Platform
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ad slot: <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{slot}</span> • AdSense verified • Upgrade to Pro for zero ads & priority queues.
          </p>
        </div>
      </div>
    </div>
  );
};
