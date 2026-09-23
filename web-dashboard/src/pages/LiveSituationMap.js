import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  RotateCcw,
  AlertTriangle,
  Users,
  Radio,
  MapPin,
  X,
  ArrowRight
} from 'lucide-react';

import api from '../services/api';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Tactical Clean Leaflet Marker (Light, Soft, Non-intrusive)
const createTacticalIcon = (label, color, isCritical = false) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        ${isCritical ? '<span style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: rgba(220, 38, 38, 0.25); animation: markerPulse 1.8s infinite;"></span>' : ''}
        <div style="display: inline-flex; align-items: center; gap: 5px; background: #FFFFFF; border: 1px solid #CBD5E1; color: #1E293B; font-size: 11px; font-weight: 550; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); white-space: nowrap;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background-color: ${color}; flex-shrink: 0;"></span>
          <span>${label}</span>
        </div>
      </div>
    `,
    iconSize: [110, 24],
    iconAnchor: [55, 12],
    popupAnchor: [0, -12]
  });
};

export default function LiveSituationMap({ onNavigate }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, CRITICAL, TEAMS, NODES
  const [selectedItem, setSelectedItem] = useState(null);

  // Distinct geospatial coordinates spread across the Kelani Flood Basin so pins never overlap
  const defaultAlerts = useMemo(() => [
    {
      id: 'SOS-841',
      citizenName: 'Kasun Perera',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      latitude: 6.9540,
      longitude: 79.8780,
      locationName: 'Sedawatta Riverbank',
      situationDetails: 'Water reached 1.8m in residence. Two elderly family members trapped on upper level.',
      deviceId: 'RM-84F2',
      hopCount: 2
    },
    {
      id: 'SOS-842',
      citizenName: 'Fatima Razeek',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      latitude: 6.9380,
      longitude: 79.8860,
      locationName: 'Orugodawatta East',
      situationDetails: 'Power completely out, infant needs dry shelter and oral rehydration salts.',
      deviceId: 'RM-4412',
      hopCount: 3
    },
    {
      id: 'SOS-839',
      citizenName: 'Sunil Fernando',
      priority: 'HIGH',
      status: 'ACTIVE',
      latitude: 6.9620,
      longitude: 79.8710,
      locationName: 'Kelani North Bridge Sector',
      situationDetails: 'Roof sheltering 4 neighbors. Water is fast-flowing, boat evacuation requested.',
      deviceId: 'RM-84F2',
      hopCount: 1
    },
    {
      id: 'SOS-835',
      citizenName: 'Devinda Silva',
      priority: 'HIGH',
      status: 'ACTIVE',
      latitude: 6.9280,
      longitude: 79.8750,
      locationName: 'Grandpass South Access',
      situationDetails: 'Diabetic patient requiring cold-storage insulin delivery.',
      deviceId: 'RM-6721',
      hopCount: 2
    }
  ], []);

  const defaultTeams = useMemo(() => [
    {
      id: 'TEAM-1',
      name: 'Swift Boat Unit ALPHA',
      callsign: 'SWIFT-ALPHA',
      specialization: 'Swift Water Inflatable Boat',
      status: 'DEPLOYED',
      latitude: 6.9460,
      longitude: 79.8720,
      locationName: 'Mid-River Kelani Corridor',
      batteryLevel: 94,
      deviceId: 'RM-84F2'
    },
    {
      id: 'TEAM-2',
      name: 'Medical Mobile Unit BRAVO',
      callsign: 'MEDIC-BRAVO',
      specialization: 'Trauma & Emergency Triage',
      status: 'DEPLOYED',
      latitude: 6.9340,
      longitude: 79.8820,
      locationName: 'Orugodawatta Clinic Base',
      batteryLevel: 98,
      deviceId: 'RM-4412'
    },
    {
      id: 'TEAM-3',
      name: 'Search & Recon Unit CHARLIE',
      callsign: 'SEARCH-CHARLIE',
      specialization: 'Thermal Drone & Lifeline Search',
      status: 'DEPLOYED',
      latitude: 6.9580,
      longitude: 79.8640,
      locationName: 'Grandpass North Basin',
      batteryLevel: 88,
      deviceId: 'RM-6721'
    },
    {
      id: 'TEAM-4',
      name: 'Zodiac Rescue Unit DELTA',
      callsign: 'BOAT-DELTA',
      specialization: 'Flood Evacuation Staging',
      status: 'AVAILABLE',
      latitude: 6.9200,
      longitude: 79.8550,
      locationName: 'Colombo Fort Staging Depot',
      batteryLevel: 99,
      deviceId: 'RM-91C2'
    },
    {
      id: 'TEAM-5',
      name: 'First Responder Team ECHO',
      callsign: 'VOL-ECHO',
      specialization: 'Community Evac Logistics',
      status: 'AVAILABLE',
      latitude: 6.9140,
      longitude: 79.8690,
      locationName: 'Maradana Central Depot',
      batteryLevel: 92,
      deviceId: 'RM-91C2'
    }
  ], []);

  const defaultNodes = useMemo(() => [
    {
      id: 'RM-84F2',
      name: 'Kelani North Tower Gateway',
      type: 'SOLAR_TOWER',
      status: 'ONLINE',
      latitude: 6.9680,
      longitude: 79.8790,
      locationName: 'Elevated North Water Tower',
      messagesHandled: 482,
      battery: 100
    },
    {
      id: 'RM-21A4',
      name: 'Kolonnawa Solar Repeater',
      type: 'RELAY_ROUTER',
      status: 'ONLINE',
      latitude: 6.9490,
      longitude: 79.8890,
      locationName: 'Kolonnawa Hilltop Station',
      messagesHandled: 236,
      battery: 91
    },
    {
      id: 'RM-91C2',
      name: 'Sedawatta Mobile Repeater',
      type: 'MOBILE_NODE',
      status: 'ONLINE',
      latitude: 6.9390,
      longitude: 79.8660,
      locationName: 'Sedawatta Communications Van',
      messagesHandled: 114,
      battery: 84
    },
    {
      id: 'RM-4412',
      name: 'Orugodawatta Flyover Node',
      type: 'RELAY_ROUTER',
      status: 'ONLINE',
      latitude: 6.9220,
      longitude: 79.8840,
      locationName: 'Orugodawatta Flyover Mast',
      messagesHandled: 198,
      battery: 78
    },
    {
      id: 'RM-6721',
      name: 'Grandpass Mast Gateway',
      type: 'GATEWAY',
      status: 'ONLINE',
      latitude: 6.9310,
      longitude: 79.8560,
      locationName: 'Grandpass High Mast',
      messagesHandled: 520,
      battery: 95
    }
  ], []);

  const [alerts, setAlerts] = useState(defaultAlerts);
  const [teams] = useState(defaultTeams);
  const [nodes] = useState(defaultNodes);

  const fetchMapData = useCallback(async () => {
    try {
      const res = await api.getSOSAlerts();
      if (res && res.success && res.data && res.data.length > 0) {
        // preserve coordinates if not present on server records
        const enriched = res.data.map((item, idx) => ({
          ...item,
          latitude: item.latitude || defaultAlerts[idx % defaultAlerts.length].latitude,
          longitude: item.longitude || defaultAlerts[idx % defaultAlerts.length].longitude
        }));
        setAlerts(enriched);
      }
    } catch (err) {
      console.warn('Using baseline tactical map coordinates:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [defaultAlerts]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  // Counts
  const criticalCount = useMemo(() => alerts.filter(a => a.priority === 'CRITICAL').length, [alerts]);
  const urgentCount = useMemo(() => alerts.filter(a => a.priority !== 'CRITICAL').length, [alerts]);

  // Filtered elements
  const displayedAlerts = useMemo(() => {
    if (activeFilter === 'TEAMS' || activeFilter === 'NODES') return [];
    if (activeFilter === 'CRITICAL') return alerts.filter(a => a.priority === 'CRITICAL');
    return alerts;
  }, [alerts, activeFilter]);

  const displayedTeams = useMemo(() => {
    if (activeFilter === 'CRITICAL' || activeFilter === 'NODES') return [];
    return teams;
  }, [teams, activeFilter]);

  const displayedNodes = useMemo(() => {
    if (activeFilter === 'CRITICAL' || activeFilter === 'TEAMS') return [];
    return nodes;
  }, [nodes, activeFilter]);

  const mapCenter = [6.9440, 79.8730]; // Centered on Kelani River Basin

  return (
    <div className="donezo-dashboard-wrapper">
      {/* 1. Page Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Live Situation Map</h1>
          <p className="donezo-page-subtitle">
            Geospatial disaster monitoring: citizen distress beacons, rescue units & mesh repeaters
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/sos')}
            className="donezo-btn-primary"
            style={{ backgroundColor: '#DC2626' }}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency SOS Queue ({criticalCount + urgentCount})</span>
          </button>
          <button
            onClick={() => { setIsRefreshing(true); fetchMapData(); }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Map'}</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Operational Ticker Banner */}
      <div className="map-situation-banner">
        <div className="map-ticker-left">
          <div className="map-alert-badge">
            <span className="map-pulse-dot-red" />
            <span>High Alert Zone</span>
          </div>
          <span className="map-ticker-title">
            Kelani River Basin Sector 4 — Severe Flooding (Water level +1.8m)
          </span>
        </div>

        <div className="map-ticker-stats">
          <span className="map-stat-pill critical">
            <strong>{criticalCount}</strong> Critical Evacuations
          </span>
          <span className="map-stat-pill urgent">
            <strong>{urgentCount}</strong> Urgent Distress
          </span>
          <span className="map-stat-pill teams">
            <strong>{teams.length}</strong> Rescue Units Active
          </span>
          <span className="map-stat-pill nodes">
            <strong>{nodes.length}</strong> Mesh Relays Online
          </span>
        </div>
      </div>

      {/* 3. Filter Control Toolbar */}
      <div className="donezo-filter-toolbar">
        <div className="donezo-filter-pills-row">
          <span className="map-filter-label">Filter Map:</span>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`map-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
          >
            All Tactical Elements ({alerts.length + teams.length + nodes.length})
          </button>
          <button
            onClick={() => setActiveFilter('CRITICAL')}
            className={`map-filter-btn ${activeFilter === 'CRITICAL' ? 'active critical' : ''}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
            Critical Life Threats ({criticalCount})
          </button>
          <button
            onClick={() => setActiveFilter('TEAMS')}
            className={`map-filter-btn ${activeFilter === 'TEAMS' ? 'active teams' : ''}`}
          >
            <Users className="w-3.5 h-3.5" />
            Rescue Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveFilter('NODES')}
            className={`map-filter-btn ${activeFilter === 'NODES' ? 'active nodes' : ''}`}
          >
            <Radio className="w-3.5 h-3.5" />
            Mesh Relays ({nodes.length})
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--donezo-text-muted)', fontWeight: 500 }}>
          Click any marker to inspect real-time telemetry
        </div>
      </div>

      {/* 4. Map Viewport & Tactical Canvas */}
      <div className="situation-map-layout-grid">
        <div className="map-view-container">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="full-leaflet-canvas"
            style={{ width: '100%', height: '100%', minHeight: '580px' }}
          >
            {/* Clean OpenStreetMap Tiles (No watermark) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Inundation Flood Zone (Kelani Sector 4) */}
            <Circle
              center={[6.9460, 79.8730]}
              radius={1800}
              pathOptions={{
                color: '#DC2626',
                fillColor: '#DC2626',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '6, 6'
              }}
            />

            {/* 1. SOS Distress Markers (Distributed) */}
            {displayedAlerts.map((a) => {
              const isCritical = a.priority === 'CRITICAL';
              const label = a.citizenName;
              const color = isCritical ? '#DC2626' : '#D97706';

              return (
                <Marker
                  key={a.id}
                  position={[a.latitude, a.longitude]}
                  icon={createTacticalIcon(label, color, isCritical)}
                  eventHandlers={{
                    click: () => setSelectedItem({ type: 'sos', data: a })
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '170px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '11px', color: '#64748B' }}>
                          #{a.id}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: isCritical ? '#FEF2F2' : '#FFFBEB',
                            color: isCritical ? '#DC2626' : '#D97706',
                            border: `1px solid ${isCritical ? '#FECACA' : '#FDE68A'}`
                          }}
                        >
                          {isCritical ? 'Critical' : 'Urgent'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
                        {a.citizenName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {a.locationName}
                      </div>
                      <button
                        onClick={() => setSelectedItem({ type: 'sos', data: a })}
                        style={{
                          marginTop: '8px',
                          background: 'none',
                          border: 'none',
                          color: '#2563EB',
                          fontWeight: 550,
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Inspect Situation Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 2. Rescue Teams Markers (Distributed) */}
            {displayedTeams.map((v) => (
              <Marker
                key={v.id}
                position={[v.latitude, v.longitude]}
                icon={createTacticalIcon(v.callsign, '#2563EB', false)}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'team', data: v })
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '170px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: '#2563EB' }}>
                        {v.callsign}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: v.status === 'AVAILABLE' ? '#ECFDF5' : '#EFF6FF',
                          color: v.status === 'AVAILABLE' ? '#059669' : '#2563EB',
                          border: `1px solid ${v.status === 'AVAILABLE' ? '#A7F3D0' : '#BFDBFE'}`
                        }}
                      >
                        {v.status === 'AVAILABLE' ? 'Available' : 'Deployed'}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {v.specialization}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 3. Mesh Gateways / Nodes (Distributed) */}
            {displayedNodes.map((n) => (
              <Marker
                key={n.id}
                position={[n.latitude, n.longitude]}
                icon={createTacticalIcon(n.id, '#059669', false)}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'node', data: n })
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '170px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: '#059669' }}>
                        Node #{n.id}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0'
                        }}
                      >
                        Online
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
                      {n.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {n.locationName}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Tactical Map Legend Floating Card */}
          <div className="map-tactical-legend">
            <div className="legend-title">Tactical Map Legend</div>
            <div className="legend-items-grid">
              <div className="legend-item">
                <span className="legend-marker-sample" style={{ backgroundColor: '#DC2626' }} />
                <span className="legend-label">Critical Citizen (Evac)</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker-sample" style={{ backgroundColor: '#D97706' }} />
                <span className="legend-label">Urgent SOS Case</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker-sample" style={{ backgroundColor: '#2563EB' }} />
                <span className="legend-label">Rescue Unit (Active)</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker-sample" style={{ backgroundColor: '#059669' }} />
                <span className="legend-label">Mesh Gateway / Node</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Selected Item Slide-out Detail Drawer */}
        {selectedItem && (
          <aside className="map-info-drawer">
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="drawer-type-tag">
                  {selectedItem.type.toUpperCase()} MONITORING
                </span>
                <span className="drawer-id-text">
                  #{selectedItem.data.id || selectedItem.data.deviceId}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                title="Close drawer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="drawer-scroll-body">
              {selectedItem.type === 'sos' && (
                <div className="drawer-details-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: selectedItem.data.priority === 'CRITICAL' ? '#FEE2E2' : '#FEF3C7',
                        color: selectedItem.data.priority === 'CRITICAL' ? '#DC2626' : '#D97706',
                        border: `1px solid ${selectedItem.data.priority === 'CRITICAL' ? '#FECACA' : '#FDE68A'}`
                      }}
                    >
                      {selectedItem.data.priority} PRIORITY
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                      ● {selectedItem.data.status}
                    </span>
                  </div>

                  <h3 className="drawer-title">{selectedItem.data.citizenName}</h3>
                  <div className="drawer-location-row">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{selectedItem.data.locationName}</span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '0.75rem' }}>
                    <span className="drawer-section-title" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>Emergency Distress Report</span>
                    <p className="drawer-notes-text" style={{ marginTop: '0.35rem', color: '#334155', fontSize: '0.82rem', lineHeight: 1.45 }}>
                      {selectedItem.data.situationDetails || 'Trapped in residence by rising flood water. Emergency boat rescue requested.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>Relaying Node:</span>
                    <span className="font-mono font-medium text-slate-700">#{selectedItem.data.deviceId}</span>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <button
                      onClick={() => onNavigate('/sos')}
                      className="donezo-btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Dispatch Rescue Unit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {selectedItem.type === 'team' && (
                <div className="drawer-details-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE'
                      }}
                    >
                      {selectedItem.data.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E293B' }}>
                      {selectedItem.data.callsign}
                    </span>
                  </div>

                  <h3 className="drawer-title">{selectedItem.data.name}</h3>
                  <div className="drawer-location-row">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{selectedItem.data.locationName}</span>
                  </div>

                  <div className="drawer-specs-grid" style={{ marginTop: '0.75rem' }}>
                    <div className="spec-box">
                      <span className="spec-lbl">Specialty</span>
                      <span className="spec-val text-xs" style={{ fontWeight: 550 }}>{selectedItem.data.specialization}</span>
                    </div>
                    <div className="spec-box">
                      <span className="spec-lbl">Battery Level</span>
                      <span className="spec-val font-mono text-emerald-700">{selectedItem.data.batteryLevel}%</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <button
                      onClick={() => onNavigate('/volunteers')}
                      className="donezo-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', backgroundColor: '#2563EB' }}
                    >
                      <span>View Team Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {selectedItem.type === 'node' && (
                <div className="drawer-details-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: '#ECFDF5',
                        color: '#065F46',
                        border: '1px solid #A7F3D0'
                      }}
                    >
                      {selectedItem.data.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E293B' }}>
                      Node #{selectedItem.data.id}
                    </span>
                  </div>

                  <h3 className="drawer-title">{selectedItem.data.name}</h3>
                  <div className="drawer-location-row">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedItem.data.locationName}</span>
                  </div>

                  <div className="drawer-specs-grid" style={{ marginTop: '0.75rem' }}>
                    <div className="spec-box">
                      <span className="spec-lbl">Node Type</span>
                      <span className="spec-val text-xs" style={{ fontWeight: 550 }}>{selectedItem.data.type}</span>
                    </div>
                    <div className="spec-box">
                      <span className="spec-lbl">Battery</span>
                      <span className="spec-val font-mono text-emerald-700">{selectedItem.data.battery}%</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <button
                      onClick={() => onNavigate('/network')}
                      className="donezo-btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Inspect Mesh Topography</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
