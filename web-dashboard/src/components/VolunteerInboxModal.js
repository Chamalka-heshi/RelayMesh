import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Shield, 
  Bell, 
  Clock, 
  MapPin, 
  CheckCheck, 
  AlertTriangle, 
  Send, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import api from '../services/api';

export default function VolunteerInboxModal({ volunteer, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!volunteer) return;
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res = await api.getVolunteerNotifications(volunteer.id);
        if (res.success) {
          setNotifications(res.data);
        }
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [volunteer]);

  if (!volunteer) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container terminal-modal">
        {/* Modal Top Bar */}
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="terminal-title">RESCUER MOBILE TERMINAL FEED</h3>
              <p className="terminal-subtitle">
                Device: <strong>{volunteer.name}</strong> ({volunteer.callsign}) • ID: {volunteer.id}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Terminal Phone Frame */}
        <div className="terminal-body">
          <div className="phone-screen-container">
            {/* Phone Top Notch & Status */}
            <div className="phone-top-bar">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>RELAYMESH v2.4 • 100% SIGNAL</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                BATTERY: {volunteer.battery}%
              </div>
            </div>

            {/* Notification Stream */}
            <div className="phone-notifications-feed">
              <div className="feed-announcement">
                <Shield className="w-4 h-4 text-emerald-400 inline mr-1" />
                <span>Encrypted Central Division Dispatch Channel</span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Loading volunteer message logs...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <Bell className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  No dispatch alerts received yet on this terminal.
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  const isClosestAlert = (notif.title || '').includes('CLOSEST') || (notif.message || '').includes('most closest');

                  return (
                    <div 
                      key={notif.id || idx} 
                      className={`terminal-notification-card ${isClosestAlert ? 'closest-highlight' : ''}`}
                    >
                      <div className="notif-header">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          {isClosestAlert ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                              <span className="text-yellow-300">🚨 PRIORITY DISPATCH ALERT</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-cyan-300">{notif.title || 'DISPATCH MESSAGE'}</span>
                            </>
                          )}
                        </div>

                        <span className="notif-time">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Notification Message Content */}
                      <div className="notif-message-body">
                        {notif.message}
                      </div>

                      {/* Notification Footer */}
                      <div className="notif-footer">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Acknowledged & Logged by Central Division</span>
                        </div>
                        <span className="sos-ref-tag">Ref: #{notif.sosId}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="terminal-modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Close Terminal View
          </button>
        </div>
      </div>
    </div>
  );
}
