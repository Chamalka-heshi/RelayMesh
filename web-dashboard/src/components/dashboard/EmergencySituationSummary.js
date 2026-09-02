import React from 'react';
import { Flame, AlertTriangle, Users, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import StatusBadge from '../common/StatusBadge';

export default function EmergencySituationSummary({ incidents = [], onNavigate, onViewIncident }) {
  const handleView = (id) => {
    if (onViewIncident) {
      onViewIncident(id);
    } else if (onNavigate) {
      onNavigate('/incidents/' + id);
    }
  };

  if (!incidents || incidents.length === 0) {
    return (
      <div className="emergency-situation-summary-card">
        <div className="card-top-header">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="card-title-text">Current Emergency Situation</h3>
          </div>
          <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            Nominal Status
          </span>
        </div>
        <p className="text-xs text-slate-500 p-4 text-center">
          All monitored sectors are currently operating under normal status.
        </p>
      </div>
    );
  }

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;

  return (
    <div className="emergency-situation-summary-card">
      <div className="card-top-header">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-600" />
          <h3 className="card-title-text">Current Emergency Situation</h3>
        </div>
        <span className="badge-pill bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
          {criticalCount} Critical • {incidents.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={'summary-incident-row ' + (incident.severity === 'CRITICAL' ? 'critical' : 'high')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <span className="font-bold text-slate-900 text-sm">{incident.title}</span>
              </div>
              <StatusBadge status={incident.status} size="sm" />
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 mt-1">{incident.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{incident.area}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>SOS: <strong className="text-red-600">{incident.activeSOSCount}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-700">
                <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Affected: <strong>{incident.affectedPopulation}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{incident.startedAt}</span>
              </div>
            </div>

            {incident.criticalNeed && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span><strong>Shortage Alert:</strong> {incident.criticalNeed}</span>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleView(incident.id)}
                className="table-action-btn"
              >
                <span>View Incident Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
