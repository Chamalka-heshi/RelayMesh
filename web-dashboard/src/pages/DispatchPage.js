import React, { useState, useEffect } from 'react';
import {
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  X,
  Truck
} from 'lucide-react';
import api from '../services/api';

export default function DispatchPage({ onNavigate }) {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dispatch Pairing Modal
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('Boat Rescue Alpha (IRB)');
  const [directiveNotes, setDirectiveNotes] = useState('');
  const [successToast, setSuccessToast] = useState(null);

  const loadData = async () => {
    try {
      const [sosRes, volRes, dispRes] = await Promise.all([
        api.getSOSAlerts(),
        api.getVolunteers(),
        api.getDispatchAssignments()
      ]);
      setSosAlerts(sosRes?.data || []);
      setVolunteers(volRes?.data || []);
      setDispatches(dispRes?.data || []);
    } catch (e) {
      console.error('Error fetching dispatch data:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenPairModal = (sos) => {
    setSelectedSOS(sos);
    const available = volunteers.find(v => v.status === 'AVAILABLE');
    setSelectedVolunteer(available ? available.id : (volunteers[0]?.id || 'VOL-001'));
    setDirectiveNotes(`Urgent responder deployment to #${sos.id} (${sos.locationName}). Citizen requires immediate aid.`);
  };

  const handleConfirmDispatch = async () => {
    if (!selectedSOS || !selectedVolunteer) return;

    try {
      await api.dispatchVolunteer(selectedSOS.id, selectedVolunteer, directiveNotes);
      setSuccessToast(`Unit successfully dispatched to Beacon #${selectedSOS.id}!`);
      setSelectedSOS(null);
      await loadData();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('Dispatch error:', err);
    }
  };

  const pendingDispatches = sosAlerts.filter((s) => s.status === 'ACTIVE');

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#164E37',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--donezo-radius-pill)',
          boxShadow: '0 10px 25px rgba(22, 78, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Response Coordination & Dispatch</h1>
          <p className="donezo-page-subtitle">
            Tactical unit deployment, vehicle routing, distress beacon pairing & live response ETA.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/sos')}
            className="donezo-btn-primary"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>View SOS Alerts Queue</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              loadData();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Queue'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Deployments (Featured Deep Forest Green Card) */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Deployments</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">{dispatches.length}</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">En Route</span>
            <span>Responders in field</span>
          </div>
        </div>

        {/* Card 2: Pending Queue */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Pending Queue</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-amber-600">{pendingDispatches.length}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-amber-100 text-amber-700">Awaiting Unit</span>
            <span>Immediate pairing needed</span>
          </div>
        </div>

        {/* Card 3: Available Responders */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Available Volunteers</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">
            {volunteers.filter(v => v.status === 'AVAILABLE').length}
          </div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">Ready</span>
            <span>Standby at relief camps</span>
          </div>
        </div>

        {/* Card 4: Avg Response Time */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Avg Deployment Time</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">11m 40s</div>
          <div className="donezo-kpi-status-text">
            <span>From triage to arrival</span>
          </div>
        </div>
      </div>

      {/* Dispatch Grid: Pending Queue & Active Deployments */}
      <div className="donezo-cards-grid-2">
        {/* Column 1: Awaiting Unit Assignment */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div>
              <h3 className="donezo-card-title">Pending SOS Assignments</h3>
              <p className="donezo-table-sub">{pendingDispatches.length} beacons requiring unit pairing</p>
            </div>
            <span className="donezo-table-tag-live" style={{ backgroundColor: '#FEF3C7', color: '#D97706', borderColor: '#FDE68A' }}>
              ● High Priority
            </span>
          </div>

          <div className="donezo-dispatch-list">
            {pendingDispatches.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                All distress beacons are currently paired with responder units!
              </div>
            ) : (
              pendingDispatches.map((sos) => (
                <div
                  key={sos.id}
                  className="donezo-dispatch-item"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="donezo-chip-id">#{sos.id}</span>
                      <span className={`donezo-badge-priority priority-${(sos.priority || 'critical').toLowerCase()}`}>
                        {sos.priority || 'CRITICAL'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1.5">{sos.citizenName || 'Citizen Distress'}</div>
                    <div className="donezo-location-cell mt-1">
                      <MapPin className="w-3.5 h-3.5 donezo-location-icon" />
                      <span>{sos.locationName || 'Kelani Flood Basin'}</span>
                    </div>
                    {sos.medicalNeeds && (
                      <div className="text-[11px] text-slate-500 mt-1 max-w-sm truncate">
                        Need: {sos.medicalNeeds}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenPairModal(sos)}
                    className="donezo-btn-dossier"
                  >
                    Pair Unit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Active Responder Deployments */}
        <div className="donezo-card">
          <div className="donezo-card-header flex items-center justify-between">
            <div>
              <h3 className="donezo-card-title">Live Responder Units in Field</h3>
              <p className="donezo-table-sub">Real-time GPS / Mesh telemetry tracking</p>
            </div>
            <span className="donezo-table-tag-live">
              ● Active En Route
            </span>
          </div>

          <div className="donezo-dispatch-list">
            {dispatches.map((d) => (
              <div
                key={d.id}
                className="donezo-dispatch-item"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{d.volunteerId}</span>
                    <span className="donezo-badge-status status-resolved">
                      ● {d.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Target SOS: <strong className="font-mono text-emerald-800">{d.sosId}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 max-w-sm truncate">
                    Directive: {d.messageSent}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="text-xs font-bold font-mono text-emerald-800 block">ETA: ~{d.etaMinutes || 8}m</span>
                  <span className="text-[11px] text-slate-400 block">{d.distanceKm || 1.2} km</span>
                  <button
                    onClick={() => onNavigate('/map')}
                    className="donezo-btn-inspect mt-1.5"
                  >
                    Track GPS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Dispatch Modal */}
      {selectedSOS && (
        <div className="donezo-modal-overlay" onClick={() => setSelectedSOS(null)}>
          <div className="donezo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">DISPATCH CONSOLE</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Pair Responder with #{selectedSOS.id}</h3>
              </div>
              <button
                onClick={() => setSelectedSOS(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Distress Summary Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                  <span>Citizen: {selectedSOS.citizenName}</span>
                  <span className={`donezo-badge-priority priority-${(selectedSOS.priority || 'critical').toLowerCase()}`}>
                    {selectedSOS.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedSOS.locationName}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1.5 font-mono">
                  Node Device: #{selectedSOS.deviceId} • {selectedSOS.hopCount} mesh hops
                </div>
              </div>

              {/* Responder Selection */}
              <div className="donezo-form-group">
                <label className="donezo-form-label">Select Volunteer Responder Unit</label>
                <select
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                  className="donezo-form-input"
                >
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.callsign}) — {v.specialization} [{v.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Transport Vehicle */}
              <div className="donezo-form-group">
                <label className="donezo-form-label">Assigned Tactical Extraction Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="donezo-form-input"
                >
                  <option>Boat Rescue Alpha (Inflatable Rescue Boat)</option>
                  <option>4x4 Emergency High-Water Ambulance</option>
                  <option>All-Terrain Motorcycle Unit</option>
                  <option>Relief Supply Logistics Truck</option>
                </select>
              </div>

              {/* Directives */}
              <div className="donezo-form-group">
                <label className="donezo-form-label">Field Directives & Medical Notes</label>
                <textarea
                  rows={3}
                  value={directiveNotes}
                  onChange={(e) => setDirectiveNotes(e.target.value)}
                  className="donezo-form-input"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedSOS(null)}
                className="donezo-btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="donezo-btn-primary"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm & Dispatch Unit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
