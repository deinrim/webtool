import React, { useState } from 'react';
import { Search, Moon, Sun, Monitor, Menu, X, ChevronDown, User, Heart, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, TOOLS } from '../../data/toolsRegistry';
import { Icon } from '../common/Icon';

interface HeaderProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenSearch, onOpenAuth, currentRoute }) => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                OmniTools
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  50+
                </span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-1">
                Everyday Web Utilities
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentRoute === '/' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            {/* Tools Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button
                onClick={() => onNavigate('/tools')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isToolsOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full left-0 w-[640px] p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.slice(0, 8).map(cat => {
                    const catTools = TOOLS.filter(t => t.category === cat.slug).slice(0, 3);
                    return (
                      <div key={cat.slug} className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                        <div
                          onClick={() => {
                            onNavigate(`/categories/${cat.slug}`);
                            setIsToolsOpen(false);
                          }}
                          className="flex items-center gap-2 mb-1.5 cursor-pointer text-slate-900 dark:text-slate-100 font-semibold text-xs hover:text-blue-600"
                        >
                          <Icon name={cat.iconName} className="w-3.5 h-3.5 text-blue-600" />
                          <span>{cat.name}</span>
                        </div>
                        <ul className="space-y-1">
                          {catTools.map(t => (
                            <li key={t.id}>
                              <button
                                onClick={() => {
                                  onNavigate(`/tools/${t.slug}`);
                                  setIsToolsOpen(false);
                                }}
                                className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 block text-left truncate w-full"
                              >
                                {t.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Showing top tools across categories</span>
                    <button
                      onClick={() => {
                        onNavigate('/tools');
                        setIsToolsOpen(false);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All 50+ Tools →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                onClick={() => onNavigate('/categories')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 w-64 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-1 animate-in fade-in duration-150">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        onNavigate(`/categories/${c.slug}`);
                        setIsCategoriesOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                    >
                      <Icon name={c.iconName} className="w-4 h-4 text-blue-600" />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/popular')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Popular
            </button>

            <button
              onClick={() => onNavigate('/blog')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Blog
            </button>

            <button
              onClick={() => onNavigate('/pricing')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Pricing
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              About
            </button>
          </nav>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
              /
            </kbd>
          </button>

          {/* Dark/Light mode toggle */}
          <div className="relative">
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('system');
                else setTheme('light');
              }}
              title={`Current theme: ${theme}. Click to switch.`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                  {user.fullName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-mono text-[10px] uppercase">
                      {user.plan} plan
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('/dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User className="w-3.5 h-3.5" /> Dashboard
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('/dashboard#history');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Clock className="w-3.5 h-3.5" /> My History
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('/dashboard#favorites');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Heart className="w-3.5 h-3.5" /> Favorites
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        onNavigate('/admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Control
                    </button>
                  )}

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer accordion */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-150">
          <button
            onClick={() => {
              onNavigate('/');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('/tools');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            All 50+ Tools
          </button>
          <button
            onClick={() => {
              onNavigate('/categories');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            Categories
          </button>
          <button
            onClick={() => {
              onNavigate('/popular');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            Popular Tools
          </button>
          <button
            onClick={() => {
              onNavigate('/blog');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            Blog & Guides
          </button>
          <button
            onClick={() => {
              onNavigate('/pricing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            Pricing
          </button>
          <button
            onClick={() => {
              onNavigate('/about');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-sm text-slate-800 dark:text-slate-200"
          >
            About OmniTools
          </button>

          {user && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onNavigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-sm text-blue-600 dark:text-blue-400"
              >
                User Dashboard
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 font-medium text-sm text-indigo-600 dark:text-indigo-400"
                >
                  Admin Control Panel
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
