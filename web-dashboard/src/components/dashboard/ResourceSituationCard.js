import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export default function ResourceSituationCard({ resources = {}, onNavigate }) {
  const { categories = [] } = resources;

  const getStatusColor = (pct, status) => {
    if (status === 'CRITICAL_SHORTAGE' || pct < 50) return '#DC2626';
    if (status === 'MODERATE' || pct < 70) return '#D97706';
    return '#059669';
  };

  const getStatusText = (status, pct) => {
    if (status === 'CRITICAL_SHORTAGE' || pct < 50) return 'CRITICAL';
    if (pct >= 80) return 'ADEQUATE';
    if (pct >= 60) return 'MODERATE';
    return 'LIMITED';
  };

  return (
    <div className="resource-situation-card">
      <div className="card-top-header">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <h3 className="card-title-text">Resource Situation</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated supply levels & shelter capacity across active emergency zones
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const isCritical = cat.status === 'CRITICAL_SHORTAGE' || cat.availablePct < 50;
          const color = getStatusColor(cat.availablePct, cat.status);

          return (
            <div key={cat.key} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-bold text-slate-800 text-xs">{cat.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={'badge-pill text-[10px] font-bold ' + (isCritical ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700')}>
                    {getStatusText(cat.status, cat.availablePct)}
                  </span>
                  <span className="font-mono font-black text-xs" style={{ color }}>
                    {cat.availablePct}%
                  </span>
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${cat.availablePct}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Shortage Warning Box if any category is below 50% */}
      {categories.some(c => c.availablePct < 50) && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 mt-3 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>
            <strong>Urgent:</strong> Medical & trauma supplies are at 41% capacity in Riverside / Grandpass. Replenishment dispatched.
          </span>
        </div>
      )}
    </div>
  );
}
