import React, { useState, useEffect } from 'react';
import RelayMeshSidebar from './components/layout/RelayMeshSidebar';
import RelayMeshTopHeader from './components/layout/RelayMeshTopHeader';

// 5 Core Primary Pages & System Pages
import DashboardOverview from './pages/DashboardOverview';
import LiveSituationMap from './pages/LiveSituationMap';
import SOSMonitoring from './pages/SOSMonitoring';
import VolunteersPage from './pages/VolunteersPage';
import NetworkHealthPage from './pages/NetworkHealthPage';
import SystemLogsPage from './pages/SystemLogsPage';
import SettingsPage from './pages/SettingsPage';

import Login from './components/Login';
import api from './services/api';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [currentPath, setCurrentPath] = useState('/dashboard');

  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPath('/dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Routing View Resolver - 5 Core Operational Destinations
  const renderCurrentView = () => {
    // 1. Command Center / Overview
    if (currentPath === '/dashboard') {
      return <DashboardOverview onNavigate={handleNavigate} />;
    }
    // 2. Live Situation Map
    if (currentPath === '/map') {
      return <LiveSituationMap onNavigate={handleNavigate} />;
    }
    // 3. Emergency SOS & Incidents
    if (currentPath === '/sos' || currentPath === '/incidents' || currentPath.startsWith('/incidents/')) {
      return <SOSMonitoring onNavigate={handleNavigate} />;
    }
    // 4. Rescue Teams & Field Dispatch
    if (currentPath === '/volunteers' || currentPath === '/dispatch' || currentPath === '/resources' || currentPath === '/response-history') {
      return <VolunteersPage onNavigate={handleNavigate} />;
    }
    // 5. Mesh Network & Node Topography
    if (currentPath === '/network' || currentPath === '/nodes' || currentPath === '/connectivity') {
      return <NetworkHealthPage onNavigate={handleNavigate} />;
    }
    // Utilities & Audit
    if (currentPath === '/logs') {
      return <SystemLogsPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/settings' || currentPath === '/users') {
      return <SettingsPage onNavigate={handleNavigate} />;
    }

    // Default fallback
    return <DashboardOverview onNavigate={handleNavigate} />;
  };

  return (
    <div className="donezo-app-container">
      {/* RelayMesh Left Sidebar */}
      <RelayMeshSidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="app-main-viewport">
        {/* RelayMesh Top Header */}
        <RelayMeshTopHeader
          user={currentUser}
          onLogout={handleLogout}
        />

        {/* Content View Body */}
        <main className="app-content-body-donezo">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
