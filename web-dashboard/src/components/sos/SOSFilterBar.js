import { Search, LayoutGrid, Table, Flame, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function SOSFilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  incidentFilter,
  onIncidentChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  counts = {}
}) {
  const priorities = [
    { key: 'ALL', label: 'All Priorities', count: counts.all },
    { key: 'CRITICAL', label: 'Critical', count: counts.critical, color: '#E53935', icon: Flame },
    { key: 'HIGH', label: 'High', count: counts.high, color: '#F59E0B', icon: AlertTriangle },
    { key: 'MODERATE', label: 'Moderate', count: counts.moderate, color: '#38BDF8', icon: Info },
    { key: 'LOW', label: 'Low', count: counts.low, color: '#10B981', icon: CheckCircle2 }
  ];

  return (
    <div className="sos-filter-control-panel">
      {/* Top Search & Dropdowns Row */}
      <div className="sos-filter-top-row">
        {/* Search */}
        <div className="sos-search-box">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SOS ID, citizen name, phone, location, triage tags, node RM-XXXX..."
            className="sos-search-input"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="sos-search-clear">
              ×
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="sos-select-wrap">
          <span className="sos-select-lbl">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="sos-select"
          >
            <option value="ALL">All Statuses ({counts.all || 0})</option>
            <option value="ACTIVE">Active ({counts.active || 0})</option>
            <option value="DISPATCHED">Dispatched ({counts.dispatched || 0})</option>
            <option value="RESOLVED">Resolved ({counts.resolved || 0})</option>
          </select>
        </div>

        {/* Incident Association Filter */}
        <div className="sos-select-wrap">
          <span className="sos-select-lbl">Incident:</span>
          <select
            value={incidentFilter}
            onChange={(e) => onIncidentChange(e.target.value)}
            className="sos-select"
          >
            <option value="ALL">All Associated Incidents</option>
            <option value="INC-101">INC-101 (Riverside Flood)</option>
            <option value="INC-102">INC-102 (Grandpass Collapse)</option>
            <option value="INC-103">INC-103 (Borella Debris)</option>
            <option value="INC-104">INC-104 (Coastal Surge)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="sos-select-wrap">
          <span className="sos-select-lbl">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sos-select"
          >
            <option value="NEWEST">Newest Reported</option>
            <option value="PRIORITY">Highest Priority</option>
            <option value="HOPS">Hop Count (Proximity)</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="sos-view-toggle">
          <button
            onClick={() => onViewModeChange('table')}
            className={'view-btn ' + (viewMode === 'table' ? 'active' : '')}
            title="Dense Data Table View"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={'view-btn ' + (viewMode === 'grid' ? 'active' : '')}
            title="Card Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Priority Pills Row */}
      <div className="sos-priority-pills-row">
        {priorities.map((p) => {
          const Icon = p.icon;
          const isActive = priorityFilter === p.key;

          return (
            <button
              key={p.key}
              onClick={() => onPriorityChange(p.key)}
              className={'priority-pill-btn ' + p.key.toLowerCase() + ' ' + (isActive ? 'active' : '')}
            >
              {Icon && <Icon className="w-3 h-3" />}
              <span>{p.label}</span>
              {p.count !== undefined && (
                <span className="pill-counter">{p.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
