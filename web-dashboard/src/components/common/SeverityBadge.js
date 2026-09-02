import React from 'react';
import { Flame, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function SeverityBadge({ severity }) {
  if (!severity) return null;
  const s = severity.toUpperCase();

  if (s === 'CRITICAL') {
    return (
      <span className="severity-badge critical">
        <Flame className="w-3 h-3 inline mr-1" />
        CRITICAL
      </span>
    );
  }
  if (s === 'HIGH' || s === 'WARNING') {
    return (
      <span className="severity-badge high">
        <AlertTriangle className="w-3 h-3 inline mr-1" />
        HIGH PRIORITY
      </span>
    );
  }
  if (s === 'MODERATE' || s === 'MEDIUM') {
    return (
      <span className="severity-badge moderate">
        <Info className="w-3 h-3 inline mr-1" />
        MODERATE
      </span>
    );
  }
  return (
    <span className="severity-badge low">
      <CheckCircle2 className="w-3 h-3 inline mr-1" />
      {severity}
    </span>
  );
}
