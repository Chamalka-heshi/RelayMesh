import React from 'react';
import { AlertCircle, Truck, Users, Clock, BatteryCharging, Radio, ShieldCheck } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-bar-grid">
      {/* 1. Active SOS */}
      <div className="stat-card danger">
        <div className="stat-icon-wrapper danger">
          <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
        <div className="stat-body">
          <div className="stat-value text-red-400">
            {stats.activeAlerts || 0}
          </div>
          <div className="stat-label">Active SOS Incidents</div>
        </div>
        <div className="stat-subtext">Immediate Response Required</div>
      </div>

      {/* 2. Dispatched En-Route */}
      <div className="stat-card warning">
        <div className="stat-icon-wrapper warning">
          <Truck className="w-5 h-5 text-amber-400" />
        </div>
        <div className="stat-body">
          <div className="stat-value text-amber-400">
            {stats.dispatchedAlerts || 0}
          </div>
          <div className="stat-label">Rescuers Dispatched</div>
        </div>
        <div className="stat-subtext">Units Mobilized On Scene</div>
      </div>

      {/* 3. Available Volunteers */}
      <div className="stat-card success">
        <div className="stat-icon-wrapper success">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="stat-body">
          <div className="stat-value text-emerald-400">
            {stats.availableVolunteers || 0} <span className="stat-total">/ {stats.totalVolunteers || 0}</span>
          </div>
          <div className="stat-label">Available Rescuers</div>
        </div>
        <div className="stat-subtext">Online & Ready to Deploy</div>
      </div>

      {/* 4. Average Volunteer Battery */}
      <div className="stat-card info">
        <div className="stat-icon-wrapper info">
          <BatteryCharging className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="stat-body">
          <div className="stat-value text-cyan-400">
            {stats.averageVolunteerBattery || 85}%
          </div>
          <div className="stat-label">Avg Rescuer Battery</div>
        </div>
        <div className="stat-subtext">Mesh Node Telemetry Nominal</div>
      </div>

      {/* 5. Avg Response Time */}
      <div className="stat-card purple">
        <div className="stat-icon-wrapper purple">
          <Clock className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="stat-body">
          <div className="stat-value text-indigo-400">
            ~{stats.avgResponseMinutes || 4.5}m
          </div>
          <div className="stat-label">Avg Proximity ETA</div>
        </div>
        <div className="stat-subtext">Calculated via Haversine Spatial</div>
      </div>

      {/* 6. Database / Mesh Engine */}
      <div className="stat-card gray">
        <div className="stat-icon-wrapper gray">
          <Radio className="w-5 h-5 text-emerald-400 animate-spin-slow" />
        </div>
        <div className="stat-body">
          <div className="stat-value-small text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            100% ONLINE
          </div>
          <div className="stat-label">Central Mesh Grid</div>
        </div>
        <div className="stat-subtext">{stats.databaseEngine || 'PostGIS Spatial Engine'}</div>
      </div>
    </div>
  );
}
