import React from 'react';
import { Radio, CheckCircle2, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function NetworkHealthCard({ networkHealth = {}, onNavigate, onViewNodes }) {
  const {
    status = 'ONLINE',
    onlineNodes = 184,
    offlineNodes = 19,
    totalNodes = 203,
    availabilityPct = 91,
    coveragePct = 94,
    messagesHourly = 1420,
    lastSync = '4 sec ago',
    nodeSample = []
  } = networkHealth;

  const handleView = () => {
    if (onViewNodes) onViewNodes();
    else if (onNavigate) onNavigate('/nodes');
  };

  return (
    <div className="network-health-card">
      <div className="card-top-header">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-600" />
          <h3 className="card-title-text">RelayMesh Network Health</h3>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Availability Banner */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700 font-mono">{availabilityPct}%</span>
              <span className="text-xs font-bold text-emerald-900">Network Availability</span>
            </div>
            <p className="text-xs text-emerald-700 mt-0.5">
              {onlineNodes} / {totalNodes} nodes active across monitored disaster sectors
            </p>
          </div>
          <span className="badge-pill bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            NOMINAL
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${availabilityPct}%` }}
          />
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-base font-black text-emerald-600 font-mono block">{onlineNodes}</span>
            <span className="text-[11px] text-slate-500 font-medium">Online Nodes</span>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-base font-black text-red-600 font-mono block">{offlineNodes}</span>
            <span className="text-[11px] text-slate-500 font-medium">Offline Nodes</span>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-base font-black text-blue-600 font-mono block">{coveragePct}%</span>
            <span className="text-[11px] text-slate-500 font-medium">Coverage Area</span>
          </div>

          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-base font-black text-purple-600 font-mono block">{messagesHourly.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 font-medium">Msgs / Hour</span>
          </div>
        </div>

        {/* Sample Active RelayMesh Nodes */}
        {nodeSample && nodeSample.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase">Recent Node Telemetry:</span>
              <span className="text-[10px] text-slate-400 font-mono">Sync: {lastSync}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {nodeSample.slice(0, 3).map((node) => (
                <div key={node.id} className="p-1.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono font-bold text-slate-800">{node.id}</span>
                    <span className="badge-pill bg-blue-50 text-blue-700 text-[10px] font-semibold">{node.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{node.messagesHandled} msgs</span>
                    <span>• {node.lastSeen}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleView}
            className="table-action-btn"
          >
            <span>View All Mesh Nodes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
