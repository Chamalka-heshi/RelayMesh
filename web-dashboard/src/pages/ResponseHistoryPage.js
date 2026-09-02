import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import LoadingState from '../components/common/LoadingState';
import api from '../services/api';

export default function ResponseHistoryPage({ onNavigate }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getDispatchAssignments();
        setAssignments(res.data || []);
      } catch (e) {
        console.error('Error fetching response history:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Historical Dispatch Logs..." />;
  }

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Emergency Response History</h1>
          <p className="donezo-page-subtitle">
            Completed search & rescue operations, dispatch audit logs, and mission outcomes.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Total Missions (Featured Forest Green) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Total Missions Logged</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">142</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">Audit</span>
            <span>All-time rescue deployments</span>
          </div>
        </div>

        {/* Card 2: Success Rate */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Successful Resolutions</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-emerald-700">138</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">97.2%</span>
            <span>Mission success rate</span>
          </div>
        </div>

        {/* Card 3: Avg Duration */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Average Response Duration</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">24 mins</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-blue-100 text-blue-700">Speed</span>
            <span>From SOS to on-scene aid</span>
          </div>
        </div>

        {/* Card 4: Lives Evacuated */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Citizens Evacuated</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">318</div>
          <div className="donezo-kpi-status-text">
            <span>Across monitored incidents</span>
          </div>
        </div>
      </div>

      {/* Main History Table Card */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Historical Deployment Records</h3>
            <p className="donezo-table-sub">Immutable PostGIS records of completed field mobilizations</p>
          </div>
          <span className="donezo-table-tag-live">
            ● Completed Operations
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>Mission ID</th>
                <th>Linked SOS</th>
                <th>Assigned Responder</th>
                <th>Dispatcher Officer</th>
                <th>Dispatch Time</th>
                <th>Distance & ETA</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Outcome / Message</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="donezo-chip-id">
                      #{record.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {record.sosId}
                    </span>
                  </td>
                  <td>
                    <div className="donezo-person-cell">
                      <span className="donezo-person-name">{record.volunteerId}</span>
                      <span className="donezo-person-meta">Medic Bravo-3</span>
                    </div>
                  </td>
                  <td className="text-xs text-slate-700 font-medium">
                    {record.dispatcherName || 'Central Division'}
                  </td>
                  <td className="text-xs font-mono text-slate-500">
                    {new Date(record.dispatchedAt).toLocaleTimeString()}
                  </td>
                  <td className="text-xs font-mono text-slate-700">
                    {record.distanceKm} km (~{record.etaMinutes}m)
                  </td>
                  <td>
                    <span className="donezo-badge-status status-resolved">
                      ● {record.status || 'COMPLETED'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="text-xs text-slate-600 max-w-xs truncate inline-block">
                      {record.messageSent || 'Citizen safely evacuated to medical aid shelter.'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
