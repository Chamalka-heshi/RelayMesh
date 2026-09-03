import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ArrowUpRight,
  RotateCcw,
  Truck
} from 'lucide-react';
import api from '../services/api';

export default function VolunteersPage({ onNavigate }) {
  const [volunteers, setVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const filteredVolunteers = useMemo(() => {
    let list = [...volunteers];
    if (statusFilter !== 'ALL') {
      list = list.filter((v) => v.status?.toUpperCase() === statusFilter.toUpperCase());
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
  }, [volunteers, statusFilter, searchQuery]);

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Volunteer Corps & Responders</h1>
          <p className="donezo-page-subtitle">
            Search & rescue teams, medical personnel, and field mesh node operators.
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
              loadVolunteers();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Responders'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Total Registered (Featured Deep Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Volunteer Corps</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">47</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">35</span>
            <span>Available for immediate dispatch</span>
          </div>
        </div>

        {/* Card 2: Deployed in Field */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Deployed in Field</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">10</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-amber-100 text-amber-700">Active</span>
            <span>Operating in Kelani basin</span>
          </div>
        </div>

        {/* Card 3: Medical Personnel */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Medical Specialists</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">11</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Trained</span>
            <span>First aid & trauma certified</span>
          </div>
        </div>

        {/* Card 4: On Standby */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">On Standby / Radio</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">2</div>
          <div className="donezo-kpi-status-text">
            <span>Standby at Base Depot</span>
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
          {['ALL', 'AVAILABLE', 'DISPATCHED'].map((s) => (
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

      {/* Volunteers Cards Grid */}
      <div className="donezo-cards-grid-3">
        {filteredVolunteers.map((vol) => (
          <div
            key={vol.id}
            className="donezo-volunteer-card"
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
                className={`donezo-badge-status status-${(vol.status || 'available').toLowerCase()}`}
              >
                ● {vol.status}
              </span>
            </div>

            <div className="donezo-vol-specs-table">
              <div className="donezo-vol-spec-row">
                <span className="donezo-vol-spec-lbl">Specialization</span>
                <span className="donezo-vol-spec-val">{vol.specialization || 'First Aid & Evac'}</span>
              </div>
              <div className="donezo-vol-spec-row">
                <span className="donezo-vol-spec-lbl">Assigned Node ID</span>
                <span className="donezo-vol-spec-val" style={{ color: 'var(--donezo-forest)' }}>
                  #{vol.deviceId || 'RM-84F2'}
                </span>
              </div>
              <div className="donezo-vol-spec-row">
                <span className="donezo-vol-spec-lbl">Battery Health</span>
                <span className="donezo-vol-spec-val">{vol.batteryLevel || 94}%</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('/dispatch');
              }}
              className="donezo-btn-assign"
            >
              Assign Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
