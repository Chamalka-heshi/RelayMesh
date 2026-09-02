import React, { useState } from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Phone, 
  Clock, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  Truck, 
  ChevronRight,
  Flame,
  Radio
} from 'lucide-react';

export default function SOSList({ 
  alerts, 
  selectedSOS, 
  onSelectSOS, 
  volunteers 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = (alerts || []).filter(alert => {
    // Status filter
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (alert.citizenName || '').toLowerCase().includes(q);
      const matchPhone = (alert.citizenPhone || '').toLowerCase().includes(q);
      const matchLoc = (alert.locationName || '').toLowerCase().includes(q);
      const matchTags = (alert.triageTags || []).some(t => t.toLowerCase().includes(q));
      return matchName || matchPhone || matchLoc || matchTags;
    }
    return true;
  });

  const getPriorityClass = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      default: return 'priority-moderate';
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="status-badge active">
            <span className="pulse-dot"></span>
            ACTIVE SOS
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="status-badge dispatched">
            <Truck className="w-3 h-3 inline mr-1" />
            DISPATCHED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="status-badge resolved">
            <CheckCircle2 className="w-3 h-3 inline mr-1" />
            RESOLVED
          </span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'just now';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getAssignedVolunteerName = (volId) => {
    if (!volId) return null;
    const vol = (volunteers || []).find(v => v.id === volId);
    return vol ? `${vol.name} (${vol.callsign})` : volId;
  };

  const counts = {
    ALL: (alerts || []).length,
    ACTIVE: (alerts || []).filter(a => a.status === 'ACTIVE').length,
    DISPATCHED: (alerts || []).filter(a => a.status === 'DISPATCHED').length,
    RESOLVED: (alerts || []).filter(a => a.status === 'RESOLVED').length,
  };

  return (
    <div className="sos-panel">
      {/* Header with Search & Filter */}
      <div className="sos-panel-header">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="sos-panel-title">EMERGENCY DISTRESS FEED</h2>
          </div>
          <span className="sos-total-badge">{filteredAlerts.length} Calls</span>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <Search className="w-3.5 h-3.5 search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search citizen, phone, triage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-pills">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`filter-pill ${filterStatus === 'ALL' ? 'active' : ''}`}
          >
            All ({counts.ALL})
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`filter-pill alert ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
          >
            🚨 Active ({counts.ACTIVE})
          </button>
          <button
            onClick={() => setFilterStatus('DISPATCHED')}
            className={`filter-pill warning ${filterStatus === 'DISPATCHED' ? 'active' : ''}`}
          >
            🚚 Dispatched ({counts.DISPATCHED})
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`filter-pill success ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
          >
            ✅ Resolved ({counts.RESOLVED})
          </button>
        </div>
      </div>

      {/* SOS List Items */}
      <div className="sos-list-content">
        {filteredAlerts.length === 0 ? (
          <div className="empty-feed">
            <Radio className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
            <p className="text-slate-400 font-semibold text-sm">No Emergency Signals Found</p>
            <p className="text-slate-600 text-xs mt-1">
              {searchQuery ? 'Try clearing your search query' : 'All incoming mesh distress signals are cleared'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isSelected = selectedSOS && selectedSOS.id === alert.id;
            const assignedVol = getAssignedVolunteerName(alert.assignedVolunteerId);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectSOS(alert)}
                className={`sos-card ${getPriorityClass(alert.priority)} ${isSelected ? 'selected' : ''}`}
              >
                {/* Top Row: Priority & Status */}
                <div className="sos-card-header">
                  <div className="flex items-center gap-1.5">
                    <span className={`priority-tag ${alert.priority.toLowerCase()}`}>
                      {alert.priority === 'CRITICAL' && <Flame className="w-3 h-3 inline mr-0.5" />}
                      {alert.priority}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      #{alert.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(alert.status)}
                  </div>
                </div>

                {/* Citizen Name & Phone */}
                <div className="sos-citizen-info">
                  <h3 className="citizen-name">{alert.citizenName || 'Unknown Citizen'}</h3>
                  <div className="citizen-phone">
                    <Phone className="w-3 h-3 inline mr-1 text-slate-400" />
                    <span>{alert.citizenPhone || '+94 77 000 0000'}</span>
                  </div>
                </div>

                {/* Location Landmark */}
                <div className="sos-location">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="location-text">{alert.locationName}</span>
                </div>

                {/* Triage Tags */}
                <div className="triage-tags-wrapper">
                  {(alert.triageTags || []).map((tag, idx) => (
                    <span key={idx} className="triage-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Assigned Volunteer Banner if Dispatched */}
                {assignedVol && (
                  <div className="assigned-banner">
                    <Truck className="w-3 h-3 text-amber-400" />
                    <span>Assigned: <strong>{assignedVol}</strong></span>
                  </div>
                )}

                {/* Card Footer: Hop count & Reported Time */}
                <div className="sos-card-footer">
                  <div className="hop-badge">
                    <Radio className="w-3 h-3" />
                    <span>{alert.hopCount || 1} {alert.hopCount === 1 ? 'Hop' : 'Hops'} ({alert.deviceId || 'Mesh'})</span>
                  </div>

                  <div className="time-badge">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeAgo(alert.reportedAt || alert.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
