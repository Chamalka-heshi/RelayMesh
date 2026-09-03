import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  ArrowUpRight,
  RotateCcw,
  Battery,
  Activity
} from 'lucide-react';
import api from '../services/api';

export default function MeshNodesPage({ onNavigate }) {
  const [nodes, setNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadNodes = async () => {
    try {
      const res = await api.getNodes();
      if (res && res.data) {
        setNodes(res.data);
      }
    } catch (e) {
      console.error('Error fetching nodes:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const filteredNodes = useMemo(() => {
    let list = [...nodes];
    if (statusFilter !== 'ALL') {
      list = list.filter((n) => n.status?.toUpperCase() === statusFilter.toUpperCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.id?.toLowerCase().includes(q) ||
          n.location?.toLowerCase().includes(q) ||
          n.type?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [nodes, statusFilter, searchQuery]);

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Mesh Network Nodes</h1>
          <p className="donezo-page-subtitle">
            Wireless relay routers, solar community repeaters, mobile phones & RF signal health.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/network')}
            className="donezo-btn-primary"
          >
            <Activity className="w-4 h-4" />
            <span>Network Health Analytics</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              loadNodes();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Scanning...' : 'Scan Nodes'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Nodes (Featured Deep Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Mesh Nodes</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">184</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">91%</span>
            <span>Nominal multi-hop relay health</span>
          </div>
        </div>

        {/* Card 2: Online Relays */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Online Field Relays</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">168</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Active</span>
            <span>BLE / Wi-Fi Direct active</span>
          </div>
        </div>

        {/* Card 3: Satellite Gateway Uplinks */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Gateway Sat Uplinks</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">12</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-blue-100 text-blue-700">Online</span>
            <span>Internet gateway bridges</span>
          </div>
        </div>

        {/* Card 4: Battery Warning */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Battery Critical (&lt;20%)</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-amber-600">7</div>
          <div className="donezo-kpi-status-text">
            <span>Solar recharge recommended</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search node ID, location, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="donezo-filter-pills-row">
          {['ALL', 'ONLINE', 'OFFLINE'].map((s) => (
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

      {/* Nodes Table Card */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Mesh Hardware & Node Roster</h3>
            <p className="donezo-table-sub">{filteredNodes.length} nodes registered in topography</p>
          </div>
          <span className="donezo-table-tag-live">
            ● Continuous Mesh Heartbeat
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>Node Identifier</th>
                <th>Hardware Type</th>
                <th>Location Sector</th>
                <th>Signal RSSI</th>
                <th>Battery</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node) => (
                <tr key={node.id}>
                  <td>
                    <span className="donezo-chip-id">
                      #{node.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-900">{node.type || 'Mobile Phone Relay'}</span>
                  </td>
                  <td>
                    <div className="donezo-location-cell">
                      <MapPin className="w-3.5 h-3.5 donezo-location-icon" />
                      <span>{node.location || 'Sector 4 Kelani Area'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-bold text-slate-700">{node.signalDbm || '-64'} dBm</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{node.battery || 88}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`donezo-badge-status status-${(node.status || 'online').toLowerCase()}`}
                    >
                      ● {node.status || 'ONLINE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onNavigate('/network')}
                      className="donezo-btn-inspect"
                    >
                      Ping
                    </button>
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
