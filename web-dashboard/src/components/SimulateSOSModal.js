import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  MapPin, 
  Phone, 
  User, 
  Flame, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import api from '../services/api';

export default function SimulateSOSModal({ isOpen, onClose, onCreated }) {
  const [citizenName, setCitizenName] = useState('Nimal Warnakulasuriya');
  const [citizenPhone, setCitizenPhone] = useState('+94 77 412 9988');
  const [locationName, setLocationName] = useState('Fort Railway Station Area, Colombo 01');
  const [latitude, setLatitude] = useState(6.9344);
  const [longitude, setLongitude] = useState(79.8500);
  const [priority, setPriority] = useState('CRITICAL');
  const [hopCount, setHopCount] = useState(2);
  const [selectedTags, setSelectedTags] = useState(['Trapped in Building', 'Medical Aid Needed']);
  const [notes, setNotes] = useState('Emergency simulation distress signal broadcasted via mesh gateway.');
  const [loading, setLoading] = useState(false);

  const availableTags = [
    'Trapped in Flood',
    'Trapped in Building',
    'Medical Aid Needed',
    'Severe Bleeding',
    'Elderly Person',
    'Child in Danger',
    'Structural Collapse',
    'Power Outage / Oxygen Needed',
    'Fire / Smoke Hazard',
    'Clean Water Exhausted'
  ];

  const presets = [
    {
      title: '🌊 Pettah High Flood Water',
      name: 'Chamari Gunaratne',
      phone: '+94 71 555 1234',
      loc: 'Pettah Market 2nd Cross Street, Colombo 11',
      lat: 6.9360,
      lon: 79.8580,
      priority: 'CRITICAL',
      tags: ['Trapped in Flood', 'Elderly Person'],
      hops: 2
    },
    {
      title: '💥 Maradana Structural Wall Collapse',
      name: 'Sunil Jayatissa',
      phone: '+94 77 888 4321',
      loc: 'Maradana Road, Colombo 10',
      lat: 6.9280,
      lon: 79.8700,
      priority: 'CRITICAL',
      tags: ['Structural Collapse', 'Severe Bleeding', 'Medical Aid Needed'],
      hops: 3
    },
    {
      title: '⚡ Kollupitiya Emergency Evacuation',
      name: 'Ramesh Senaratne',
      phone: '+94 76 999 0011',
      loc: 'Kollupitiya Coastal Strip, Colombo 03',
      lat: 6.9110,
      lon: 79.8510,
      priority: 'HIGH',
      tags: ['Child in Danger', 'Clean Water Exhausted'],
      hops: 1
    }
  ];

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const applyPreset = (p) => {
    setCitizenName(p.name);
    setCitizenPhone(p.phone);
    setLocationName(p.loc);
    setLatitude(p.lat);
    setLongitude(p.lon);
    setPriority(p.priority);
    setSelectedTags(p.tags);
    setHopCount(p.hops);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        citizenName,
        citizenPhone,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        priority,
        hopCount: parseInt(hopCount, 10),
        triageTags: selectedTags.length > 0 ? selectedTags : ['Urgent Rescue'],
        notes,
        deviceId: `NODE-SIM-${Math.floor(1000 + Math.random() * 9000)}`
      };

      const res = await api.createSOS(payload);
      if (res.success) {
        onCreated(res.data);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create simulation SOS', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container simulate-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="modal-header-icon">
              <PlusCircle className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <h3 className="modal-title">SIMULATE CITIZEN SOS DISTRESS SIGNAL</h3>
              <p className="modal-subtitle">Inject emergency packet into Central Mesh Ingestion API</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Quick Presets */}
          <div className="presets-section">
            <span className="text-xs font-bold text-slate-300 mb-1.5 block">
              Quick Emergency Scenario Presets:
            </span>
            <div className="presets-row">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="preset-btn"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <User className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Citizen Name
              </label>
              <input
                type="text"
                className="form-input"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Citizen Contact Phone
              </label>
              <input
                type="text"
                className="form-input"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-red-400" />
              Incident Location Landmark / Address
            </label>
            <input
              type="text"
              className="form-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Latitude (GPS)</label>
              <input
                type="number"
                step="0.0001"
                className="form-input font-mono"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude (GPS)</label>
              <input
                type="number"
                step="0.0001"
                className="form-input font-mono"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority Urgency</label>
              <select
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="CRITICAL">🔴 CRITICAL</option>
                <option value="HIGH">🟠 HIGH</option>
                <option value="MODERATE">🟡 MODERATE</option>
              </select>
            </div>
          </div>

          {/* Triage Tag Selector */}
          <div className="form-group">
            <label className="form-label">Triage & Needs Tags:</label>
            <div className="triage-selector-grid">
              {availableTags.map((tag, idx) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`tag-toggle-btn ${active ? 'active' : ''}`}
                  >
                    {active ? '✓ ' : '+ '} {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-danger-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  Broadcasting SOS to Mesh...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Broadcast & Ingest Emergency SOS</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
