import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw, AlertTriangle } from 'lucide-react';

import MapLegend from '../components/map/MapLegend';
import MapFilterBar from '../components/map/MapFilterBar';
import MapInfoPanel from '../components/map/MapInfoPanel';
import api from '../services/api';
import mockDataStore from '../services/mockDataStore';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom tactical icons
const createLeafletIcon = (type, label, color) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="tactical-marker ${type}">
        <div class="marker-core" style="background-color: ${color};"></div>
        <span class="marker-label-tag">${label}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export default function LiveSituationMap({ onNavigate }) {
  const [data, setData] = useState(() => mockDataStore.getState());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [layers, setLayers] = useState({
    emergency: true,
    network: true,
    infrastructure: true,
    personnel: true
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMapData = useCallback(async () => {
    try {
      const res = await api.getDashboardOverview();
      if (res && res.success && res.data) {
        setData(res.data);
      } else {
        setData(mockDataStore.getState());
      }
    } catch (err) {
      console.warn('Using local prototype map data:', err);
      setData(mockDataStore.getState());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMapData();
    const interval = setInterval(fetchMapData, 6000);
    return () => clearInterval(interval);
  }, [fetchMapData]);

  const handleToggleLayer = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Static/Fallback Nodes for Tactical Grid
  const defaultNodes = useMemo(() => [
    { id: 'RM-84F2', type: 'GATEWAY', status: 'ONLINE', latitude: 6.9450, longitude: 79.8750, messagesHandled: 482, battery: 100 },
    { id: 'RM-21A4', type: 'RELAY_ROUTER', status: 'ONLINE', latitude: 6.9501, longitude: 79.8710, messagesHandled: 236, battery: 91 },
    { id: 'RM-91C2', type: 'MOBILE_NODE', status: 'ONLINE', latitude: 6.9380, longitude: 79.8730, messagesHandled: 114, battery: 84 },
    { id: 'RM-4412', type: 'RELAY_ROUTER', status: 'ONLINE', latitude: 6.9150, longitude: 79.8820, messagesHandled: 198, battery: 78 },
    { id: 'RM-6721', type: 'SOLAR_TOWER', status: 'ONLINE', latitude: 6.9200, longitude: 79.8600, messagesHandled: 520, battery: 95 }
  ], []);

  // Filtered Collections
  const filteredAlerts = useMemo(() => {
    const rawAlerts = data?.mapData?.alerts || data?.sosAlerts || mockDataStore.getState().sosAlerts;
    if (!rawAlerts || !layers.emergency) return [];
    let list = rawAlerts.filter(a => a.status === 'ACTIVE' || a.status === 'DISPATCHED');

    if (severityFilter === 'CRITICAL') {
      list = list.filter(a => a.priority === 'CRITICAL');
    }
    if (selectedArea !== 'ALL') {
      list = list.filter(a => a.locationName?.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.citizenName?.toLowerCase().includes(q) ||
        a.id?.toLowerCase().includes(q) ||
        a.deviceId?.toLowerCase().includes(q) ||
        a.locationName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, layers.emergency, severityFilter, selectedArea, searchQuery]);

  const filteredNodes = useMemo(() => {
    const rawNodes = data?.mapData?.nodes || defaultNodes;
    if (!rawNodes || !layers.network) return [];
    let list = rawNodes;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n =>
        n.id?.toLowerCase().includes(q) ||
        n.location?.toLowerCase().includes(q) ||
        n.type?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, defaultNodes, layers.network, searchQuery]);

  const filteredResources = useMemo(() => {
    const rawResources = data?.mapData?.resources || data?.resources || mockDataStore.getState().resources;
    if (!rawResources || !layers.infrastructure) return [];
    let list = rawResources;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, layers.infrastructure, searchQuery]);

  const filteredVolunteers = useMemo(() => {
    const rawVolunteers = data?.mapData?.volunteers || data?.volunteers || mockDataStore.getState().volunteers;
    if (!rawVolunteers || !layers.personnel) return [];
    let list = rawVolunteers;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.callsign?.toLowerCase().includes(q) ||
        v.role?.toLowerCase().includes(q) ||
        v.specialization?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, layers.personnel, searchQuery]);

  const defaultCenter = [6.9385, 79.8735]; // Colombo Kelani Flood Basin

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Live Situation Map</h1>
          <p className="donezo-page-subtitle">
            Real-time geospatial tactical view of flood zones, SOS distress beacons, volunteers & mesh relays.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => onNavigate('/sos')}
            className="donezo-btn-primary"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>View Distress Queue</span>
          </button>
          <button
            onClick={() => { setIsRefreshing(true); fetchMapData(); }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={'w-4 h-4 ' + (isRefreshing ? 'animate-spin text-emerald-800' : '')} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Map'}</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <MapFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
        layers={layers}
        onToggleLayer={handleToggleLayer}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        counts={{
          sos: filteredAlerts.length,
          nodes: filteredNodes.length,
          resources: filteredResources.length,
          volunteers: filteredVolunteers.length
        }}
      />

      {/* Main Map View Area with Side Info Panel */}
      <div className="situation-map-layout-grid">
        <div className="map-view-container">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="full-leaflet-canvas"
            style={{ width: '100%', height: '100%', minHeight: '580px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Flood Zone Risk Radius (Kelani Basin Sector 4) */}
            <Circle
              center={[6.9450, 79.8750]}
              radius={2200}
              pathOptions={{
                color: '#DC2626',
                fillColor: '#DC2626',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '8, 8'
              }}
            />

            {/* High Tide Coastal Warning Zone */}
            <Circle
              center={[6.9150, 79.8600]}
              radius={1400}
              pathOptions={{
                color: '#D97706',
                fillColor: '#D97706',
                fillOpacity: 0.1,
                weight: 1.5,
                dashArray: '6, 6'
              }}
            />

            {/* 1. Emergency SOS Layer */}
            {filteredAlerts.map((a) => (
              <Marker
                key={a.id}
                position={[a.latitude || 6.9448, a.longitude || 79.8745]}
                icon={createLeafletIcon('sos-marker', a.priority === 'CRITICAL' ? '🚨 CRITICAL' : '🚨 SOS', '#DC2626')}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'sos', data: a })
                }}
              >
                <Popup className="monitoring-popup">
                  <div className="p-1">
                    <div className="font-bold text-xs text-red-600">🚨 {a.priority} SOS #{a.id}</div>
                    <div className="font-bold text-sm text-slate-900">{a.citizenName}</div>
                    <div className="text-xs text-slate-600">{a.locationName}</div>
                    <div className="mt-1 text-[11px] text-slate-500 font-mono">Node: #{a.deviceId} • {a.hopCount || 2} hops</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 2. Network Nodes Layer */}
            {filteredNodes.map((n) => (
              <Marker
                key={n.id}
                position={[n.latitude || 6.9450, n.longitude || 79.8750]}
                icon={createLeafletIcon('node-marker', n.id, '#2563EB')}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'node', data: n })
                }}
              >
                <Popup className="monitoring-popup">
                  <div className="p-1">
                    <div className="font-bold text-xs text-blue-600">📡 RelayMesh Node #{n.id}</div>
                    <div className="text-xs text-slate-700">Type: {n.type}</div>
                    <div className="text-[11px] text-slate-500">Status: {n.status} • Battery: {n.battery}%</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 3. Shelters & Resources Layer */}
            {filteredResources.map((r) => {
              const lat = r.latitude || (r.coordinates ? parseFloat(r.coordinates.split(',')[0]) : 6.9385);
              const lng = r.longitude || (r.coordinates ? parseFloat(r.coordinates.split(',')[1]) : 79.8735);

              return (
                <Marker
                  key={r.id}
                  position={[lat, lng]}
                  icon={createLeafletIcon('resource-marker', r.category?.toUpperCase() || 'SHELTER', r.category === 'SHELTER' ? '#164E37' : '#0891B2')}
                  eventHandlers={{
                    click: () => setSelectedItem({ type: 'resource', data: r })
                  }}
                >
                  <Popup className="monitoring-popup">
                    <div className="p-1">
                      <div className="font-bold text-xs text-emerald-800">
                        {r.category === 'SHELTER' ? '🏠 Shelter' : '📦 Resource Depot'}
                      </div>
                      <div className="font-bold text-sm text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-600">
                        Capacity: <strong>{r.available} / {r.total} {r.unit}</strong> available
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 4. Personnel / Volunteers Layer */}
            {filteredVolunteers.map((v) => (
              <Marker
                key={v.id}
                position={[v.latitude || 6.9440, v.longitude || 79.8730]}
                icon={createLeafletIcon('volunteer-marker', v.callsign || 'VOL', '#059669')}
                eventHandlers={{
                  click: () => setSelectedItem({ type: 'volunteer', data: v })
                }}
              >
                <Popup className="monitoring-popup">
                  <div className="p-1">
                    <div className="font-bold text-xs text-emerald-700">👤 {v.name} ({v.callsign})</div>
                    <div className="text-xs text-slate-700">{v.specialization}</div>
                    <div className="text-[11px] text-slate-500">Status: {v.status} • Battery: {v.batteryLevel || 92}%</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Overlay Legend */}
          <MapLegend />
        </div>

        {/* Side Information Drawer */}
        {selectedItem && (
          <MapInfoPanel
            selectedItem={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}
