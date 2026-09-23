import React from 'react';
import {
  LayoutGrid,
  MapPin,
  AlertCircle,
  HeartHandshake,
  Radio,
  Settings,
  FileText,
  LogOut
} from 'lucide-react';

export default function RelayMeshSidebar({
  currentPath = '/dashboard',
  onNavigate,
  onLogout
}) {
  const primaryNavItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Command Center', icon: LayoutGrid },
    { id: 'map', path: '/map', label: 'Live Situation Map', icon: MapPin },
    { id: 'sos', path: '/sos', label: 'Emergency SOS', icon: AlertCircle, badge: '9', isCritical: true },
    { id: 'volunteers', path: '/volunteers', label: 'Rescue Teams', icon: HeartHandshake, badge: '18' },
    { id: 'network', path: '/network', label: 'Mesh Network', icon: Radio, badge: '92%' },
  ];

  const utilityItems = [
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    { id: 'logs', path: '/logs', label: 'System Logs', icon: FileText },
    { id: 'logout', path: '#logout', label: 'Logout', icon: LogOut, action: onLogout },
  ];

  const renderNavList = (items) => (
    <div className="donezo-nav-list">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentPath === item.path ||
          (item.path !== '/dashboard' && currentPath.startsWith(item.path)) ||
          (item.path === '/sos' && currentPath.startsWith('/incidents')) ||
          (item.path === '/volunteers' && (currentPath === '/dispatch' || currentPath === '/resources')) ||
          (item.path === '/network' && (currentPath === '/nodes' || currentPath === '/connectivity'));

        return (
          <button
            key={item.id}
            onClick={item.action || (() => onNavigate(item.path))}
            className={`donezo-nav-btn ${isActive ? 'active' : ''}`}
          >
            {/* Left Active Indicator Bar */}
            {isActive && <div className="donezo-nav-active-indicator" />}

            <div className="donezo-nav-btn-content">
              <Icon className="w-4 h-4 donezo-nav-icon" />
              <span className="donezo-nav-label">{item.label}</span>
            </div>

            {item.badge && (
              <span className={`donezo-nav-badge ${item.isCritical ? 'critical-badge' : ''}`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="donezo-sidebar">
      <div>
        {/* Brand Header */}
        <div className="donezo-sidebar-brand cursor-pointer" onClick={() => onNavigate('/dashboard')}>
          <div className="donezo-brand-logo-icon">
            {/* Triangular RelayMesh Constellation Logo */}
            <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
              <line x1="24" y1="7" x2="8" y2="39" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="24" y1="7" x2="40" y2="39" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="8" y1="39" x2="40" y2="39" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="24" y1="7" x2="24" y2="27" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="8" y1="39" x2="24" y2="27" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="40" y1="39" x2="24" y2="27" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="16" y1="23" x2="32" y2="23" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="7" r="5" fill="#334155" />
              <circle cx="8" cy="39" r="5" fill="#334155" />
              <circle cx="40" cy="39" r="5" fill="#334155" />
              <circle cx="24" cy="27" r="4.2" fill="#334155" />
              <circle cx="16" cy="23" r="3.5" fill="#10B981" />
              <circle cx="32" cy="23" r="3.5" fill="#10B981" />
            </svg>
          </div>
          <div className="donezo-brand-text-wrap">
            <span className="donezo-brand-text">RelayMesh</span>
            <span className="donezo-brand-sub">Disaster Command</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="donezo-sidebar-nav-wrap">
          <div className="donezo-nav-group">
            <span className="donezo-nav-group-label">OPERATIONS</span>
            {renderNavList(primaryNavItems)}
          </div>

          {/* Settings, System Logs & Logout directly below operations */}
          <div className="donezo-nav-group pt-4 mt-3 border-t border-slate-200">
            <span className="donezo-nav-group-label">SYSTEM & PREFERENCES</span>
            {renderNavList(utilityItems)}
          </div>
        </div>
      </div>
    </aside>
  );
}
