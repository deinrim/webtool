import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';
import { FeedbackModal } from './components/common/FeedbackModal';

import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoriesPage';
import { BlogPage } from './pages/BlogPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage } from './pages/StaticPages';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

import { ToolLayout } from './components/tools/ToolLayout';
import { ToolRenderer } from './components/tools/ToolRenderer';
import { getToolBySlug, TOOLS } from './data/toolsRegistry';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Route Resolver
  const renderRoute = () => {
    const path = currentPath;

    // Homepage
    if (path === '/' || path === '') {
      return <HomePage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    // All tools directory
    if (path === '/tools') {
      return <CategoryPage onNavigate={navigate} />;
    }

    // Single Tool Page
    if (path.startsWith('/tools/')) {
      const slug = path.replace('/tools/', '').split('?')[0].split('#')[0];
      const tool = getToolBySlug(slug);

      if (tool) {
        return (
          <ToolLayout tool={tool} onNavigate={navigate}>
            <ToolRenderer tool={tool} />
          </ToolLayout>
        );
      } else {
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tool Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              We couldn't locate a tool with slug "{slug}". It may have moved or been updated.
            </p>
            <button
              onClick={() => navigate('/tools')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Browse All 54 Tools
            </button>
          </div>
        );
      }
    }

    // Categories
    if (path === '/categories') {
      return <CategoryPage onNavigate={navigate} />;
    }

    if (path.startsWith('/categories/')) {
      const catSlug = path.replace('/categories/', '').split('?')[0];
      return <CategoryPage categorySlug={catSlug} onNavigate={navigate} />;
    }

    // Blog
    if (path === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (path.startsWith('/blog/')) {
      const postSlug = path.replace('/blog/', '').split('?')[0];
      return <BlogPage postSlug={postSlug} onNavigate={navigate} />;
    }

    // Static & Feature Pages
    if (path === '/pricing') {
      return <PricingPage onNavigate={navigate} />;
    }

    if (path === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (path === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (path === '/privacy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }

    if (path === '/terms' || path === '/disclaimer') {
      return <TermsPage onNavigate={navigate} />;
    }

    if (path === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }

    if (path === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    // 404 Fallback
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black text-blue-600">404</h1>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The requested URL "{path}" does not exist on OmniTools.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </button>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors">
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigate={navigate}
          />

          <main className="flex-1">{renderRoute()}</main>

          <Footer onNavigate={navigate} />

          {/* Global Modals */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTool={slug => {
              navigate(`/tools/${slug}`);
              setIsSearchOpen(false);
            }}
          />

          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

          <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
