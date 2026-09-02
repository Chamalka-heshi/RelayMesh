import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [], onNavigate }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumb-item">
              {index === 0 && <Home className="w-3 h-3 text-slate-400 mr-1" />}
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => item.path && onNavigate && onNavigate(item.path)}
                  className="breadcrumb-link"
                >
                  {item.label}
                </button>
              )}
              {!isLast && <ChevronRight className="w-3 h-3 breadcrumb-separator" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
