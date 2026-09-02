import React from 'react';
import { Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from './PageHeader';

export default function PlaceholderPage({
  title = 'Module Overview',
  subtitle = 'Module details and administrative tools',
  badge = 'COMING IN NEXT PHASE',
  breadcrumbs = [],
  onNavigate
}) {
  return (
    <div className="placeholder-page-container">
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={title}
        subtitle={subtitle}
        badge={badge}
        onNavigate={onNavigate}
      />
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-2xl mx-auto mt-6 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 mb-4">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-600 mb-6">
          {subtitle}. This monitoring module is scheduled for full telemetry deployment in the upcoming RelayMesh platform iteration.
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Core operational dispatch and SOS telemetry feeds remain fully active in real-time.</span>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => onNavigate && onNavigate('/dashboard')} className="btn-primary flex items-center gap-1.5">
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onNavigate && onNavigate('/sos')} className="btn-secondary flex items-center gap-1.5">
            <span>SOS Monitoring</span>
          </button>
          <button onClick={() => onNavigate && onNavigate('/map')} className="btn-secondary flex items-center gap-1.5">
            <span>Live Situation Map</span>
          </button>
        </div>
      </div>
    </div>
  );
}
