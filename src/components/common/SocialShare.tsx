import React, { useState } from 'react';
import { Share2, Check, Copy, Link as LinkIcon } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://omnitools.example.com');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`, '_blank');
  };

  return (
    <div className={`flex items-center flex-wrap gap-2 text-xs ${className}`}>
      <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
        <Share2 className="w-3.5 h-3.5" /> Share tool:
      </span>

      <button
        onClick={shareToX}
        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
        title="Share on X"
      >
        X / Twitter
      </button>

      <button
        onClick={shareToLinkedIn}
        className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition"
        title="Share on LinkedIn"
      >
        LinkedIn
      </button>

      <button
        onClick={shareToFacebook}
        className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 transition"
        title="Share on Facebook"
      >
        Facebook
      </button>

      <button
        onClick={shareToWhatsApp}
        className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition"
        title="Share on WhatsApp"
      >
        WhatsApp
      </button>

      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition"
        title="Copy Link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
};
