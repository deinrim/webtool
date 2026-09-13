import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SocialShare } from '../components/common/SocialShare';
import { AdBanner } from '../components/common/AdBanner';
import { BookOpen, Clock, Calendar, ArrowRight, User, CheckCircle2 } from 'lucide-react';

interface BlogPageProps {
  postSlug?: string;
  onNavigate: (route: string) => void;
}

const BLOG_POSTS = [
  {
    id: 'post_1',
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Visual Quality: The 2026 Guide',
    excerpt: 'Comprehensive deep-dive into modern image compression techniques, comparing WebP vs JPEG vs AVIF, optimizing DPI, and boosting Core Web Vitals.',
    category: 'Image Optimization',
    readTime: '5 min read',
    publishedAt: '2026-03-10',
    author: 'Elena Rostova, Chief Web Architect',
    content: `
### Why Image Optimization is Critical for Your Website

High-resolution images often account for over 60% of total webpage weight. If your images are uncompressed, pages load slowly, bounce rates increase, and Google search rankings drop.

### 1. Lossless vs. Lossy Compression
- **Lossless Compression**: Reduces file size by eliminating unnecessary metadata and re-encoding color tables without removing a single pixel. Best for logos, diagrams, and transparent UI assets.
- **Lossy Compression**: Selectively eliminates imperceptible high-frequency visual details. When set to 75-80% quality factor, it reduces file sizes by up to 70% with zero perceivable blur to the human eye.

### 2. Next-Gen Formats: Why You Should Switch to WebP
WebP provides superior compression for images on the web. WebP lossless images are **26% smaller** in size compared to PNGs, and WebP lossy images are **25-34% smaller** than comparable JPEG images at equivalent SSIM quality index.

### 3. Step-by-Step Optimization Process
1. Upload your JPG or PNG to the **OmniTools Image Compressor**.
2. Select **WebP** as the target format.
3. Slide the quality control to **75%**.
4. Download the output and replace your website asset.
    `,
  },
  {
    id: 'post_2',
    slug: 'how-to-improve-google-ads-ctr-and-roas',
    title: 'How to Double Google Ads Click-Through Rate and Maximize ROAS',
    excerpt: 'Actionable advertising blueprint covering ad extensions, high-intent long-tail keywords, negative keyword hygiene, and target CPA bidding.',
    category: 'PPC & Digital Advertising',
    readTime: '7 min read',
    publishedAt: '2026-03-08',
    author: 'Marcus Vance, Growth Marketing Lead',
    content: `
### Understanding the Mathematical Relationship of PPC

Every profitable advertising campaign balances four foundational metrics: Click-Through Rate (CTR), Cost Per Click (CPC), Conversion Rate (CVR), and Average Order Value (AOV).

### The Formula for ROAS
$$ROAS = \\frac{\\text{Total Attributed Revenue}}{\\text{Total Advertising Cost}}$$

If you spend $2,000 on Google Ads and generate $10,000 in sales, your ROAS is 5.0x (500%).

### 3 Tactical Steps to Increase CTR Today
1. **Include Numbers and Pricing**: Ads with tangible pricing numbers receive 28% more qualified clicks.
2. **Utilize All Ad Assets**: Add sitelinks, callouts, and structured snippets to expand visual real estate on the SERP.
3. **Align Keyword with Ad Title**: Use dynamic keyword insertion or tightly themed ad groups (STAGs).
    `,
  },
  {
    id: 'post_3',
    slug: 'mastering-utm-campaign-tracking-guide',
    title: 'Mastering UTM Campaign Tracking: The Standard Marketer Blueprint',
    excerpt: 'How to build standardized UTM tracking links that will not break Google Analytics 4 (GA4) attribution models.',
    category: 'Analytics & Attribution',
    readTime: '4 min read',
    publishedAt: '2026-03-02',
    author: 'Sarah Chen, Analytics Director',
    content: `
### Why Dirty UTMs Destroy Attribution

Without consistent naming conventions, marketing teams see traffic scattered across dozens of fragmented sources in GA4. 

### Best Practices for Clean UTMs:
- **Always use lowercase**: Google Analytics treats \`Email\`, \`email\`, and \`EMAIL\` as three distinct channels.
- **Use hyphens or underscores**: Never use spaces (%20) inside UTM parameters.
- **Keep source strictly to the platform**: (e.g. \`google\`, \`facebook\`, \`linkedin\`, \`twitter\`).
- **Keep medium strictly to the channel**: (e.g. \`cpc\`, \`email\`, \`social\`, \`referral\`).
    `,
  },
];

export const BlogPage: React.FC<BlogPageProps> = ({ postSlug, onNavigate }) => {
  const currentPost = postSlug ? BLOG_POSTS.find(p => p.slug === postSlug) : null;

  if (currentPost) {
    return (
      <article className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Breadcrumbs
          items={[{ label: 'Blog & Guides', href: '/blog' }, { label: currentPost.title }]}
          onNavigate={onNavigate}
        />

        <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-bold uppercase">
              {currentPost.category}
            </span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {currentPost.readTime}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {currentPost.publishedAt}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {currentPost.title}
          </h1>

          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {currentPost.author.charAt(0)}
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">{currentPost.author}</span>
              <span className="text-[11px] text-slate-400">OmniTools Research Team</span>
            </div>
          </div>
        </header>

        <AdBanner slot="header" />

        <div className="prose dark:prose-invert max-w-none my-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {currentPost.content}
        </div>

        <AdBanner slot="footer" />

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center justify-between">
          <SocialShare title={currentPost.title} />
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            ← Back to all articles
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: 'Blog & Practical Guides' }]} onNavigate={onNavigate} />

      <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          OmniTools Knowledge Base & Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Actionable tutorials and blueprints covering image formats, Google Ads optimization formulas, SEO meta architectures, and developer best practices.
        </p>
      </div>

      <AdBanner slot="header" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {BLOG_POSTS.map(post => (
          <div
            key={post.id}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-blue-600 font-bold uppercase">{post.category}</span>
                <span className="text-slate-400">{post.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 transition">
                {post.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read article</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <AdBanner slot="footer" />
    </div>
  );
};
