import React, { useState } from 'react';
import { Settings, Bell, Map, Database, Check } from 'lucide-react';

export default function SettingsPage({ onNavigate }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">System & Monitoring Settings</h1>
          <p className="donezo-page-subtitle">
            Configure emergency thresholds, map defaults, Supabase synchronizer & mesh telemetry parameters.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={handleSave}
            className="donezo-btn-primary"
          >
            {saved ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* 3 Settings Cards Grid */}
      <div className="donezo-cards-grid-3">
        {/* Card 1: Emergency Alert Thresholds */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="donezo-telemetry-icon-circle" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="donezo-card-title">Emergency Alert Thresholds</h3>
            </div>
          </div>

          <div className="space-y-3.5 mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="donezo-form-group">
              <label className="donezo-form-label">Critical Priority Notification Sound</label>
              <select className="donezo-form-input">
                <option>High Alert Siren (Continuous)</option>
                <option>Emergency Tone (Pulse)</option>
                <option>Visual Indicator Only</option>
              </select>
            </div>

            <div className="donezo-form-group">
              <label className="donezo-form-label">Automatic Nearest Rescuer Calculation</label>
              <select className="donezo-form-input">
                <option>Instant (Haversine Great-Circle Mode)</option>
                <option>Manual Dispatch Confirmation Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Map & Geographic Defaults */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="donezo-telemetry-icon-circle blue">
                <Map className="w-4 h-4" />
              </div>
              <h3 className="donezo-card-title">Map & Geographic Defaults</h3>
            </div>
          </div>

          <div className="space-y-3.5 mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="donezo-form-group">
              <label className="donezo-form-label">Default Command Center Coordinates</label>
              <input
                type="text"
                defaultValue="6.9271, 79.8612 (Colombo Western Province)"
                className="donezo-form-input font-mono text-xs"
              />
            </div>

            <div className="donezo-form-group">
              <label className="donezo-form-label">Hazard Zone Buffer Radius</label>
              <input
                type="text"
                defaultValue="2000 meters"
                className="donezo-form-input"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Database & Supabase Integration */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="donezo-telemetry-icon-circle green">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="donezo-card-title">Supabase & Mesh Uplink</h3>
            </div>
          </div>

          <div className="donezo-telemetry-list mt-2">
            <div className="donezo-telemetry-row">
              <div>
                <span className="donezo-telemetry-label block">Supabase PostGIS DB</span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">aws-0-ap-southeast-1.pooler.supabase.com</span>
              </div>
              <span className="donezo-badge-status status-resolved">CONNECTED</span>
            </div>

            <div className="donezo-telemetry-row">
              <div>
                <span className="donezo-telemetry-label block">Live Polling Frequency</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Auto-synchronizing every 5 seconds</span>
              </div>
              <span className="donezo-badge-status status-active" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}>
                5000ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
