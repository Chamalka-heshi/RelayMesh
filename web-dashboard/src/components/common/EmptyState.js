import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function EmptyState({ 
  title = 'No Active Monitoring Data', 
  description = 'No active records reported in this area.', 
  icon: Icon = ShieldAlert 
}) {
  return (
    <div className="state-container empty">
      <Icon className="w-10 h-10 text-slate-600 mb-2" />
      <div className="font-bold text-sm text-slate-300">{title}</div>
      <div className="text-xs text-slate-500 max-w-sm text-center mt-1">{description}</div>
    </div>
  );
}
