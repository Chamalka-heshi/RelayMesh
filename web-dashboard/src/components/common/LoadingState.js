import React from 'react';
import { Activity } from 'lucide-react';

export default function LoadingState({ message = 'Loading emergency monitoring data...' }) {
  return (
    <div className="state-container loading">
      <Activity className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
      <div className="font-bold text-sm text-slate-200">{message}</div>
      <div className="text-xs text-slate-500 mt-1">Synchronizing with RelayMesh Central Monitoring Grid</div>
    </div>
  );
}
