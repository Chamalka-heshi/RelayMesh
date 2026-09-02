import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin,
  ArrowUpRight,
  RotateCcw,
  Search
} from 'lucide-react';
import api from '../services/api';

export default function IncidentMonitoring({ onNavigate }) {
  const [incidents, setIncidents] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await api.getIncidents();
      if (res && res.success && res.data) {
        setIncidents(res.data);
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 6000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const filteredIncidents = useMemo(() => {
    let list = [...incidents];
    if (severityFilter !== 'ALL') {
      list = list.filter((i) => i.severity?.toUpperCase() === severityFilter.toUpperCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.id?.toLowerCase().includes(q) ||
          i.title?.toLowerCase().includes(q) ||
          i.area?.toLowerCase().includes(q) ||
          i.type?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [incidents, severityFilter, searchQuery]);

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Disaster Incidents & Areas</h1>
          <p className="donezo-page-subtitle">
            Active flood zones, landslip alerts, triage points, and tactical response sectors.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/map')}
            className="donezo-btn-primary"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Situation Map</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchIncidents();
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
        {/* Card 1: Total Incidents (Featured Deep Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Disaster Incidents</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">4</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">2</span>
            <span>Critical life-safety zones</span>
          </div>
        </div>

        {/* Card 2: Active SOS Beacons */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Triaged Distress Beacons</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">24</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-red-100 text-red-700">17 In Flood</span>
            <span>Across Kelani basin</span>
          </div>
        </div>

        {/* Card 3: Evacuees */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Citizens Evacuated</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">1,840</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Safe</span>
            <span>In designated shelters</span>
          </div>
        </div>

        {/* Card 4: Affected Population */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Estimated Zone Population</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">6.2k</div>
          <div className="donezo-kpi-status-text">
            <span>Mesh coverage active</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident, location, hazard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="donezo-filter-pills-row">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`donezo-filter-pill-btn ${severityFilter === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Cards Grid */}
      <div className="donezo-cards-grid-2">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="donezo-incident-card"
            onClick={() => onNavigate(`/incidents/${inc.id}`)}
          >
            <div className="donezo-incident-card-top">
              <div>
                <span className="donezo-incident-code">INCIDENT #{inc.id}</span>
                <h4 className="donezo-incident-title">{inc.title}</h4>
                <div className="donezo-incident-location">
                  <MapPin className="w-3.5 h-3.5 donezo-location-icon" />
                  <span>{inc.area}</span>
                </div>
              </div>

              <span
                className={`donezo-badge-priority priority-${(inc.severity || 'moderate').toLowerCase()}`}
              >
                {inc.severity}
              </span>
            </div>

            <div className="donezo-incident-stats-grid">
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">Active SOS</span>
                <span className="donezo-incident-stat-val val-red">{inc.activeSOSCount || 17} Beacons</span>
              </div>
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">Responders</span>
                <span className="donezo-incident-stat-val val-green">{inc.activeResponders || 14} Units</span>
              </div>
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">Casualties</span>
                <span className="donezo-incident-stat-val">{inc.casualties || 0}</span>
              </div>
            </div>

            <div className="donezo-incident-footer">
              <span className="donezo-hazard-tag">
                Hazard Type: <strong>{inc.type || 'FLOOD'}</strong>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`/incidents/${inc.id}`);
                }}
                className="donezo-btn-dossier"
              >
                Inspect Sector Dossier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
