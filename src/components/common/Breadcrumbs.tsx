import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[]; onNavigate?: (href: string) => void }> = ({
  items,
  onNavigate,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => onNavigate?.('/')}
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 mx-2 text-slate-400 shrink-0" />
          {item.href ? (
            <button
              onClick={() => onNavigate?.(item.href!)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
