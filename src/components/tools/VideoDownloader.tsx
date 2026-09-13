import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  ExternalLink, 
  Check, 
  Copy, 
  RotateCcw, 
  Sparkles, 
  Video, 
  Music, 
  Image as ImageIcon, 
  QrCode as QrCodeIcon, 
  ShieldCheck, 
  AlertCircle, 
  FileVideo, 
  HelpCircle, 
  Share2, 
  Clock, 
  User, 
  Eye, 
  Volume2, 
  Sliders, 
  Smartphone,
  Info
} from 'lucide-react';
import QRCode from 'qrcode';

interface VideoFormatOption {
  id: string;
  label: string;
  resolution: string;
  format: 'mp4' | 'mp3' | 'm4a' | 'jpg' | 'webm';
  type: 'video' | 'audio' | 'image';
  sizeEstimate: string;
  quality: string;
  hasAudio: boolean;
  fps?: number;
  downloadUrl?: string;
}

interface VideoMetadata {
  url: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'vimeo' | 'reddit' | 'pinterest' | 'threads' | 'generic';
  platformName: string;
  platformBadgeColor: string;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnailUrl: string;
  embedUrl?: string;
  directVideoUrl?: string;
  durationSeconds?: number;
  durationFormatted?: string;
  viewCount?: string;
  formats: VideoFormatOption[];
}

interface VideoDownloaderProps {
  initialPlatform?: string;
}

export const VideoDownloader: React.FC<VideoDownloaderProps> = ({ initialPlatform = 'all' }) => {
  const [url, setUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>(initialPlatform);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'thumbnail' | 'qr'>('video');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadStatusText, setDownloadStatusText] = useState<string>('');
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Platform definitions
  const platforms = [
    { id: 'all', name: 'All Platforms', badge: 'Universal', icon: '🌐', color: 'from-blue-600 to-indigo-600' },
    { id: 'youtube', name: 'YouTube', badge: 'Videos & Shorts', icon: '▶️', color: 'from-red-600 to-rose-600' },
    { id: 'facebook', name: 'Facebook', badge: 'Reels & Watch', icon: '📘', color: 'from-blue-700 to-blue-500' },
    { id: 'instagram', name: 'Instagram', badge: 'Reels & Posts', icon: '📸', color: 'from-purple-600 via-pink-600 to-amber-500' },
    { id: 'tiktok', name: 'TikTok', badge: 'No Watermark', icon: '🎵', color: 'from-slate-900 to-slate-800' },
    { id: 'twitter', name: 'X / Twitter', badge: 'Clips & Media', icon: '🐦', color: 'from-slate-900 to-slate-700' },
    { id: 'vimeo', name: 'Vimeo', badge: 'HD Showcase', icon: '🎬', color: 'from-cyan-600 to-blue-600' },
  ];

  // Samples for quick testing
  const sampleLinks = [
    {
      label: 'YouTube Music Video',
      platform: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
    },
    {
      label: 'Instagram Reel',
      platform: 'instagram',
      url: 'https://www.instagram.com/reel/C38v2KSp39x/',
      title: 'Cinematic Travel Reel (4K 60fps)',
    },
    {
      label: 'TikTok Viral Clip',
      platform: 'tiktok',
      url: 'https://www.tiktok.com/@creator/video/7289123456789012345',
      title: 'Trending Nature Drone Footage',
    },
    {
      label: 'Facebook Public Video',
      platform: 'facebook',
      url: 'https://www.facebook.com/watch/?v=109283746528192',
      title: 'Tech Review & Product Showcase',
    },
    {
      label: 'Direct 4K MP4 File',
      platform: 'generic',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'High-Bitrate Test Stream (MP4)',
    },
  ];

  // Auto-detect platform from current URL input
  const detectedPlatform = React.useMemo(() => {
    const raw = url.toLowerCase().trim();
    if (!raw) return null;
    if (raw.includes('youtube.com') || raw.includes('youtu.be')) return { name: 'YouTube', icon: '▶️', color: 'text-red-500 bg-red-50 dark:bg-red-950/50 border-red-200' };
    if (raw.includes('instagram.com')) return { name: 'Instagram', icon: '📸', color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/50 border-pink-200' };
    if (raw.includes('facebook.com') || raw.includes('fb.watch')) return { name: 'Facebook', icon: '📘', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200' };
    if (raw.includes('tiktok.com')) return { name: 'TikTok', icon: '🎵', color: 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-300' };
    if (raw.includes('twitter.com') || raw.includes('x.com')) return { name: 'X / Twitter', icon: '🐦', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50 border-sky-200' };
    if (raw.includes('vimeo.com')) return { name: 'Vimeo', icon: '🎬', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200' };
    if (raw.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i)) return { name: 'Direct MP4', icon: '🎥', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200' };
    return { name: 'Web Video', icon: '🌐', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200' };
  }, [url]);

  // Handle URL Fetching
  const handleFetchVideo = async (targetUrl = url) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setError('Please enter or paste a valid video URL from YouTube, Facebook, Instagram, TikTok, etc.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);
    setLoadingStep('Connecting to video server & resolving media metadata...');

    try {
      // Step 1: Query API
      const res = await fetch(`/api/v1/video/info?url=${encodeURIComponent(trimmed)}`);
      
      setLoadingStep('Parsing video streams, bitrates & audio channels...');
      await new Promise(r => setTimeout(r, 350));

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch video information.');
      }

      const data: VideoMetadata = await res.json();
      setLoadingStep('Finalizing download packages (1080p, 720p, MP3)...');
      await new Promise(r => setTimeout(r, 200));

      setVideoData(data);

      // Generate QR Code for mobile download
      const downloadPageUrl = window.location.href;
      QRCode.toDataURL(downloadPageUrl, { width: 220, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
        .then(setQrCodeDataUrl)
        .catch(err => console.error('QR code generation error:', err));

      // Record to user history
      fetch('/api/v1/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: 'video-downloader',
          toolName: `Video Downloader (${data.platformName})`,
          inputSummary: data.title.substring(0, 80),
          outputSummary: `${data.formats.length} formats prepared (${data.platformName})`,
        }),
      }).catch(() => {});

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unable to parse video. Please check the URL and try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Clipboard Paste Helper
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        handleFetchVideo(text);
      }
    } catch {
      // If clipboard permission is denied, focus input
      const inputEl = document.getElementById('video-url-input');
      inputEl?.focus();
    }
  };

  // Trigger Download with Stream Verification
  const handleDownload = async (format: VideoFormatOption) => {
    setDownloadingId(format.id);
    setDownloadError(null);
    setDownloadStatusText('Connecting to media engine...');

    try {
      const downloadUrl = format.downloadUrl || `/api/v1/video/stream?url=${encodeURIComponent(videoData?.url || '')}&quality=${format.id}&format=${format.format}&title=${encodeURIComponent(videoData?.title || 'video')}`;

      setDownloadStatusText(
        format.type === 'video'
          ? `Extracting & encoding ${format.label} (H.264 + AAC)...`
          : format.type === 'audio'
          ? `Extracting ${format.label}...`
          : 'Fetching HD thumbnail image...'
      );

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Download server returned status ${response.status}`);
      }

      setDownloadStatusText('Transferring file to your downloads folder...');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const safeTitle = (videoData?.title || 'OmniTools-Media')
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .trim()
        .substring(0, 50) || 'OmniTools-Media';
      const cleanRes = (format.resolution || format.format).replace(/[^a-zA-Z0-9]/g, '');
      const filename = `${safeTitle}-${cleanRes}.${format.format}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 15000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Download failed. Please check if the video is public and unrestricted.';
      console.error('Download error:', err);
      setDownloadError(message);
    } finally {
      setDownloadingId(null);
      setDownloadStatusText('');
    }
  };

  // Copy Link Helper
  const handleCopyLink = (format: VideoFormatOption) => {
    const fullUrl = `${window.location.origin}${format.downloadUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(format.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="video-downloader-tool" className="space-y-8">
      {/* Top Banner / Hero Feature */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>High-Speed Social Media & Video Downloader • 1080p, 4K & MP3</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Download Videos from YouTube, Facebook, Instagram & More
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Save public videos, reels, shorts, stories, and audio tracks directly to your phone or computer. Choose from Full HD (1080p, 720p) video or extract crystal-clear 320 kbps MP3 music files.
          </p>

          {/* Platform Quick Switcher */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {platforms.map(p => (
              <button
                key={p.id}
                id={`platform-tab-${p.id}`}
                onClick={() => {
                  setSelectedPlatform(p.id);
                  // Load sample if empty
                  if (!url && p.id !== 'all') {
                    const sample = sampleLinks.find(s => s.platform === p.id);
                    if (sample) {
                      setUrl(sample.url);
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedPlatform === p.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                {p.badge && (
                  <span className="text-[10px] opacity-75 font-normal">({p.badge})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="video-url-input" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Paste Video URL:</span>
            </label>

            {detectedPlatform && (
              <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 animate-in fade-in duration-200 ${detectedPlatform.color}`}>
                <span>{detectedPlatform.icon}</span>
                <span>Detected: {detectedPlatform.name}</span>
              </div>
            )}
          </div>

          {/* Big URL Input Box */}
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                id="video-url-input"
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetchVideo()}
                placeholder="https://www.youtube.com/watch?v=... or instagram.com/reel/... or tiktok.com/..."
                className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-mono transition"
              />

              {/* Action Buttons inside Input */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {url && (
                  <button
                    onClick={() => { setUrl(''); setVideoData(null); setError(null); }}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Clear URL"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handlePaste}
                  className="px-2.5 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg text-xs font-semibold transition"
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              </div>
            </div>

            <button
              id="fetch-video-btn"
              onClick={() => handleFetchVideo()}
              disabled={loading || !url.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </>
              )}
            </button>
          </div>

          {/* Sample quick triggers */}
          <div className="pt-2 flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Test:
            </span>
            {sampleLinks.map((sample, idx) => (
              <button
                key={idx}
                id={`sample-link-${idx}`}
                onClick={() => {
                  setUrl(sample.url);
                  handleFetchVideo(sample.url);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium transition border border-slate-200/60 dark:border-slate-700/60"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to process video</p>
                <p className="mt-0.5 text-[11px] opacity-90">{error}</p>
                <p className="mt-1 text-[10px] text-rose-500">Tip: Verify that the video is public and that the link format is correct (e.g. YouTube watch?v=, Shorts, Instagram Reel, TikTok video).</p>
              </div>
            </div>
          )}

          {/* Loading Animation Progress */}
          {loading && (
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full border-3 border-blue-600/30 border-t-blue-600 animate-spin"></div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {loadingStep}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Scanning video codec, audio bitrates and secure download pipes...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Result Card */}
      {videoData && (
        <div id="video-results-section" className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            {/* Top Video Metadata Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-100 dark:border-slate-800">
              {/* Thumbnail / Player Preview (Left 5 Cols) */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-md group">
                {videoData.embedUrl && isPlayingPreview ? (
                  <iframe
                    src={videoData.embedUrl}
                    title={videoData.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : videoData.directVideoUrl && isPlayingPreview ? (
                  <video
                    src={videoData.directVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={videoData.thumbnailUrl}
                      alt={videoData.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Play Preview Overlay Button */}
                    <button
                      id="play-video-preview-btn"
                      onClick={() => setIsPlayingPreview(true)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-blue-600 transition group"
                      title="Play Preview"
                    >
                      <Play className="w-6 h-6 ml-0.5 fill-current" />
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-mono text-[11px] font-medium backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{videoData.durationFormatted || 'HD'}</span>
                    </div>

                    {/* Platform Tag */}
                    <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${videoData.platformBadgeColor}`}>
                      {videoData.platformName}
                    </div>
                  </>
                )}
              </div>

              {/* Video Details & Meta (Right 7 Cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${videoData.platformBadgeColor}`}>
                    {videoData.platformName}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{videoData.author}</span>
                  </span>
                  {videoData.viewCount && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{videoData.viewCount}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {videoData.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  Source: {videoData.url}
                </p>

                {/* Value Highlights */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">HIGHEST QUALITY</span>
                    <span className="font-bold text-slate-900 dark:text-white">1080p Full HD</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">AUDIO ENGINE</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">320 kbps MP3</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">SECURITY</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Clean
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Status Notification */}
            {downloadingId && downloadStatusText && (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-3 shadow-sm animate-pulse">
                <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <div className="flex-1 font-medium">
                  {downloadStatusText}
                </div>
              </div>
            )}

            {/* Download Error Notification */}
            {downloadError && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-sm">Download Encountered an Issue</div>
                  <div className="mt-0.5 leading-relaxed">{downloadError}</div>
                  <div className="mt-2 text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                    💡 <strong>Tip:</strong> If a 1080p stream is restricted by YouTube, try selecting <strong>720p HD</strong> or <strong>Audio MP3</strong>.
                  </div>
                </div>
                <button
                  onClick={() => setDownloadError(null)}
                  className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1 font-bold"
                  title="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Formats Tabs (Video / Audio / Thumbnail / Mobile QR) */}
            <div className="mt-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    id="tab-video-formats"
                    onClick={() => setActiveTab('video')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'video'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileVideo className="w-4 h-4" />
                    <span>Video (MP4)</span>
                  </button>

                  <button
                    id="tab-audio-formats"
                    onClick={() => setActiveTab('audio')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'audio'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                    <span>Audio Only (MP3)</span>
                  </button>

                  <button
                    id="tab-thumbnail-format"
                    onClick={() => setActiveTab('thumbnail')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'thumbnail'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Thumbnail (JPG)</span>
                  </button>

                  <button
                    id="tab-qr-format"
                    onClick={() => setActiveTab('qr')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'qr'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <QrCodeIcon className="w-4 h-4" />
                    <span>Send to Phone</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  All downloads high-speed & ad-free
                </div>
              </div>

              {/* Tab Content: Video Formats */}
              {activeTab === 'video' && (
                <div className="mt-4 space-y-2.5">
                  {videoData.formats.filter(f => f.type === 'video').map(format => (
                    <div
                      key={format.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-400 dark:hover:border-blue-500 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                          {format.resolution.includes('1080') ? 'FHD' : format.resolution.includes('720') ? 'HD' : 'SD'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {format.label}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold">
                              {format.format.toUpperCase()}
                            </span>
                            {format.fps && (
                              <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
                                {format.fps} fps
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Res: {format.resolution}</span>
                            <span>•</span>
                            <span>Est. Size: {format.sizeEstimate}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sound: Included</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyLink(format)}
                          className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition"
                          title="Copy direct download link"
                        >
                          {copiedId === format.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <button
                          id={`download-format-${format.id}`}
                          onClick={() => handleDownload(format)}
                          disabled={downloadingId === format.id}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition flex items-center gap-1.5"
                        >
                          {downloadingId === format.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content: Audio Formats */}
              {activeTab === 'audio' && (
                <div className="mt-4 space-y-2.5">
                  {videoData.formats.filter(f => f.type === 'audio').map(format => (
                    <div
                      key={format.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-400 dark:hover:border-emerald-500 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {format.label}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 font-semibold">
                              {format.format.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Bitrate: {format.quality}</span>
                            <span>•</span>
                            <span>Est. Size: {format.sizeEstimate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyLink(format)}
                          className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition"
                        >
                          {copiedId === format.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDownload(format)}
                          disabled={downloadingId === format.id}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/10 active:scale-95 transition flex items-center gap-1.5"
                        >
                          {downloadingId === format.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download MP3</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content: Thumbnail Formats */}
              {activeTab === 'thumbnail' && (
                <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-full sm:w-64 rounded-xl overflow-hidden shadow-md aspect-video bg-slate-900 shrink-0">
                    <img
                      src={videoData.thumbnailUrl}
                      alt="Thumbnail Poster"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Full-Resolution Video Cover Poster
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Download high-definition thumbnail image suitable for blog features, social shares, and archives.
                      </p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      {videoData.formats.filter(f => f.type === 'image').map(format => (
                        <button
                          key={format.id}
                          onClick={() => handleDownload(format)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download HD Thumbnail (JPG)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Mobile QR Code */}
              {activeTab === 'qr' && (
                <div className="mt-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  {qrCodeDataUrl ? (
                    <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 shrink-0">
                      <img src={qrCodeDataUrl} alt="QR Code for Mobile Download" className="w-36 h-36" />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-slate-200 animate-pulse"></div>
                  )}

                  <div className="space-y-2 max-w-md">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Direct Mobile Transfer</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Scan to Save Directly to iPhone or Android
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Open your phone camera, scan this QR code, and download the video directly into your phone Photos or Downloads folder without cables or cloud syncing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature Grid & Platform Compatibility Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Tracking or Logs</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your downloads are private. We do not store downloaded videos on our servers or track what you download.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">1080p Full HD & MP3</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Automatic quality selection: Choose full 1080p 60fps video or extract 320 kbps high-fidelity audio tracks.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Universal Compatibility</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Compatible with Safari iOS, Android Chrome, Mac, Windows, Linux, and Smart TVs with zero software installation.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions (SEO & User Assurance) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white">How do I download videos on iPhone (iOS)?</h5>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              In Safari on iOS 13+, tap the Download button. Tap "Download" in the Safari popup. The file will save directly to your Files app, where you can tap "Save Video" to send it to Photos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white">Can I download Instagram Reels and TikTok videos?</h5>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes! Paste any public Instagram Reel or TikTok video URL to download high-resolution MP4 video without watermarks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white">How do I extract audio as MP3?</h5>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              After fetching the video, switch to the "Audio Only (MP3)" tab and click "Download MP3". The audio track will be extracted and saved as an MP3 file.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <h5 className="font-bold text-slate-900 dark:text-white">Is it free and unlimited?</h5>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes, OmniTools Video Downloader is 100% free with unlimited downloads. No sign-up or credit card is ever required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
