import React from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Radio
} from 'lucide-react';

export default function DonezoSidebar({
  currentPath = '/dashboard',
  onNavigate,
  onLogout
}) {
  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'tasks', path: '/tasks', label: 'Tasks', icon: CheckSquare, badge: '12+' },
    { id: 'calendar', path: '/calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'team', path: '/team', label: 'Team', icon: Users },
  ];

  const generalItems = [
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    { id: 'help', path: '/help', label: 'Help', icon: HelpCircle },
    { id: 'logout', path: '#logout', label: 'Logout', icon: LogOut, action: onLogout },
  ];

  return (
    <aside className="donezo-sidebar">
      {/* Brand Header */}
      <div className="donezo-sidebar-brand">
        <div className="donezo-brand-logo-icon">
          {/* Circular double loop SVG logo */}
          <svg viewBox="0 0 32 32" className="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#164E37" strokeWidth="3" />
            <circle cx="16" cy="16" r="8" fill="none" stroke="#38A169" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="3" fill="#164E37" />
          </svg>
        </div>
        <span className="donezo-brand-text">Donezo</span>
      </div>

      {/* Navigation Sections */}
      <div className="donezo-sidebar-nav-wrap">
        {/* MENU Group */}
        <div className="donezo-nav-group">
          <span className="donezo-nav-group-label">MENU</span>
          <div className="donezo-nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.path)}
                  className={`donezo-nav-btn ${isActive ? 'active' : ''}`}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && <div className="donezo-nav-active-indicator" />}

                  <div className="donezo-nav-btn-content">
                    <Icon className="w-5 h-5 donezo-nav-icon" />
                    <span className="donezo-nav-label">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="donezo-nav-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* GENERAL Group */}
        <div className="donezo-nav-group mt-6">
          <span className="donezo-nav-group-label">GENERAL</span>
          <div className="donezo-nav-list">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.id}
                  onClick={item.action || (() => onNavigate(item.path))}
                  className={`donezo-nav-btn ${isActive ? 'active' : ''}`}
                >
                  <div className="donezo-nav-btn-content">
                    <Icon className="w-5 h-5 donezo-nav-icon" />
                    <span className="donezo-nav-label">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Promo: Download Mobile App */}
      <div className="donezo-app-promo-card">
        {/* Abstract wavy lines background */}
        <div className="donezo-app-promo-bg" />

        <div className="donezo-app-promo-inner">
          <div className="donezo-app-promo-icon-badge">
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>

          <h4 className="donezo-app-promo-title">Download our Mobile App</h4>
          <p className="donezo-app-promo-sub">Get easy in another way</p>

          <button
            onClick={() => alert('Opening mobile app download link...')}
            className="donezo-app-promo-btn"
          >
            <span>Download</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
