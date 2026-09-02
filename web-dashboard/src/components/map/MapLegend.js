import React from 'react';
import { Layers } from 'lucide-react';

export default function MapLegend() {
  const legendItems = [
    { label: 'Critical SOS Beacon', color: '#E53935', type: 'sos-dot' },
    { label: 'Active Incident Zone', color: '#F59E0B', type: 'zone-box' },
    { label: 'RelayMesh Gateway/Node', color: '#2563EB', type: 'node-dot' },
    { label: 'Emergency Shelter', color: '#167044', type: 'shelter-dot' },
    { label: 'Active Volunteer Unit', color: '#10B981', type: 'vol-dot' },
    { label: 'Medical / Water Supply', color: '#06B6D4', type: 'resource-dot' },
  ];

  return (
    <div className="map-tactical-legend">
      <div className="legend-header">
        <Layers className="w-3.5 h-3.5 text-slate-400" />
        <span className="legend-title">Tactical Map Legend</span>
      </div>

      <div className="legend-items-grid">
        {legendItems.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span
              className={'legend-marker-sample ' + item.type}
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
