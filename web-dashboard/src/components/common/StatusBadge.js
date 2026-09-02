import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  if (!status) return null;
  const s = status.toUpperCase();

  let colorClass = 'status-default';
  let label = status;
  let hasPulse = false;

  switch (s) {
    case 'ONLINE':
    case 'ACTIVE':
    case 'OPEN':
    case 'AVAILABLE':
    case 'VERIFIED':
      colorClass = 'status-active';
      hasPulse = true;
      break;
    case 'LIMITED':
    case 'WARNING':
    case 'DISPATCHED':
    case 'EN_ROUTE':
    case 'CONTAINED':
      colorClass = 'status-warning';
      break;
    case 'CRITICAL':
    case 'FULL':
    case 'DANGER':
    case 'EMERGENCY':
      colorClass = 'status-critical';
      hasPulse = true;
      break;
    case 'OFFLINE':
    case 'CLOSED':
    case 'INACTIVE':
    case 'RESOLVED':
      colorClass = 'status-muted';
      break;
    default:
      colorClass = 'status-default';
  }

  return (
    <span className={'status-badge ' + colorClass + ' size-' + size}>
      {hasPulse && <span className="status-pulse-dot" />}
      <span>{label}</span>
    </span>
  );
}
