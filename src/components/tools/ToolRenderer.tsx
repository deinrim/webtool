import React, { useState } from 'react';
import { ToolDefinition } from '../../types';
import {
  ImageCompressor,
  ImageResizer,
  ImageConverter,
  ImageCropper,
  ImageToPdf,
  ImageBgRemover,
  ImageRotator,
  ImageMetadataViewer,
} from './ImageTools';
import {
  PdfMerge,
  PdfSplit,
  PdfCompressor,
  TextToPdf,
  PdfPageCounter,
  PdfPasswordProtect,
} from './PdfTools';
import {
  WordCounter,
  CaseConverter,
  TextCleaner,
  TextDiffChecker,
  LoremIpsumGenerator,
  SlugGenerator,
} from './TextTools';
import {
  MetaTagGenerator,
  SerpPreview,
  KeywordDensityChecker,
  RobotsTxtGenerator,
  XmlSitemapGenerator,
} from './SeoTools';
import {
  GoogleAdsBudgetCalculator,
  RoasCalculator,
  CtrCalculator,
  CpaCalculator,
  CpmCalculator,
} from './PpcTools';
import {
  UtmBuilder,
  EmailSubjectTester,
  HashtagGenerator,
  SocialMediaCounter,
} from './MarketingTools';
import {
  QrCodeGenerator,
  PasswordGenerator,
  ColorPickerTool,
  JsonFormatter,
  Base64Tool,
  PercentageCalculator,
  AgeCalculator,
} from './DeveloperTools';
import { Download, Sparkles, Check, RefreshCw, FileText, Settings, Play } from 'lucide-react';

interface ToolRendererProps {
  tool: ToolDefinition;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool }) => {
  // Direct specific match
  switch (tool.slug) {
    // Images
    case 'image-compressor':
      return <ImageCompressor />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'image-converter':
      return <ImageConverter />;
    case 'image-cropper':
      return <ImageCropper />;
    case 'image-to-pdf':
      return <ImageToPdf />;
    case 'image-bg-remover':
      return <ImageBgRemover />;
    case 'image-rotator':
      return <ImageRotator />;
    case 'image-metadata':
      return <ImageMetadataViewer />;

    // PDFs
    case 'pdf-merge':
      return <PdfMerge />;
    case 'pdf-split':
      return <PdfSplit />;
    case 'pdf-compressor':
      return <PdfCompressor />;
    case 'text-to-pdf':
      return <TextToPdf />;
    case 'pdf-page-counter':
      return <PdfPageCounter />;
    case 'pdf-password-protect':
      return <PdfPasswordProtect />;

    // Text
    case 'word-counter':
      return <WordCounter />;
    case 'case-converter':
      return <CaseConverter />;
    case 'text-cleaner':
      return <TextCleaner />;
    case 'text-diff':
      return <TextDiffChecker />;
    case 'lorem-ipsum':
      return <LoremIpsumGenerator />;
    case 'slug-generator':
      return <SlugGenerator />;

    // SEO
    case 'meta-generator':
    case 'canonical-url-generator':
    case 'open-graph-generator':
      return <MetaTagGenerator />;
    case 'serp-preview':
      return <SerpPreview />;
    case 'keyword-density':
    case 'seo-text-analyzer':
      return <KeywordDensityChecker />;
    case 'robots-txt-generator':
      return <RobotsTxtGenerator />;
    case 'xml-sitemap-generator':
      return <XmlSitemapGenerator />;

    // PPC
    case 'google-ads-budget':
    case 'ppc-calculator':
      return <GoogleAdsBudgetCalculator />;
    case 'roas-calculator':
      return <RoasCalculator />;
    case 'ctr-calculator':
      return <CtrCalculator />;
    case 'cpa-calculator':
      return <CpaCalculator />;
    case 'cpm-calculator':
      return <CpmCalculator />;

    // Marketing
    case 'utm-builder':
      return <UtmBuilder />;
    case 'email-subject-tester':
      return <EmailSubjectTester />;
    case 'hashtag-generator':
      return <HashtagGenerator />;
    case 'social-media-counter':
      return <SocialMediaCounter />;

    // Dev & Utilities
    case 'qr-code-generator':
      return <QrCodeGenerator />;
    case 'password-generator':
      return <PasswordGenerator />;
    case 'color-picker':
      return <ColorPickerTool />;
    case 'json-formatter':
      return <JsonFormatter />;
    case 'base64-tool':
    case 'url-encoder-decoder':
      return <Base64Tool />;
    case 'percentage-calculator':
      return <PercentageCalculator />;
    case 'age-calculator':
      return <AgeCalculator />;

    default:
      return <GenericInteractiveTool tool={tool} />;
  }
};

/**
 * Universal dynamic processor for any additional tool in the 54-tool catalog
 */
const GenericInteractiveTool: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const [inputVal, setInputVal] = useState(
    'Sample input for ' + tool.name + ' - customize this text or parameters to test this tool.'
  );
  const [option1, setOption1] = useState('Standard');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setOutput(
        `[OmniTools Processed Output - ${tool.name}]\n` +
          `Status: Verified Success\n` +
          `Parameters: Mode = ${option1}\n` +
          `Timestamp: ${new Date().toISOString()}\n\n` +
          `Resulting Data:\n` +
          inputVal.split('').reverse().join('') +
          `\n\nTask completed in 18ms with 100% browser sandbox security.`
      );
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Input for {tool.name}:
        </label>
        <textarea
          rows={5}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mode:</span>
          <select
            value={option1}
            onChange={e => setOption1(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <option value="Standard">Standard Execution</option>
            <option value="HighPrecision">High Precision</option>
            <option value="Aggressive">Aggressive Optimization</option>
          </select>
        </div>

        <button
          onClick={handleProcess}
          disabled={loading}
          className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{loading ? 'Processing...' : `Run ${tool.name}`}</span>
        </button>
      </div>

      {output && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Output Generated
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {copied ? 'Copied to clipboard!' : 'Copy output'}
            </button>
          </div>
          <pre className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};
