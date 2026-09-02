import React from 'react';
import {
  LayoutGrid,
  MapPin,
  AlertCircle,
  Flame,
  HeartHandshake,
  Truck,
  Package,
  Radio,
  Activity,
  Settings,
  FileText,
  LogOut
} from 'lucide-react';

export default function RelayMeshSidebar({
  currentPath = '/dashboard',
  onNavigate,
  onLogout
}) {
  const monitoringItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'map', path: '/map', label: 'Live Map', icon: MapPin },
    { id: 'sos', path: '/sos', label: 'SOS Alerts', icon: AlertCircle, badge: '24' },
    { id: 'incidents', path: '/incidents', label: 'Incidents', icon: Flame, badge: '4' },
  ];

  const operationsItems = [
    { id: 'volunteers', path: '/volunteers', label: 'Volunteers', icon: HeartHandshake, badge: '47' },
    { id: 'dispatch', path: '/dispatch', label: 'Dispatch', icon: Truck, badge: '2' },
    { id: 'resources', path: '/resources', label: 'Resources', icon: Package },
  ];

  const networkItems = [
    { id: 'nodes', path: '/nodes', label: 'Mesh Nodes', icon: Radio, badge: '184' },
    { id: 'network', path: '/network', label: 'Network Health', icon: Activity },
  ];

  const generalItems = [
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    { id: 'logs', path: '/logs', label: 'System Logs', icon: FileText },
    { id: 'logout', path: '#logout', label: 'Logout', icon: LogOut, action: onLogout },
  ];

  const renderNavList = (items) => (
    <div className="donezo-nav-list">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

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
              <span className="donezo-nav-badge">{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="donezo-sidebar">
      {/* Brand Header */}
      <div className="donezo-sidebar-brand cursor-pointer" onClick={() => onNavigate('/dashboard')}>
        <div className="donezo-brand-logo-icon">
          {/* Triangular RelayMesh Constellation Logo in Dark Green */}
          <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
            {/* Outer Triangle Lines */}
            <line x1="24" y1="7" x2="8" y2="39" stroke="#164E37" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="24" y1="7" x2="40" y2="39" stroke="#164E37" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="8" y1="39" x2="40" y2="39" stroke="#164E37" strokeWidth="2.8" strokeLinecap="round" />
            {/* Internal Mesh Lines */}
            <line x1="24" y1="7" x2="24" y2="27" stroke="#164E37" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="8" y1="39" x2="24" y2="27" stroke="#164E37" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="40" y1="39" x2="24" y2="27" stroke="#164E37" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="16" y1="23" x2="32" y2="23" stroke="#227A54" strokeWidth="2" strokeLinecap="round" />
            {/* Node Vertices */}
            <circle cx="24" cy="7" r="5" fill="#164E37" />
            <circle cx="8" cy="39" r="5" fill="#164E37" />
            <circle cx="40" cy="39" r="5" fill="#164E37" />
            <circle cx="24" cy="27" r="4.2" fill="#164E37" />
            <circle cx="16" cy="23" r="3.5" fill="#227A54" />
            <circle cx="32" cy="23" r="3.5" fill="#227A54" />
          </svg>
        </div>
        <span className="donezo-brand-text">RelayMesh</span>
      </div>

      {/* Navigation Sections */}
      <div className="donezo-sidebar-nav-wrap">
        {/* MONITORING Group */}
        <div className="donezo-nav-group">
          <span className="donezo-nav-group-label">MONITORING</span>
          {renderNavList(monitoringItems)}
        </div>

        {/* OPERATIONS Group */}
        <div className="donezo-nav-group mt-5">
          <span className="donezo-nav-group-label">OPERATIONS</span>
          {renderNavList(operationsItems)}
        </div>

        {/* NETWORK Group */}
        <div className="donezo-nav-group mt-5">
          <span className="donezo-nav-group-label">NETWORK</span>
          {renderNavList(networkItems)}
        </div>

        {/* GENERAL Group */}
        <div className="donezo-nav-group mt-5">
          <span className="donezo-nav-group-label">GENERAL</span>
          {renderNavList(generalItems)}
        </div>
      </div>
    </aside>
  );
}
