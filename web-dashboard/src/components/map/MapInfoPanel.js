import React from 'react';
import { X, MapPin } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';

export default function MapInfoPanel({ selectedItem, onClose, onNavigate }) {
  if (!selectedItem) return null;

  const { type, data } = selectedItem;

  return (
    <aside className="map-info-drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="flex items-center gap-2">
          <span className="drawer-type-tag">{type?.toUpperCase()} MONITORING</span>
          <span className="drawer-id-text">#{data.id || data.deviceId}</span>
        </div>
        <button onClick={onClose} className="drawer-close-btn" title="Close Panel">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="drawer-scroll-body">
        {/* Type 1: SOS Distress */}
        {type === 'sos' && (
          <div className="drawer-details-content">
            <div className="flex items-center justify-between mb-2">
              <SeverityBadge severity={data.priority} />
              <StatusBadge status={data.status} />
            </div>

            <h3 className="drawer-title">{data.citizenName}</h3>
            <div className="drawer-location-row">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{data.locationName}</span>
            </div>

            <div className="drawer-specs-grid">
              <div className="spec-box">
                <span className="spec-lbl">Phone</span>
                <span className="spec-val font-mono">{data.citizenPhone || 'N/A'}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">RelayMesh Hop Count</span>
                <span className="spec-val font-mono">{data.hopCount} Hops</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Ingestion Node</span>
                <span className="spec-val font-mono text-blue-400">{data.deviceId}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Coordinates</span>
                <span className="spec-val font-mono text-xs">{data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}</span>
              </div>
            </div>

            <div className="drawer-section">
              <span className="drawer-section-title">Emergency Triage Tags</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(data.triageTags || []).map((tag, i) => (
                  <span key={i} className="drawer-triage-tag">{tag}</span>
                ))}
              </div>
            </div>

            {data.notes && (
              <div className="drawer-section">
                <span className="drawer-section-title">Field Notes</span>
                <p className="drawer-notes-text">{data.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Type 2: RelayMesh Node */}
        {type === 'node' && (
          <div className="drawer-details-content">
            <div className="flex items-center justify-between mb-2">
              <span className="node-type-pill">{data.type}</span>
              <StatusBadge status={data.status} />
            </div>

            <h3 className="drawer-title">RelayMesh Node {data.id}</h3>
            <div className="drawer-location-row">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{data.location || 'Monitored Mesh Station'}</span>
            </div>

            <div className="drawer-specs-grid">
              <div className="spec-box">
                <span className="spec-lbl">Battery Status</span>
                <span className="spec-val font-mono text-emerald-400">{data.battery}%</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Messages Handled</span>
                <span className="spec-val font-mono">{data.messagesHandled?.toLocaleString()}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Signal Strength</span>
                <span className="spec-val font-mono">{data.signalDbm || -64} dBm</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Connection State</span>
                <span className="spec-val font-mono text-cyan-400">{data.connectionState || 'MESH_PEER'}</span>
              </div>
            </div>

            <div className="drawer-section">
              <span className="drawer-section-title">Connected Mesh Peers</span>
              <div className="text-xs text-slate-300 mt-1">
                Active P2P links: <strong>{data.peersCount || 8} neighboring nodes</strong>
              </div>
            </div>
          </div>
        )}

        {/* Type 3: Shelter / Resource */}
        {type === 'resource' && (
          <div className="drawer-details-content">
            <div className="flex items-center justify-between mb-2">
              <span className="resource-cat-badge">{data.category?.toUpperCase()}</span>
              <StatusBadge status={data.status} />
            </div>

            <h3 className="drawer-title">{data.name}</h3>
            <p className="drawer-desc-text">{data.description}</p>

            <div className="drawer-specs-grid">
              <div className="spec-box">
                <span className="spec-lbl">Available Capacity</span>
                <span className="spec-val font-mono text-emerald-400">{data.availableCapacity}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Total Capacity</span>
                <span className="spec-val font-mono">{data.capacity}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Contact Hotline</span>
                <span className="spec-val font-mono">{data.contactInfo || 'N/A'}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Verification</span>
                <span className="spec-val text-emerald-400">Verified via Mesh</span>
              </div>
            </div>

            {data.amenities && (
              <div className="drawer-section">
                <span className="drawer-section-title">Amenities & Facilities</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.amenities.split(',').map((a, i) => (
                    <span key={i} className="amenity-pill">{a.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Type 4: Volunteer */}
        {type === 'volunteer' && (
          <div className="drawer-details-content">
            <div className="flex items-center justify-between mb-2">
              <span className="callsign-badge">{data.callsign}</span>
              <StatusBadge status={data.status} />
            </div>

            <h3 className="drawer-title">{data.name}</h3>
            <div className="text-xs text-slate-300 font-semibold mb-2">{data.role}</div>

            <div className="drawer-specs-grid">
              <div className="spec-box">
                <span className="spec-lbl">Specialization</span>
                <span className="spec-val">{data.specialization}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Battery Telemetry</span>
                <span className="spec-val font-mono text-emerald-400">{data.battery}%</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Completed Missions</span>
                <span className="spec-val font-mono">{data.completedMissions || 12}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Phone Contact</span>
                <span className="spec-val font-mono">{data.phone}</span>
              </div>
            </div>

            {data.equipment && (
              <div className="drawer-section">
                <span className="drawer-section-title">Equipment Inventory</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.equipment.map((eq, i) => (
                    <span key={i} className="equipment-pill">{eq}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Type 5: Incident */}
        {type === 'incident' && (
          <div className="drawer-details-content">
            <div className="flex items-center justify-between mb-2">
              <SeverityBadge severity={data.severity} />
              <StatusBadge status={data.status} />
            </div>

            <h3 className="drawer-title">{data.title}</h3>
            <div className="drawer-location-row">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{data.area}</span>
            </div>

            <p className="drawer-desc-text">{data.description}</p>

            <div className="drawer-specs-grid">
              <div className="spec-box">
                <span className="spec-lbl">Active SOS Count</span>
                <span className="spec-val font-mono text-red-400">{data.activeSOSCount}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Affected Population</span>
                <span className="spec-val font-mono text-cyan-400">{data.affectedPopulation}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Responders In Area</span>
                <span className="spec-val font-mono text-emerald-400">{data.activeResponders}</span>
              </div>
              <div className="spec-box">
                <span className="spec-lbl">Incident Started</span>
                <span className="spec-val font-mono">{data.startedAt}</span>
              </div>
            </div>

            {data.criticalNeed && (
              <div className="drawer-section">
                <span className="drawer-section-title">Critical Need / Shortage</span>
                <div className="critical-box">{data.criticalNeed}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
