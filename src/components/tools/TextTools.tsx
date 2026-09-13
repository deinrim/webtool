import React, { useState } from 'react';
import { Copy, Check, Trash2, RefreshCw, AlignLeft, Sparkles, FileDiff } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'OmniTools is an all-in-one free online platform for everyday utilities. You can compress images, merge PDFs, test PPC ad budgets, format code, and optimize SEO tags in seconds.'
  );
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? (text.match(/[.!?]+(?:\s|$)/g) || []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  const readingTimeMin = (words / 200).toFixed(1);
  const speakingTimeMin = (words / 130).toFixed(1);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { label: 'Words', val: words, color: 'text-blue-600' },
          { label: 'Characters', val: charsWithSpaces, color: 'text-indigo-600' },
          { label: 'No Spaces', val: charsNoSpaces, color: 'text-slate-700' },
          { label: 'Sentences', val: sentences, color: 'text-emerald-600' },
          { label: 'Paragraphs', val: paragraphs, color: 'text-amber-600' },
          { label: 'Read Time', val: `${readingTimeMin}m`, color: 'text-purple-600' },
          { label: 'Speech Time', val: `${speakingTimeMin}m`, color: 'text-rose-600' },
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{item.label}</span>
            <span className={`text-lg font-extrabold ${item.color} dark:text-white mt-0.5 block`}>{item.val}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here to analyze..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setText('')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition"
            title="Clear Text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={copyText}
            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Copy Text"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('OmniTools powers your daily workflow with fast browser-based utilities.');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () => {
    setText(
      text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };
  const toSentence = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
  };
  const toCamel = () => {
    setText(
      text
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((w, idx) => (idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('')
    );
  };
  const toKebab = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };
  const toSnake = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
    );
  };
  const toPascal = () => {
    setText(
      text
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'UPPERCASE', action: toUpper },
          { label: 'lowercase', action: toLower },
          { label: 'Title Case', action: toTitle },
          { label: 'Sentence case', action: toSentence },
          { label: 'camelCase', action: toCamel },
          { label: 'kebab-case', action: toKebab },
          { label: 'snake_case', action: toSnake },
          { label: 'PascalCase', action: toPascal },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
      />
    </div>
  );
};

export const TextCleaner: React.FC = () => {
  const [text, setText] = useState<string>('  Item 1  \nItem 2\nItem 1\n\n<b>Item 3 with HTML</b>  \nItem 4  ');

  const removeDuplicates = () => {
    const lines = text.split('\n');
    setText(Array.from(new Set(lines)).join('\n'));
  };

  const trimWhitespace = () => {
    const lines = text.split('\n').map(l => l.trim());
    setText(lines.join('\n'));
  };

  const removeBlankLines = () => {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    setText(lines.join('\n'));
  };

  const stripHtml = () => {
    setText(text.replace(/<[^>]*>?/gm, ''));
  };

  const sortLines = () => {
    const lines = text.split('\n').sort((a, b) => a.localeCompare(b));
    setText(lines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={removeDuplicates} className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50">
          Remove Duplicate Lines
        </button>
        <button onClick={trimWhitespace} className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50">
          Trim Whitespace
        </button>
        <button onClick={removeBlankLines} className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50">
          Remove Empty Lines
        </button>
        <button onClick={stripHtml} className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50">
          Strip HTML Tags
        </button>
        <button onClick={sortLines} className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50">
          Sort A-Z Alphabetical
        </button>
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
      />
    </div>
  );
};

export const TextDiffChecker: React.FC = () => {
  const [original, setOriginal] = useState<string>('Welcome to OmniTools.\nThe platform has 40 tools.\n100% free.');
  const [modified, setModified] = useState<string>('Welcome to OmniTools!\nThe platform has 54+ tools.\n100% free forever.');

  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLines = Math.max(origLines.length, modLines.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Original Version</label>
          <textarea
            rows={6}
            value={original}
            onChange={e => setOriginal(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Updated Version</label>
          <textarea
            rows={6}
            value={modified}
            onChange={e => setModified(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <FileDiff className="w-4 h-4" /> Visual Line Diff Output
        </h4>
        <div className="space-y-1">
          {Array.from({ length: maxLines }).map((_, idx) => {
            const o = origLines[idx];
            const m = modLines[idx];
            const isDifferent = o !== m;

            return (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <div className={`p-1.5 rounded ${isDifferent ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' : 'bg-transparent'}`}>
                  <span className="text-slate-400 mr-2">{idx + 1}</span> {o ?? '<none>'}
                </div>
                <div className={`p-1.5 rounded ${isDifferent ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold' : 'bg-transparent'}`}>
                  <span className="text-slate-400 mr-2">{idx + 1}</span> {m ?? '<none>'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(3);
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState<string>('');

  const sampleIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  const generate = () => {
    if (unit === 'paragraphs') {
      setOutput(Array(count).fill(sampleIpsum).join('\n\n'));
    } else if (unit === 'sentences') {
      const sentences = sampleIpsum.split('. ');
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(sentences[i % sentences.length]);
      }
      setOutput(result.join('. ') + '.');
    } else {
      const words = sampleIpsum.split(' ');
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(words[i % words.length]);
      }
      setOutput(result.join(' '));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span>Count:</span>
          <input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-16 p-2 rounded-lg border text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span>Type:</span>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="p-2 rounded-lg border text-xs"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <button onClick={generate} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Generate Dummy Text
        </button>
      </div>

      <textarea
        rows={8}
        value={output}
        readOnly
        placeholder="Click Generate Dummy Text..."
        className="w-full p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-serif leading-relaxed"
      />
    </div>
  );
};

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState<string>('50+ Best Free Online Web Tools in 2026!');
  const [separator, setSeparator] = useState<string>('-');

  const slug = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`(^\\${separator}|\\${separator}$)`, 'g'), '');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Human Readable Title</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full p-3 text-xs rounded-xl border"
        />
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span>Separator:</span>
        {['-', '_', '.'].map(sep => (
          <button
            key={sep}
            onClick={() => setSeparator(sep)}
            className={`px-3 py-1 rounded-lg border font-mono font-bold ${separator === sep ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}
          >
            {sep}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Generated URL Slug</span>
          <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{slug}</span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(slug)}
          className="p-2 rounded-lg bg-white dark:bg-slate-700 border hover:bg-slate-50"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
