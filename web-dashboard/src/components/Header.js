import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Radio, 
  Users, 
  MapPin, 
  FileText, 
  PlusCircle, 
  RotateCcw, 
  LogOut, 
  Clock, 
  Activity, 
  Database,
  Bell
} from 'lucide-react';

export default function Header({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onOpenSimulate, 
  onResetScenario, 
  stats,
  unreadCount 
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <header className="command-header">
      {/* Top Bar Branding */}
      <div className="header-left">
        <div className="brand-logo-badge">
          <Shield className="w-6 h-6 text-red-500 animate-pulse" />
          <div className="brand-pulse-ring"></div>
        </div>

        <div className="brand-text">
          <div className="flex items-center gap-2">
            <span className="brand-title">RELAYMESH CENTRAL COMMAND</span>
            <span className="live-pill">
              <span className="live-dot"></span>
              DISPATCH LIVE
            </span>
          </div>
          <div className="brand-subtitle">
            National Disaster Management Division • Mesh Response Hub
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div className="header-center">
        <nav className="nav-tabs">
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`nav-tab-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Tactical Map & Dispatch</span>
            {stats && stats.activeAlerts > 0 && (
              <span className="tab-counter-badge alert">{stats.activeAlerts}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('volunteers')}
            className={`nav-tab-btn ${activeTab === 'volunteers' ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>Connected Volunteers</span>
            {stats && (
              <span className="tab-counter-badge success">{stats.availableVolunteers || 0}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <FileText className="w-4 h-4" />
            <span>Dispatch Logs & Notifications</span>
            {unreadCount > 0 && (
              <span className="tab-counter-badge">{unreadCount}</span>
            )}
          </button>
        </nav>
      </div>

      {/* Right Controls & User Info */}
      <div className="header-right">
        {/* Live Clock */}
        <div className="clock-widget">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <div className="clock-time">{formatTime(time)} <span className="clock-tz">LST</span></div>
          <div className="clock-date">{formatDate(time)}</div>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          <button
            onClick={onOpenSimulate}
            className="action-btn-primary"
            title="Simulate incoming SOS mesh beacon"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate SOS</span>
          </button>

          <button
            onClick={onResetScenario}
            className="action-btn-secondary"
            title="Reset scenario data to default demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Operator Badge */}
        <div className="operator-profile">
          <div className="operator-avatar">
            {user?.name ? user.name.charAt(0) : 'O'}
          </div>
          <div className="operator-info">
            <div className="operator-name">{user?.name || 'Central Operator'}</div>
            <div className="operator-meta">
              <span className="operator-badge">{user?.badgeNumber || 'DM-9041'}</span>
              <span className="operator-role">{user?.role || 'Dispatcher'}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="logout-btn"
            title="Sign out of Central Division"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
