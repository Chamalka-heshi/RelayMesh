import React from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';

export default function UsersPage({ onNavigate }) {
  const users = [
    { id: 'ADM-001', name: 'Cmdr. Sarath Wickramasinghe', email: 'admin@relaymesh.org', role: 'Central Division Director', badge: 'DM-9041', status: 'ACTIVE', lastActive: '4m ago' },
    { id: 'ADM-002', name: 'Operator Ananya Perera', email: 'dispatcher@relaymesh.org', role: 'Emergency Dispatch Officer', badge: 'DP-3120', status: 'ACTIVE', lastActive: 'Just now' },
    { id: 'ADM-003', name: 'Capt. Dinesh Fernando', email: 'sar.lead@relaymesh.org', role: 'Search & Rescue Coordinator', badge: 'SR-7714', status: 'ACTIVE', lastActive: '12m ago' },
    { id: 'VOL-001', name: 'Sanjeewa Kumara', email: 'sanjeewa.k@volunteers.relaymesh.org', role: 'Field Volunteer Lead', badge: 'VOL-ALPHA', status: 'ACTIVE', lastActive: '2m ago' },
    { id: 'VOL-002', name: 'Dr. Niluka Jayasuriya', email: 'niluka.j@volunteers.relaymesh.org', role: 'Emergency Medical Officer', badge: 'MED-BRAVO', status: 'ACTIVE', lastActive: '7m ago' }
  ];

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">User & Operator Administration</h1>
          <p className="donezo-page-subtitle">
            Authorized central division personnel, dispatch commanders & field volunteer accounts.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => alert('New operator invitation modal')}
            className="donezo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Operator</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Metrics */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Active Operators */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Active Operators</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">5</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">Cleared</span>
            <span>Central division users</span>
          </div>
        </div>

        {/* Card 2: Command Clearance */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Command Clearance</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">3</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-blue-100 text-blue-700">Director</span>
            <span>Director & Dispatch leads</span>
          </div>
        </div>

        {/* Card 3: Auth Security */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Authentication System</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">Supabase</div>
          <div className="donezo-kpi-status-text">
            <span>PostgreSQL RLS Active</span>
          </div>
        </div>
      </div>

      {/* Main Users Table Card */}
      <div className="donezo-table-card">
        <div className="donezo-table-header-bar">
          <div>
            <h3 className="donezo-table-title">Authorized Personnel Registry</h3>
            <p className="donezo-table-sub">Role-based access control (RBAC) cleared accounts</p>
          </div>
          <span className="donezo-table-tag-live">
            ● Supabase Auth Synchronized
          </span>
        </div>

        <div className="donezo-table-wrap">
          <table className="donezo-table">
            <thead>
              <tr>
                <th>Operator ID</th>
                <th>Full Name & Email</th>
                <th>Assigned Role</th>
                <th>Badge ID</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="donezo-chip-id">
                      #{u.id}
                    </span>
                  </td>
                  <td>
                    <div className="donezo-person-cell">
                      <span className="donezo-person-name">{u.name}</span>
                      <span className="donezo-person-meta">{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-slate-800 text-xs">{u.role}</span>
                  </td>
                  <td>
                    <span className="donezo-chip-id" style={{ color: 'var(--donezo-forest)' }}>
                      {u.badge}
                    </span>
                  </td>
                  <td>
                    <span className="donezo-badge-status status-resolved">
                      ● {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="text-xs font-mono text-slate-500">{u.lastActive}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
