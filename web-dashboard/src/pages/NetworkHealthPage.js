import React from 'react';
import {
  Radio,
  ArrowUpRight,
  RotateCcw,
  Wifi,
  ShieldCheck,
  Server
} from 'lucide-react';

export default function NetworkHealthPage({ onNavigate }) {
  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Network Health & Topography</h1>
          <p className="donezo-page-subtitle">
            Real-time peer-to-peer packet routing, store-and-forward buffers & link quality telemetry.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/nodes')}
            className="donezo-btn-primary"
          >
            <Radio className="w-4 h-4" />
            <span>View All Mesh Nodes</span>
          </button>
          <button
            onClick={() => alert('Diagnostic ping broadcast to all active mesh repeaters!')}
            className="donezo-btn-outline"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Run Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Network Availability (Featured Deep Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Mesh Availability</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">91.2%</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">184/203</span>
            <span>Relay nodes active</span>
          </div>
        </div>

        {/* Card 2: Packet Relay Throughput */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Packet Relay Throughput</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">14.8k/h</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Nominal</span>
            <span>Multi-hop hops active</span>
          </div>
        </div>

        {/* Card 3: Avg Hop Count */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Average Hop Count</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">2.4 hops</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-blue-100 text-blue-700">Low Latency</span>
            <span>142ms avg packet latency</span>
          </div>
        </div>

        {/* Card 4: Signal Link Quality */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Average Link RSSI</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">-64 dBm</div>
          <div className="donezo-kpi-status-text">
            <span>Strong RF Signal</span>
          </div>
        </div>
      </div>

      {/* Network Diagnostics Cards */}
      <div className="donezo-cards-grid-2">
        {/* Card 1: Radio Protocol Status */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div>
              <h3 className="donezo-card-title">Radio Layer & Protocol Telemetry</h3>
              <p className="text-xs text-slate-400 mt-0.5">Physical and link-layer RF interface status</p>
            </div>
            <span className="donezo-table-tag-live">
              ● All Systems Nominal
            </span>
          </div>

          <div className="donezo-telemetry-list">
            <div className="donezo-telemetry-row">
              <div className="donezo-telemetry-left">
                <div className="donezo-telemetry-icon-circle green">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="donezo-telemetry-label">Bluetooth Low Energy (BLE 5.2 Mesh)</span>
              </div>
              <span className="donezo-badge-status status-resolved">ACTIVE</span>
            </div>

            <div className="donezo-telemetry-row">
              <div className="donezo-telemetry-left">
                <div className="donezo-telemetry-icon-circle blue">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="donezo-telemetry-label">Wi-Fi Direct P2P Mesh</span>
              </div>
              <span className="donezo-badge-status status-resolved">ACTIVE</span>
            </div>

            <div className="donezo-telemetry-row">
              <div className="donezo-telemetry-left">
                <div className="donezo-telemetry-icon-circle amber">
                  <Server className="w-4 h-4" />
                </div>
                <span className="donezo-telemetry-label">Satellite Gateway Forwarding</span>
              </div>
              <span className="donezo-badge-status status-dispatched">STANDBY</span>
            </div>

            <div className="donezo-telemetry-row">
              <div className="donezo-telemetry-left">
                <div className="donezo-telemetry-icon-circle green">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="donezo-telemetry-label">Curve25519 End-to-End Encryption</span>
              </div>
              <span className="donezo-badge-status status-resolved">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Card 2: Store-and-Forward Buffer Status */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div>
              <h3 className="donezo-card-title">Store-and-Forward Buffer Health</h3>
              <p className="text-xs text-slate-400 mt-0.5">Disruption-tolerant queuing and throughput diagnostics</p>
            </div>
            <span className="donezo-table-tag-live">
              ● DTN Queue Active
            </span>
          </div>

          <div className="donezo-telemetry-list">
            <div className="donezo-telemetry-row">
              <span className="donezo-telemetry-sublabel">BUFFERED MESSAGES</span>
              <span className="donezo-telemetry-val">420 pkts awaiting next hop</span>
            </div>
            <div className="donezo-telemetry-row">
              <span className="donezo-telemetry-sublabel">AVERAGE TIME IN BUFFER</span>
              <span className="donezo-telemetry-val">3.4 minutes</span>
            </div>
            <div className="donezo-telemetry-row">
              <span className="donezo-telemetry-sublabel">PACKET DELIVERY RATIO</span>
              <span className="donezo-telemetry-val val-green">98.4% Delivered</span>
            </div>
            <div className="donezo-telemetry-row">
              <span className="donezo-telemetry-sublabel">DATA COMPRESSION RATIO</span>
              <span className="donezo-telemetry-val">68% Bandwidth Saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
