import React from 'react';
import { Eye, MapPin, Radio, Clock, Phone, AlertTriangle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import SOSTriageTags from './SOSTriageTags';

export default function SOSTable({
  alerts = [],
  volunteers = [],
  selectedId,
  onSelectSOS
}) {
  const getVol = (volId) => {
    if (!volId) return null;
    return volunteers.find(v => v.id === volId) || null;
  };

  const getWaitingTime = (reportedAt) => {
    if (!reportedAt) return 'Just now';
    const diffMs = Date.now() - new Date(reportedAt).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  return (
    <div className="sos-table-wrapper">
      <table className="sos-dense-table">
        <thead>
          <tr>
            <th>SOS ID</th>
            <th>Citizen & Contact</th>
            <th>Emergency Location</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Elapsed</th>
            <th>Assigned Unit</th>
            <th>Mesh Ingestion</th>
            <th>Triage Needs</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const isSelected = selectedId === alert.id;
            const isCritical = alert.priority === 'CRITICAL';
            const assignedVol = getVol(alert.assignedVolunteerId);

            return (
              <tr
                key={alert.id}
                onClick={() => onSelectSOS(alert)}
                className={'sos-table-row ' + (isSelected ? 'selected ' : '') + (isCritical ? 'critical-glow' : '')}
              >
                {/* SOS ID */}
                <td className="sos-id-cell">
                  <span className="sos-id-badge">#{alert.id}</span>
                  {alert.incidentId && (
                    <span className="incident-id-tag">{alert.incidentId}</span>
                  )}
                </td>

                {/* Citizen */}
                <td>
                  <div className="citizen-info-cell">
                    <span className="citizen-name-text">{alert.citizenName}</span>
                    <span className="citizen-phone-text">
                      <Phone className="w-2.5 h-2.5 inline mr-1" />
                      {alert.citizenPhone || 'No Phone'}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td>
                  <div className="location-cell">
                    <span className="location-name-text">
                      <MapPin className="w-3 h-3 text-red-400 inline mr-1 flex-shrink-0" />
                      {alert.locationName}
                    </span>
                    <span className="coords-text">
                      {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                    </span>
                  </div>
                </td>

                {/* Severity */}
                <td>
                  <SeverityBadge severity={alert.priority} />
                </td>

                {/* Status */}
                <td>
                  <StatusBadge status={alert.status} size="sm" />
                </td>

                {/* Waiting */}
                <td className="elapsed-cell">
                  <Clock className="w-3 h-3 text-slate-400 inline mr-1" />
                  <span>{getWaitingTime(alert.reportedAt)}</span>
                </td>

                {/* Assigned Responder */}
                <td>
                  {assignedVol ? (
                    <div className="assigned-vol-cell">
                      <span className="vol-callsign-text">{assignedVol.callsign}</span>
                      <span className="vol-name-sub">{assignedVol.name}</span>
                    </div>
                  ) : alert.status === 'ACTIVE' ? (
                    <span className="unassigned-badge">
                      <AlertTriangle className="w-2.5 h-2.5 inline mr-1 text-amber-400" />
                      Unassigned
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>

                {/* Node & Hops */}
                <td>
                  <div className="mesh-node-cell">
                    <span className="node-id-text">
                      <Radio className="w-2.5 h-2.5 inline mr-1 text-blue-400" />
                      {alert.deviceId}
                    </span>
                    <span className="hops-badge">{alert.hopCount || 1} hops</span>
                  </div>
                </td>

                {/* Triage Tags */}
                <td className="triage-cell">
                  <SOSTriageTags tags={alert.triageTags} compact={true} />
                </td>

                {/* Action View */}
                <td className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSOS(alert);
                    }}
                    className={'view-sos-row-btn ' + (isSelected ? 'active' : '')}
                    title="Inspect SOS Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
