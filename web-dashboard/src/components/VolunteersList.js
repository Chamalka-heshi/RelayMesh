import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Battery, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Truck, 
  Search, 
  MessageSquare, 
  Plus, 
  Radio, 
  Star,
  Award
} from 'lucide-react';

export default function VolunteersList({ 
  volunteers, 
  onViewInbox, 
  onSelectVolunteer,
  alerts 
}) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredVolunteers = (volunteers || []).filter(v => {
    if (filter !== 'ALL' && v.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (v.name || '').toLowerCase().includes(q) ||
        (v.callsign || '').toLowerCase().includes(q) ||
        (v.specialization || '').toLowerCase().includes(q) ||
        (v.role || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'AVAILABLE':
      case 'ONLINE':
        return (
          <span className="vol-status-badge available">
            <span className="live-dot-green"></span>
            AVAILABLE & READY
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="vol-status-badge dispatched">
            <Truck className="w-3 h-3 inline mr-1 text-amber-400" />
            DISPATCHED EN ROUTE
          </span>
        );
      case 'BUSY':
        return (
          <span className="vol-status-badge busy">
            BUSY ON SCENE
          </span>
        );
      default:
        return <span className="vol-status-badge offline">OFFLINE</span>;
    }
  };

  const getAssignedIncidentName = (taskId) => {
    if (!taskId) return null;
    const alert = (alerts || []).find(a => a.id === taskId);
    return alert ? `${alert.citizenName} (${alert.locationName})` : taskId;
  };

  return (
    <div className="volunteers-view-container">
      {/* Top Header Bar */}
      <div className="volunteers-header">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            CONNECTED RESCUE VOLUNTEER CORPS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Mesh Telemetry, Battery Status & Rescuer Notification Hub
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-3">
          <div className="search-box">
            <Search className="w-3.5 h-3.5 search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search volunteers by name, skill, callsign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button
              onClick={() => setFilter('ALL')}
              className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`}
            >
              All ({volunteers.length})
            </button>
            <button
              onClick={() => setFilter('AVAILABLE')}
              className={`filter-pill success ${filter === 'AVAILABLE' ? 'active' : ''}`}
            >
              Available ({(volunteers || []).filter(v => v.status === 'AVAILABLE').length})
            </button>
            <button
              onClick={() => setFilter('DISPATCHED')}
              className={`filter-pill warning ${filter === 'DISPATCHED' ? 'active' : ''}`}
            >
              Dispatched ({(volunteers || []).filter(v => v.status === 'DISPATCHED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Volunteer Cards */}
      <div className="volunteers-grid">
        {filteredVolunteers.map(vol => {
          const assignedIncident = getAssignedIncidentName(vol.currentTaskId);

          return (
            <div key={vol.id} className="volunteer-telemetry-card">
              {/* Card Top: Callsign & Status */}
              <div className="vol-card-top">
                <div className="flex items-center gap-2">
                  <div className="vol-avatar-icon">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="vol-name">{vol.name}</h3>
                    <div className="vol-callsign-text">
                      {vol.callsign} • <span className="text-slate-400">{vol.role}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {getStatusBadge(vol.status)}
                </div>
              </div>

              {/* Specialization & Skills */}
              <div className="vol-specialization-box">
                <span className="text-[11px] text-slate-400">Specialization:</span>
                <span className="font-bold text-xs text-emerald-300 ml-1.5">{vol.specialization}</span>
              </div>

              {/* Telemetry Row: Battery, Rating, Missions, Location */}
              <div className="vol-telemetry-stats">
                <div className="vol-stat-pill">
                  <Battery className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Battery: <strong>{vol.battery}%</strong></span>
                </div>

                <div className="vol-stat-pill">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Missions: <strong>{vol.completedMissions || 12}</strong></span>
                </div>

                <div className="vol-stat-pill">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Rating: <strong>{vol.rating || 4.9}</strong></span>
                </div>
              </div>

              {/* GPS Coordinates & Contact */}
              <div className="vol-contact-row">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span className="font-mono text-slate-300">{vol.phone}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span className="font-mono text-slate-300">{vol.latitude?.toFixed(4)}, {vol.longitude?.toFixed(4)}</span>
                </div>
              </div>

              {/* Equipment Checklist */}
              <div className="vol-equipment-list">
                {(vol.equipment || []).map((eq, idx) => (
                  <span key={idx} className="eq-badge">
                    ✓ {eq}
                  </span>
                ))}
              </div>

              {/* Currently Assigned Task Banner */}
              {assignedIncident && (
                <div className="current-task-banner">
                  <Truck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs text-amber-200 truncate">
                    Assigned Task: <strong>{assignedIncident}</strong>
                  </span>
                </div>
              )}

              {/* Card Footer: View Rescuer Terminal Inbox */}
              <div className="vol-card-footer">
                <button
                  onClick={() => onViewInbox(vol)}
                  className="view-inbox-btn"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inspect Rescuer Mobile Inbox & Alerts</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
