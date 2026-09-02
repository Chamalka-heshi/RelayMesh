import React from 'react';
import {
  X,
  MapPin,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Clock
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import SOSTriageTags from './SOSTriageTags';
import SOSResponseTimeline from './SOSResponseTimeline';

export default function SOSInfoPanel({
  sos,
  assignedVolunteer,
  onClose,
  onNavigate
}) {
  const [copied, setCopied] = React.useState(false);

  if (!sos) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(sos.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="sos-detail-drawer">
      {/* Drawer Top Header */}
      <div className="drawer-top-header">
        <div className="flex items-center gap-2">
          <span className="drawer-badge">SOS MONITORING</span>
          <span className="drawer-sos-id">#{sos.id}</span>
          <button
            onClick={handleCopyId}
            className="copy-id-btn"
            title="Copy SOS Identifier"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        <button onClick={onClose} className="drawer-close-btn" title="Close Details Drawer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="drawer-scrollable-content">
        {/* Severity & Status Row */}
        <div className="drawer-status-bar">
          <SeverityBadge severity={sos.priority} />
          <StatusBadge status={sos.status} />
        </div>

        {/* 1. Citizen Profile Card */}
        <div className="drawer-card-box citizen-box">
          <div className="flex items-center gap-3">
            <div className="citizen-avatar">
              {sos.citizenName ? sos.citizenName.charAt(0) : 'C'}
            </div>
            <div className="flex flex-col">
              <span className="citizen-full-name">{sos.citizenName}</span>
              <span className="citizen-phone-line">
                <Phone className="w-3 h-3 inline mr-1 text-slate-400" />
                {sos.citizenPhone || 'No contact number provided'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Emergency Triage Needs */}
        <div className="drawer-card-box">
          <div className="card-box-title">Emergency Triage Requirements</div>
          <div className="mt-1.5">
            <SOSTriageTags tags={sos.triageTags} />
          </div>

          {sos.notes && (
            <div className="mt-2.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400">Distress Message / Field Notes:</span>
              <p className="drawer-field-notes">{sos.notes}</p>
            </div>
          )}
        </div>

        {/* 3. Geographic Context & Navigation */}
        <div className="drawer-card-box">
          <div className="flex items-center justify-between mb-1.5">
            <span className="card-box-title">Incident Location & Coordinates</span>
            {sos.incidentId && (
              <span className="incident-link-tag">{sos.incidentId}</span>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-200 mb-2">
            <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">{sos.locationName}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                GPS: {sos.latitude?.toFixed(6)}, {sos.longitude?.toFixed(6)} • Acc: ±{sos.accuracy || 4}m
              </div>
            </div>
          </div>

          {/* View on Live Map Navigation Button */}
          <button
            onClick={() => onNavigate && onNavigate('/map')}
            className="view-on-map-cta-btn"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Live Situation Map</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </button>
        </div>

        {/* 4. RelayMesh Topography & Ingestion */}
        <div className="drawer-card-box">
          <span className="card-box-title">RelayMesh Topography</span>

          <div className="drawer-specs-2col mt-2">
            <div className="spec-col-item">
              <span className="spec-col-lbl">Source Device ID</span>
              <span className="spec-col-val text-blue-400 font-mono">{sos.deviceId}</span>
            </div>

            <div className="spec-col-item">
              <span className="spec-col-lbl">Mesh Hop Count</span>
              <span className="spec-col-val text-cyan-400 font-mono">{sos.hopCount} P2P Hops</span>
            </div>

            <div className="spec-col-item">
              <span className="spec-col-lbl">Timestamp Reported</span>
              <span className="spec-col-val font-mono text-xs">
                {sos.reportedAt ? new Date(sos.reportedAt).toLocaleTimeString() : 'Recent'}
              </span>
            </div>

            <div className="spec-col-item">
              <span className="spec-col-lbl">Topography State</span>
              <span className="spec-col-val text-emerald-400">SYNCHRONIZED</span>
            </div>
          </div>
        </div>

        {/* 5. Response Coordination & Assigned Volunteer */}
        <div className="drawer-card-box">
          <div className="flex items-center justify-between mb-2">
            <span className="card-box-title">Response Coordination</span>
            <span className={'coordination-badge ' + (assignedVolunteer ? 'assigned' : 'unassigned')}>
              {assignedVolunteer ? 'DISPATCHED' : 'AWAITING DISPATCH'}
            </span>
          </div>

          {assignedVolunteer ? (
            <div className="assigned-responder-profile">
              <div className="flex items-center justify-between">
                <span className="responder-callsign-text">{assignedVolunteer.callsign}</span>
                <span className="responder-battery-tag">🔋 {assignedVolunteer.battery}%</span>
              </div>
              <div className="responder-name-text">{assignedVolunteer.name}</div>
              <div className="text-xs text-slate-400">{assignedVolunteer.role} • {assignedVolunteer.specialization}</div>
              <div className="text-[11px] font-mono text-slate-300 mt-1">
                Phone: {assignedVolunteer.phone}
              </div>
            </div>
          ) : (
            <div className="no-responder-alert">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>No field volunteer assigned. Emergency distress call is queued for nearest response unit.</span>
            </div>
          )}
        </div>

        {/* 6. Response Lifecycle Timeline */}
        <SOSResponseTimeline
          sos={sos}
          assignedVolunteer={assignedVolunteer}
        />
      </div>
    </aside>
  );
}
