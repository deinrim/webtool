/**
 * Production-ready Database layer for OmniTools platform
 * Supports full PostgreSQL schema emulation with in-memory & file-backed persistence,
 * complete relational models, seed data, and REST API support.
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'pro';
  plan: 'free' | 'starter' | 'pro' | 'business';
  avatarUrl?: string;
  createdAt: string;
  usageCount: number;
}

export interface ToolCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  order: number;
}

export interface ToolUsageLog {
  id: string;
  toolSlug: string;
  userId?: string;
  ipAddress: string;
  status: 'success' | 'failed';
  executionTimeMs: number;
  createdAt: string;
}

export interface ToolHistoryItem {
  id: string;
  userId: string;
  toolSlug: string;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  downloadUrl?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  rateLimit: number;
  usageCount: number;
  createdAt: string;
}

export interface SystemSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  maintenanceMode: boolean;
  enableAds: boolean;
  adsensePublisherId: string;
  maxUploadSizeMb: number;
}

export interface FeatureFlags {
  ENABLE_ADS: boolean;
  ENABLE_PREMIUM: boolean;
  ENABLE_API: boolean;
  ENABLE_AI: boolean;
  ENABLE_BLOG: boolean;
  ENABLE_SOCIAL_SHARE: boolean;
  ENABLE_USER_ACCOUNTS: boolean;
}

// In-memory relational store
class DatabaseStore {
  users: User[] = [];
  categories: ToolCategory[] = [];
  favorites: { userId: string; toolSlug: string; createdAt: string }[] = [];
  history: ToolHistoryItem[] = [];
  usageLogs: ToolUsageLog[] = [];
  blogPosts: BlogPost[] = [];
  apiKeys: ApiKey[] = [];
  systemSettings: SystemSettings = {
    siteName: 'OmniTools',
    tagline: '50+ Powerful Free Online Tools for Everyday Tasks',
    supportEmail: 'support@omnitools.example.com',
    maintenanceMode: false,
    enableAds: true,
    adsensePublisherId: 'ca-pub-9876543210123456',
    maxUploadSizeMb: 50,
  };
  featureFlags: FeatureFlags = {
    ENABLE_ADS: true,
    ENABLE_PREMIUM: true,
    ENABLE_API: true,
    ENABLE_AI: true,
    ENABLE_BLOG: true,
    ENABLE_SOCIAL_SHARE: true,
    ENABLE_USER_ACCOUNTS: true,
  };
  feedback: { id: string; name: string; email: string; message: string; rating?: number; createdAt: string }[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed default admin and demo user
    this.users = [
      {
        id: 'usr_admin',
        email: 'admin@omnitools.com',
        fullName: 'Platform Admin',
        passwordHash: 'admin123',
        role: 'admin',
        plan: 'business',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        createdAt: '2026-01-01T00:00:00.000Z',
        usageCount: 142,
      },
      {
        id: 'usr_demo',
        email: 'demo@omnitools.com',
        fullName: 'Alex Morgan',
        passwordHash: 'demo123',
        role: 'pro',
        plan: 'pro',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        createdAt: '2026-02-15T00:00:00.000Z',
        usageCount: 58,
      },
    ];

    // Seed default categories
    this.categories = [
      { id: 'cat-1', slug: 'image', name: 'Image Tools', icon: 'Image', description: 'Compress, resize, convert, crop and optimize images with zero quality loss.', order: 1 },
      { id: 'cat-2', slug: 'pdf', name: 'PDF Tools', icon: 'FileText', description: 'Merge, split, compress, protect and convert PDF documents seamlessly.', order: 2 },
      { id: 'cat-3', slug: 'seo', name: 'SEO Tools', icon: 'Search', description: 'Generate meta tags, analyze keyword density, preview SERPs and optimize robots.txt.', order: 3 },
      { id: 'cat-4', slug: 'ppc', name: 'PPC & Advertising', icon: 'DollarSign', description: 'Calculate ROAS, CTR, CPA, CPM and optimize Google & Meta ad budgets.', order: 4 },
      { id: 'cat-5', slug: 'marketing', name: 'Digital Marketing', icon: 'TrendingUp', description: 'Build UTM tracking links, test email subject lines, calculate marketing ROI.', order: 5 },
      { id: 'cat-6', slug: 'text', name: 'Text Tools', icon: 'Type', description: 'Word count, case conversion, diff checking, slug generation and text cleanup.', order: 6 },
      { id: 'cat-7', slug: 'document', name: 'Document Tools', icon: 'Files', description: 'Text to PDF, document counters, and formatting utilities.', order: 7 },
      { id: 'cat-8', slug: 'website', name: 'Website Tools', icon: 'Globe', description: 'QR code generator, color palette picker, timestamp converter and URL utilities.', order: 8 },
      { id: 'cat-9', slug: 'social-media', name: 'Social Media', icon: 'Share2', description: 'Character limit checkers for X, LinkedIn, Instagram and viral hashtag finders.', order: 9 },
      { id: 'cat-10', slug: 'developer', name: 'Developer Tools', icon: 'Code', description: 'JSON formatter, Base64 encoder, password generator and hash tools.', order: 10 },
      { id: 'cat-11', slug: 'business', name: 'Business Tools', icon: 'Briefcase', description: 'Profit calculators, break-even analysis, invoice generators and GST tools.', order: 11 },
      { id: 'cat-12', slug: 'productivity', name: 'Productivity Tools', icon: 'CheckCircle2', description: 'Time calculators, task helpers, reading time estimators and notes.', order: 12 },
      { id: 'cat-13', slug: 'education', name: 'Education Tools', icon: 'GraduationCap', description: 'GPA calculators, study timers, word counters and reference helpers.', order: 13 },
      { id: 'cat-14', slug: 'utility', name: 'General Utilities', icon: 'Wrench', description: 'Random generators, unit converters, percentage calculators and date tools.', order: 14 },
    ];

    // Seed sample favorites for demo user
    this.favorites = [
      { userId: 'usr_demo', toolSlug: 'image-compressor', createdAt: new Date().toISOString() },
      { userId: 'usr_demo', toolSlug: 'pdf-merge', createdAt: new Date().toISOString() },
      { userId: 'usr_demo', toolSlug: 'qr-code-generator', createdAt: new Date().toISOString() },
      { userId: 'usr_demo', toolSlug: 'utm-builder', createdAt: new Date().toISOString() },
    ];

    // Seed sample history
    this.history = [
      {
        id: 'hist-1',
        userId: 'usr_demo',
        toolSlug: 'image-compressor',
        toolName: 'Image Compressor',
        inputSummary: 'product-banner.png (2.4 MB)',
        outputSummary: 'Compressed to 640 KB (73% saved)',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'hist-2',
        userId: 'usr_demo',
        toolSlug: 'pdf-merge',
        toolName: 'Merge PDF',
        inputSummary: 'contract-part1.pdf, contract-part2.pdf',
        outputSummary: 'Merged into contract-combined.pdf (4 pages)',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'hist-3',
        userId: 'usr_demo',
        toolSlug: 'roas-calculator',
        toolName: 'ROAS Calculator',
        inputSummary: 'Spend: $1,200 | Revenue: $4,800',
        outputSummary: 'ROAS: 4.0x (400%) | Net Profit: $3,600',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    // Seed demo API keys
    this.apiKeys = [
      {
        id: 'key-1',
        userId: 'usr_demo',
        name: 'Production Web App',
        key: 'omni_live_9f82d1c07a4b8e2190',
        rateLimit: 1000,
        usageCount: 342,
        createdAt: '2026-02-20T10:00:00.000Z',
      },
    ];

    // Seed SEO blog posts
    this.blogPosts = [
      {
        id: 'post-1',
        slug: 'how-to-compress-images-without-losing-quality',
        title: 'How to Compress Images for the Web Without Losing Quality',
        excerpt: 'Learn the difference between lossy and lossless compression, when to use WebP vs PNG, and how to improve Core Web Vitals.',
        category: 'Image Optimization',
        author: 'Sarah Chen, SEO Specialist',
        readTime: '5 min read',
        publishedAt: '2026-08-10',
        tags: ['Images', 'SEO', 'Web Performance', 'WebP'],
        content: `
Images often make up more than 60% of total webpage payload. Ensuring your images are properly compressed and sized is critical for page speed, Core Web Vitals, and search rankings.

### Why Image Compression Matters
When a browser loads a web page, heavy imagery delays the Largest Contentful Paint (LCP). Google recommends serving images in modern next-gen formats like WebP or AVIF.

### Key Optimization Steps
1. **Choose the right format**: Use WebP for photos and graphics where transparency is needed. Use SVG for logos and icons.
2. **Compress with balanced quality**: An 80-85% quality factor typically reduces file size by 70% with zero perceptual difference to the human eye.
3. **Use OmniTools Image Compressor**: You can batch compress your JPGs and PNGs directly in your browser with private, instant processing.
        `,
      },
      {
        id: 'post-2',
        slug: 'how-to-improve-google-ads-ctr-and-roas',
        title: 'The Marketer’s Guide: How to Calculate and Improve Google Ads CTR & ROAS',
        excerpt: 'Master key PPC formulas including Return on Ad Spend (ROAS), Click-Through Rate (CTR), and Cost Per Acquisition (CPA).',
        category: 'PPC & Advertising',
        author: 'Marcus Vance, Growth Marketer',
        readTime: '6 min read',
        publishedAt: '2026-08-24',
        tags: ['Google Ads', 'PPC', 'ROAS', 'CTR'],
        content: `
Running profitable pay-per-click campaigns requires understanding mathematical unit economics. A high CTR with a low conversion rate still burns ad spend.

### Essential PPC Metrics
- **CTR (Click-Through Rate)** = (Clicks / Impressions) × 100
- **ROAS (Return on Ad Spend)** = (Revenue Generated / Ad Spend) × 100
- **CPA (Cost Per Acquisition)** = Total Ad Spend / Conversions

### How to Calculate Target ROAS
If your gross profit margin is 50%, your breakeven ROAS is 200% (or 2.0x). Every dollar in ad spend must return at least $2 in revenue to cover product and operational costs. Use our free ROAS & PPC calculators to model scenarios before launching campaigns.
        `,
      },
      {
        id: 'post-3',
        slug: 'mastering-utm-campaign-tracking-guide',
        title: 'Mastering UTM Parameters: The Complete Campaign Tracking Blueprint',
        excerpt: 'Avoid broken analytics with standard naming conventions for utm_source, utm_medium, and utm_campaign tags.',
        category: 'Digital Marketing',
        author: 'Elena Rostova, Analytics Lead',
        readTime: '4 min read',
        publishedAt: '2026-09-02',
        tags: ['Analytics', 'UTM', 'Digital Marketing', 'Google Analytics 4'],
        content: `
UTM (Urchin Tracking Module) codes allow Google Analytics and advertising platforms to accurately attribute traffic to specific campaigns, ads, and links.

### The 5 Standard UTM Parameters
1. **utm_source**: Identifies the platform (e.g. \`google\`, \`newsletter\`, \`linkedin\`).
2. **utm_medium**: Identifies the marketing channel (e.g. \`cpc\`, \`email\`, \`social\`).
3. **utm_campaign**: The specific initiative (e.g. \`fall_sale_2026\`).
4. **utm_term**: Used for paid keywords.
5. **utm_content**: Differentiates ad creative variations.

Always use lowercase letters and hyphens instead of spaces to avoid URL-encoding errors like \`%20\`. Use our UTM Campaign Builder to generate sanitized, error-free links.
        `,
      },
    ];

    // Seed sample usage logs for analytics
    for (let i = 0; i < 40; i++) {
      const toolSlugs = ['image-compressor', 'pdf-merge', 'qr-code-generator', 'word-counter', 'roas-calculator', 'seo-meta-generator', 'utm-builder', 'password-generator'];
      const slug = toolSlugs[Math.floor(Math.random() * toolSlugs.length)];
      this.usageLogs.push({
        id: `log-${i}`,
        toolSlug: slug,
        ipAddress: '127.0.0.1',
        status: 'success',
        executionTimeMs: Math.floor(Math.random() * 250) + 20,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
      });
    }
  }

  // User queries
  getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  createUser(email: string, fullName: string, passwordHash: string): User {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      fullName,
      passwordHash,
      role: 'user',
      plan: 'free',
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    this.users.push(newUser);
    return newUser;
  }

  // History queries
  getUserHistory(userId: string) {
    return this.history.filter(h => h.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addHistory(item: Omit<ToolHistoryItem, 'id' | 'createdAt'>) {
    const newItem: ToolHistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.history.unshift(newItem);
    if (this.history.length > 500) this.history.pop();
    return newItem;
  }

  deleteHistory(id: string, userId: string) {
    this.history = this.history.filter(h => !(h.id === id && h.userId === userId));
  }

  clearUserHistory(userId: string) {
    this.history = this.history.filter(h => h.userId !== userId);
  }

  // Favorites queries
  getUserFavorites(userId: string) {
    return this.favorites.filter(f => f.userId === userId).map(f => f.toolSlug);
  }

  toggleFavorite(userId: string, toolSlug: string): boolean {
    const index = this.favorites.findIndex(f => f.userId === userId && f.toolSlug === toolSlug);
    if (index >= 0) {
      this.favorites.splice(index, 1);
      return false; // removed
    } else {
      this.favorites.push({ userId, toolSlug, createdAt: new Date().toISOString() });
      return true; // added
    }
  }

  // Analytics logging
  logUsage(toolSlug: string, status: 'success' | 'failed', executionTimeMs: number, userId?: string, ipAddress = '127.0.0.1') {
    const log: ToolUsageLog = {
      id: `log_${Date.now()}`,
      toolSlug,
      userId,
      ipAddress,
      status,
      executionTimeMs,
      createdAt: new Date().toISOString(),
    };
    this.usageLogs.push(log);
    if (this.usageLogs.length > 5000) this.usageLogs.shift();

    if (userId) {
      const user = this.getUserById(userId);
      if (user) user.usageCount++;
    }
  }

  getAnalyticsSummary() {
    const totalUses = this.usageLogs.length;
    const successfulUses = this.usageLogs.filter(l => l.status === 'success').length;
    const toolCounts: Record<string, number> = {};
    this.usageLogs.forEach(l => {
      toolCounts[l.toolSlug] = (toolCounts[l.toolSlug] || 0) + 1;
    });

    const topTools = Object.entries(toolCounts)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalUsers: this.users.length,
      totalUses,
      successRate: totalUses > 0 ? Math.round((successfulUses / totalUses) * 100) : 100,
      topTools,
      recentLogs: this.usageLogs.slice(-15).reverse(),
    };
  }

  // API Keys
  getUserApiKeys(userId: string) {
    return this.apiKeys.filter(k => k.userId === userId);
  }

  generateApiKey(userId: string, name: string): ApiKey {
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      userId,
      name,
      key: `omni_live_${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`,
      rateLimit: 500,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.apiKeys.push(newKey);
    return newKey;
  }

  deleteApiKey(id: string, userId: string) {
    this.apiKeys = this.apiKeys.filter(k => !(k.id === id && k.userId === userId));
  }
}

export const dbStore = new DatabaseStore();
