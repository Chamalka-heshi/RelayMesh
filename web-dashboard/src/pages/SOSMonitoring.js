import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  MapPin,
  Search,
  CheckCircle2,
  X,
  Truck,
  ArrowUpRight
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

  const handleQuickDispatch = (alert) => {
    setToastMessage(`Rescue Unit dispatched to #${alert.id} (${alert.citizenName})`);
    alert.status = 'DISPATCHED';
    setTimeout(() => setToastMessage(null), 4000);
  };

  // KPI Calculations
  const activeCount = useMemo(() => alerts.filter(a => a.status === 'ACTIVE').length, [alerts]);
  const criticalCount = useMemo(() => alerts.filter(a => a.priority === 'CRITICAL' && a.status === 'ACTIVE').length, [alerts]);
  const dispatchedCount = useMemo(() => alerts.filter(a => a.status === 'DISPATCHED').length, [alerts]);
  const resolvedCount = useMemo(() => alerts.filter(a => a.status === 'RESOLVED').length, [alerts]);

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
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--donezo-radius-pill)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
            onClick={() => onNavigate('/map')}
            className="donezo-btn-primary"
          >
            <MapPin className="w-4 h-4" />
            <span>Tactical Map View</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchSOSData();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Distress (Featured Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured" onClick={() => { setPriorityFilter('ALL'); setStatusFilter('ACTIVE'); }} style={{ cursor: 'pointer' }}>
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Distress Beacons</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">{activeCount}</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">Live</span>
            <span>Broadcasting over Mesh</span>
          </div>
        </div>

        {/* Card 2: Critical Life Threats */}
        <div className="donezo-kpi-card donezo-kpi-white" onClick={() => { setPriorityFilter('CRITICAL'); setStatusFilter('ACTIVE'); }} style={{ cursor: 'pointer' }}>
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Critical Life Threats</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: '#DC2626' }}>{criticalCount}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>Priority 1</span>
            <span>Immediate evacuation needed</span>
          </div>
        </div>

        {/* Card 3: Dispatched Units */}
        <div className="donezo-kpi-card donezo-kpi-white" onClick={() => { setPriorityFilter('ALL'); setStatusFilter('DISPATCHED'); }} style={{ cursor: 'pointer' }}>
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Dispatched Units</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: '#D97706' }}>{dispatchedCount}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>En Route</span>
            <span>Responders in field</span>
          </div>
        </div>

        {/* Card 4: Resolved Operations */}
        <div className="donezo-kpi-card donezo-kpi-white" onClick={() => { setPriorityFilter('ALL'); setStatusFilter('RESOLVED'); }} style={{ cursor: 'pointer' }}>
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Resolved Operations</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: 'var(--donezo-forest)' }}>{resolvedCount}</div>
          <div className="donezo-kpi-status-text">
            <span>● Aid Successfully Delivered</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search citizen, node ID, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="donezo-filter-pills-row">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--donezo-text-muted)', marginRight: '0.25rem' }}>PRIORITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`donezo-filter-pill-btn ${priorityFilter === p ? (p === 'CRITICAL' ? 'active' : 'active-dark') : ''}`}
              style={priorityFilter === p && p === 'CRITICAL' ? { backgroundColor: '#DC2626', borderColor: '#DC2626' } : {}}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="donezo-filter-pills-row">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--donezo-text-muted)', marginRight: '0.25rem' }}>STATUS:</span>
          {['ALL', 'ACTIVE', 'DISPATCHED', 'RESOLVED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`donezo-filter-pill-btn ${statusFilter === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scannable SOS Table */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Live Ingested Distress Beacons</h3>
            <p className="donezo-table-sub">Showing {filteredAlerts.length} beacons matching criteria</p>
          </div>
          <span className="donezo-table-tag-live">
            ● P2P Mesh Relay Ingestion Active
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>SOS Beacon ID</th>
                <th>Citizen / Node ID</th>
                <th>Location & Sector</th>
                <th>Distress Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--donezo-text-muted)' }}>
                    No distress beacons found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isCritical = alert.priority === 'CRITICAL';
                  const isDispatched = alert.status === 'DISPATCHED';
                  const isResolved = alert.status === 'RESOLVED';

                  return (
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
                          <span>{alert.locationName || 'Kelani Flood Basin'}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`donezo-badge-priority ${
                            isCritical
                              ? 'donezo-priority-critical'
                              : alert.priority === 'HIGH'
                              ? 'donezo-priority-high'
                              : 'donezo-priority-moderate'
                          }`}
                        >
                          {alert.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`donezo-badge-status ${
                            isResolved
                              ? 'donezo-status-resolved'
                              : isDispatched
                              ? 'donezo-status-dispatched'
                              : 'donezo-status-active'
                          }`}
                        >
                          ● {alert.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {!isDispatched && !isResolved && (
                            <button
                              onClick={() => handleQuickDispatch(alert)}
                              className="donezo-btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#2563EB' }}
                            >
                              Dispatch
                            </button>
                          )}
                          {!isResolved && (
                            <button
                              onClick={() => handleResolveSOS(alert.id)}
                              className="donezo-btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#059669' }}
                            >
                              Mark Safe
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedSOS(alert)}
                            className="donezo-btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected SOS Details Modal Drawer */}
      {selectedSOS && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedSOS(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--donezo-radius-lg)',
              border: '1px solid var(--donezo-border)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--donezo-border)', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--donezo-text-light)' }}>
                  DISTRESS BEACON #{selectedSOS.id}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--donezo-text-main)', margin: '0.2rem 0 0 0' }}>
                  {selectedSOS.citizenName || 'Citizen Distress Case'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSOS(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--donezo-text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span
                className={`donezo-badge-priority ${
                  selectedSOS.priority === 'CRITICAL'
                    ? 'donezo-priority-critical'
                    : selectedSOS.priority === 'HIGH'
                    ? 'donezo-priority-high'
                    : 'donezo-priority-moderate'
                }`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              >
                {selectedSOS.priority} PRIORITY
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>
                Status: <strong>{selectedSOS.status}</strong>
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.85rem 1rem', borderRadius: 'var(--donezo-radius-sm)', marginBottom: '1rem', border: '1px solid var(--donezo-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--donezo-text-main)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{selectedSOS.locationName || 'Kelani River Flood Basin'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--donezo-text-muted)', lineHeight: 1.4 }}>
                <strong>Reported Situation:</strong> {selectedSOS.situationDetails || 'Trapped in residence, flood water reaching upper level. Urgent boat rescue requested.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--donezo-border)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--donezo-text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Ingest Node</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2563EB', fontFamily: 'monospace' }}>#{selectedSOS.deviceId || 'RM-4587'}</div>
              </div>
              <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--donezo-border)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--donezo-text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Mesh Routing</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>{selectedSOS.hopCount || 2} Hops</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--donezo-border)' }}>
              {selectedSOS.status !== 'DISPATCHED' && selectedSOS.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    handleQuickDispatch(selectedSOS);
                    setSelectedSOS(null);
                  }}
                  className="donezo-btn-primary"
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: '#2563EB' }}
                >
                  <Truck className="w-4 h-4" />
                  <span>Dispatch Rescue Unit</span>
                </button>
              )}
              {selectedSOS.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolveSOS(selectedSOS.id)}
                  className="donezo-btn-primary"
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: 'var(--donezo-forest)' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              )}
              <button
                onClick={() => setSelectedSOS(null)}
                className="donezo-btn-outline"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
