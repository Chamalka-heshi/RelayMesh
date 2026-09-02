import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Truck, 
  Clock, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  MessageSquare, 
  Search,
  Sparkles,
  Radio
} from 'lucide-react';
import api from '../services/api';

export default function DispatchHistoryView({ assignments, volunteers, alerts }) {
  const [search, setSearch] = useState('');

  const getVolunteerName = (volId) => {
    const vol = (volunteers || []).find(v => v.id === volId);
    return vol ? `${vol.name} (${vol.callsign})` : volId;
  };

  const getSOSDetails = (sosId) => {
    const sos = (alerts || []).find(a => a.id === sosId);
    return sos ? { name: sos.citizenName, loc: sos.locationName, priority: sos.priority } : null;
  };

  const filtered = (assignments || []).filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const volName = getVolunteerName(item.volunteerId).toLowerCase();
    const msg = (item.messageSent || '').toLowerCase();
    const dispName = (item.dispatcherName || '').toLowerCase();
    return volName.includes(q) || msg.includes(q) || dispName.includes(q);
  });

  return (
    <div className="dispatch-history-container">
      {/* Header */}
      <div className="history-header">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            DISPATCH ASSIGNMENTS & NOTIFICATION AUDIT LOG
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically Verified Dispatch Records, Spatial Routes & Delivered Rescuer Messages
          </p>
        </div>

        <div className="search-box">
          <Search className="w-3.5 h-3.5 search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search dispatch logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="history-table-wrapper">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
            No dispatch records matching search criteria.
          </div>
        ) : (
          <div className="history-cards-list">
            {filtered.map(item => {
              const volName = getVolunteerName(item.volunteerId);
              const sos = getSOSDetails(item.sosId);
              const isClosest = (item.messageSent || '').includes('most closest');

              return (
                <div key={item.id} className="history-record-card">
                  {/* Top Line: ID, Dispatcher, Timestamp */}
                  <div className="record-header">
                    <div className="flex items-center gap-2">
                      <span className="record-id-badge">#{item.id}</span>
                      {isClosest && (
                        <span className="closest-dispatch-tag">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          CLOSEST RESCUER AUTO-ROUTED
                        </span>
                      )}
                      <span className="record-status-pill">
                        <Truck className="w-3 h-3 inline mr-1" />
                        {item.status || 'EN_ROUTE'}
                      </span>
                    </div>

                    <div className="record-timestamp">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(item.dispatchedAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Dispatcher and Rescuer Meta */}
                  <div className="record-meta-row">
                    <div className="meta-block">
                      <span className="meta-label">Dispatched Volunteer:</span>
                      <span className="meta-value font-bold text-emerald-400">{volName}</span>
                    </div>

                    <div className="meta-block">
                      <span className="meta-label">Incident Target:</span>
                      <span className="meta-value text-slate-200">
                        {sos ? `${sos.name} • ${sos.loc}` : item.sosId}
                      </span>
                    </div>

                    <div className="meta-block">
                      <span className="meta-label">Distance / ETA:</span>
                      <span className="meta-value font-mono text-cyan-400">
                        {item.distanceKm} km (~{item.etaMinutes} mins)
                      </span>
                    </div>

                    <div className="meta-block">
                      <span className="meta-label">Authorized Dispatcher:</span>
                      <span className="meta-value text-slate-300">{item.dispatcherName}</span>
                    </div>
                  </div>

                  {/* Delivered Message */}
                  <div className="record-message-box">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                      <span>Delivered Terminal Alert Message:</span>
                    </div>
                    <div className="record-message-text">
                      "{item.messageSent}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
