import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Layers } from 'lucide-react';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Markers for Monitoring
const createMarkerIcon = (type, label, color) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="map-preview-marker ${type}">
        <div class="marker-dot" style="background-color: ${color};"></div>
        <span class="marker-tag">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function SituationalMapPreview({
  mapData = {},
  onNavigate,
  onOpenFullMap
}) {
  const [activeLayer, setActiveLayer] = useState('ALL');

  const defaultCenter = [6.9271, 79.8612]; // Colombo / Western Province

  const {
    alerts = [],
    nodes = [],
    volunteers = [],
    resources = [],
  } = mapData;

  const showSOS = activeLayer === 'ALL' || activeLayer === 'SOS';
  const showNodes = activeLayer === 'ALL' || activeLayer === 'NODES';
  const showShelters = activeLayer === 'ALL' || activeLayer === 'SHELTERS';
  const showVolunteers = activeLayer === 'ALL' || activeLayer === 'VOLUNTEERS';

  const handleOpenMap = () => {
    if (onOpenFullMap) onOpenFullMap();
    else if (onNavigate) onNavigate('/map');
  };

  return (
    <div className="situational-map-preview-card">
      {/* Header & Controls */}
      <div className="card-top-header">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="card-title-text">Situational Map Overview</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic distribution of SOS requests, active mesh nodes, shelters & volunteers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={'px-2 py-1 text-[11px] font-bold rounded ' + (activeLayer === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600')}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer('SOS')}
              className={'px-2 py-1 text-[11px] font-bold rounded ' + (activeLayer === 'SOS' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-600')}
            >
              SOS (24)
            </button>
            <button
              onClick={() => setActiveLayer('NODES')}
              className={'px-2 py-1 text-[11px] font-bold rounded ' + (activeLayer === 'NODES' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600')}
            >
              Nodes (184)
            </button>
            <button
              onClick={() => setActiveLayer('SHELTERS')}
              className={'px-2 py-1 text-[11px] font-bold rounded ' + (activeLayer === 'SHELTERS' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600')}
            >
              Shelters (5)
            </button>
          </div>

          <button
            onClick={handleOpenMap}
            className="btn-secondary flex items-center gap-1 py-1 px-2.5 text-xs"
            title="Open Full Live Situation Map"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Map</span>
          </button>
        </div>
      </div>

      {/* Cluster Aggregation Badges Bar */}
      <div className="map-cluster-summary-bar">
        <div className="cluster-summary-item sos">
          <span className="cluster-dot red" />
          <span>SOS cluster: <strong>17</strong> (Riverside)</span>
        </div>
        <div className="cluster-summary-item nodes">
          <span className="cluster-dot blue" />
          <span>Nodes cluster: <strong>42</strong> (Colombo North)</span>
        </div>
        <div className="cluster-summary-item shelters">
          <span className="cluster-dot green" />
          <span>Shelter capacity: <strong>1,240</strong> available</span>
        </div>
        <div className="cluster-summary-item volunteers">
          <span className="cluster-dot cyan" />
          <span>Volunteers: <strong>47</strong> online</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="map-canvas-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          className="leaflet-preview-canvas"
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Incident Flood Zone Radius */}
          <Circle
            center={[6.9385, 79.8735]}
            radius={1800}
            pathOptions={{
              color: '#E53935',
              fillColor: '#E53935',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '6, 6'
            }}
          />

          {/* SOS Distress Markers */}
          {showSOS && alerts.map((a) => (
            <Marker
              key={a.id}
              position={[a.latitude, a.longitude]}
              icon={createMarkerIcon('sos', a.priority === 'CRITICAL' ? 'CRITICAL' : 'SOS', '#E53935')}
            >
              <Popup className="monitoring-popup">
                <div className="p-1">
                  <div className="font-bold text-xs text-red-400">🚨 {a.priority} SOS #{a.id}</div>
                  <div className="font-bold text-sm text-slate-100">{a.citizenName}</div>
                  <div className="text-[11px] text-slate-400">{a.locationName}</div>
                  <div className="text-[10px] text-slate-300 mt-1 font-mono">
                    Source Node: {a.deviceId} • {a.hopCount} Hops
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(a.triageTags || []).map((t, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700">{t}</span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Network Nodes */}
          {showNodes && nodes.map((n) => (
            <Marker
              key={n.id}
              position={[n.latitude, n.longitude]}
              icon={createMarkerIcon('node', n.id, '#2563EB')}
            >
              <Popup className="monitoring-popup">
                <div className="p-1">
                  <div className="font-bold text-xs text-blue-400">📡 RelayMesh Node {n.id}</div>
                  <div className="text-xs text-slate-200">Type: <strong>{n.type}</strong></div>
                  <div className="text-[11px] text-slate-400">Status: {n.status} • Battery: {n.battery}%</div>
                  <div className="text-[10px] text-slate-400 font-mono">Messages handled: {n.messagesHandled}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelters & Resources */}
          {showShelters && resources.filter(r => r.category === 'shelter').map((s) => (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={createMarkerIcon('shelter', 'SHELTER', '#167044')}
            >
              <Popup className="monitoring-popup">
                <div className="p-1">
                  <div className="font-bold text-xs text-emerald-400">🏠 {s.name}</div>
                  <div className="text-xs text-slate-200">Capacity: <strong>{s.availableCapacity} / {s.capacity}</strong> available</div>
                  <div className="text-[11px] text-slate-400">Status: {s.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Volunteers */}
          {showVolunteers && volunteers.map((v) => (
            <Marker
              key={v.id}
              position={[v.latitude, v.longitude]}
              icon={createMarkerIcon('volunteer', v.callsign, '#10B981')}
            >
              <Popup className="monitoring-popup">
                <div className="p-1">
                  <div className="font-bold text-xs text-emerald-400">👤 {v.name} ({v.callsign})</div>
                  <div className="text-xs text-slate-200">{v.role} • {v.specialization}</div>
                  <div className="text-[11px] text-slate-400">Battery: {v.battery}% • Status: {v.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
