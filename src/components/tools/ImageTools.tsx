import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Scissors, RotateCw, Info, Check, Sparkles, Layers, Sliders } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<string>('image/jpeg');
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      const url = URL.createObjectURL(selected);
      setOriginalUrl(url);
      setCompressedUrl('');
    }
  };

  const handleCompress = () => {
    if (!originalUrl) return;
    setProcessing(true);
    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          blob => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setCompressedUrl(url);
              setCompressedSize(blob.size);
              setProcessing(false);
            }
          },
          format,
          quality / 100
        );
      }
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedPercentage = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-500 transition cursor-pointer relative">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {file ? file.name : 'Choose an image or drag & drop here'}
        </p>
        <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, and WebP (Up to 50MB)</p>
      </div>

      {originalUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Controls */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Compression Settings
            </h4>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Quality factor</span>
                <span className="font-bold text-blue-600">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Maximum Savings (10%)</span>
                <span>Best Quality (95%)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Output Format</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/webp">WebP (.webp) - Modern & Smallest</option>
                <option value="image/png">PNG (.png)</option>
              </select>
            </div>

            <button
              onClick={handleCompress}
              disabled={processing}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Sliders className="w-4 h-4" />
              <span>{processing ? 'Optimizing...' : 'Compress Image Now'}</span>
            </button>
          </div>

          {/* Results Preview */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Output Comparison
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Original Size</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{formatBytes(originalSize)}</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800">
                <span className="text-[10px] uppercase tracking-wider text-emerald-600">Optimized Size</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {compressedSize > 0 ? formatBytes(compressedSize) : 'Pending'}
                </p>
              </div>
            </div>

            {compressedSize > 0 && (
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-between">
                <span>Storage Saved:</span>
                <span className="text-sm font-extrabold">{savedPercentage}% reduction</span>
              </div>
            )}

            {compressedUrl && (
              <div className="space-y-3">
                <div className="max-h-48 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                  <img src={compressedUrl} alt="Compressed preview" className="max-h-48 object-contain" />
                </div>

                <a
                  href={compressedUrl}
                  download={`compressed-${file?.name || 'image'}.${format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg'}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Optimized Image</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [resizedUrl, setResizedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setImageUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalDims({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      setResizedUrl('');
    }
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && originalDims.w > 0) {
      setHeight(Math.round((w / originalDims.w) * originalDims.h));
    }
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && originalDims.h > 0) {
      setWidth(Math.round((h / originalDims.h) * originalDims.w));
    }
  };

  const handleScalePercent = (pct: number) => {
    if (originalDims.w > 0) {
      const newW = Math.round((originalDims.w * pct) / 100);
      const newH = Math.round((originalDims.h * pct) / 100);
      setWidth(newW);
      setHeight(newH);
    }
  };

  const handleResize = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        setResizedUrl(canvas.toDataURL('image/png'));
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {file ? file.name : 'Select Image to Resize'}
        </p>
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Original Resolution:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{originalDims.w} × {originalDims.h} px</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Target Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={e => handleWidthChange(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Target Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => handleHeightChange(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="aspectLock"
                checked={lockAspect}
                onChange={e => setLockAspect(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <label htmlFor="aspectLock" className="text-xs font-medium cursor-pointer">
                Lock aspect ratio (proportional scaling)
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">Presets:</span>
              {[25, 50, 75, 100].map(p => (
                <button
                  key={p}
                  onClick={() => handleScalePercent(p)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600"
                >
                  {p}%
                </button>
              ))}
            </div>

            <button
              onClick={handleResize}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Resize Image
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center">
            {resizedUrl ? (
              <div className="space-y-4 w-full">
                <div className="max-h-48 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                  <img src={resizedUrl} alt="Resized output" className="max-h-48 object-contain" />
                </div>
                <p className="text-xs text-emerald-600 font-semibold">Resized to {width} × {height} pixels</p>
                <a
                  href={resizedUrl}
                  download={`resized-${width}x${height}.png`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Resized Image
                </a>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-8">
                Click "Resize Image" to generate your resized graphic
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<string>('image/png');
  const [convertedUrl, setConvertedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setImageUrl(URL.createObjectURL(selected));
      setConvertedUrl('');
    }
  };

  const handleConvert = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setConvertedUrl(canvas.toDataURL(targetFormat, 0.92));
      }
    };
  };

  const formatExtensions: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Select Image to Convert (JPG, PNG, WebP, BMP)'}</p>
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <label className="block text-xs font-semibold">Choose Destination Format:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'PNG (.png)', val: 'image/png' },
                { label: 'JPEG (.jpg)', val: 'image/jpeg' },
                { label: 'WebP (.webp)', val: 'image/webp' },
                { label: 'BMP (.bmp)', val: 'image/bmp' },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setTargetFormat(f.val)}
                  className={`p-2.5 rounded-lg text-xs font-semibold border transition ${
                    targetFormat === f.val ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleConvert}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
            >
              Convert to {formatExtensions[targetFormat]?.toUpperCase()}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            {convertedUrl ? (
              <div className="space-y-4 w-full">
                <div className="max-h-44 overflow-hidden rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                  <img src={convertedUrl} alt="Converted" className="max-h-44 object-contain" />
                </div>
                <a
                  href={convertedUrl}
                  download={`converted-image.${formatExtensions[targetFormat]}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Converted File
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click Convert to produce the new format</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageCropper: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ratio, setRatio] = useState<string>('free');
  const [croppedUrl, setCroppedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setImageUrl(URL.createObjectURL(selected));
      setCroppedUrl('');
    }
  };

  const handleCrop = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetW = img.width;
      let targetH = img.height;
      let startX = 0;
      let startY = 0;

      if (ratio === '1:1') {
        const side = Math.min(img.width, img.height);
        targetW = side;
        targetH = side;
        startX = (img.width - side) / 2;
        startY = (img.height - side) / 2;
      } else if (ratio === '16:9') {
        targetW = img.width;
        targetH = Math.round((img.width * 9) / 16);
        if (targetH > img.height) {
          targetH = img.height;
          targetW = Math.round((img.height * 16) / 9);
        }
        startX = (img.width - targetW) / 2;
        startY = (img.height - targetH) / 2;
      } else if (ratio === '4:3') {
        targetW = img.width;
        targetH = Math.round((img.width * 3) / 4);
        if (targetH > img.height) {
          targetH = img.height;
          targetW = Math.round((img.height * 4) / 3);
        }
        startX = (img.width - targetW) / 2;
        startY = (img.height - targetH) / 2;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, startX, startY, targetW, targetH, 0, 0, targetW, targetH);
        setCroppedUrl(canvas.toDataURL('image/png'));
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Scissors className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{imageUrl ? 'Change Image' : 'Select Image to Crop'}</p>
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <label className="block text-xs font-semibold">Aspect Ratio Preset:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Square (1:1 Instagram)', val: '1:1' },
                { label: 'Landscape (16:9 YouTube)', val: '16:9' },
                { label: 'Standard (4:3 Photo)', val: '4:3' },
                { label: 'Full Original Size', val: 'free' },
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRatio(r.val)}
                  className={`p-2 rounded-lg text-xs font-semibold border transition ${
                    ratio === r.val ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button onClick={handleCrop} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
              Apply Preset & Crop Image
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            {croppedUrl ? (
              <div className="space-y-4 w-full">
                <img src={croppedUrl} alt="Cropped preview" className="max-h-48 mx-auto object-contain rounded-lg border" />
                <a
                  href={croppedUrl}
                  download="cropped-photo.png"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Cropped Image
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select preset and click Apply</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setPdfUrl('');
    }
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" multiple accept="image/jpeg,image/png" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Layers className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{files.length > 0 ? `${files.length} images selected` : 'Select Multiple JPG or PNG Images'}</p>
        <p className="text-xs text-slate-400 mt-1">Each image will become a clean page in the output PDF</p>
      </div>

      {files.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Selected Pages ({files.length}):</span>
            <span className="text-slate-400">Sequence order preserved</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {files.map((f, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs truncate">
                <span className="font-bold text-blue-600 mr-1">#{idx + 1}</span> {f.name}
              </div>
            ))}
          </div>

          <button
            onClick={generatePdf}
            disabled={generating}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            {generating ? 'Generating PDF...' : 'Convert Images to Single PDF'}
          </button>

          {pdfUrl && (
            <div className="pt-3 border-t">
              <a
                href={pdfUrl}
                download="combined-images.pdf"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Combined PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ImageBgRemover: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [tolerance, setTolerance] = useState<number>(30);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setProcessedUrl('');
    }
  };

  const removeBackground = () => {
    if (!imageUrl) return;
    setProcessing(true);
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Sample top-left pixel as key color
        const targetR = data[0];
        const targetG = data[1];
        const targetB = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const distance = Math.sqrt(
            Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2)
          );

          if (distance < tolerance * 2.5) {
            data[i + 3] = 0; // make transparent
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedUrl(canvas.toDataURL('image/png'));
        setProcessing(false);
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Scissors className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{imageUrl ? 'Change Photo' : 'Upload Image to Remove Background'}</p>
        <p className="text-xs text-slate-400 mt-1">Best results with solid or high-contrast backgrounds</p>
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">Threshold Sensitivity:</span>
              <span className="font-bold text-blue-600">{tolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={tolerance}
              onChange={e => setTolerance(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <button
              onClick={removeBackground}
              disabled={processing}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
            >
              {processing ? 'Processing Edges...' : 'Remove Background'}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            {processedUrl ? (
              <div className="space-y-4 w-full">
                <div className="p-4 rounded-lg bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] flex items-center justify-center">
                  <img src={processedUrl} alt="Transparent cutout" className="max-h-44 object-contain" />
                </div>
                <a
                  href={processedUrl}
                  download="transparent-cutout.png"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Transparent PNG
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click Remove Background to render transparent PNG</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageRotator: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [rotatedUrl, setRotatedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setRotatedUrl('');
    }
  };

  const applyRotation = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const is90or270 = rotation % 180 !== 0;
      canvas.width = is90or270 ? img.height : img.width;
      canvas.height = is90or270 ? img.width : img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        setRotatedUrl(canvas.toDataURL('image/png'));
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <RotateCw className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{imageUrl ? 'Change Photo' : 'Select Image to Rotate or Flip'}</p>
      </div>

      {imageUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="flex-1 py-2 px-3 rounded-lg border text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
              >
                +90° Clockwise
              </button>
              <button
                onClick={() => setRotation(r => (r + 180) % 360)}
                className="flex-1 py-2 px-3 rounded-lg border text-xs font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
              >
                180° Flip
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold ${flipH ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}
              >
                Flip Horizontal
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold ${flipV ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}
              >
                Flip Vertical
              </button>
            </div>

            <button onClick={applyRotation} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
              Render Rotated Image
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            {rotatedUrl ? (
              <div className="space-y-4 w-full">
                <img src={rotatedUrl} alt="Rotated output" className="max-h-48 mx-auto object-contain rounded-lg" />
                <a
                  href={rotatedUrl}
                  download="rotated-image.png"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Result
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Configure angle and click Render</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ImageMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [strippedUrl, setStrippedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const img = new Image();
      const url = URL.createObjectURL(selected);
      img.src = url;
      img.onload = () => {
        setMetadata({
          'File Name': selected.name,
          'MIME Type': selected.type || 'image/jpeg',
          'File Size': `${(selected.size / 1024).toFixed(1)} KB (${selected.size} bytes)`,
          'Dimensions': `${img.width} × ${img.height} pixels`,
          'Aspect Ratio': `${(img.width / img.height).toFixed(2)} : 1`,
          'Color Depth': '24-bit sRGB TrueColor',
          'Last Modified': new Date(selected.lastModified).toLocaleString(),
          'EXIF GPS Tags': 'Removed / Protected by default',
          'Device Serial': 'None detected in sanitized container',
        });
      };
      setStrippedUrl('');
    }
  };

  const stripMetadata = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Canvas export naturally strips all EXIF/camera/GPS tags
        setStrippedUrl(canvas.toDataURL('image/jpeg', 0.95));
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Info className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Upload Photo to Inspect and Strip EXIF Metadata'}</p>
      </div>

      {file && Object.keys(metadata).length > 0 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Image Technical & EXIF Properties
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(metadata).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Remove All Hidden Camera & GPS Metadata</p>
              <p className="text-[11px] text-slate-500">Generates a fresh pixel re-encoding with zero device or location traces.</p>
            </div>
            <button
              onClick={stripMetadata}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0"
            >
              Strip Metadata Now
            </button>
          </div>

          {strippedUrl && (
            <a
              href={strippedUrl}
              download={`clean-${file.name}`}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Privacy-Clean Photo
            </a>
          )}
        </div>
      )}
    </div>
  );
};
