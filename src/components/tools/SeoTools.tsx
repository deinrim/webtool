import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Sparkles, Smartphone, Monitor } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState('OmniTools - 50+ Powerful Free Online Web Utilities');
  const [description, setDescription] = useState('Comprehensive all-in-one free online tools for image compression, PDF conversion, SEO tags, PPC ROI calculators, and coding utilities.');
  const [keywords, setKeywords] = useState('free tools, image compressor, pdf merge, roas calculator, utm builder');
  const [author, setAuthor] = useState('OmniTools Platform');
  const [robots, setRobots] = useState('index, follow');
  const [copied, setCopied] = useState(false);

  const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="${robots}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;

  const copyTags = () => {
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Page Title</span>
            <span className={title.length > 60 ? 'text-rose-500 font-bold' : 'text-slate-400'}>{title.length}/60 chars</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Meta Description</span>
            <span className={description.length > 160 ? 'text-rose-500 font-bold' : 'text-slate-400'}>{description.length}/160 chars</span>
          </div>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Keywords (Comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Robots Indexing</label>
            <select
              value={robots}
              onChange={e => setRobots(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border"
            >
              <option value="index, follow">index, follow (Recommended)</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, follow">noindex, follow</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated HTML Meta Tags</label>
          <button
            onClick={copyTags}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy HTML'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto h-72">
          {tags}
        </pre>
      </div>
    </div>
  );
};

export const SerpPreview: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [title, setTitle] = useState('OmniTools - 50+ Free All-in-One Online Web Utilities');
  const [url, setUrl] = useState('https://omnitools.example.com/tools');
  const [description, setDescription] = useState('Discover 50+ free online web tools for image compression, PDF merge, PPC calculations, UTM tagging, and code formatting. No signup required.');

  return (
    <div className="space-y-6">
      {/* Device switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              device === 'desktop' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Preview
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              device === 'mobile' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Preview
          </button>
        </div>

        <span className="text-xs text-slate-400">Google SERP Simulator</span>
      </div>

      {/* Simulator Frame */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className={device === 'mobile' ? 'max-w-sm mx-auto border-x border-dashed p-4' : 'max-w-xl'}>
          <div className="space-y-1 font-sans">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">O</div>
              <span className="text-slate-800 dark:text-slate-200 truncate">{url}</span>
            </div>

            <h3 className="text-base sm:text-lg font-medium text-blue-800 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Target Page URL</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>SEO Title</span>
            <span className={title.length > 60 ? 'text-amber-500 font-bold' : 'text-slate-400'}>{title.length}/60</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Meta Snippet Description</span>
            <span className={description.length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}>{description.length}/160</span>
          </div>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>
      </div>
    </div>
  );
};

export const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState(
    'Search engine optimization requires understanding keywords and content relevance. When keywords are placed naturally in your text, search engines can evaluate your search intent properly.'
  );

  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const freq: Record<string, number> = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="space-y-4">
      <textarea
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste article content to analyze..."
        className="w-full p-4 rounded-xl border text-xs"
      />

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Top Keywords & Density Percentage
        </h4>
        <div className="space-y-2">
          {sorted.map(([word, count]) => {
            const pct = words.length > 0 ? ((count / words.length) * 100).toFixed(1) : '0';
            return (
              <div key={word} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{word}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{count} times</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-14 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const RobotsTxtGenerator: React.FC = () => {
  const [sitemap, setSitemap] = useState('https://omnitools.example.com/sitemap.xml');
  const [allowAll, setAllowAll] = useState(true);
  const [disallowedPaths, setDisallowedPaths] = useState('/admin/\n/private/\n/api/');

  const robotsOutput = `User-agent: *
${allowAll ? 'Allow: /' : 'Disallow: /'}
${disallowedPaths
  .split('\n')
  .filter(Boolean)
  .map(p => `Disallow: ${p}`)
  .join('\n')}

Sitemap: ${sitemap}`;

  const downloadRobots = () => {
    const blob = new Blob([robotsOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1">XML Sitemap Location</label>
          <input
            type="text"
            value={sitemap}
            onChange={e => setSitemap(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Disallowed Paths (One per line)</label>
          <textarea
            rows={5}
            value={disallowedPaths}
            onChange={e => setDisallowedPaths(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border font-mono"
          />
        </div>

        <button
          onClick={downloadRobots}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Download robots.txt File
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Generated Output</label>
        <pre className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs h-64 overflow-x-auto">
          {robotsOutput}
        </pre>
      </div>
    </div>
  );
};

export const XmlSitemapGenerator: React.FC = () => {
  const [urls, setUrls] = useState('https://omnitools.example.com\nhttps://omnitools.example.com/tools\nhttps://omnitools.example.com/blog');

  const today = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .split('\n')
  .filter(Boolean)
  .map(
    u => `  <url>
    <loc>${u.trim()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <label className="block text-xs font-semibold">List Website URLs (one per line):</label>
        <textarea
          rows={7}
          value={urls}
          onChange={e => setUrls(e.target.value)}
          className="w-full p-3 rounded-xl border text-xs font-mono"
        />

        <button
          onClick={() => {
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sitemap.xml';
            a.click();
          }}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Download sitemap.xml
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Standard XML Output</label>
        <pre className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs h-64 overflow-x-auto">
          {xml}
        </pre>
      </div>
    </div>
  );
};
