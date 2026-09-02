import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowUpRight,
  Plus,
  Flame,
  Package,
  Radio,
  AlertTriangle,
  Home,
  RotateCcw,
  Truck
} from 'lucide-react';
import api from '../../services/api';

export default function RelayMeshCommandDashboard({ onNavigate }) {
  // Live Data State
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Action Modal State
  const [modalType, setModalType] = useState(null); // 'dispatch', 'newIncident', 'syncData', 'startComms'

  const fetchOverview = useCallback(async () => {
    try {
      const res = await api.getDashboardOverview();
      if (res && res.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error('Error fetching overview:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 8000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  const metrics = data?.metrics || {
    activeSOS: 24,
    activeIncidents: 4,
    criticalIncidents: 2,
    activeNodes: 184,
    networkAvailability: 91,
    activeVolunteers: 47,
    availableResources: 126,
    availableShelterCapacity: 1240
  };

  // Critical Incidents List (Project Task style)
  const criticalIncidents = [
    {
      id: 'INC-101',
      title: 'Sector 4 Flash Flood & Road Submersion',
      dueDate: 'Status: 17 SOS Beacons Active',
      icon: Flame,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      badge: 'Critical',
      actionPath: '/incidents',
    },
    {
      id: 'INC-102',
      title: 'Central Evacuation Shelter Medical Depletion',
      dueDate: 'Due: 45m (Insulin & Trauma Kits)',
      icon: Package,
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      badge: 'High Priority',
      actionPath: '/resources',
    },
    {
      id: 'INC-103',
      title: 'Hill Relay Node RM-84F2 Battery Depletion',
      dueDate: 'Status: Battery 12% • Solar Offline',
      icon: Radio,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      badge: 'Mesh Health',
      actionPath: '/nodes',
    },
    {
      id: 'INC-104',
      title: 'Evacuation Route 2 Tree Fall Obstruction',
      dueDate: 'Status: Main St Blocked (Bypass Ready)',
      icon: AlertTriangle,
      iconBg: '#FFEDD5',
      iconColor: '#EA580C',
      badge: 'Hazard',
      actionPath: '/map',
    },
    {
      id: 'INC-105',
      title: 'Shelter Alpha Bed Capacity Approaching 90%',
      dueDate: 'Capacity: 1,240 / 1,400 Beds Occupied',
      icon: Home,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      badge: 'Shelter',
      actionPath: '/resources',
    },
  ];

  // Active Volunteer Responders (Team Collaboration style)
  const activeVolunteersList = [
    {
      id: 1,
      name: 'Dr. Alexandra Deff',
      task: 'Lead Medical Responder • Sector 4 Relief Camp',
      status: 'Deployed',
      statusType: 'completed',
      avatarBg: '#FCA5A5',
      emoji: '👩‍⚕️',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      task: 'Boat Rescue Unit Alpha • Riverside Flood Zone',
      status: 'En Route',
      statusType: 'in-progress',
      avatarBg: '#86EFAC',
      emoji: '👨‍🚒',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      task: 'Mesh Network Technician • Hill Solar Tower',
      status: 'On Standby',
      statusType: 'pending',
      avatarBg: '#93C5FD',
      emoji: '👨‍🔧',
    },
    {
      id: 4,
      name: 'David Oshodi',
      task: 'Logistics Coordinator • Central Supply Depot',
      status: 'Deployed',
      statusType: 'in-progress',
      avatarBg: '#FDE047',
      emoji: '👨‍💼',
    },
  ];

  return (
    <div className="donezo-dashboard-wrapper">
      {/* SVG Definitions for Diagonal Striped Patterns & Gradients */}
      <svg width="0" height="0" className="absolute hidden">
        <defs>
          <pattern id="diagonalStripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#D1D5DB" strokeWidth="2.5" />
          </pattern>
          <pattern id="gaugeStripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#9CA3AF" strokeWidth="2" />
          </pattern>
        </defs>
      </svg>

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Dashboard</h1>
          <p className="donezo-page-subtitle">
            Real-time disaster telemetry, peer-to-peer mesh routing & emergency operations.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => setModalType('dispatch')}
            className="donezo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Responders</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchOverview();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Mesh Data'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards (Matching uploaded image layout) */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active SOS Distress (Featured Solid Deep Forest Green Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-featured cursor-pointer"
          onClick={() => onNavigate('/sos')}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active SOS Distress</span>
            <button className="donezo-kpi-arrow-circle" title="View live SOS beacons">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">{metrics.activeSOS}</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">3 ▵</span>
            <span>Live beacons in last 10m</span>
          </div>
        </div>

        {/* Card 2: Critical Incidents (White Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-white cursor-pointer"
          onClick={() => onNavigate('/incidents')}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Incidents</span>
            <button className="donezo-kpi-arrow-outline" title="View incidents">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">{metrics.activeIncidents}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light">{metrics.criticalIncidents || 2} ▵</span>
            <span>High severity life-safety zones</span>
          </div>
        </div>

        {/* Card 3: Mesh Network Nodes (White Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-white cursor-pointer"
          onClick={() => onNavigate('/nodes')}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Mesh Network Nodes</span>
            <button className="donezo-kpi-arrow-outline" title="View mesh nodes">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">{metrics.activeNodes}</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light">{metrics.networkAvailability || 91}%</span>
            <span>Nominal relay availability</span>
          </div>
        </div>

        {/* Card 4: Active Volunteers (White Card) */}
        <div
          className="donezo-kpi-card donezo-kpi-white cursor-pointer"
          onClick={() => onNavigate('/volunteers')}
        >
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Volunteers</span>
            <button className="donezo-kpi-arrow-outline" title="View volunteer corps">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">{metrics.activeVolunteers}</div>
          <div className="donezo-kpi-status-text">
            <span>Operating in Field</span>
          </div>
        </div>
      </div>

      {/* Operations Row 1: Priority Emergency Operations & Active Missions */}
      <div className="donezo-cards-grid-2">
        {/* Card 1: Priority Operations Action Banner */}
        <div className="donezo-card donezo-reminders-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Priority Operations</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>

          <div className="donezo-reminder-body">
            <div>
              <span className="inline-block text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-1">
                Active Incident Alert
              </span>
              <h4 className="donezo-reminder-event">Sector 4 Bridge Flash Flood</h4>
              <p className="donezo-reminder-time">Time : 02.15 pm • 17 Citizens Triaged</p>
              <p className="text-xs text-slate-500 mt-2">
                Bridge road submerged (1.5m depth). Rescue Boat Unit Alpha deployed with satellite uplink.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/dispatch')}
              className="donezo-btn-meeting"
            >
              <Truck className="w-4 h-4" />
              <span>Coordinate Response</span>
            </button>
          </div>
        </div>

        {/* Card 2: Critical Incidents / Active Missions */}
        <div className="donezo-card donezo-project-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Active Missions</h3>
            <button
              onClick={() => onNavigate('/incidents')}
              className="donezo-btn-small-outline"
            >
              <Plus className="w-3 h-3" />
              <span>View All</span>
            </button>
          </div>

          <div className="donezo-project-list">
            {criticalIncidents.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="donezo-project-item cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                  onClick={() => onNavigate(item.actionPath)}
                >
                  <div
                    className="donezo-project-icon-box"
                    style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="donezo-project-info flex-1 min-w-0">
                    <div className="donezo-project-name truncate">{item.title}</div>
                    <div className="donezo-project-due">{item.dueDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operations Row 2: Field Volunteers & Shelter Capacity */}
      <div className="donezo-cards-grid-2" style={{ marginTop: '1.15rem' }}>
        {/* Card 3: Volunteer Corps */}
        <div className="donezo-card donezo-team-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Active Responders</h3>
            <button
              onClick={() => onNavigate('/volunteers')}
              className="donezo-btn-small-outline"
            >
              <Plus className="w-3 h-3" />
              <span>Dispatch</span>
            </button>
          </div>

          <div className="donezo-team-list">
            {activeVolunteersList.map((m) => (
              <div
                key={m.id}
                className="donezo-team-item cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors"
                onClick={() => onNavigate('/volunteers')}
              >
                <div className="donezo-team-avatar" style={{ backgroundColor: m.avatarBg }}>
                  <span className="donezo-avatar-emoji">{m.emoji}</span>
                </div>
                <div className="donezo-team-info">
                  <div className="donezo-team-name">{m.name}</div>
                  <div className="donezo-team-task">{m.task}</div>
                </div>
                <div className={`donezo-status-badge badge-${m.statusType}`}>
                  {m.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Shelter & Supply Capacity (Semi-Circular Donut Gauge) */}
        <div className="donezo-card donezo-progress-card">
          <div className="donezo-card-header flex items-center justify-between">
            <h3 className="donezo-card-title">Shelter Capacity</h3>
            <span className="text-xs font-bold text-slate-500">1,240 / 1,700 Beds</span>
          </div>

          <div className="donezo-gauge-container">
            <div className="donezo-gauge-svg-wrap">
              <svg viewBox="0 0 200 115" className="donezo-gauge-svg">
                {/* Background Track Arc (Semi Circle) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Striped Arc for Available Beds */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke="url(#gaugeStripes)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Occupied In Progress Arc (Deep Forest Green) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 145 40"
                  fill="none"
                  stroke="#164E37"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Verified Beds Arc (Mint Green) */}
                <path
                  d="M 25 105 A 75 75 0 0 1 80 45"
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
              </svg>

              {/* Gauge Center Text */}
              <div className="donezo-gauge-center-text">
                <span className="donezo-gauge-percent">73%</span>
                <span className="donezo-gauge-sub">Beds Occupied</span>
              </div>
            </div>

            {/* Gauge Legends */}
            <div className="donezo-gauge-legends">
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot bg-emerald-500" />
                <span>Occupied</span>
              </div>
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot bg-emerald-900" />
                <span>Reserved</span>
              </div>
              <div className="donezo-legend-item">
                <span className="donezo-legend-dot donezo-dot-striped" />
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Emergency Operations */}
      {modalType && (
        <div className="donezo-modal-overlay" onClick={() => setModalType(null)}>
          <div className="donezo-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              {modalType === 'dispatch' && 'Deploy Field Responder Unit'}
              {modalType === 'syncData' && 'Mesh Node Data Synchronization'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {modalType === 'dispatch'
                ? 'Assign volunteers and vehicles to active emergency sectors.'
                : 'Synchronizing store-and-forward mesh buffers across local BLE radios.'}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Emergency Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4 Kelani Flood Basin"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-700"
                  defaultValue="Sector 4 Kelani Flood Basin"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Volunteer Unit</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-700 bg-white">
                  <option>Boat Rescue Unit Alpha (Edwin Adenike)</option>
                  <option>Medical Triage Team 1 (Dr. Alexandra Deff)</option>
                  <option>Mesh Logistics Depot (David Oshodi)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Deployment order broadcast across RelayMesh P2P network!');
                  setModalType(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#164E37] text-white text-sm font-bold hover:bg-[#0E3B27]"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
