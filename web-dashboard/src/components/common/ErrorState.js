import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorState({ error = 'Failed to fetch monitoring telemetry', onRetry }) {
  return (
    <div className="state-container error">
      <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
      <div className="font-bold text-sm text-red-300">Monitoring Data Feed Offline</div>
      <div className="text-xs text-slate-400 max-w-sm text-center mt-1">{error}</div>
      {onRetry && (
        <button onClick={onRetry} className="state-retry-btn">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
