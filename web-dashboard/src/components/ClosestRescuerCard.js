import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  MapPin, 
  Phone, 
  Battery, 
  Shield, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Truck,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function ClosestRescuerCard({
  selectedSOS,
  closestVolunteer,
  allRankedVolunteers,
  onDispatchClosest,
  onAssignSpecific,
  isDispatching,
  lastDispatchResult
}) {
  const [customNote, setCustomNote] = useState('');
  const [selectedAltVolId, setSelectedAltVolId] = useState('');

  if (!selectedSOS) {
    return (
      <div className="dispatch-controller-panel empty">
        <div className="empty-prompt">
          <MapPin className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
          <h3 className="text-slate-300 font-bold text-sm">Select an Emergency Incident</h3>
          <p className="text-slate-500 text-xs mt-1 text-center max-w-xs">
            Click any active SOS alert from the feed or map to compute the closest rescue volunteer and dispatch immediate aid.
          </p>
        </div>
      </div>
    );
  }

  const isAlreadyDispatched = selectedSOS.status === 'DISPATCHED';
  const isResolved = selectedSOS.status === 'RESOLVED';

  const handleDispatch = () => {
    if (selectedAltVolId && selectedAltVolId !== closestVolunteer?.id) {
      onAssignSpecific(selectedSOS.id, selectedAltVolId, customNote);
    } else {
      onDispatchClosest(selectedSOS.id, customNote);
    }
  };

  return (
    <div className="dispatch-controller-panel">
      {/* Card Header */}
      <div className="panel-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="badge-icon-sparkle">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <h3 className="panel-title">DISPATCH CONTROLLER</h3>
              <p className="panel-subtitle">Automated Closest Rescuer Routing</p>
            </div>
          </div>
          <span className="incident-id-tag">Incident #{selectedSOS.id}</span>
        </div>
      </div>

      <div className="panel-scroll-content">
        {/* Selected Citizen Incident Brief */}
        <div className="incident-brief-card">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-200">{selectedSOS.citizenName}</div>
            <span className={`priority-pill ${selectedSOS.priority.toLowerCase()}`}>
              {selectedSOS.priority}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>{selectedSOS.locationName}</span>
          </div>

          <div className="triage-pills-row mt-2">
            {(selectedSOS.triageTags || []).map((tag, idx) => (
              <span key={idx} className="triage-tag-small">{tag}</span>
            ))}
          </div>
        </div>

        {/* Closest Rescuer Recommendation */}
        {closestVolunteer ? (
          <div className={`closest-recommendation-box ${isAlreadyDispatched ? 'dispatched-state' : ''}`}>
            {/* Top Star Banner */}
            <div className="recommendation-header">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>RECOMMENDED CLOSEST RESCUER</span>
              </div>
              <span className="auto-match-tag">Auto-Calculated</span>
            </div>

            {/* Rescuer Profile */}
            <div className="rescuer-profile-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="rescuer-name">{closestVolunteer.name}</div>
                  <div className="rescuer-callsign">
                    <Shield className="w-3 h-3 inline mr-1 text-emerald-400" />
                    {closestVolunteer.callsign} • {closestVolunteer.role}
                  </div>
                </div>

                <div className="rescuer-battery">
                  <Battery className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{closestVolunteer.battery}%</span>
                </div>
              </div>

              {/* Distance & ETA Pills */}
              <div className="metrics-row">
                <div className="metric-pill distance">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <div className="metric-val">{closestVolunteer.distanceKm} km</div>
                    <div className="metric-sub">Haversine Distance</div>
                  </div>
                </div>

                <div className="metric-pill eta">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="metric-val">~{closestVolunteer.etaMinutes} mins</div>
                    <div className="metric-sub">Est. Arrival Time</div>
                  </div>
                </div>
              </div>

              {/* Specialization & Equipment */}
              <div className="rescuer-specs">
                <div className="spec-item">
                  <span className="spec-label">Specialization:</span>
                  <span className="spec-value text-emerald-300">{closestVolunteer.specialization}</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Phone:</span>
                  <span className="spec-value font-mono text-slate-300">{closestVolunteer.phone}</span>
                </div>

                <div className="equipment-tags">
                  {(closestVolunteer.equipment || []).map((eq, idx) => (
                    <span key={idx} className="eq-tag">✓ {eq}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Instructions Input */}
            {!isAlreadyDispatched && !isResolved && (
              <div className="custom-note-group">
                <label className="note-label">
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  Optional Dispatcher Note to Rescuer:
                </label>
                <input
                  type="text"
                  className="note-input"
                  placeholder="e.g. Bring extra life jackets; access via West Gate"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                />
              </div>
            )}

            {/* Main Action Button */}
            {!isAlreadyDispatched && !isResolved ? (
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="dispatch-action-btn"
              >
                {isDispatching ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="btn-spinner"></span>
                    Transmitting Priority Dispatch...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 font-bold tracking-wide">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>⚡ DISPATCH CLOSEST RESCUER & SEND ALERT</span>
                  </span>
                )}
              </button>
            ) : isAlreadyDispatched ? (
              <div className="already-dispatched-banner">
                <Truck className="w-4 h-4 text-amber-400 animate-bounce" />
                <div>
                  <div className="font-bold text-xs text-amber-300">Rescuer Mobilized & En Route</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Assigned: <strong>{closestVolunteer.name}</strong> • Notification sent to mobile terminal
                  </div>
                </div>
              </div>
            ) : (
              <div className="already-dispatched-banner resolved">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-emerald-300">Incident Successfully Resolved</span>
              </div>
            )}
          </div>
        ) : (
          <div className="no-volunteers-warning">
            <AlertTriangle className="w-6 h-6 text-amber-400 mb-1" />
            <div className="font-bold text-xs text-amber-200">No Online Rescuers In Range</div>
            <div className="text-[11px] text-slate-400">All connected mesh volunteers are currently busy or offline.</div>
          </div>
        )}

        {/* Live Delivered Message Banner (Verifying the exact required phrasing) */}
        {lastDispatchResult && lastDispatchResult.sosId === selectedSOS.id && (
          <div className="delivered-message-card">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>MESSAGE DELIVERED TO RESCUER TERMINAL</span>
            </div>
            <div className="delivered-message-text">
              "{lastDispatchResult.messageSentToVolunteer || lastDispatchResult.message}"
            </div>
            <div className="delivered-meta">
              <span>Delivered to: <strong>{lastDispatchResult.dispatchedVolunteer?.name || 'Rescuer'}</strong></span>
              <span>• Status: <strong>RECEIVED & ACKNOWLEDGED</strong></span>
            </div>
          </div>
        )}

        {/* Other Nearby Volunteers List (Alternative selection) */}
        {allRankedVolunteers && allRankedVolunteers.length > 1 && (
          <div className="alternative-volunteers-section">
            <div className="alt-title">
              <span>Other Nearby Volunteers Ranked ({allRankedVolunteers.length - 1})</span>
            </div>

            <div className="alt-volunteers-list">
              {allRankedVolunteers.slice(1, 4).map(vol => (
                <div key={vol.id} className="alt-volunteer-row">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="font-semibold text-xs text-slate-300">{vol.name}</span>
                      <div className="text-[11px] text-slate-400">
                        {vol.callsign} • {vol.specialization}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-400">{vol.distanceKm} km</div>
                      <div className="text-[10px] text-slate-400">~{vol.etaMinutes}m ETA</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
