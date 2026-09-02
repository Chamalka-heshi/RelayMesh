import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  AlertCircle,
  Flame,
  HeartHandshake,
  Truck,
  Package,
  Radio,
  Activity,
  Wifi,
  BarChart3,
  FileText,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  currentPath = '/dashboard',
  onNavigate,
  collapsed,
  onToggleCollapse,
  counts = {}
}) {
  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'REAL-TIME MONITORING',
      items: [
        { path: '/map', label: 'Live Situation Map', icon: MapPin },
        { path: '/sos', label: 'SOS Monitoring', icon: AlertCircle, badge: counts.activeSOS || 24, badgeType: 'danger' },
        { path: '/incidents', label: 'Incident Monitoring', icon: Flame, badge: counts.activeIncidents || 4, badgeType: 'warning' }
      ]
    },
    {
      label: 'RESPONSE OPERATIONS',
      items: [
        { path: '/volunteers', label: 'Volunteer Management', icon: HeartHandshake, badge: counts.activeVolunteers || 47, badgeType: 'success' },
        { path: '/dispatch', label: 'Response Coordination', icon: Truck, badge: counts.pendingDispatches || 2, badgeType: 'info' },
        { path: '/resources', label: 'Resource Management', icon: Package }
      ]
    },
    {
      label: 'NETWORK',
      items: [
        { path: '/nodes', label: 'Mesh Nodes', icon: Radio, badge: counts.activeNodes || 184, badgeType: 'primary' },
        { path: '/network', label: 'Network Health', icon: Activity },
        { path: '/connectivity', label: 'Connectivity', icon: Wifi }
      ]
    },
    {
      label: 'REPORTING',
      items: [
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/reports', label: 'Reports', icon: FileText }
      ]
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { path: '/users', label: 'Users', icon: Users },
        { path: '/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={'sidebar-nav ' + (collapsed ? 'collapsed' : '')}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        {!collapsed && (
          <div className="brand-title-wrap">
            <span className="brand-name">RELAYMESH</span>
            <span className="brand-tagline">Emergency Monitoring</span>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav-sections">
        {navSections.map((section, idx) => (
          <div key={idx} className="nav-section-group">
            {!collapsed && <div className="nav-section-label">{section.label}</div>}
            <div className="nav-items-list">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={'nav-item-btn ' + (isActive ? 'active' : '')}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 nav-item-icon" />
                    {!collapsed && (
                      <span className="nav-item-label">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className={'nav-item-badge ' + (item.badgeType || 'default')}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="sidebar-footer">
        <button
          onClick={onToggleCollapse}
          className="sidebar-collapse-btn"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
