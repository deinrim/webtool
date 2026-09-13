import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Calculator, 
  Search, 
  QrCode, 
  Code, 
  Sliders,
  Maximize2
} from 'lucide-react';

interface HeroSliderProps {
  onNavigate: (route: string) => void;
}

export interface ImportantToolSlide {
  id: string;
  name: string;
  slug: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  metric: {
    label: string;
    value: string;
  };
  accentColor: string;
  bgGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  renderPreview: () => React.ReactNode;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const SLIDE_DURATION = 5500; // 5.5 seconds per slide
  const TICK_INTERVAL = 50;

  const slides: ImportantToolSlide[] = [
    {
      id: 'image-compressor',
      name: 'Smart Image Compressor',
      slug: 'image-compressor',
      category: 'Image Processing',
      badge: 'Most Popular',
      tagline: 'Reduce file sizes by up to 90% without visual degradation',
      description: 'Optimize WebP, PNG, JPEG, and AVIF directly in your browser. Real-time visual comparison slider with zero server upload.',
      highlights: ['Lossless & Lossy modes', 'Client-side privacy', 'Batch multi-file support', 'Direct WebP export'],
      metric: { label: 'Avg Size Reduction', value: '-84%' },
      accentColor: 'from-blue-600 to-cyan-500',
      bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
      icon: ImageIcon,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              hero-photo.jpg
            </span>
            <span className="font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              82% Saved
            </span>
          </div>
          
          {/* Comparison Bar */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Original File</span>
                <span className="font-mono text-slate-300">4.82 MB (100%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span className="text-blue-400 font-semibold">Optimized (WebP)</span>
                <span className="font-mono text-emerald-400 font-bold">867 KB (-82%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[18%]"></div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-blue-400" />
                Quality: <strong className="text-white font-mono">82%</strong>
              </span>
              <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-[10px] font-medium border border-blue-500/40">
                Instant Download Ready
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'pdf-merge',
      name: 'PDF Merge & Combine',
      slug: 'pdf-merge',
      category: 'PDF Suite',
      badge: 'Essential Tool',
      tagline: 'Combine multiple PDF files into one clean document',
      description: 'Merge invoices, contracts, scans, and slides in seconds. Reorder pages and files with client-side PDF-lib precision.',
      highlights: ['Unlimited page count', 'Drag & drop reordering', 'No file uploads to server', 'Preserves bookmarks & vector clarity'],
      metric: { label: 'Speed Execution', value: '< 1.2s' },
      accentColor: 'from-rose-600 to-orange-500',
      bgGradient: 'from-rose-500/10 via-orange-500/5 to-transparent',
      icon: FileText,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Document Merge Queue</span>
            <span className="text-orange-400 text-[11px] font-mono font-medium">3 Documents Selected</span>
          </div>

          <div className="space-y-2">
            {[
              { name: '01_Contract_Agreement.pdf', pages: '4 pages', size: '1.2 MB', color: 'border-blue-500/40 bg-blue-950/30' },
              { name: '02_Appendix_Exhibits.pdf', pages: '8 pages', size: '2.4 MB', color: 'border-purple-500/40 bg-purple-950/30' },
              { name: '03_Signatures_Certified.pdf', pages: '2 pages', size: '420 KB', color: 'border-emerald-500/40 bg-emerald-950/30' },
            ].map((doc, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg border text-xs ${doc.color}`}>
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="truncate text-slate-200">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{doc.pages}</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Result: <strong className="text-white">Unified_Bundle.pdf</strong></span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Ready to Merge
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'roas-calculator',
      name: 'ROAS & PPC Profit Calculator',
      slug: 'roas-calculator',
      category: 'PPC & Marketing',
      badge: 'Marketer Favorite',
      tagline: 'Calculate return on ad spend, breakeven, and net profits',
      description: 'Model Google Ads, Meta Ads, and TikTok campaigns. Forecast revenue, break-even ROAS threshold, and cost per acquisition.',
      highlights: ['Instant ROAS & ROI %', 'Breakeven threshold indicator', 'Profit margin adjustment', 'Multi-scenario sensitivity'],
      metric: { label: 'Target ROAS Model', value: '450%' },
      accentColor: 'from-emerald-600 to-teal-500',
      bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      icon: Calculator,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Campaign Performance Metrics</span>
            <span className="text-emerald-400 text-[11px] font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
              ROAS: 4.50x
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Ad Spend</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">$1,500.00</div>
              <div className="text-[10px] text-slate-500">Google Search</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Gross Revenue</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">$6,750.00</div>
              <div className="text-[10px] text-emerald-500/80">+350% ROI</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Breakeven ROAS</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">1.67x</div>
              <div className="text-[10px] text-slate-500">Margin: 60%</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Net Profit</div>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">+$2,550.00</div>
              <div className="text-[10px] text-cyan-500/80">Profitable ✅</div>
            </div>
          </div>

          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[78%]"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'meta-tag-generator',
      name: 'SEO Meta Tag & SERP Studio',
      slug: 'meta-tag-generator',
      category: 'SEO Suite',
      badge: 'Growth Ranking',
      tagline: 'Live Google SERP simulation and Open Graph social tags',
      description: 'Test titles and descriptions with Google character & pixel width counters. Generate validated HTML meta code in one click.',
      highlights: ['Desktop & Mobile SERP preview', 'Twitter card & OG image previews', 'Real-time pixel length meters', 'One-click HTML code export'],
      metric: { label: 'Search Rank Ready', value: '100%' },
      accentColor: 'from-indigo-600 to-blue-500',
      bgGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
      icon: Search,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Google SERP Snippet Preview</span>
            <span className="text-indigo-400 text-[11px] font-mono">Desktop View</span>
          </div>

          {/* Realistic SERP Preview */}
          <div className="p-3 rounded-lg bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 border border-slate-700/80 text-left">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">O</span>
              <span className="truncate">https://omnitools.app › tools › free-utilities</span>
            </div>
            <h5 className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
              OmniTools - 54+ Free Online Utilities For Professionals
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Instant image compression, PDF merge, ROAS calculators, and code formatting directly in browser. Zero server upload, completely private & fast.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">Title: 58 / 60 chars</span>
            <span className="text-emerald-400 font-medium">Desc: 154 / 160 chars</span>
          </div>
        </div>
      ),
    },
    {
      id: 'qr-code-generator',
      name: 'Custom QR Code Studio',
      slug: 'qr-code-generator',
      category: 'Marketing & Utilities',
      badge: 'High Precision',
      tagline: 'Generate crisp vector QR codes with colors and instant download',
      description: 'Encode website URLs, WiFi credentials, vCards, or plain text. Download high-resolution PNG or crisp SVG vector files for print and web.',
      highlights: ['Custom color palettes', 'High-res PNG & SVG downloads', 'Error correction levels (L, M, Q, H)', 'Zero tracking or expirations'],
      metric: { label: 'Download Quality', value: 'SVG / 4K' },
      accentColor: 'from-purple-600 to-pink-500',
      bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      icon: QrCode,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-medium">Interactive QR Generation</span>
            <span className="text-purple-400 text-[11px] font-mono">Vector SVG Ready</span>
          </div>

          <div className="flex items-center justify-center gap-4 py-1">
            {/* Visual Mini QR Pattern */}
            <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded flex flex-col justify-between p-1">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white"></div>
                  </div>
                  <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white"></div>
                  </div>
                </div>
                <div className="flex justify-around items-center px-1">
                  <div className="w-1.5 h-1.5 bg-white"></div>
                  <div className="w-1.5 h-1.5 bg-white"></div>
                  <div className="w-1.5 h-1.5 bg-white"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white"></div>
                  </div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-left space-y-1.5">
              <div className="text-[11px] text-slate-300 font-medium">Payload: <span className="text-purple-400 font-mono">https://omnitools.app</span></div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Palette:</span>
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-white/40"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-600"></span>
              </div>
              <div className="flex gap-1.5 pt-1">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">PNG 1024px</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">Vector SVG</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'json-formatter',
      name: 'JSON Formatter & Validator',
      slug: 'json-formatter',
      category: 'Developer Tools',
      badge: 'Clean Code',
      tagline: 'Format, validate, minify, and inspect complex JSON payloads',
      description: 'Highlight nested structures, catch syntax syntax errors with exact line numbers, and minify payloads for production APIs.',
      highlights: ['Syntax error line indicator', 'Minify & Beautify controls', 'Collapsible tree inspector', '100% private in browser'],
      metric: { label: 'Validation Engine', value: 'Zero Latency' },
      accentColor: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      icon: Code,
      renderPreview: () => (
        <div className="bg-slate-900 rounded-xl p-4 text-white font-sans border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-medium">JSON Syntax Inspection</span>
            <span className="text-emerald-400 text-[11px] font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Valid JSON
            </span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-left leading-relaxed text-slate-300 overflow-x-auto">
            <span className="text-slate-500">1</span> {'{'}<br />
            <span className="text-slate-500">2</span> &nbsp;&nbsp;<span className="text-amber-400">"status"</span>: <span className="text-emerald-400">"success"</span>,<br />
            <span className="text-slate-500">3</span> &nbsp;&nbsp;<span className="text-amber-400">"payload"</span>: {'{'}<br />
            <span className="text-slate-500">4</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-400">"tools_count"</span>: <span className="text-cyan-400">54</span>,<br />
            <span className="text-slate-500">5</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-400">"latency_ms"</span>: <span className="text-cyan-400">0.42</span><br />
            <span className="text-slate-500">6</span> &nbsp;&nbsp;{'}'}<br />
            <span className="text-slate-500">7</span> {'}'}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Encoding: UTF-8</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Format: 2 Spaces</span>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentIndex];

  // Auto slide rotation
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(progressPercent);

      if (elapsed >= SLIDE_DURATION) {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
      }
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const handleSelectSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const IconComp = currentSlide.icon;

  return (
    <div
      id="hero-important-tools-slider"
      className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background subtle aura */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} pointer-events-none transition-all duration-700`}></div>

      {/* Slide Header with Navigation & Badge */}
      <div className="relative p-5 sm:p-6 pb-2 z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              <Sparkles className="w-3 h-3" />
              Featured Slide {currentIndex + 1} of 6
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {currentSlide.category}
            </span>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              id="slider-btn-prev"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="slider-btn-next"
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Title & Tagline */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentSlide.accentColor} text-white shadow-lg shadow-blue-500/20 shrink-0`}>
            <IconComp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {currentSlide.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {currentSlide.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Slide Preview & Value Proposition */}
      <div className="relative px-5 sm:px-6 py-2 z-10">
        {/* Interactive Simulated Preview */}
        <div className="my-2">
          {currentSlide.renderPreview()}
        </div>

        {/* Feature checklist bullets */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
          {currentSlide.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className="truncate">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Footer with Primary CTA & Progress Bar */}
      <div className="relative p-5 sm:p-6 pt-3 z-10 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              {currentSlide.metric.label}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono">
              {currentSlide.metric.value}
            </span>
          </div>

          <button
            id={`launch-tool-${currentSlide.slug}`}
            onClick={() => onNavigate(`/tools/${currentSlide.slug}`)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r ${currentSlide.accentColor} hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-95 transition`}
          >
            <span>Launch Tool Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Quick Tabs Indicators with tool names and progress */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id}
                id={`slider-tab-${s.slug}`}
                onClick={() => handleSelectSlide(idx)}
                className={`relative py-1.5 px-1 rounded-lg text-[10px] font-medium text-center transition flex flex-col items-center ${
                  isActive 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-sm border border-slate-200 dark:border-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate w-full block font-mono text-[9px]">
                  0{idx + 1}
                </span>
                
                {/* Active animated progress line */}
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full bg-blue-600 dark:bg-blue-400 transition-all ${isActive ? '' : 'w-0'}`}
                    style={{ width: isActive ? `${progress}%` : '0%' }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
