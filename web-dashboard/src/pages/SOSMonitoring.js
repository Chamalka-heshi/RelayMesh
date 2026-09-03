import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  MapPin,
  Radio,
  ArrowUpRight,
  Search,
  Truck,
  CheckCircle2,
  X,
  Phone,
  Clock
} from 'lucide-react';
import api from '../services/api';

export default function SOSMonitoring({ onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchSOSData = useCallback(async () => {
    try {
      const sosRes = await api.getSOSAlerts();
      if (sosRes && sosRes.success && sosRes.data) {
        setAlerts(sosRes.data);
      }
    } catch (err) {
      console.error('Error loading SOS monitoring alerts:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSOSData();
    const interval = setInterval(fetchSOSData, 6000);
    return () => clearInterval(interval);
  }, [fetchSOSData]);

  const handleResolveSOS = async (sosId) => {
    try {
      await api.resolveSOS(sosId);
      setToastMessage(`Distress Beacon #${sosId} marked as RESOLVED`);
      setSelectedSOS(null);
      await fetchSOSData();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      console.error('Error resolving SOS:', e);
    }
  };

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    let list = [...alerts];

    if (priorityFilter !== 'ALL') {
      list = list.filter((a) => a.priority?.toUpperCase() === priorityFilter.toUpperCase());
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((a) => a.status?.toUpperCase() === statusFilter.toUpperCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.id?.toLowerCase().includes(q) ||
          a.citizenName?.toLowerCase().includes(q) ||
          a.deviceId?.toLowerCase().includes(q) ||
          a.locationName?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [alerts, priorityFilter, statusFilter, searchQuery]);

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#164E37',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--donezo-radius-pill)',
          boxShadow: '0 10px 25px rgba(22, 78, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">SOS Distress Monitoring</h1>
          <p className="donezo-page-subtitle">
            Real-time citizen distress beacons, priority triage & field responder dispatch.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/dispatch')}
            className="donezo-btn-primary"
          >
            <Truck className="w-4 h-4" />
            <span>Open Dispatch Matrix</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchSOSData();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Distress */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Distress Beacons</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">
            {alerts.filter(a => a.status === 'ACTIVE').length}
          </div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">Live</span>
            <span>Broadcasting over Mesh</span>
          </div>
        </div>

        {/* Card 2: Critical Life Threats */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Critical Life Threats</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-red-600">
            {alerts.filter(a => a.priority === 'CRITICAL' && a.status === 'ACTIVE').length}
          </div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-red-100 text-red-700">Priority 1</span>
            <span>Immediate evacuation needed</span>
          </div>
        </div>

        {/* Card 3: Dispatched Beacons */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Dispatched Units</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-amber-600">
            {alerts.filter(a => a.status === 'DISPATCHED').length}
          </div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-amber-100 text-amber-700">En Route</span>
            <span>Responders in field</span>
          </div>
        </div>

        {/* Card 4: Resolved Operations */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Resolved Operations</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-emerald-700">
            {alerts.filter(a => a.status === 'RESOLVED').length}
          </div>
          <div className="donezo-kpi-status-text">
            <span>● Aid Successfully Delivered</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        {/* Search Input Box */}
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search citizen, node ID, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Priority Filter Pills */}
        <div className="donezo-filter-pills-row">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`donezo-filter-pill-btn ${priorityFilter === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="donezo-filter-pills-row">
          {['ALL', 'ACTIVE', 'DISPATCHED', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`donezo-filter-pill-btn ${statusFilter === s ? 'active-dark' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main SOS Alerts List Table */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Live Ingested Distress Beacons</h3>
            <p className="donezo-table-sub">Showing {filteredAlerts.length} beacons matching criteria</p>
          </div>
          <span className="donezo-table-tag-live">
            ● P2P Mesh Relay Ingestion
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>SOS Beacon ID</th>
                <th>Citizen / Node ID</th>
                <th>Location & Sector</th>
                <th>Priority & Triage</th>
                <th>Status</th>
                <th>Mesh Hops</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedSOS(alert)}
                >
                  <td>
                    <span className="donezo-chip-id">
                      #{alert.id}
                    </span>
                  </td>
                  <td>
                    <div className="donezo-person-cell">
                      <span className="donezo-person-name">{alert.citizenName || 'Anonymous Citizen'}</span>
                      <span className="donezo-person-meta">Node: #{alert.deviceId || 'RM-4587'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="donezo-location-cell">
                      <MapPin className="w-3.5 h-3.5 donezo-location-icon" />
                      <span>{alert.locationName || 'Kelani River Basin'}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`donezo-badge-priority priority-${(alert.priority || 'moderate').toLowerCase()}`}
                    >
                      {alert.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`donezo-badge-status status-${(alert.status || 'active').toLowerCase()}`}
                    >
                      ● {alert.status}
                    </span>
                  </td>
                  <td>
                    <div className="donezo-hops-cell">
                      <Radio className="w-3.5 h-3.5" />
                      <span>{alert.hopCount || 2} Hops</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSOS(alert);
                      }}
                      className="donezo-btn-inspect"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected SOS Details Modal Drawer */}
      {selectedSOS && (
        <div className="donezo-modal-overlay" onClick={() => setSelectedSOS(null)}>
          <div className="donezo-modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">SOS BEACON #{selectedSOS.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedSOS.citizenName || 'Citizen Distress Beacon'}</h3>
              </div>
              <button
                onClick={() => setSelectedSOS(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5 text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-medium block">Triage Priority</span>
                  <span className={`donezo-badge-priority priority-${(selectedSOS.priority || 'critical').toLowerCase()} mt-1`}>
                    {selectedSOS.priority}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-slate-400 text-xs font-medium block">Current Status</span>
                  <span className={`donezo-badge-status status-${(selectedSOS.status || 'active').toLowerCase()} mt-1`}>
                    ● {selectedSOS.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800 text-xs">{selectedSOS.citizenPhone || '+94 77 123 4567'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedSOS.timeAgo || '3m ago'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedSOS.locationName}</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-800 font-bold block">
                  Coordinates: {selectedSOS.latitude?.toFixed(4)}, {selectedSOS.longitude?.toFixed(4)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 text-xs font-bold block mb-1">MEDICAL & DISTRESS NEEDS</span>
                <p className="text-slate-800 text-xs leading-relaxed">
                  {selectedSOS.medicalNeeds || selectedSOS.notes || 'Citizen stranded in flood zone requiring boat extraction and potable water.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              {selectedSOS.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolveSOS(selectedSOS.id)}
                  className="donezo-btn-outline"
                  style={{ color: '#059669', borderColor: '#A7F3D0' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved</span>
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setSelectedSOS(null)}
                  className="donezo-btn-outline"
                >
                  Close
                </button>
                {selectedSOS.status === 'ACTIVE' && (
                  <button
                    onClick={() => {
                      onNavigate('/dispatch');
                    }}
                    className="donezo-btn-primary"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Dispatch Unit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
