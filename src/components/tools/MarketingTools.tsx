import React, { useState } from 'react';
import { Copy, Check, Sparkles, Hash, Mail, Share2, Link } from 'lucide-react';

export const UtmBuilder: React.FC = () => {
  const [url, setUrl] = useState('https://example.com/product');
  const [source, setSource] = useState('google');
  const [medium, setMedium] = useState('cpc');
  const [campaign, setCampaign] = useState('spring_sale_2026');
  const [term, setTerm] = useState('best_web_tools');
  const [content, setContent] = useState('banner_ad_v1');
  const [copied, setCopied] = useState(false);

  const cleanUrl = url.trim();
  const params = new URLSearchParams();
  if (source.trim()) params.append('utm_source', source.trim());
  if (medium.trim()) params.append('utm_medium', medium.trim());
  if (campaign.trim()) params.append('utm_campaign', campaign.trim());
  if (term.trim()) params.append('utm_term', term.trim());
  if (content.trim()) params.append('utm_content', content.trim());

  const hasParams = Array.from(params.keys()).length > 0;
  const separator = cleanUrl.includes('?') ? '&' : '?';
  const fullUrl = hasParams ? `${cleanUrl}${separator}${params.toString()}` : cleanUrl;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Landing Page Base URL *</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/pricing"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Campaign Source (utm_source) *</label>
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="e.g. google, newsletter, facebook"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Campaign Medium (utm_medium) *</label>
          <input
            type="text"
            value={medium}
            onChange={e => setMedium(e.target.value)}
            placeholder="e.g. cpc, email, social, banner"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Campaign Name (utm_campaign) *</label>
          <input
            type="text"
            value={campaign}
            onChange={e => setCampaign(e.target.value)}
            placeholder="e.g. black_friday, product_launch"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Campaign Term (utm_term)</label>
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="e.g. running+shoes, developer+tools"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1">Campaign Content (utm_content)</label>
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="e.g. logolink, textlink, cta_button_red"
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Output Link */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Generated Campaign URL</span>
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>
        <p className="font-mono text-xs text-blue-900 dark:text-blue-100 break-all p-2 bg-white dark:bg-slate-900 rounded-xl border">
          {fullUrl}
        </p>
      </div>
    </div>
  );
};

export const EmailSubjectTester: React.FC = () => {
  const [subject, setSubject] = useState('🔥 Last chance: Claim your 50% discount before midnight!');

  // Simple rule-based evaluation
  const charCount = subject.length;
  const wordCount = subject.trim().split(/\s+/).filter(Boolean).length;
  const hasUrgency = /urgent|last chance|hurry|today only|expires|ending/i.test(subject);
  const hasNumbers = /\d+/.test(subject);
  const hasEmoji = /\p{Extended_Pictographic}/u.test(subject);
  const spamWords = ['free', 'guarantee', 'winner', 'risk-free', '100% free'].filter(w =>
    subject.toLowerCase().includes(w)
  );

  let score = 50;
  if (charCount >= 30 && charCount <= 60) score += 20;
  else if (charCount < 20 || charCount > 80) score -= 15;

  if (hasNumbers) score += 10;
  if (hasEmoji) score += 10;
  if (hasUrgency) score += 10;
  if (spamWords.length > 0) score -= 20;
  score = Math.max(10, Math.min(100, score));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold mb-1">Email Subject Line</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full p-3 text-sm rounded-xl border font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-center">
          <span className="text-xs uppercase font-bold text-slate-400">Effectiveness Score</span>
          <p className={`text-5xl font-extrabold mt-2 ${score > 75 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
            {score}/100
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {score > 75 ? 'Excellent subject line!' : 'Good with room for optimization'}
          </span>
        </div>

        <div className="md:col-span-2 p-4 rounded-2xl border space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span>Character Count ({charCount} chars):</span>
            <span className={charCount >= 30 && charCount <= 60 ? 'text-emerald-600 font-bold' : 'text-amber-500'}>
              {charCount >= 30 && charCount <= 60 ? 'Optimal (30-60 chars)' : 'Too long or too short'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span>Contains Numbers / Stats:</span>
            <span className={hasNumbers ? 'text-emerald-600 font-bold' : 'text-slate-400'}>{hasNumbers ? 'Yes (+10 pts)' : 'No'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span>Visual Emoji Included:</span>
            <span className={hasEmoji ? 'text-emerald-600 font-bold' : 'text-slate-400'}>{hasEmoji ? 'Yes (+10 pts)' : 'No'}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span>Spam Trigger Words:</span>
            <span className={spamWords.length === 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              {spamWords.length === 0 ? 'Clean (0 detected)' : `Warning: ${spamWords.join(', ')}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HashtagGenerator: React.FC = () => {
  const [topic, setTopic] = useState('digital marketing');
  const [generated, setGenerated] = useState<string[]>([
    '#digitalmarketing', '#marketingtips', '#seo', '#growthhacking', '#socialmediamarketing',
    '#contentmarketing', '#onlinebusiness', '#branding', '#businessgrowth', '#marketingstrategy'
  ]);
  const [copied, setCopied] = useState(false);

  const generateHashtags = () => {
    const clean = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    setGenerated([
      `#${clean}`,
      `#${clean}tips`,
      `#${clean}strategy`,
      `#${clean}growth`,
      `#${clean}expert`,
      `#${clean}tools`,
      `#${clean}online`,
      `#trending${clean}`,
      `#${clean}daily`,
      `#learn${clean}`
    ]);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generated.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter keyword or topic (e.g. fitness, web design, crypto)..."
          className="w-full p-2.5 text-xs rounded-xl border"
        />
        <button
          onClick={generateHashtags}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0"
        >
          Generate
        </button>
      </div>

      <div className="p-4 rounded-xl border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trending Tags</span>
          <button onClick={copyAll} className="text-xs text-blue-600 font-semibold hover:underline">
            {copied ? 'Copied!' : 'Copy All 10 Tags'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {generated.map(tag => (
            <span
              key={tag}
              onClick={() => navigator.clipboard.writeText(tag)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-xs font-mono font-medium cursor-pointer transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SocialMediaCounter: React.FC = () => {
  const [text, setText] = useState('Boost your business with 50+ free web utilities on OmniTools! Check out the suite today.');

  const platforms = [
    { name: 'X / Twitter', max: 280, count: text.length },
    { name: 'LinkedIn Post', max: 3000, count: text.length },
    { name: 'Instagram Caption', max: 2200, count: text.length },
    { name: 'Facebook Post', max: 63206, count: text.length },
    { name: 'Pinterest Description', max: 500, count: text.length },
  ];

  return (
    <div className="space-y-4">
      <textarea
        rows={5}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your social post..."
        className="w-full p-3 rounded-xl border text-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {platforms.map(p => {
          const remaining = p.max - p.count;
          const isOver = remaining < 0;
          return (
            <div key={p.name} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">{p.name}</span>
              <p className={`text-lg font-extrabold mt-1 ${isOver ? 'text-rose-500' : 'text-blue-600'}`}>
                {p.count} / {p.max}
              </p>
              <span className={`text-[10px] ${isOver ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                {isOver ? `${Math.abs(remaining)} chars over limit` : `${remaining} left`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
