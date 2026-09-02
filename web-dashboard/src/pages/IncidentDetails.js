import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Truck,
  Package,
  Plus
} from 'lucide-react';
import LoadingState from '../components/common/LoadingState';
import api from '../services/api';

export default function IncidentDetails({ incidentId = 'INC-101', onNavigate }) {
  const [incident, setIncident] = useState(null);
  const [relatedSOS, setRelatedSOS] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [incRes, sosRes, volRes] = await Promise.all([
          api.getIncidents(),
          api.getSOSAlerts(),
          api.getVolunteers()
        ]);

        const targetId = incidentId.replace('/incidents/', '');
        const found = incRes.data?.find(i => i.id === targetId) || incRes.data?.[0];
        setIncident(found);

        if (found) {
          const matchedSOS = (sosRes.data || []).filter(s => s.incidentId === found.id);
          setRelatedSOS(matchedSOS.length > 0 ? matchedSOS : (sosRes.data || []).slice(0, 3));
        }

        setResponders((volRes.data || []).slice(0, 4));
      } catch (e) {
        console.error('Error loading incident details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [incidentId]);

  if (loading || !incident) {
    return <LoadingState message="Loading Incident Dossier & Area Operations..." />;
  }

  const handleRequestSupply = () => {
    setToastMessage(`Emergency supply drop requisition submitted for ${incident.id}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
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
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          {/* Clean Breadcrumb Bar */}
          <div className="donezo-breadcrumb-bar">
            <button
              onClick={() => onNavigate('/incidents')}
              className="donezo-breadcrumb-link"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Incidents Directory</span>
            </button>
            <span className="donezo-breadcrumb-sep">/</span>
            <span className="donezo-breadcrumb-current">#{incident.id}</span>
          </div>

          <h1 className="donezo-page-title">{incident.title}</h1>
          <p className="donezo-page-subtitle">
            Disaster operational dossier for {incident.area}
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={handleRequestSupply}
            className="donezo-btn-outline"
          >
            <Package className="w-4 h-4 text-emerald-800" />
            <span>Request Supply Drop</span>
          </button>
          <button
            onClick={() => onNavigate('/dispatch')}
            className="donezo-btn-primary"
          >
            <Truck className="w-4 h-4" />
            <span>Deploy Extra Responders</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid of Dossier Cards */}
      <div className="donezo-cards-grid-2">
        {/* Left Column: Tactical Overview & Linked SOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Card 1: Tactical Overview */}
          <div className="donezo-card">
            <div className="donezo-card-header flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="donezo-telemetry-icon-circle" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="donezo-card-title">Tactical Overview</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`donezo-badge-priority priority-${(incident.severity || 'critical').toLowerCase()}`}>
                  {incident.severity}
                </span>
                <span className="donezo-badge-status status-active">
                  ● {incident.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {incident.description}
            </p>

            <div className="donezo-incident-stats-grid">
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">INCIDENT TYPE</span>
                <span className="donezo-incident-stat-val font-mono">{incident.type}</span>
              </div>
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">AFFECTED POPULATION</span>
                <span className="donezo-incident-stat-val text-blue-600">{incident.affectedPopulation} Persons</span>
              </div>
              <div className="donezo-incident-stat-box">
                <span className="donezo-incident-stat-label">ACTIVE SOS</span>
                <span className="donezo-incident-stat-val val-red">{incident.activeSOSCount} Alerts</span>
              </div>
            </div>

            {incident.criticalNeed && (
              <div className="donezo-hazard-alert-box">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900">Critical Need / Shortage: </span>
                  <span className="text-amber-800">{incident.criticalNeed}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Linked Active SOS Distress Alerts */}
          <div className="donezo-card">
            <div className="donezo-card-header flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="donezo-telemetry-icon-circle" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="donezo-card-title">Linked SOS Distress Alerts ({relatedSOS.length})</h3>
              </div>
              <button
                onClick={() => onNavigate('/sos')}
                className="donezo-btn-small-outline"
              >
                <span>View SOS Feeds</span>
              </button>
            </div>

            <div className="donezo-dispatch-list">
              {relatedSOS.map((sos) => (
                <div key={sos.id} className="donezo-dispatch-item">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="donezo-chip-id">#{sos.id}</span>
                      <span className="font-bold text-xs text-slate-900">{sos.citizenName}</span>
                      <span className={`donezo-badge-priority priority-${(sos.priority || 'critical').toLowerCase()}`}>
                        {sos.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{sos.locationName}</div>
                  </div>

                  <button
                    onClick={() => onNavigate('/sos')}
                    className="donezo-btn-inspect"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mobilized Response Units & Lifecycle Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Card 3: Mobilized Units */}
          <div className="donezo-card">
            <div className="donezo-card-header flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="donezo-telemetry-icon-circle green">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="donezo-card-title">Mobilized Response Units ({responders.length})</h3>
              </div>
              <button
                onClick={() => onNavigate('/volunteers')}
                className="donezo-btn-small-outline"
              >
                <Plus className="w-3 h-3" />
                <span>Volunteers</span>
              </button>
            </div>

            <div className="donezo-dispatch-list">
              {responders.map((v) => (
                <div key={v.id} className="donezo-dispatch-item">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{v.name}</span>
                      <span className="donezo-chip-id" style={{ color: 'var(--donezo-forest)' }}>
                        {v.callsign}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{v.specialization}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">🔋 {v.batteryLevel || 92}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Incident Response Timeline */}
          <div className="donezo-card">
            <div className="donezo-card-header flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="donezo-telemetry-icon-circle blue">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="donezo-card-title">Incident Response Timeline</h3>
              </div>
              <span className="donezo-table-tag-live">
                ● Live Log
              </span>
            </div>

            <div className="donezo-timeline-list">
              <div className="donezo-timeline-item">
                <div className="donezo-timeline-dot bg-red-600" />
                <div className="donezo-timeline-content">
                  <div className="donezo-timeline-header">
                    <span className="donezo-timeline-title">Incident Detected & Triaged</span>
                    <span className="donezo-timeline-time">{incident.startedAt}</span>
                  </div>
                  <p className="donezo-timeline-desc">First SOS beacon ingested via node RM-84F2.</p>
                </div>
              </div>

              <div className="donezo-timeline-item">
                <div className="donezo-timeline-dot bg-amber-500" />
                <div className="donezo-timeline-content">
                  <div className="donezo-timeline-header">
                    <span className="donezo-timeline-title">Severity Escalated to {incident.severity}</span>
                    <span className="donezo-timeline-time">10m later</span>
                  </div>
                  <p className="donezo-timeline-desc">Hazard perimeter expanded across 2.0 km basin.</p>
                </div>
              </div>

              <div className="donezo-timeline-item">
                <div className="donezo-timeline-dot bg-emerald-600" />
                <div className="donezo-timeline-content">
                  <div className="donezo-timeline-header">
                    <span className="donezo-timeline-title">Multi-Unit Tactical Deployment</span>
                    <span className="donezo-timeline-time">15m later</span>
                  </div>
                  <p className="donezo-timeline-desc">{incident.activeResponders} volunteer & boat units assigned.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
