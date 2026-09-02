import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StatusBadge from './components/common/StatusBadge';
import SeverityBadge from './components/common/SeverityBadge';
import MetricCard from './components/common/MetricCard';
import NetworkHealthCard from './components/dashboard/NetworkHealthCard';
import ResourceSituationCard from './components/dashboard/ResourceSituationCard';
import EmergencySituationSummary from './components/dashboard/EmergencySituationSummary';
import PageHeader from './components/common/PageHeader';
import Breadcrumb from './components/common/Breadcrumb';
import PlaceholderPage from './components/common/PlaceholderPage';
import SOSTriageTags from './components/sos/SOSTriageTags';
import SOSKpiCards from './components/sos/SOSKpiCards';
import SOSTable from './components/sos/SOSTable';

describe('RelayMesh Emergency Monitoring Component Tests', () => {
  test('renders StatusBadge with correct status', () => {
    render(<StatusBadge status="ONLINE" />);
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
  });

  test('renders SeverityBadge with critical badge', () => {
    render(<SeverityBadge severity="CRITICAL" />);
    expect(screen.getByText(/CRITICAL/i)).toBeInTheDocument();
  });

  test('renders MetricCard with title and value', () => {
    render(
      <MetricCard
        title="Active SOS Requests"
        value={24}
        subtitle="Currently active distress beacons"
      />
    );
    expect(screen.getByText('Active SOS Requests')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Currently active distress beacons')).toBeInTheDocument();
  });

  test('renders NetworkHealthCard with network availability', () => {
    render(
      <NetworkHealthCard
        networkHealth={{
          status: 'ONLINE',
          onlineNodes: 184,
          offlineNodes: 19,
          totalNodes: 203,
          availabilityPct: 91,
          coveragePct: 94,
          messagesHourly: 1420
        }}
      />
    );
    expect(screen.getByText('RelayMesh Network Health')).toBeInTheDocument();
    expect(screen.getByText('91%')).toBeInTheDocument();
    expect(screen.getByText(/184 \/ 203 nodes active/i)).toBeInTheDocument();
  });

  test('renders ResourceSituationCard with categories', () => {
    render(
      <ResourceSituationCard
        resources={{
          categories: [
            { name: 'Food Rations', key: 'food', availablePct: 82, status: 'ADEQUATE' },
            { name: 'Potable Water', key: 'water', availablePct: 64, status: 'MODERATE' },
            { name: 'Medical & Trauma Supplies', key: 'medical', availablePct: 41, status: 'CRITICAL_SHORTAGE' }
          ]
        }}
      />
    );
    expect(screen.getByText('Resource Situation')).toBeInTheDocument();
    expect(screen.getByText('Food Rations')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
    expect(screen.getByText(/Urgent:/i)).toBeInTheDocument();
  });

  test('renders EmergencySituationSummary with incidents', () => {
    render(
      <EmergencySituationSummary
        incidents={[
          {
            id: 'INC-101',
            title: 'Flooding — Riverside Area',
            severity: 'CRITICAL',
            area: 'Riverside Area',
            activeSOSCount: 17,
            affectedPopulation: 86,
            startedAt: '09:42 AM',
            status: 'ACTIVE',
            description: 'Flood levels rising.'
          }
        ]}
      />
    );
    expect(screen.getByText('Current Emergency Situation')).toBeInTheDocument();
    expect(screen.getByText('Flooding — Riverside Area')).toBeInTheDocument();
    expect(screen.getByText('Riverside Area')).toBeInTheDocument();
  });

  test('renders SOSTriageTags with styled tags', () => {
    render(<SOSTriageTags tags={['Trapped in Flood', 'Medical Aid Needed']} />);
    expect(screen.getByText('Trapped in Flood')).toBeInTheDocument();
    expect(screen.getByText('Medical Aid Needed')).toBeInTheDocument();
  });

  test('renders SOSKpiCards with 6 metrics', () => {
    render(
      <SOSKpiCards
        stats={{
          activeSOS: 24,
          critical: 8,
          awaitingResponse: 6,
          responding: 10,
          resolvedToday: 37,
          avgResponseTime: '08:42'
        }}
      />
    );
    expect(screen.getByText('Critical Priority')).toBeInTheDocument();
    expect(screen.getByText('Awaiting Response')).toBeInTheDocument();
    expect(screen.getByText('Responding Units')).toBeInTheDocument();
    expect(screen.getByText('Resolved Today')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
  });

  test('renders SOSTable with SOS records', () => {
    render(
      <SOSTable
        alerts={[
          {
            id: 'SOS-2026-891',
            deviceId: 'RM-84F2',
            citizenName: 'Kasun Bandara',
            citizenPhone: '+94 77 123 4567',
            priority: 'CRITICAL',
            locationName: 'Pettah Main Street',
            status: 'ACTIVE',
            hopCount: 3,
            triageTags: ['Trapped in Flood']
          }
        ]}
        volunteers={[]}
        selectedId={null}
        onSelectSOS={() => {}}
      />
    );
    expect(screen.getByText('#SOS-2026-891')).toBeInTheDocument();
    expect(screen.getByText('Kasun Bandara')).toBeInTheDocument();
    expect(screen.getByText(/Pettah Main Street/i)).toBeInTheDocument();
  });

  test('renders Breadcrumb with path links', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Overview', path: '/dashboard' },
          { label: 'Live Operations', path: '/incidents' },
          { label: 'Incident Monitoring' }
        ]}
        onNavigate={() => {}}
      />
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Live Operations')).toBeInTheDocument();
    expect(screen.getByText('Incident Monitoring')).toBeInTheDocument();
  });

  test('renders PageHeader with breadcrumbs and title', () => {
    render(
      <PageHeader
        breadcrumbs={[
          { label: 'Emergency Operations', path: '/dashboard' },
          { label: 'SOS Monitoring' }
        ]}
        title="SOS Monitoring"
        subtitle="Real-time distress beacon monitoring"
        badge="EMERGENCY MONITORING"
      />
    );
    expect(screen.getByText('SOS Monitoring', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('Real-time distress beacon monitoring')).toBeInTheDocument();
    expect(screen.getByText('EMERGENCY MONITORING')).toBeInTheDocument();
  });

  test('renders PlaceholderPage with title and next phase badge', () => {
    render(
      <PlaceholderPage
        title="Resource Management"
        subtitle="Inventory tracking & supplies"
        badge="COMING IN NEXT PHASE"
        breadcrumbs={[
          { label: 'Emergency Operations', path: '/dashboard' },
          { label: 'Resource Management' }
        ]}
        onNavigate={() => {}}
      />
    );
    expect(screen.getByText('Resource Management', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('COMING IN NEXT PHASE')).toBeInTheDocument();
  });
});
