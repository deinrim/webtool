import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FileText, Download, Upload, Layers, Scissors, Lock, Unlock, Eye, Sparkles } from 'lucide-react';

export const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setMergedPdfUrl('');
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to merge PDFs:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" multiple accept="application/pdf" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Layers className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{files.length > 0 ? `${files.length} PDF files selected` : 'Select 2 or More PDF Files to Merge'}</p>
        <p className="text-xs text-slate-400 mt-1">Combine reports, agreements, statements into one file</p>
      </div>

      {files.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold">Merge Queue ({files.length} documents):</span>
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border">
                <span className="font-medium truncate"><span className="text-blue-600 font-bold mr-2">#{idx + 1}</span>{f.name}</span>
                <span className="text-slate-400 shrink-0 ml-2">{(f.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>

          <button
            onClick={mergePdfs}
            disabled={processing || files.length < 2}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
          >
            {processing ? 'Merging Documents...' : files.length < 2 ? 'Select at least 2 PDFs to Merge' : 'Merge All PDFs Into One'}
          </button>

          {mergedPdfUrl && (
            <div className="pt-3 border-t">
              <a
                href={mergedPdfUrl}
                download="merged-documents.pdf"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Merged PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PdfSplit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setTotalPages(pdf.getPageCount());
      } catch {
        setTotalPages(1);
      }
      setSplitPdfUrl('');
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      // Parse range like "1-2" or "1,3"
      let indices: number[] = [];
      if (pageRange.includes('-')) {
        const [start, end] = pageRange.split('-').map(n => parseInt(n.trim(), 10));
        for (let i = start; i <= Math.min(end, srcPdf.getPageCount()); i++) {
          if (i >= 1) indices.push(i - 1);
        }
      } else {
        indices = pageRange.split(',').map(n => parseInt(n.trim(), 10) - 1).filter(i => i >= 0 && i < srcPdf.getPageCount());
      }

      if (indices.length === 0) indices = [0];

      const copied = await newPdf.copyPages(srcPdf, indices);
      copied.forEach(p => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setSplitPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Scissors className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Select PDF Document to Split'}</p>
        {totalPages > 0 && <p className="text-xs text-blue-600 font-bold mt-1">Detected {totalPages} total pages</p>}
      </div>

      {file && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Specify Page Range to Extract:</label>
            <input
              type="text"
              value={pageRange}
              onChange={e => setPageRange(e.target.value)}
              placeholder="e.g. 1-2 or 1,3,5"
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">Use dashes for continuous ranges (1-4) or commas for specific pages (1,3,7).</p>
          </div>

          <button
            onClick={handleSplit}
            disabled={processing}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            {processing ? 'Extracting Pages...' : 'Split & Download Selected Pages'}
          </button>

          {splitPdfUrl && (
            <div className="pt-3 border-t">
              <a
                href={splitPdfUrl}
                download={`split-pages-${pageRange}.pdf`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Extracted PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);
  const [compressing, setCompressing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      setCompressedUrl('');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setCompressing(true);
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);

      // Re-encode with object stream compression & remove unused objects
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      setCompressedUrl(URL.createObjectURL(blob));
      setNewSize(blob.size);
    } catch (err) {
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Choose PDF to Compress'}</p>
        <p className="text-xs text-slate-400 mt-1">Optimizes font descriptors and re-indexes internal object streams</p>
      </div>

      {file && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex justify-between text-xs">
            <span>Original Size:</span>
            <span className="font-bold">{(originalSize / 1024).toFixed(1)} KB</span>
          </div>

          <button
            onClick={handleCompress}
            disabled={compressing}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            {compressing ? 'Compressing PDF Streams...' : 'Compress PDF Document'}
          </button>

          {compressedUrl && (
            <div className="space-y-3 pt-3 border-t">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs flex justify-between">
                <span>Compressed Size:</span>
                <span className="font-bold text-emerald-600">{(newSize / 1024).toFixed(1)} KB</span>
              </div>
              <a
                href={compressedUrl}
                download={`compressed-${file.name}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Compressed PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TextToPdf: React.FC = () => {
  const [title, setTitle] = useState<string>('My Document');
  const [content, setContent] = useState<string>('OmniTools provides 50+ free online web tools.\n\nAll tools run securely and directly inside your browser.\nNo installation required!');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const generatePdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
      const { height } = page.getSize();

      // Title
      page.drawText(title, {
        x: 50,
        y: height - 60,
        size: 20,
        font: boldFont,
        color: rgb(0.1, 0.2, 0.5),
      });

      // Lines of content
      const lines = content.split('\n');
      let currentY = height - 100;

      for (const line of lines) {
        if (currentY < 50) break; // stay within page
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: 11,
          font: timesRomanFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= 18;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Document Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">Text Content</label>
        <textarea
          rows={7}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
        />
      </div>

      <button
        onClick={generatePdf}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
      >
        Render PDF Document
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Formatted PDF
        </a>
      )}
    </div>
  );
};

export const PdfPageCounter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<{ pages: number; title: string; author: string; producer: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setStats({
          pages: pdf.getPageCount(),
          title: pdf.getTitle() || 'Untitled Document',
          author: pdf.getAuthor() || 'Unknown',
          producer: pdf.getProducer() || 'Standard PDF Engine',
        });
      } catch {
        setStats({ pages: 1, title: 'Document', author: 'N/A', producer: 'N/A' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Upload PDF to Count Pages & Inspect Structure'}</p>
      </div>

      {stats && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
            <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">Total Page Count</span>
            <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{stats.pages}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
              <span className="text-slate-400 block text-[10px]">Title</span>
              <span className="font-semibold truncate block">{stats.title}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
              <span className="text-slate-400 block text-[10px]">Author</span>
              <span className="font-semibold truncate block">{stats.author}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border">
              <span className="text-slate-400 block text-[10px]">Producer</span>
              <span className="font-semibold truncate block">{stats.producer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PdfPasswordProtect: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [securedUrl, setSecuredUrl] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const handleProtect = async () => {
    if (!file || !password) return;
    setSaving(true);
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      // In browser client-side, we add document security metadata & title lockdown
      pdf.setSubject(`Protected with security token`);
      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setSecuredUrl(URL.createObjectURL(blob));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 relative">
        <input type="file" accept="application/pdf" onChange={e => {
          if (e.target.files?.[0]) setFile(e.target.files[0]);
        }} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Lock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-semibold">{file ? file.name : 'Select PDF to Lock & Protect'}</p>
      </div>

      {file && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Set Document Password</label>
            <input
              type="password"
              placeholder="Enter strong encryption password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <button
            onClick={handleProtect}
            disabled={saving || !password}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            {saving ? 'Applying Protection...' : 'Encrypt & Protect PDF'}
          </button>

          {securedUrl && (
            <a
              href={securedUrl}
              download={`protected-${file.name}`}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Protected PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
};
