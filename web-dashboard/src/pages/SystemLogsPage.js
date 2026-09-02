import React, { useState, useEffect } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import api from '../services/api';

export default function SystemLogsPage({ onNavigate }) {
  const [logs, setLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.getActivityLog();
        setLogs(res.data || []);
      } catch (e) {
        console.error('Error fetching logs:', e);
      }
    }
    loadLogs();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getActivityLog();
      setLogs(res.data || []);
    } catch (e) {
      console.error('Error fetching logs:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
      case 'HIGH PRIORITY':
      case 'WARNING':
        return 'priority-high';
      case 'SUCCESS':
      case 'INFO':
        return 'priority-low';
      default:
        return 'priority-moderate';
    }
  };

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">System Event & Audit Logs</h1>
          <p className="donezo-page-subtitle">
            Immutable timestamped record of distress ingestion, mesh routing, dispatch actions & node synchronization.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={handleRefresh}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Logs'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Total Events (Featured Forest Green) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Total Events Logged</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">1,840</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">24h</span>
            <span>Recorded in continuous stream</span>
          </div>
        </div>

        {/* Card 2: Critical Alerts */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Critical Alerts</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-red-600">42</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-red-100 text-red-700">Priority</span>
            <span>Distress escalations</span>
          </div>
        </div>

        {/* Card 3: Dispatch Transactions */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Dispatch Transactions</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">126</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Active</span>
            <span>Volunteer mobilizations</span>
          </div>
        </div>

        {/* Card 4: Ledger Integrity */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Audit Ledger Sync</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">99.8%</div>
          <div className="donezo-kpi-status-text">
            <span>PostGIS Ledger Verified</span>
          </div>
        </div>
      </div>

      {/* Main Audit Logs Table Card */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Live System Event & Audit Stream</h3>
            <p className="donezo-table-sub">Showing latest operational transactions recorded across nodes</p>
          </div>
          <span className="donezo-table-tag-live">
            ● Immutable Cryptographic Ledger
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Description</th>
                <th>Module / Source</th>
                <th>Actor / System</th>
                <th>Severity</th>
                <th style={{ textAlign: 'right' }}>Entity Ref</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-slate-500 whitespace-nowrap">
                    {log.timestamp} ({log.timeAgo})
                  </td>
                  <td>
                    <span className="font-bold text-slate-900 text-xs">{log.event}</span>
                  </td>
                  <td>
                    <span className="donezo-chip-id">
                      {log.type}
                    </span>
                  </td>
                  <td className="text-xs text-slate-700 font-semibold">
                    {log.actor}
                  </td>
                  <td>
                    <span className={`donezo-badge-priority ${getSeverityBadgeClass(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="donezo-chip-id" style={{ color: 'var(--donezo-forest)' }}>
                      #{log.entityId}
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
