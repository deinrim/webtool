import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, RefreshCw, Key, Palette, Code, Clock, Calculator, Eye } from 'lucide-react';

export const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://omnitools.example.com');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: 320,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [text, fgColor, bgColor]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Content or Website Link</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Foreground Color</label>
            <div className="flex items-center gap-2 p-1.5 rounded-lg border">
              <input
                type="color"
                value={fgColor}
                onChange={e => setFgColor(e.target.value)}
                className="w-7 h-7 rounded border-none cursor-pointer"
              />
              <span className="text-xs font-mono">{fgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Background Color</label>
            <div className="flex items-center gap-2 p-1.5 rounded-lg border">
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className="w-7 h-7 rounded border-none cursor-pointer"
              />
              <span className="text-xs font-mono">{bgColor}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {['https://google.com', 'WIFI:S:MyWifi;T:WPA;P:mypass;;', 'mailto:contact@example.com'].map(sample => (
            <button
              key={sample}
              onClick={() => setText(sample)}
              className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 truncate max-w-[130px]"
            >
              {sample.split(':')[0]} preset
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-center">
        {qrDataUrl && (
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-xl shadow-sm inline-block border">
              <img src={qrDataUrl} alt="Generated QR code" className="w-48 h-48" />
            </div>
            <div>
              <a
                href={qrDataUrl}
                download="qrcode.png"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download High-Res PNG
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = '';
    if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generate();
  }, [length, incUpper, incLower, incNumbers, incSymbols]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
        <span className="font-mono text-base sm:text-lg tracking-wider break-all font-bold">{password}</span>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button onClick={generate} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition" title="New Password">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={copyPassword} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition" title="Copy">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Password Length</span>
            <span className="font-bold text-blue-600">{length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'A-Z Uppercase', checked: incUpper, set: setIncUpper },
            { label: 'a-z Lowercase', checked: incLower, set: setIncLower },
            { label: '0-9 Numbers', checked: incNumbers, set: setIncNumbers },
            { label: '!@# Symbols', checked: incSymbols, set: setIncSymbols },
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={e => item.set(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ColorPickerTool: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');

  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const rgb = `rgb(${r}, ${g}, ${b})`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-white shadow-lg shrink-0"
        />
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">HEX</span>
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">{color.toUpperCase()}</span>
          </div>
          <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">RGB</span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{rgb}</span>
          </div>
          <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CSS Output</span>
            <span className="font-mono text-xs text-blue-600">color: {color};</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('{"name":"OmniTools","version":"2.4.0","toolsCount":54,"categories":["image","pdf","seo","ppc"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError('');
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => formatJson(2)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">
          Format (2 Spaces)
        </button>
        <button onClick={() => formatJson(4)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          Format (4 Spaces)
        </button>
        <button onClick={minifyJson} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          Minify Compact
        </button>
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          rows={10}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste unformatted JSON here..."
          className="w-full p-3 rounded-xl border text-xs font-mono"
        />
        <textarea
          rows={10}
          value={output}
          readOnly
          placeholder="Formatted JSON will appear here..."
          className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-mono text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};

export const Base64Tool: React.FC = () => {
  const [rawText, setRawText] = useState('Hello OmniTools!');
  const [base64Text, setBase64Text] = useState('');

  const encode = () => {
    try {
      setBase64Text(btoa(unescape(encodeURIComponent(rawText))));
    } catch {
      setBase64Text('Encoding error');
    }
  };

  const decode = () => {
    try {
      setRawText(decodeURIComponent(escape(atob(base64Text))));
    } catch {
      setRawText('Decoding error: Invalid Base64 sequence');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold">Raw Text</label>
          <textarea
            rows={5}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            className="w-full p-3 rounded-xl border text-xs font-mono"
          />
          <button onClick={encode} className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
            Encode to Base64 →
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold">Base64 Encoded</label>
          <textarea
            rows={5}
            value={base64Text}
            onChange={e => setBase64Text(e.target.value)}
            className="w-full p-3 rounded-xl border text-xs font-mono"
          />
          <button onClick={decode} className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
            ← Decode to Plain Text
          </button>
        </div>
      </div>
    </div>
  );
};

export const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState(25);
  const [val2, setVal2] = useState(200);

  const [increaseOld, setIncreaseOld] = useState(100);
  const [increaseNew, setIncreaseNew] = useState(150);

  const res1 = ((val1 / 100) * val2).toFixed(2);
  const res2 = val2 !== 0 ? (((val1) / val2) * 100).toFixed(2) : '0';
  const pctChange = increaseOld !== 0 ? (((increaseNew - increaseOld) / increaseOld) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/60 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          What is X% of Y?
        </h4>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span>What is</span>
          <input
            type="number"
            value={val1}
            onChange={e => setVal1(Number(e.target.value))}
            className="w-20 p-2 rounded-lg border bg-white dark:bg-slate-900"
          />
          <span>% of</span>
          <input
            type="number"
            value={val2}
            onChange={e => setVal2(Number(e.target.value))}
            className="w-24 p-2 rounded-lg border bg-white dark:bg-slate-900"
          />
          <span>=</span>
          <span className="text-base font-extrabold text-blue-600 ml-2">{res1}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/60 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Percentage Increase / Decrease
        </h4>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span>From</span>
          <input
            type="number"
            value={increaseOld}
            onChange={e => setIncreaseOld(Number(e.target.value))}
            className="w-24 p-2 rounded-lg border bg-white dark:bg-slate-900"
          />
          <span>to</span>
          <input
            type="number"
            value={increaseNew}
            onChange={e => setIncreaseNew(Number(e.target.value))}
            className="w-24 p-2 rounded-lg border bg-white dark:bg-slate-900"
          />
          <span>=</span>
          <span className={`text-base font-extrabold ml-2 ${Number(pctChange) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {Number(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`}
          </span>
        </div>
      </div>
    </div>
  );
};

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');

  const calculateAge = () => {
    if (!birthDate) return null;
    const now = new Date();
    const dob = new Date(birthDate);

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    return { years, months, days, totalDays, totalHours };
  };

  const age = calculateAge();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold mb-1">Select Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          className="p-3 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-medium"
        />
      </div>

      {age && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-center">
            <span className="text-xs uppercase font-bold text-blue-600">Years Old</span>
            <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{age.years}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">{age.months} months, {age.days} days</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-center">
            <span className="text-xs uppercase font-bold text-slate-500">Total Days Lived</span>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">{age.totalDays.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">days on Earth</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-center">
            <span className="text-xs uppercase font-bold text-purple-600">Total Hours</span>
            <p className="text-3xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">{age.totalHours.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">hours elapsed</span>
          </div>
        </div>
      )}
    </div>
  );
};
