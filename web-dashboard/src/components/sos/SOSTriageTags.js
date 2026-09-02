import React from 'react';

export default function SOSTriageTags({ tags = [], compact = false }) {
  if (!tags || tags.length === 0) return null;

  const getTagStyle = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes('flood') || t.includes('water') || t.includes('submerged') || t.includes('trapped')) {
      return { bg: 'rgba(229, 57, 53, 0.15)', border: 'rgba(229, 57, 53, 0.4)', text: '#F87171' };
    }
    if (t.includes('medical') || t.includes('bleeding') || t.includes('insulin') || t.includes('trauma')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#FBBF24' };
    }
    if (t.includes('infant') || t.includes('child') || t.includes('elderly') || t.includes('pregnant')) {
      return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: '#22D3EE' };
    }
    if (t.includes('collapse') || t.includes('debris') || t.includes('tree')) {
      return { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)', text: '#C084FC' };
    }
    return { bg: '#1E293B', border: '#334155', text: '#CBD5E1' };
  };

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, idx) => {
        const style = getTagStyle(tag);
        return (
          <span
            key={idx}
            className={'triage-pill-tag ' + (compact ? 'compact' : '')}
            style={{
              backgroundColor: style.bg,
              borderColor: style.border,
              color: style.text
            }}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
}
