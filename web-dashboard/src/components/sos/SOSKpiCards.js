import React from 'react';
import { AlertCircle, Flame, Clock, Truck, CheckCircle2, Timer } from 'lucide-react';
import MetricCard from '../common/MetricCard';

export default function SOSKpiCards({ stats = {} }) {
  const {
    activeSOS = 24,
    critical = 8,
    awaitingResponse = 6,
    responding = 10,
    resolvedToday = 37,
    avgResponseTime = '08:42'
  } = stats;

  return (
    <div className="sos-kpi-grid">
      {/* 1. Active SOS */}
      <MetricCard
        title="Active SOS Requests"
        value={activeSOS}
        subtitle="Currently active beacons"
        icon={AlertCircle}
        variant="danger"
        badge="Active"
      />

      {/* 2. Critical */}
      <MetricCard
        title="Critical Priority"
        value={critical}
        subtitle="Immediate attention required"
        icon={Flame}
        variant="danger"
        badge="Urgent"
      />

      {/* 3. Awaiting Response */}
      <MetricCard
        title="Awaiting Response"
        value={awaitingResponse}
        subtitle="No responder assigned yet"
        icon={Clock}
        variant="warning"
        badge="Unassigned"
      />

      {/* 4. Responding */}
      <MetricCard
        title="Responding Units"
        value={responding}
        subtitle="Responders currently en route"
        icon={Truck}
        variant="info"
        badge="Mobilized"
      />

      {/* 5. Resolved Today */}
      <MetricCard
        title="Resolved Today"
        value={resolvedToday}
        subtitle="Successfully evacuated / aided"
        icon={CheckCircle2}
        variant="success"
        badge="Closed"
      />

      {/* 6. Avg Response Time */}
      <MetricCard
        title="Avg Response Time"
        value={avgResponseTime}
        subtitle="Today's deployment speed"
        icon={Timer}
        variant="purple"
        badge="Minutes"
      />
    </div>
  );
}
