import React, { useState, useEffect } from 'react';
import RelayMeshSidebar from './components/layout/RelayMeshSidebar';
import RelayMeshTopHeader from './components/layout/RelayMeshTopHeader';

// Primary Pages
import DashboardOverview from './pages/DashboardOverview';
import LiveSituationMap from './pages/LiveSituationMap';
import SOSMonitoring from './pages/SOSMonitoring';
import IncidentMonitoring from './pages/IncidentMonitoring';
import IncidentDetails from './pages/IncidentDetails';
import VolunteersPage from './pages/VolunteersPage';
import DispatchPage from './pages/DispatchPage';
import ResourcesPage from './pages/ResourcesPage';
import ResponseHistoryPage from './pages/ResponseHistoryPage';
import MeshNodesPage from './pages/MeshNodesPage';
import NetworkHealthPage from './pages/NetworkHealthPage';
import UsersPage from './pages/UsersPage';
import SystemLogsPage from './pages/SystemLogsPage';
import SettingsPage from './pages/SettingsPage';
import PlaceholderPage from './components/common/PlaceholderPage';

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

  // Routing View Resolver
  const renderCurrentView = () => {
    if (currentPath === '/dashboard') {
      return <DashboardOverview onNavigate={handleNavigate} />;
    }
    if (currentPath === '/map') {
      return <LiveSituationMap onNavigate={handleNavigate} />;
    }
    if (currentPath === '/sos') {
      return <SOSMonitoring onNavigate={handleNavigate} />;
    }
    if (currentPath === '/incidents') {
      return <IncidentMonitoring onNavigate={handleNavigate} />;
    }
    if (currentPath.startsWith('/incidents/')) {
      return <IncidentDetails incidentId={currentPath} onNavigate={handleNavigate} />;
    }
    if (currentPath === '/volunteers') {
      return <VolunteersPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/dispatch') {
      return <DispatchPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/resources') {
      return <ResourcesPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/response-history') {
      return <ResponseHistoryPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/nodes') {
      return <MeshNodesPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/network') {
      return <NetworkHealthPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/connectivity') {
      return (
        <PlaceholderPage
          title="Mesh Connectivity & Link Quality"
          subtitle="Signal strength (RSSI/SNR), packet route analysis & multi-hop telemetry"
          breadcrumbs={[
            { label: 'Emergency Operations', path: '/dashboard' },
            { label: 'Network', path: '/nodes' },
            { label: 'Connectivity' }
          ]}
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPath === '/analytics') {
      return (
        <PlaceholderPage
          title="Emergency Operations Analytics"
          subtitle="Response time trends, casualty heatmaps, triage distribution & mesh reliability statistics"
          breadcrumbs={[
            { label: 'Emergency Operations', path: '/dashboard' },
            { label: 'Reporting' },
            { label: 'Analytics' }
          ]}
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPath === '/reports') {
      return (
        <PlaceholderPage
          title="Operational Mission Reports"
          subtitle="Incident summaries, agency audit export, responder evaluations & PostGIS logs"
          breadcrumbs={[
            { label: 'Emergency Operations', path: '/dashboard' },
            { label: 'Reporting' },
            { label: 'Reports' }
          ]}
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPath === '/users') {
      return <UsersPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/logs') {
      return <SystemLogsPage onNavigate={handleNavigate} />;
    }
    if (currentPath === '/settings') {
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
