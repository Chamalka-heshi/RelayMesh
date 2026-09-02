import React, { useState } from 'react';
import { Search, Mail, Bell } from 'lucide-react';

export default function DonezoTopHeader({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="donezo-top-header">
      {/* Search Input Bar */}
      <div className="donezo-search-container">
        <Search className="w-4 h-4 text-slate-400 donezo-search-icon" />
        <input
          type="text"
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="donezo-search-input"
        />
        <div className="donezo-search-shortcut">
          <span>⌘F</span>
        </div>
      </div>

      {/* Right Actions: Mail, Notifications & User Profile */}
      <div className="donezo-header-right">
        {/* Messages Button */}
        <button className="donezo-header-icon-btn" title="Messages">
          <Mail className="w-4 h-4 text-slate-600" />
        </button>

        {/* Notifications Button */}
        <button className="donezo-header-icon-btn" title="Notifications">
          <Bell className="w-4 h-4 text-slate-600" />
        </button>

        {/* User Profile Capsule */}
        <div className="donezo-user-capsule" onClick={onLogout} title="Click to log out">
          <div className="donezo-user-avatar">
            {/* Memoji Avatar with warm peach skin and brown curls */}
            <span className="text-xl">👨🏽‍💼</span>
          </div>
          <div className="donezo-user-meta">
            <span className="donezo-user-name">{user?.name || 'Totok Michael'}</span>
            <span className="donezo-user-email">{user?.email || 'tmichael20@mail.com'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
