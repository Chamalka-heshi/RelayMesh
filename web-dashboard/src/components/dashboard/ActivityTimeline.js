import React from 'react';
import { Clock, Radio, AlertCircle, Home, Flame, UserCheck, ArrowRight } from 'lucide-react';

export default function ActivityTimeline({ activities = [], onNavigate, onViewLogs }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'SOS_RECEIVED':
        return <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
      case 'NODE_CONNECTED':
      case 'NODE_SYNC':
        return <Radio className="w-3.5 h-3.5 text-blue-600" />;
      case 'SHELTER_UPDATE':
      case 'RESOURCE_VERIFIED':
        return <Home className="w-3.5 h-3.5 text-emerald-600" />;
      case 'INCIDENT_UPDATE':
        return <Flame className="w-3.5 h-3.5 text-amber-600" />;
      case 'VOLUNTEER_ACTIVE':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleView = () => {
    if (onViewLogs) onViewLogs();
    else if (onNavigate) onNavigate('/logs');
  };

  return (
    <div className="activity-timeline-card">
      <div className="card-top-header">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <h3 className="card-title-text">Live Operational Activity</h3>
        </div>

        <button
          onClick={handleView}
          className="table-action-btn"
        >
          <span>System Logs</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {activities.map((item, idx) => (
          <div key={item.id || idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs">
            <div className="p-1 rounded bg-white border border-slate-200 shadow-xs flex-shrink-0 mt-0.5">
              {getEventIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 leading-snug">{item.event}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                <span>{item.timeAgo || item.timestamp}</span>
                {item.location && <span>• {item.location}</span>}
                {item.actor && <span>• {item.actor}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
