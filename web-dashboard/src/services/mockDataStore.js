/**
 * RelayMesh Web Dashboard — Interactive Client-Side Prototype Data Store
 * Provides persistent local state, reactive listeners, and end-to-end prototype operations.
 */

const STORAGE_KEY = 'relaymesh_prototype_store_v1';

const INITIAL_STATE = {
  metrics: {
    activeSOS: 24,
    activeIncidents: 4,
    criticalIncidents: 2,
    activeNodes: 184,
    networkAvailability: 91,
    activeVolunteers: 47,
    availableResources: 126,
    availableShelterCapacity: 1240
  },
  incidents: [
    {
      id: 'INC-101',
      title: 'Flooding — Riverside Area',
      type: 'FLOOD',
      severity: 'CRITICAL',
      area: 'Riverside / Kelani Basin (Colombo North)',
      activeSOSCount: 17,
      affectedPopulation: 86,
      startedAt: '09:42 AM',
      status: 'ACTIVE',
      activeResponders: 12,
      criticalNeed: 'Boat Extraction & Potable Water',
      description: 'Rapid river bank overflow leading to 1.5m flood level across 4 square kilometers.',
      latitude: 6.9450,
      longitude: 79.8750
    },
    {
      id: 'INC-102',
      title: 'Grandpass Structural Wall Collapse',
      type: 'STRUCTURAL_COLLAPSE',
      severity: 'CRITICAL',
      area: 'Grandpass Junction, Colombo 14',
      activeSOSCount: 4,
      affectedPopulation: 28,
      startedAt: '10:15 AM',
      status: 'ACTIVE',
      activeResponders: 8,
      criticalNeed: 'Heavy Extraction & Trauma Medic',
      description: 'Commercial perimeter wall collapsed over two residential units.',
      latitude: 6.9501,
      longitude: 79.8710
    },
    {
      id: 'INC-103',
      title: 'Borella Storm Debris & Power Outage',
      type: 'POWER_OUTAGE',
      severity: 'HIGH',
      area: 'Borella Cross Road, Colombo 08',
      activeSOSCount: 2,
      affectedPopulation: 14,
      startedAt: '10:30 AM',
      status: 'ACTIVE',
      activeResponders: 5,
      criticalNeed: 'Emergency Generators',
      description: 'Fallen trees severed central power lines, blocking emergency ambulances.',
      latitude: 6.9150,
      longitude: 79.8820
    },
    {
      id: 'INC-104',
      title: 'Pettah Market Rooftop Evacuation',
      type: 'FLOOD',
      severity: 'MODERATE',
      area: 'Pettah 5th Cross Street',
      activeSOSCount: 1,
      affectedPopulation: 12,
      startedAt: '10:45 AM',
      status: 'ACTIVE',
      activeResponders: 4,
      criticalNeed: 'Rooftop Extraction & Dry Food',
      description: 'Citizens isolated on second-floor balcony due to fast rising ground water.',
      latitude: 6.9385,
      longitude: 79.8735
    }
  ],
  sosAlerts: [
    {
      id: 'SOS-2026-891',
      citizenName: 'Nimali Senanayake',
      citizenPhone: '+94 77 482 9102',
      deviceId: 'RM-84F2',
      locationName: 'Riverside / Kelani Basin (Zone 4)',
      latitude: 6.9448,
      longitude: 79.8745,
      priority: 'CRITICAL',
      status: 'ACTIVE',
      hopCount: 2,
      timeAgo: '2m ago',
      timestamp: '10:42 AM',
      medicalNeeds: 'Elderly citizen requiring oxygen tank & high-water boat extraction',
      incidentId: 'INC-101'
    },
    {
      id: 'SOS-2026-892',
      citizenName: 'Kamal Jayawardena',
      citizenPhone: '+94 71 839 2041',
      deviceId: 'RM-21A4',
      locationName: 'Grandpass Junction #45',
      latitude: 6.9510,
      longitude: 79.8720,
      priority: 'CRITICAL',
      status: 'ACTIVE',
      hopCount: 1,
      timeAgo: '5m ago',
      timestamp: '10:39 AM',
      medicalNeeds: 'Trapped beneath masonry debris, conscious with leg fracture',
      incidentId: 'INC-102'
    },
    {
      id: 'SOS-2026-893',
      citizenName: 'Fathima Rizwan',
      citizenPhone: '+94 76 991 3820',
      deviceId: 'RM-91C2',
      locationName: 'Pettah Main Street #112',
      latitude: 6.9380,
      longitude: 79.8730,
      priority: 'HIGH',
      status: 'ACTIVE',
      hopCount: 3,
      timeAgo: '9m ago',
      timestamp: '10:35 AM',
      medicalNeeds: 'Infant with fever, isolated on commercial rooftop',
      incidentId: 'INC-104'
    },
    {
      id: 'SOS-2026-894',
      citizenName: 'Sunil Wickramasinghe',
      citizenPhone: '+94 75 120 4938',
      deviceId: 'RM-4412',
      locationName: 'Borella Cross Road Sector 2',
      latitude: 6.9155,
      longitude: 79.8815,
      priority: 'MODERATE',
      status: 'DISPATCHED',
      hopCount: 2,
      timeAgo: '14m ago',
      timestamp: '10:30 AM',
      medicalNeeds: 'Power out for dialysis device, backup battery needed',
      incidentId: 'INC-103'
    },
    {
      id: 'SOS-2026-895',
      citizenName: 'Priyantha De Silva',
      citizenPhone: '+94 77 334 1928',
      deviceId: 'RM-6721',
      locationName: 'Kelaniya Temple Road',
      latitude: 6.9580,
      longitude: 79.9190,
      priority: 'LOW',
      status: 'RESOLVED',
      hopCount: 1,
      timeAgo: '28m ago',
      timestamp: '10:16 AM',
      medicalNeeds: 'Water purification tablets requested — Delivered',
      incidentId: 'INC-101'
    }
  ],
  volunteers: [
    {
      id: 'VOL-001',
      name: 'Dr. Alexandra Deff',
      specialization: 'Emergency Trauma & First Aid',
      status: 'AVAILABLE',
      deviceId: 'RM-84F2',
      callsign: 'MEDIC-ALPHA',
      batteryLevel: 94,
      location: 'Sector 4 Relief Camp',
      latitude: 6.9440,
      longitude: 79.8730
    },
    {
      id: 'VOL-002',
      name: 'Edwin Adenike',
      specialization: 'Boat Extraction & Swift Water Rescue',
      status: 'AVAILABLE',
      deviceId: 'RM-21A4',
      callsign: 'RESCUE-BOAT-1',
      batteryLevel: 88,
      location: 'Riverside Marine Base',
      latitude: 6.9460,
      longitude: 79.8760
    },
    {
      id: 'VOL-003',
      name: 'Isaac Oluwatemilorun',
      specialization: 'Mesh Infrastructure & RF Repeaters',
      status: 'AVAILABLE',
      deviceId: 'RM-91C2',
      callsign: 'MESH-TECH-1',
      batteryLevel: 76,
      location: 'Hill Tower Relay Station',
      latitude: 6.9200,
      longitude: 79.8600
    },
    {
      id: 'VOL-004',
      name: 'David Oshodi',
      specialization: 'Relief Logistics & Supply Distribution',
      status: 'DISPATCHED',
      deviceId: 'RM-4412',
      callsign: 'SUPPLY-LEAD',
      batteryLevel: 92,
      location: 'Central Supply Depot',
      latitude: 6.9385,
      longitude: 79.8735
    },
    {
      id: 'VOL-005',
      name: 'Sanjeewa Kumara',
      specialization: 'Disaster Search & Heavy Extraction',
      status: 'AVAILABLE',
      deviceId: 'RM-1109',
      callsign: 'SEARCH-LEAD',
      batteryLevel: 85,
      location: 'Grandpass Depot',
      latitude: 6.9500,
      longitude: 79.8710
    }
  ],
  resources: [
    {
      id: 'RES-001',
      name: 'Central Kelani Community Shelter',
      category: 'SHELTER',
      location: 'Pettah Municipal Complex, Colombo 11',
      coordinates: '6.9385, 79.8735',
      available: 82,
      total: 250,
      unit: 'Beds',
      status: 'AVAILABLE',
      freshness: 'Synced 2m ago via Mesh #RM-84F2',
      description: 'Designated primary flood evacuation center with emergency power and sanitation facilities.',
      contactPerson: 'K. Bandara (Shelter Coordinator)',
    },
    {
      id: 'RES-002',
      name: 'Trauma & First Aid Medical Depot Alpha',
      category: 'MEDICAL',
      location: 'Kelani River Relief Base 1, Colombo North',
      coordinates: '6.9412, 79.8680',
      available: 14,
      total: 50,
      unit: 'Trauma Kits',
      status: 'LOW_STOCK',
      freshness: 'Synced 4m ago via Mesh #RM-21A4',
      description: 'Critical emergency trauma dressings, saline drip kits, insulin supplies and first-response triage equipment.',
      contactPerson: 'Dr. Alexandra Deff (Lead Medical Responder)',
    },
    {
      id: 'RES-003',
      name: 'Potable Water Distribution Point 1',
      category: 'WATER',
      location: 'Grandpass Junction, Colombo 14',
      coordinates: '6.9501, 79.8710',
      available: 3200,
      total: 5000,
      unit: 'Liters',
      status: 'AVAILABLE',
      freshness: 'Synced 6m ago via Mesh #RM-91C2',
      description: 'Chlorine-treated drinking water distribution bowsers with filtration tanks.',
      contactPerson: 'S. Fernando (Water Operations)',
    },
    {
      id: 'RES-004',
      name: 'Emergency Dry Food Rations Depot 2',
      category: 'FOOD',
      location: 'Borella Community Center, Colombo 08',
      coordinates: '6.9150, 79.8820',
      available: 480,
      total: 600,
      unit: 'Family Packs',
      status: 'AVAILABLE',
      freshness: 'Synced 8m ago via Mesh #RM-4412',
      description: '3-day emergency ready-to-eat ration packs containing canned protein, biscuits and purification tablets.',
      contactPerson: 'M. Jayawardena (Logistics Lead)',
    },
    {
      id: 'RES-005',
      name: 'Solar Generator & Battery Storage Hub',
      category: 'EQUIPMENT',
      location: 'Hill Station Tower Relay Station',
      coordinates: '6.9200, 79.8600',
      available: 8,
      total: 10,
      unit: 'Generators',
      status: 'AVAILABLE',
      freshness: 'Synced 1m ago via Mesh #RM-6721',
      description: 'Portable solar generators and lithium battery packs maintaining repeater mesh links.',
      contactPerson: 'I. Oluwatemilorun (Mesh Technician)',
    },
    {
      id: 'RES-006',
      name: 'Rescue Boat & Lifejacket Marine Depot',
      category: 'EQUIPMENT',
      location: 'Riverside Marine Base, Colombo North',
      coordinates: '6.9450, 79.8750',
      available: 6,
      total: 8,
      unit: 'Rescue Boats',
      status: 'AVAILABLE',
      freshness: 'Synced 3m ago via Mesh #RM-1109',
      description: 'Inflatable rescue boats (IRB) with outboard engines, ropes and life jackets for flood extraction.',
      contactPerson: 'Edwin Adenike (Rescue Lead)',
    }
  ],
  dispatchAssignments: [
    {
      id: 'DISP-01',
      sosId: 'SOS-2026-894',
      volunteerId: 'VOL-004 (David Oshodi)',
      dispatcherName: 'Operator Ananya Perera',
      dispatchedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      distanceKm: 1.2,
      etaMinutes: 8,
      status: 'EN_ROUTE',
      messageSent: 'Deploying with emergency generator and backup medical battery.'
    }
  ],
  auditLogs: [
    {
      id: 'LOG-001',
      timestamp: '10:42 AM',
      timeAgo: '2m ago',
      event: 'New SOS received from RelayMesh node RM-84F2',
      type: 'SOS_RECEIVED',
      severity: 'CRITICAL',
      actor: 'Node RM-84F2',
      entityId: 'SOS-2026-891'
    },
    {
      id: 'LOG-002',
      timestamp: '10:38 AM',
      timeAgo: '6m ago',
      event: 'Mesh node RM-21A4 connected via P2P relay',
      type: 'NODE_CONNECTED',
      severity: 'INFO',
      actor: 'System Router',
      entityId: 'RM-21A4'
    },
    {
      id: 'LOG-003',
      timestamp: '10:34 AM',
      timeAgo: '10m ago',
      event: 'Central Community Shelter capacity updated (168/250 occupied)',
      type: 'SHELTER_UPDATE',
      severity: 'SUCCESS',
      actor: 'Shelter Lead',
      entityId: 'RES-001'
    },
    {
      id: 'LOG-004',
      timestamp: '10:30 AM',
      timeAgo: '14m ago',
      event: 'Responder David Oshodi dispatched to SOS-2026-894',
      type: 'DISPATCH_ASSIGNED',
      severity: 'HIGH',
      actor: 'Operator Ananya Perera',
      entityId: 'DISP-01'
    }
  ]
};

class MockDataStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read stored prototype state:', e);
    }
    return INITIAL_STATE;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save prototype state:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error('Listener notification error:', e);
      }
    }
  }

  getState() {
    return this.state;
  }

  // --- SOS Operations ---
  getSOSAlerts() {
    return this.state.sosAlerts;
  }

  resolveSOS(sosId) {
    this.state.sosAlerts = this.state.sosAlerts.map(s =>
      s.id === sosId ? { ...s, status: 'RESOLVED' } : s
    );
    this.state.metrics.activeSOS = this.state.sosAlerts.filter(s => s.status === 'ACTIVE').length;
    this.logAction('SOS_RESOLVED', `Beacon #${sosId} resolved by dispatcher`, 'SUCCESS', sosId);
    this.saveState();
  }

  // --- Dispatch Operations ---
  dispatchUnit(sosId, volunteerId, instructions = '') {
    const sos = this.state.sosAlerts.find(s => s.id === sosId);
    const vol = this.state.volunteers.find(v => v.id === volunteerId);

    // Update SOS status
    if (sos) {
      sos.status = 'DISPATCHED';
    }

    // Update volunteer status
    if (vol) {
      vol.status = 'DISPATCHED';
    }

    // Record dispatch assignment
    const newAssignment = {
      id: `DISP-${String(this.state.dispatchAssignments.length + 1).padStart(2, '0')}`,
      sosId: sosId,
      volunteerId: vol ? `${vol.name} (${vol.callsign})` : volunteerId,
      dispatcherName: 'Operator Ananya Perera',
      dispatchedAt: new Date().toISOString(),
      distanceKm: (Math.random() * 2 + 0.5).toFixed(1),
      etaMinutes: Math.floor(Math.random() * 12 + 4),
      status: 'EN_ROUTE',
      messageSent: instructions || 'Dispatched immediate emergency assistance.'
    };

    this.state.dispatchAssignments.unshift(newAssignment);
    this.state.metrics.activeSOS = this.state.sosAlerts.filter(s => s.status === 'ACTIVE').length;

    this.logAction(
      'DISPATCH_CONFIRMED',
      `Unit ${vol?.callsign || volunteerId} dispatched to #${sosId}`,
      'HIGH',
      newAssignment.id
    );

    this.saveState();
    return newAssignment;
  }

  // --- Resource Operations ---
  getResources() {
    return this.state.resources;
  }

  addResource(newRes) {
    const id = `RES-${String(this.state.resources.length + 1).padStart(3, '0')}`;
    const resource = {
      id,
      name: newRes.name || 'New Emergency Depot',
      category: newRes.category || 'EQUIPMENT',
      location: newRes.location || 'Central Disaster Zone',
      coordinates: newRes.coordinates || '6.9385, 79.8735',
      available: Number(newRes.available || newRes.total || 100),
      total: Number(newRes.total || 100),
      unit: newRes.unit || 'Units',
      status: 'AVAILABLE',
      freshness: 'Just registered via Web Console',
      description: newRes.description || 'Emergency supplies registered in local registry.',
      contactPerson: newRes.contactPerson || 'Central Division'
    };

    this.state.resources.unshift(resource);
    this.state.metrics.availableResources += 1;
    this.logAction('RESOURCE_REGISTERED', `Resource Depot "${resource.name}" registered`, 'INFO', id);
    this.saveState();
    return resource;
  }

  allocateResource(resourceId, amount, targetSector) {
    const res = this.state.resources.find(r => r.id === resourceId);
    if (res) {
      const deduction = Math.min(res.available, Number(amount));
      res.available -= deduction;
      if (res.available / res.total < 0.3) {
        res.status = 'LOW_STOCK';
      }
      res.freshness = 'Allocation dispatched just now';

      this.logAction(
        'STOCK_ALLOCATED',
        `Dispatched ${deduction} ${res.unit} from "${res.name}" to ${targetSector || 'Sector 4'}`,
        'SUCCESS',
        res.id
      );

      this.saveState();
      return true;
    }
    return false;
  }

  // --- System Logs ---
  logAction(type, event, severity = 'INFO', entityId = '') {
    const newLog = {
      id: `LOG-${String(this.state.auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      event,
      type,
      severity,
      actor: 'Operator Ananya Perera',
      entityId
    };
    this.state.auditLogs.unshift(newLog);
  }

  // Reset demo state
  resetToInitial() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }
}

export const mockDataStore = new MockDataStore();
export default mockDataStore;
