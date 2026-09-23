import React, { useState, useMemo } from 'react';
import {
  Radio,
  RotateCcw,
  CheckCircle2,
  Search,
  ArrowUpRight,
  Wifi,
  ShieldCheck,
  Server
} from 'lucide-react';

export default function NetworkHealthPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, GATEWAYS, REPEATERS, ATTENTION
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const initialNodes = useMemo(() => [
    { id: 'RM-84F2', name: 'Kelani North Gateway', type: 'GATEWAY', status: 'ONLINE', sector: 'Sector 4 Flood Basin', packets: '48.2k', battery: 100, rssi: -58 },
    { id: 'RM-21A4', name: 'Kolonnawa Solar Repeater', type: 'REPEATER', status: 'ONLINE', sector: 'Kolonnawa Elevated', packets: '23.6k', battery: 91, rssi: -64 },
    { id: 'RM-91C2', name: 'Sedawatta Mobile Node', type: 'MOBILE', status: 'ONLINE', sector: 'Sedawatta High Ground', packets: '11.4k', battery: 84, rssi: -71 },
    { id: 'RM-4412', name: 'Orugodawatta Repeater', type: 'REPEATER', status: 'ONLINE', sector: 'Orugodawatta Junction', packets: '19.8k', battery: 78, rssi: -66 },
    { id: 'RM-6721', name: 'Grandpass Tower Node', type: 'SOLAR_TOWER', status: 'ONLINE', sector: 'Grandpass High Mast', packets: '52.0k', battery: 95, rssi: -54 },
    { id: 'RM-3309', name: 'Kotikawatta Edge Repeater', type: 'REPEATER', status: 'DEGRADED', sector: 'Kotikawatta Lowland', packets: '8.2k', battery: 32, rssi: -82 },
    { id: 'RM-1192', name: 'Wellampitiya Bridge Relay', type: 'MOBILE', status: 'ONLINE', sector: 'Wellampitiya Access Pt', packets: '14.1k', battery: 67, rssi: -69 },
  ], []);

  const [nodes] = useState(initialNodes);

  const handleRunDiagnostics = () => {
    setIsDiagnosticRunning(true);
    setToastMessage('Broadcasting diagnostic ping packet across all mesh repeaters...');
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setToastMessage('Mesh diagnostic complete: 184 nodes verified with 99.1% packet acknowledgement.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  const handlePingNode = (nodeId) => {
    setToastMessage(`Ping ACK received from #${nodeId} (Round-trip: 42ms, 2 Hops)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredNodes = useMemo(() => {
    let list = [...nodes];
    if (activeTab === 'GATEWAYS') {
      list = list.filter(n => n.type === 'GATEWAY' || n.type === 'SOLAR_TOWER');
    } else if (activeTab === 'REPEATERS') {
      list = list.filter(n => n.type === 'REPEATER' || n.type === 'MOBILE');
    } else if (activeTab === 'ATTENTION') {
      list = list.filter(n => n.status !== 'ONLINE' || n.battery < 50);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n =>
        n.id.toLowerCase().includes(q) ||
        n.name.toLowerCase().includes(q) ||
        n.sector.toLowerCase().includes(q)
      );
    }
    return list;
  }, [nodes, activeTab, searchQuery]);

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
          <h1 className="donezo-page-title">Mesh Network & Topography</h1>
          <p className="donezo-page-subtitle">
            Peer-to-peer packet routing, store-and-forward buffers, gateway uptime & RF link health.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/map')}
            className="donezo-btn-primary"
          >
            <Radio className="w-4 h-4" />
            <span>View on Tactical Map</span>
          </button>
          <button
            onClick={handleRunDiagnostics}
            disabled={isDiagnosticRunning}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
            <span>{isDiagnosticRunning ? 'Broadcasting...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Mesh Availability (Featured Forest Green Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-featured"
          onClick={() => setActiveTab('ALL')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Mesh Availability</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">91.2%</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">184/203</span>
            <span>Relays Online</span>
          </div>
        </div>

        {/* Card 2: Packet Throughput */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Relay Throughput</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: 'var(--donezo-text-main)' }}>14.8k/h</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}>98.4%</span>
            <span>Delivery Success Ratio</span>
          </div>
        </div>

        {/* Card 3: Avg Hop Latency */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Average Hops</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: 'var(--donezo-text-main)' }}>2.4 Hops</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>142ms</span>
            <span>Average Packet Latency</span>
          </div>
        </div>

        {/* Card 4: Signal Link RSSI */}
        <div
          className="donezo-kpi-card donezo-kpi-white"
          onClick={() => setActiveTab('ATTENTION')}
          style={{ cursor: 'pointer' }}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Average Link RSSI</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number" style={{ color: 'var(--donezo-text-main)' }}>-64 dBm</div>
          <div className="donezo-kpi-status-text">
            <span>● Nominal RF Signal Range</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by node ID, sector, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="donezo-filter-pills-row">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--donezo-text-muted)', marginRight: '0.25rem' }}>FILTER RELAYS:</span>
          {[
            { id: 'ALL', label: `All Backbone Nodes (${nodes.length})` },
            { id: 'GATEWAYS', label: `Gateways & Towers` },
            { id: 'REPEATERS', label: `Repeaters & Mobile` },
            { id: 'ATTENTION', label: `⚠️ Low Battery / Attention (1)` }
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

      {/* Main Scannable Nodes Table */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Active Mesh Infrastructure Telemetry</h3>
            <p className="donezo-table-sub">Showing {filteredNodes.length} nodes registered in cluster</p>
          </div>
          <span className="donezo-table-tag-live">
            ● Store-and-Forward DTN Buffer Active
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>Node ID</th>
                <th>Relay Name & Type</th>
                <th>Coverage Sector</th>
                <th>Battery Health</th>
                <th>Signal RSSI</th>
                <th>Traffic Handled</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((n) => {
                const isDegraded = n.status !== 'ONLINE' || n.battery < 40;

                return (
                  <tr key={n.id}>
                    <td>
                      <span className="donezo-chip-id">
                        #{n.id}
                      </span>
                    </td>
                    <td>
                      <div className="donezo-person-cell">
                        <span className="donezo-person-name">{n.name}</span>
                        <span className="donezo-person-meta">{n.type}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--donezo-text-main)' }}>
                        {n.sector}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${n.battery}%`,
                              height: '100%',
                              backgroundColor: isDegraded ? '#D97706' : '#059669',
                              borderRadius: '9999px'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: isDegraded ? '#D97706' : '#059669' }}>
                          {n.battery}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--donezo-text-muted)' }}>
                        {n.rssi} dBm
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--donezo-text-main)' }}>
                        {n.packets}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handlePingNode(n.id)}
                        className="donezo-btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Ping Node
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocols & DTN Queue Diagnostics Cards */}
      <div className="donezo-cards-grid-2">
        {/* Card 1: Radio Protocol Status */}
        <div className="donezo-card">
          <div className="donezo-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="donezo-card-title">Radio Layer & Protocol Telemetry</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--donezo-text-muted)', margin: '0.2rem 0 0 0' }}>
                Physical and link-layer RF interface status
              </p>
            </div>
            <span className="donezo-table-tag-live">● Nominal</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wifi className="w-4 h-4 text-emerald-700" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Bluetooth Low Energy (BLE 5.2 Mesh)</span>
              </div>
              <span className="donezo-badge-status donezo-status-resolved">ACTIVE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wifi className="w-4 h-4 text-blue-600" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Wi-Fi Direct P2P Group Formation</span>
              </div>
              <span className="donezo-badge-status donezo-status-resolved">ACTIVE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Curve25519 End-to-End Encryption</span>
              </div>
              <span className="donezo-badge-status donezo-status-resolved">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Card 2: Store-and-Forward Buffer Status */}
        <div className="donezo-card">
          <div className="donezo-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="donezo-card-title">Disruption-Tolerant Buffer (DTN)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--donezo-text-muted)', margin: '0.2rem 0 0 0' }}>
                Store-and-forward queuing and delivery telemetry
              </p>
            </div>
            <span className="donezo-table-tag-live">● Queue Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server className="w-4 h-4 text-slate-600" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Buffered Packets Awaiting Forward</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--donezo-text-main)' }}>420 pkts</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Average Transit Time in Buffer</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--donezo-text-main)' }}>3.4 minutes</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--donezo-bg)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--donezo-text-main)' }}>Bandwidth Saved by Compression</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--donezo-forest)' }}>68%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
