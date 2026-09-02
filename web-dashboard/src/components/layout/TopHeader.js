import React, { useState, useEffect } from 'react';
import {
  Clock,
  RotateCcw,
  LogOut,
  Bell
} from 'lucide-react';

export default function TopHeader({
  user,
  onLogout,
  onRefresh,
  isRefreshing,
  systemStatus = 'ONLINE'
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
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="top-header-bar">
      {/* Left Title Group */}
      <div className="top-header-left">
        <div className="flex items-center gap-2">
          <span className="top-brand-title">RelayMesh</span>
          <span className="top-separator">/</span>
          <span className="top-app-title">Emergency Monitoring Center</span>
        </div>
      </div>

      {/* Right Controls & Info */}
      <div className="top-header-right">
        {/* System Connection Status */}
        <div className="system-status-indicator">
          <span className="status-live-dot" />
          <span className="status-live-text">
            {systemStatus === 'ONLINE' ? 'System Status: ONLINE' : 'OFFLINE MODE'}
          </span>
        </div>

        {/* Live Date & Time */}
        <div className="top-clock-widget">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <div className="top-clock-time">{formatTime(time)} <span className="text-[10px] text-blue-600 font-semibold">LST</span></div>
          <div className="top-clock-date">{formatDate(time)}</div>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="top-refresh-btn"
            title="Refresh Monitoring Feeds"
          >
            <RotateCcw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin text-blue-600' : '')} />
          </button>
        )}

        {/* Notifications Icon Button */}
        <div className="top-notif-btn-wrap">
          <button className="top-notif-btn" title="3 New Emergency Notifications">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="top-notif-badge">3</span>
          </button>
        </div>

        {/* Authenticated User Profile */}
        <div className="user-profile-widget">
          <div className="user-avatar-initials">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="user-info-text">
            <div className="user-fullname">{user?.name || 'Administrator'}</div>
            <div className="user-role-line">
              <span className="user-role-badge">{user?.role || 'Administrator'}</span>
              {user?.badgeNumber && <span className="user-badge-num">• {user.badgeNumber}</span>}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="top-logout-btn"
            title="Sign out of Monitoring Center"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
