export type ToolCategoryType =
  | 'image'
  | 'pdf'
  | 'seo'
  | 'ppc'
  | 'marketing'
  | 'text'
  | 'document'
  | 'website'
  | 'social-media'
  | 'developer'
  | 'business'
  | 'productivity'
  | 'education'
  | 'utility';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategoryType;
  description: string;
  icon: string;
  isFree: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  howToUse: string[];
  features: string[];
  faqs: { question: string; answer: string }[];
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user' | 'pro';
  plan: 'free' | 'starter' | 'pro' | 'business';
  avatarUrl?: string;
}

export interface ToolHistoryEntry {
  id: string;
  userId: string;
  toolSlug: string;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  createdAt: string;
}

export type ToolHistoryItem = ToolHistoryEntry;

export interface BlogPostItem {
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
