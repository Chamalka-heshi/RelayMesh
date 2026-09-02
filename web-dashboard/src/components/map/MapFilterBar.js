import React from 'react';
import { Search, Filter, ShieldAlert } from 'lucide-react';

export default function MapFilterBar({
  searchQuery,
  onSearchChange,
  selectedArea,
  onAreaChange,
  layers,
  onToggleLayer,
  severityFilter,
  onSeverityFilterChange,
  counts = {}
}) {
  const areas = [
    'ALL AREAS',
    'Riverside / Kelani Basin',
    'Grandpass Junction',
    'Pettah Commercial Zone',
    'Borella Junction',
    'Kollupitiya Coastal'
  ];

  return (
    <div className="map-filter-control-bar">
      {/* Search Input */}
      <div className="map-search-wrap">
        <Search className="w-3.5 h-3.5 text-slate-400 map-search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by SOS ID, citizen, RM-Node, shelter, location..."
          className="map-search-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="map-search-clear"
          >
            ×
          </button>
        )}
      </div>

      {/* Area Selector */}
      <div className="map-area-select-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value)}
          className="map-area-select"
        >
          {areas.map((a, idx) => (
            <option key={idx} value={a === 'ALL AREAS' ? 'ALL' : a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="map-layers-toggle-group">
        <button
          onClick={() => onToggleLayer('emergency')}
          className={'layer-toggle-btn emergency ' + (layers.emergency ? 'active' : '')}
          title="Toggle Emergency Layer (SOS & Incidents)"
        >
          <span className="layer-dot red" />
          <span>Emergency ({counts.sos || 0})</span>
        </button>

        <button
          onClick={() => onToggleLayer('network')}
          className={'layer-toggle-btn network ' + (layers.network ? 'active' : '')}
          title="Toggle Mesh Network Layer"
        >
          <span className="layer-dot blue" />
          <span>Network ({counts.nodes || 0})</span>
        </button>

        <button
          onClick={() => onToggleLayer('infrastructure')}
          className={'layer-toggle-btn infrastructure ' + (layers.infrastructure ? 'active' : '')}
          title="Toggle Shelters & Resources Layer"
        >
          <span className="layer-dot green" />
          <span>Infrastructure ({counts.resources || 0})</span>
        </button>

        <button
          onClick={() => onToggleLayer('personnel')}
          className={'layer-toggle-btn personnel ' + (layers.personnel ? 'active' : '')}
          title="Toggle Volunteers & Responders Layer"
        >
          <span className="layer-dot cyan" />
          <span>Volunteers ({counts.volunteers || 0})</span>
        </button>
      </div>

      {/* Critical Only Filter */}
      <div className="map-critical-toggle-wrap">
        <button
          onClick={() => onSeverityFilterChange(severityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={'critical-filter-btn ' + (severityFilter === 'CRITICAL' ? 'active' : '')}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{severityFilter === 'CRITICAL' ? 'Critical Only' : 'All Severities'}</span>
        </button>
      </div>
    </div>
  );
}
