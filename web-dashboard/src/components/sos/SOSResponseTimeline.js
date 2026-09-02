import React from 'react';
import { Clock, Radio, CheckCircle2, Truck, AlertCircle, Shield } from 'lucide-react';

export default function SOSResponseTimeline({ sos, assignedVolunteer }) {
  if (!sos) return null;

  const reportedDate = sos.reportedAt ? new Date(sos.reportedAt) : new Date();
  const formatT = (date, addMinutes = 0) => {
    const d = new Date(date.getTime() + addMinutes * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isDispatched = sos.status === 'DISPATCHED' || assignedVolunteer != null;
  const isResolved = sos.status === 'RESOLVED';

  return (
    <div className="sos-response-timeline-card">
      <div className="timeline-header">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-bold text-slate-200">Emergency Response Lifecycle</span>
      </div>

      <div className="sos-timeline-flow">
        {/* Step 1: SOS Ingestion */}
        <div className="timeline-step completed">
          <div className="step-bullet red">
            <AlertCircle className="w-3 h-3" />
          </div>
          <div className="step-content">
            <div className="step-row">
              <span className="step-title">SOS Beacon Generated</span>
              <span className="step-time">{formatT(reportedDate, 0)}</span>
            </div>
            <span className="step-desc">Citizen distress signal broadcast via mobile app</span>
          </div>
        </div>

        {/* Step 2: Mesh Forwarding */}
        <div className="timeline-step completed">
          <div className="step-bullet blue">
            <Radio className="w-3 h-3" />
          </div>
          <div className="step-content">
            <div className="step-row">
              <span className="step-title">Relayed via Mesh Node {sos.deviceId}</span>
              <span className="step-time">{formatT(reportedDate, 1)}</span>
            </div>
            <span className="step-desc">Forwarded across {sos.hopCount || 2} P2P wireless hops</span>
          </div>
        </div>

        {/* Step 3: Central Division Ingestion */}
        <div className="timeline-step completed">
          <div className="step-bullet green">
            <Shield className="w-3 h-3" />
          </div>
          <div className="step-content">
            <div className="step-row">
              <span className="step-title">Central Monitoring Ingested</span>
              <span className="step-time">{formatT(reportedDate, 2)}</span>
            </div>
            <span className="step-desc">Prioritized as {sos.priority} emergency</span>
          </div>
        </div>

        {/* Step 4: Dispatch Assignment */}
        <div className={'timeline-step ' + (isDispatched ? 'completed' : 'pending')}>
          <div className={'step-bullet ' + (isDispatched ? 'amber' : 'gray')}>
            <Truck className="w-3 h-3" />
          </div>
          <div className="step-content">
            <div className="step-row">
              <span className="step-title">
                {isDispatched ? 'Volunteer Unit Dispatched' : 'Awaiting Responder Assignment'}
              </span>
              <span className="step-time">{isDispatched ? formatT(reportedDate, 4) : 'Pending'}</span>
            </div>
            <span className="step-desc">
              {isDispatched
                ? `Assigned to ${assignedVolunteer ? assignedVolunteer.name + ' (' + assignedVolunteer.callsign + ')' : 'Field Responder'}`
                : 'Distress call in queue for nearest available unit'}
            </span>
          </div>
        </div>

        {/* Step 5: Resolution */}
        {isResolved && (
          <div className="timeline-step completed">
            <div className="step-bullet emerald">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <div className="step-content">
              <div className="step-row">
                <span className="step-title">Incident Resolved</span>
                <span className="step-time">{formatT(reportedDate, 35)}</span>
              </div>
              <span className="step-desc">Citizen safely evacuated / aid delivered</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
