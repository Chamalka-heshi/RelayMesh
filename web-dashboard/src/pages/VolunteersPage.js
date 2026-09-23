import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Truck,
  ArrowUpRight,
  CheckCircle2,
  X
} from 'lucide-react';
import api from '../services/api';

export default function VolunteersPage({ onNavigate }) {
  const [volunteers, setVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, AVAILABLE, DEPLOYED, MEDICAL
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadVolunteers = async () => {
    try {
      const res = await api.getVolunteers();
      if (res && res.success && res.data) {
        setVolunteers(res.data);
      }
    } catch (e) {
      console.error('Error fetching volunteers:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleToggleDeployment = (vol) => {
    const newStatus = vol.status === 'AVAILABLE' ? 'DEPLOYED' : 'AVAILABLE';
    vol.status = newStatus;
    setToastMessage(`Team ${vol.callsign || vol.name} status updated to ${newStatus}`);
    setSelectedVolunteer(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // KPI Calculations
  const totalCount = volunteers.length || 47;
  const deployedCount = volunteers.filter(v => v.status === 'DEPLOYED' || v.status === 'BUSY').length || 8;
  const availableCount = volunteers.filter(v => v.status === 'AVAILABLE' || v.status === 'STANDBY').length || 10;
  const medicalCount = volunteers.filter(v => (v.specialization || '').toLowerCase().includes('medic') || (v.role || '').toLowerCase().includes('medic')).length || 11;

  const filteredVolunteers = useMemo(() => {
    let list = [...volunteers];
    if (activeTab === 'AVAILABLE') {
      list = list.filter((v) => v.status === 'AVAILABLE' || v.status === 'STANDBY');
    } else if (activeTab === 'DEPLOYED') {
      list = list.filter((v) => v.status === 'DEPLOYED' || v.status === 'BUSY');
    } else if (activeTab === 'MEDICAL') {
      list = list.filter((v) => (v.specialization || '').toLowerCase().includes('medic') || (v.role || '').toLowerCase().includes('medic'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.callsign?.toLowerCase().includes(q) ||
          v.role?.toLowerCase().includes(q) ||
          v.specialization?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [volunteers, activeTab, searchQuery]);

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
          <h1 className="donezo-page-title">Rescue Teams & Responders</h1>
          <p className="donezo-page-subtitle">
            Field responder readiness, swift water rescue teams, medical corps & mission assignment.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/sos')}
            className="donezo-btn-primary"
            style={{ backgroundColor: '#DC2626' }}
          >
            <Truck className="w-4 h-4" />
            <span>Assign to SOS Cases</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              loadVolunteers();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Responders'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Volunteer Corps (Featured Forest Green Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-featured"
          onClick={() => setActiveTab('ALL')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Volunteer Corps</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">{totalCount}</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">18</span>
            <span>Coordinated Rescue Teams</span>
          </div>
        </div>

        {/* Card 2: Deployed in Field */}
        <div
          className="donezo-kpi-card donezo-kpi-white"
          onClick={() => setActiveTab('DEPLOYED')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Deployed in Field</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: '#2563EB' }}>{deployedCount}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>In Action</span>
            <span>Operating in flood zones</span>
          </div>
        </div>

        {/* Card 3: Ready on Standby */}
        <div
          className="donezo-kpi-card donezo-kpi-white"
          onClick={() => setActiveTab('AVAILABLE')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Ready on Standby</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: 'var(--donezo-forest)' }}>{availableCount}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}>Standby</span>
            <span>Immediate dispatch ready</span>
          </div>
        </div>

        {/* Card 4: Medical Specialists */}
        <div
          className="donezo-kpi-card donezo-kpi-white"
          onClick={() => setActiveTab('MEDICAL')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Medical Specialists</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: '#7C3AED' }}>{medicalCount}</div>
          <div className="donezo-kpi-status-text">
            <span>● Trauma & First Aid Certified</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, callsign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="donezo-filter-pills-row">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--donezo-text-muted)', marginRight: '0.25rem' }}>FILTER UNITS:</span>
          {[
            { id: 'ALL', label: `All Personnel (${volunteers.length})` },
            { id: 'AVAILABLE', label: `Ready Standby (${availableCount})` },
            { id: 'DEPLOYED', label: `In Field (${deployedCount})` },
            { id: 'MEDICAL', label: `Medical Units (${medicalCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`donezo-filter-pill-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      <div className="donezo-cards-grid-3">
        {filteredVolunteers.map((vol) => {
          const isDeployed = vol.status === 'DEPLOYED' || vol.status === 'BUSY';

          return (
            <div
              key={vol.id}
              className="donezo-volunteer-card"
              onClick={() => setSelectedVolunteer(vol)}
            >
              <div className="donezo-vol-top">
                <div className="donezo-vol-identity">
                  <div className="donezo-vol-avatar-circle">
                    {vol.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="donezo-vol-name">{vol.name}</h4>
                    <span className="donezo-vol-callsign">Callsign: {vol.callsign || 'RESCUE-1'}</span>
                  </div>
                </div>
                <span
                  className={`donezo-badge-status ${
                    isDeployed ? 'donezo-status-dispatched' : 'donezo-status-resolved'
                  }`}
                >
                  ● {vol.status || 'AVAILABLE'}
                </span>
              </div>

              <div className="donezo-vol-specs-table">
                <div className="donezo-vol-spec-row" style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  <span className="donezo-vol-spec-lbl">Specialization</span>
                  <span className="donezo-vol-spec-val">{vol.specialization || 'First Aid & Evac'}</span>
                </div>
                <div className="donezo-vol-spec-row" style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  <span className="donezo-vol-spec-lbl">Assigned Node ID</span>
                  <span className="donezo-vol-spec-val" style={{ color: 'var(--donezo-forest)', fontFamily: 'monospace' }}>
                    #{vol.deviceId || 'RM-84F2'}
                  </span>
                </div>
                <div className="donezo-vol-spec-row" style={{ padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  <span className="donezo-vol-spec-lbl">Battery Health</span>
                  <span className="donezo-vol-spec-val">{vol.batteryLevel || 94}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleToggleDeployment(vol)}
                  className="donezo-btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: '0.45rem',
                    fontSize: '0.75rem',
                    backgroundColor: isDeployed ? '#475569' : '#2563EB'
                  }}
                >
                  {isDeployed ? 'Mark Available' : 'Deploy to Field'}
                </button>
                <button
                  onClick={() => setSelectedVolunteer(vol)}
                  className="donezo-btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                >
                  Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Volunteer Dossier Modal */}
      {selectedVolunteer && (
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
          onClick={() => setSelectedVolunteer(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--donezo-radius-lg)',
              border: '1px solid var(--donezo-border)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--donezo-border)', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--donezo-text-light)' }}>
                  RESPONDER DOSSIER #{selectedVolunteer.callsign || selectedVolunteer.id}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--donezo-text-main)', margin: '0.2rem 0 0 0' }}>
                  {selectedVolunteer.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--donezo-text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--donezo-border)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--donezo-text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Specialization</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--donezo-text-main)' }}>{selectedVolunteer.specialization || 'First Responder'}</div>
              </div>
              <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--donezo-border)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--donezo-text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Sector</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--donezo-text-main)' }}>Kelani North River Corridor</div>
              </div>
              <div style={{ backgroundColor: 'var(--donezo-bg)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--donezo-border)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--donezo-text-light)', fontWeight: 700, textTransform: 'uppercase' }}>RelayMesh Node Link</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--donezo-forest)', fontFamily: 'monospace' }}>#{selectedVolunteer.deviceId || 'RM-84F2'} (Active)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--donezo-border)' }}>
              <button
                onClick={() => handleToggleDeployment(selectedVolunteer)}
                className="donezo-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Toggle Deployment Status
              </button>
              <button
                onClick={() => setSelectedVolunteer(null)}
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
