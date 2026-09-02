import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertCircle, 
  Shield, 
  Truck, 
  MapPin, 
  Navigation, 
  Battery, 
  Phone, 
  Zap, 
  Maximize2 
} from 'lucide-react';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Map Controller to smoothly Pan & Zoom
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Create custom pulsating SVG icons
const createSOSIcon = (priority, status, isSelected) => {
  const isCritical = priority === 'CRITICAL';
  const isDispatched = status === 'DISPATCHED';
  const isResolved = status === 'RESOLVED';

  let colorClass = 'sos-marker-critical';
  let badgeColor = '#ef4444';
  if (isResolved) {
    colorClass = 'sos-marker-resolved';
    badgeColor = '#10b981';
  } else if (isDispatched) {
    colorClass = 'sos-marker-dispatched';
    badgeColor = '#f59e0b';
  }

  const selectedClass = isSelected ? 'selected-beacon' : '';

  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="map-marker-container ${colorClass} ${selectedClass}">
        ${!isResolved ? '<div class="marker-pulse-ring"></div>' : ''}
        <div class="marker-core" style="background-color: ${badgeColor};">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${isResolved 
              ? '<polyline points="20 6 9 17 4 12"></polyline>' 
              : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
            }
          </svg>
        </div>
        <div class="marker-label">${priority || 'SOS'}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });
};

const createVolunteerIcon = (status, isClosest, callsign) => {
  const isAvailable = status === 'AVAILABLE' || status === 'ONLINE';
  const isDispatched = status === 'DISPATCHED';
  
  let bg = '#10b981'; // Green
  let ringClass = '';
  if (isDispatched) {
    bg = '#f59e0b'; // Amber
  } else if (!isAvailable) {
    bg = '#64748b'; // Gray
  }

  if (isClosest) {
    ringClass = 'closest-rescuer-pulse';
  }

  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div class="volunteer-marker-container ${ringClass}">
        ${isClosest ? '<div class="closest-target-ring"></div>' : ''}
        <div class="volunteer-marker-core" style="background-color: ${bg};">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="volunteer-label ${isClosest ? 'highlight' : ''}">${isClosest ? '★ ' : ''}${callsign || 'RESCUER'}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

export default function TacticalMap({ 
  alerts, 
  volunteers, 
  selectedSOS, 
  onSelectSOS, 
  closestVolunteer, 
  onDispatchClosest,
  onResetView 
}) {
  const defaultCenter = [6.9271, 79.8612]; // Colombo Central Coordinates
  const mapCenter = selectedSOS 
    ? [selectedSOS.latitude, selectedSOS.longitude] 
    : defaultCenter;

  const polylineCoords = (selectedSOS && closestVolunteer && closestVolunteer.latitude && closestVolunteer.longitude)
    ? [
        [selectedSOS.latitude, selectedSOS.longitude],
        [closestVolunteer.latitude, closestVolunteer.longitude]
      ]
    : null;

  return (
    <div className="tactical-map-wrapper">
      {/* Map Overlay Control Bar */}
      <div className="map-overlay-bar">
        <div className="flex items-center gap-2">
          <span className="map-live-dot"></span>
          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Tactical Spatial Radar (Colombo Grid)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span className="text-slate-300">Active SOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-300">Available Rescuer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-300">Dispatched Rescuer</span>
          </div>
          {closestVolunteer && (
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
              <span>★ Closest Rescuer Highlighted</span>
            </div>
          )}
        </div>
      </div>

      {/* Proximity Distance & Route Badge overlay */}
      {selectedSOS && closestVolunteer && (
        <div className="proximity-radar-badge">
          <div className="radar-badge-title">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>NEAREST RESCUER ROUTE</span>
          </div>
          <div className="radar-badge-content">
            <div className="radar-stat">
              <span className="radar-val">{closestVolunteer.distanceKm} km</span>
              <span className="radar-lbl">Direct Distance</span>
            </div>
            <div className="radar-divider"></div>
            <div className="radar-stat">
              <span className="radar-val text-emerald-400">~{closestVolunteer.etaMinutes} mins</span>
              <span className="radar-lbl">Estimated ETA</span>
            </div>
            <div className="radar-divider"></div>
            <div className="radar-stat">
              <span className="radar-val text-blue-400">{closestVolunteer.callsign}</span>
              <span className="radar-lbl">{closestVolunteer.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="leaflet-map-canvas"
        zoomControl={true}
      >
        <MapController center={mapCenter} zoom={selectedSOS ? 14 : 13} />

        {/* High-contrast CartoDB Dark Matter tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Connecting Proximity Line between Citizen SOS and Closest Rescuer */}
        {polylineCoords && (
          <>
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: '#06b6d4',
                weight: 4,
                dashArray: '8, 8',
                opacity: 0.9,
                className: 'animated-proximity-line'
              }}
            />
            {/* Range Circle around citizen */}
            <Circle
              center={[selectedSOS.latitude, selectedSOS.longitude]}
              radius={Math.max(300, (closestVolunteer.distanceKm || 1) * 1000)}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            />
          </>
        )}

        {/* SOS Distress Markers */}
        {(alerts || []).map(alert => {
          const isSelected = selectedSOS && selectedSOS.id === alert.id;
          return (
            <Marker
              key={alert.id}
              position={[alert.latitude, alert.longitude]}
              icon={createSOSIcon(alert.priority, alert.status, isSelected)}
              eventHandlers={{
                click: () => onSelectSOS(alert)
              }}
            >
              <Popup className="tactical-popup">
                <div className="popup-body">
                  <div className="popup-header">
                    <span className="popup-priority-badge">{alert.priority} SOS</span>
                    <span className="popup-status">{alert.status}</span>
                  </div>
                  
                  <h4 className="popup-name">{alert.citizenName}</h4>
                  <div className="popup-meta">
                    <Phone className="w-3 h-3 inline mr-1 text-slate-400" />
                    <span>{alert.citizenPhone}</span>
                  </div>
                  
                  <div className="popup-location">
                    <MapPin className="w-3 h-3 inline mr-1 text-red-400" />
                    <span>{alert.locationName}</span>
                  </div>

                  <div className="popup-tags">
                    {(alert.triageTags || []).map((t, idx) => (
                      <span key={idx} className="popup-tag">{t}</span>
                    ))}
                  </div>

                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => onDispatchClosest(alert.id)}
                      className="popup-dispatch-btn"
                    >
                      <Zap className="w-3.5 h-3.5 inline mr-1" />
                      Dispatch Closest Rescuer
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Volunteer Markers */}
        {(volunteers || []).map(vol => {
          const isClosest = closestVolunteer && closestVolunteer.id === vol.id;
          return (
            <Marker
              key={vol.id}
              position={[vol.latitude, vol.longitude]}
              icon={createVolunteerIcon(vol.status, isClosest, vol.callsign)}
            >
              <Popup className="tactical-popup">
                <div className="popup-body">
                  <div className="popup-header volunteer">
                    <span className="popup-callsign">{vol.callsign}</span>
                    <span className="popup-status volunteer">{vol.status}</span>
                  </div>

                  <h4 className="popup-name">{vol.name}</h4>
                  <div className="popup-meta">
                    <span>{vol.role} • </span>
                    <span className="text-emerald-400">{vol.specialization}</span>
                  </div>

                  <div className="popup-battery">
                    <Battery className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
                    <span>Battery: <strong>{vol.battery}%</strong></span>
                  </div>

                  {isClosest && (
                    <div className="closest-announcement">
                      ★ Closest Rescuer ({vol.distanceKm} km, ETA ~{vol.etaMinutes} mins)
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
