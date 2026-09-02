import React from 'react';
import { Mail, Bell } from 'lucide-react';

export default function RelayMeshTopHeader({ user, onLogout }) {
  return (
    <header className="donezo-top-header">
      {/* Left Section: Offline. Connected. Together. Badge */}
      <div className="donezo-header-left-section">
        <div className="donezo-slogan-pill">
          <span className="donezo-slogan-dot" />
          <span className="donezo-slogan-text">Offline. Connected. Together.</span>
        </div>
      </div>

      {/* Right Actions: Mail, Notifications & User Profile */}
      <div className="donezo-header-right">
        {/* Messages Button */}
        <button className="donezo-header-icon-btn" title="Field Communications">
          <Mail className="w-4 h-4 text-slate-600" />
        </button>

        {/* Notifications Button */}
        <button className="donezo-header-icon-btn relative" title="3 Active SOS Beacons">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile Capsule */}
        <div className="donezo-user-capsule" onClick={onLogout} title="Click to log out">
          <div className="donezo-user-avatar">
            <span className="text-xl">👨🏽‍💼</span>
          </div>
          <div className="donezo-user-meta">
            <span className="donezo-user-name">{user?.name || 'Operator Ananya Perera'}</span>
            <span className="donezo-user-email">{user?.email || 'dispatcher@relaymesh.org'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
