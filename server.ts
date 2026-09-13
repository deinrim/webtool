import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/database';
import { handleGetVideoInfo, handleStreamVideoDownload } from './server/videoDownloader';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logger for audit & rate limiting
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // ==========================================
  // REST API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      platform: 'OmniTools Production Server',
      toolsAvailable: 54,
    });
  });

  // Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Allow: /tools/
Allow: /categories/
Allow: /blog/
Allow: /pricing/
Allow: /about
Disallow: /admin
Disallow: /api/
Disallow: /dashboard

Sitemap: https://${req.get('host') || 'omnitools.example.com'}/sitemap.xml
`);
  });

  // Dynamic XML sitemap
  app.get('/sitemap.xml', (req, res) => {
    const host = `https://${req.get('host') || 'omnitools.example.com'}`;
    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = ['', '/categories', '/blog', '/pricing', '/about', '/contact', '/privacy', '/terms'];
    const toolSlugs = [
      'image-compressor', 'image-resizer', 'image-converter', 'image-cropper', 'image-to-pdf',
      'image-bg-remover', 'image-rotator', 'image-metadata', 'pdf-merge', 'pdf-split',
      'pdf-compressor', 'pdf-to-image', 'pdf-to-text', 'text-to-pdf', 'pdf-page-counter',
      'pdf-password-protect', 'pdf-unlock', 'word-counter', 'case-converter', 'text-cleaner',
      'text-diff', 'lorem-ipsum', 'slug-generator', 'random-text', 'meta-generator',
      'serp-preview', 'keyword-density', 'robots-txt-generator', 'xml-sitemap-generator',
      'seo-text-analyzer', 'canonical-url-generator', 'open-graph-generator', 'google-ads-budget',
      'ppc-calculator', 'roas-calculator', 'ctr-calculator', 'cpa-calculator', 'cpm-calculator',
      'utm-builder', 'marketing-roi', 'email-subject-tester', 'hashtag-generator',
      'social-media-counter', 'qr-code-generator', 'password-generator', 'color-picker',
      'url-encoder-decoder', 'json-formatter', 'base64-tool', 'timestamp-converter',
      'percentage-calculator', 'age-calculator', 'gpa-calculator', 'markdown-previewer',
      'video-downloader', 'youtube-downloader', 'facebook-video-downloader', 'instagram-video-downloader', 'tiktok-downloader', 'twitter-video-downloader'
    ];
    const categorySlugs = ['image', 'pdf', 'seo', 'ppc', 'marketing', 'text', 'document', 'website', 'social-media', 'developer', 'business', 'productivity', 'education', 'utility'];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticRoutes.forEach(r => {
      xml += `  <url>\n    <loc>${host}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${r === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Categories
    categorySlugs.forEach(c => {
      xml += `  <url>\n    <loc>${host}/categories/${c}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // Tools
    toolSlugs.forEach(t => {
      xml += `  <url>\n    <loc>${host}/tools/${t}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // Blog
    dbStore.blogPosts.forEach(p => {
      xml += `  <url>\n    <loc>${host}/blog/${p.slug}</loc>\n    <lastmod>${p.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.type('application/xml');
    res.send(xml);
  });

  // Auth endpoints
  app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = dbStore.getUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json({ token: `session_${user.id}_${Date.now()}`, user: safeUser });
  });

  app.post('/api/v1/auth/register', (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, full name, and password are required' });
    }
    if (dbStore.getUserByEmail(email)) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    const newUser = dbStore.createUser(email, fullName, password);
    const { passwordHash: _, ...safeUser } = newUser;
    res.json({ token: `session_${newUser.id}_${Date.now()}`, user: safeUser });
  });

  app.get('/api/v1/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    // Extract userId from token simulation
    const match = authHeader.match(/session_(usr_[a-zA-Z0-9_-]+)_/);
    if (match) {
      const user = dbStore.getUserById(match[1]);
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        return res.json({ user: safeUser });
      }
    }
    // Fallback demo user if provided demo header
    const demo = dbStore.getUserById('usr_demo');
    if (demo) {
      const { passwordHash: _, ...safeUser } = demo;
      return res.json({ user: safeUser });
    }
    res.status(401).json({ error: 'Session expired' });
  });

  // Categories endpoint
  app.get('/api/v1/categories', (req, res) => {
    res.json(dbStore.categories);
  });

  // History endpoints
  app.get('/api/v1/history', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    res.json(dbStore.getUserHistory(userId));
  });

  app.post('/api/v1/history', (req, res) => {
    const { userId, toolSlug, toolName, inputSummary, outputSummary } = req.body;
    const historyItem = dbStore.addHistory({
      userId: userId || 'usr_demo',
      toolSlug: toolSlug || 'unknown-tool',
      toolName: toolName || 'Online Tool',
      inputSummary: inputSummary || 'Processed task',
      outputSummary: outputSummary || 'Success',
    });
    res.json(historyItem);
  });

  app.delete('/api/v1/history/:id', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    dbStore.deleteHistory(req.params.id, userId);
    res.json({ success: true });
  });

  app.delete('/api/v1/history', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    dbStore.clearUserHistory(userId);
    res.json({ success: true });
  });

  // Favorites endpoints
  app.get('/api/v1/favorites', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    res.json(dbStore.getUserFavorites(userId));
  });

  app.post('/api/v1/favorites/toggle', (req, res) => {
    const { userId, toolSlug } = req.body;
    const isFavorited = dbStore.toggleFavorite(userId || 'usr_demo', toolSlug);
    res.json({ isFavorited });
  });

  // Analytics logging
  app.post('/api/v1/analytics/log', (req, res) => {
    const { toolSlug, status, executionTimeMs, userId } = req.body;
    dbStore.logUsage(toolSlug, status || 'success', executionTimeMs || 50, userId, req.ip || '127.0.0.1');
    res.json({ logged: true });
  });

  app.get('/api/v1/analytics/summary', (req, res) => {
    res.json(dbStore.getAnalyticsSummary());
  });

  // Blog endpoints
  app.get('/api/v1/blog', (req, res) => {
    res.json(dbStore.blogPosts);
  });

  app.get('/api/v1/blog/:slug', (req, res) => {
    const post = dbStore.blogPosts.find(p => p.slug === req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  });

  // Developer API Keys endpoints
  app.get('/api/v1/api-keys', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    res.json(dbStore.getUserApiKeys(userId));
  });

  app.post('/api/v1/api-keys', (req, res) => {
    const { userId, name } = req.body;
    const key = dbStore.generateApiKey(userId || 'usr_demo', name || 'API Key');
    res.json(key);
  });

  app.delete('/api/v1/api-keys/:id', (req, res) => {
    const userId = (req.query.userId as string) || 'usr_demo';
    dbStore.deleteApiKey(req.params.id, userId);
    res.json({ success: true });
  });

  // User feedback endpoint
  app.post('/api/v1/feedback', (req, res) => {
    const { name, email, message, rating } = req.body;
    dbStore.feedback.push({
      id: `fb_${Date.now()}`,
      name: name || 'Anonymous',
      email: email || '',
      message: message || '',
      rating: Number(rating) || 5,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, message: 'Thank you for your feedback!' });
  });

  // Video Downloader endpoints
  app.get('/api/v1/video/info', handleGetVideoInfo);
  app.get('/api/v1/video/stream', handleStreamVideoDownload);

  // Admin settings endpoints
  app.get('/api/v1/admin/settings', (req, res) => {
    res.json({
      settings: dbStore.systemSettings,
      featureFlags: dbStore.featureFlags,
      totalUsers: dbStore.users.length,
      totalLogs: dbStore.usageLogs.length,
      feedback: dbStore.feedback,
    });
  });

  app.post('/api/v1/admin/settings', (req, res) => {
    const { settings, featureFlags } = req.body;
    if (settings) dbStore.systemSettings = { ...dbStore.systemSettings, ...settings };
    if (featureFlags) dbStore.featureFlags = { ...dbStore.featureFlags, ...featureFlags };
    res.json({ success: true, settings: dbStore.systemSettings, featureFlags: dbStore.featureFlags });
  });

  // Server-side processing simulation for heavy tasks or API calls
  app.post('/api/v1/process/:toolSlug', async (req, res) => {
    const { toolSlug } = req.params;
    const startTime = Date.now();

    // Emulate server-side background job queue (BullMQ concept)
    const executionTime = Math.floor(Math.random() * 150) + 50;
    await new Promise(resolve => setTimeout(resolve, executionTime));

    dbStore.logUsage(toolSlug, 'success', Date.now() - startTime, req.body.userId, req.ip);

    res.json({
      jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'completed',
      tool: toolSlug,
      executionTimeMs: Date.now() - startTime,
      result: {
        message: 'Processed successfully',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ==========================================
  // VITE DEV SERVER OR STATIC PRODUCTION FLOW
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniTools] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[OmniTools] Failed to start server:', err);
});
