/**
 * SOSService.ts
 * Manages emergency distress beacon lifecycle, mesh telemetry,
 * responder dispatch tracking, and historical audit logs.
 */

export interface SOSResponder {
  id: string;
  name: string;
  unitType: 'boat' | 'medical' | 'rescue_team' | 'helicopter';
  icon: string;
  distanceMeters: number;
  etaMinutes: number;
  bearing: string;
  radioChannel: string;
  contactNumber?: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE';
}

export interface SOSEventLog {
  id: string;
  title: string;
  time: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface SOSAlert {
  id: string; // e.g. "#SOS-4487"
  status: 'BROADCASTING' | 'ACKNOWLEDGED' | 'RESPONDER_EN_ROUTE' | 'RESOLVED' | 'CANCELLED';
  createdAt: number; // Unix timestamp
  resolvedAt?: number;
  tags: string[];
  latitude: number;
  longitude: number;
  accuracy: number;
  locationName: string;
  nodesNotified: number;
  meshHops: number;
  signalDbm: number;
  batteryPercent: number;
  responder?: SOSResponder;
  timeline: SOSEventLog[];
  notes?: string;
}

type SOSListener = (activeAlert: SOSAlert | null) => void;

class SOSService {
  private activeAlert: SOSAlert | null = null;
  private history: SOSAlert[] = [];
  private listeners: Set<SOSListener> = new Set();

  constructor() {
    this.initMockHistory();
  }

  private initMockHistory() {
    this.history = [
      {
        id: '#SOS-3219',
        status: 'RESOLVED',
        createdAt: Date.now() - 1000 * 60 * 60 * 26, // Yesterday
        resolvedAt: Date.now() - 1000 * 60 * 60 * 24,
        tags: ['Trapped / Evacuation', 'Food & Water'],
        latitude: 6.9412,
        longitude: 79.8821,
        accuracy: 14,
        locationName: 'Kelani River Basin - Sedawatta',
        nodesNotified: 18,
        meshHops: 4,
        signalDbm: -68,
        batteryPercent: 88,
        responder: {
          id: 'resp-01',
          name: 'Volunteer Rescue Unit Alpha',
          unitType: 'boat',
          icon: '🚤',
          distanceMeters: 0,
          etaMinutes: 0,
          bearing: 'ARRIVED',
          radioChannel: 'Ch-03 VHF (156.150 MHz)',
          status: 'ON_SCENE',
        },
        timeline: [
          {
            id: 't-1',
            title: 'Distress Beacon Initialized',
            time: 'Yesterday, 14:10',
            description: 'Flood water rising rapidly. Coordinates broadcast to mesh cluster.',
            status: 'completed',
          },
          {
            id: 't-2',
            title: 'Volunteer Unit Dispatched',
            time: 'Yesterday, 14:25',
            description: 'Rescue inflatable boat dispatched from Kelaniya Staging Center.',
            status: 'completed',
          },
          {
            id: 't-3',
            title: 'Evacuated to Safe Shelter',
            time: 'Yesterday, 16:15',
            description: '4 occupants escorted to Vidyalankara Relief Camp.',
            status: 'completed',
          },
        ],
        notes: 'Successfully evacuated safely to designated high-ground shelter.',
      },
      {
        id: '#SOS-2904',
        status: 'RESOLVED',
        createdAt: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
        resolvedAt: Date.now() - 1000 * 60 * 60 * 70,
        tags: ['Medical Urgent'],
        latitude: 6.9182,
        longitude: 79.8654,
        accuracy: 9,
        locationName: 'Colombo 07 - Emergency First Aid',
        nodesNotified: 9,
        meshHops: 2,
        signalDbm: -58,
        batteryPercent: 95,
        responder: {
          id: 'resp-02',
          name: 'Red Cross First Aid Mobile Team',
          unitType: 'medical',
          icon: '🚑',
          distanceMeters: 0,
          etaMinutes: 0,
          bearing: 'ARRIVED',
          radioChannel: 'Ch-07 VHF',
          status: 'ON_SCENE',
        },
        timeline: [
          {
            id: 't-4',
            title: 'Medical Assistance Requested',
            time: '3 days ago, 09:30',
            description: 'Elderly patient required insulin & dehydration aid.',
            status: 'completed',
          },
          {
            id: 't-5',
            title: 'Medical Team Deployed',
            time: '3 days ago, 11:30',
            description: 'Paramedic team administered first aid on site.',
            status: 'completed',
          },
        ],
        notes: 'Medical supplies delivered and patient stabilized.',
      },
    ];
  }

  public subscribe(listener: SOSListener): () => void {
    this.listeners.add(listener);
    listener(this.activeAlert);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.activeAlert));
  }

  public getActiveSOS(): SOSAlert | null {
    return this.activeAlert;
  }

  public isSOSActive(): boolean {
    return this.activeAlert !== null && this.activeAlert.status !== 'RESOLVED' && this.activeAlert.status !== 'CANCELLED';
  }

  public getHistory(): SOSAlert[] {
    return [...this.history];
  }

  /**
   * Trigger a brand new SOS distress beacon
   */
  public triggerSOS(
    tags: string[] = ['Medical Urgent'],
    coords?: { latitude: number; longitude: number; accuracy?: number }
  ): SOSAlert {
    const lat = coords?.latitude || 6.9271;
    const lng = coords?.longitude || 79.8612;
    const acc = coords?.accuracy || 10;
    const randomId = `#SOS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAlert: SOSAlert = {
      id: randomId,
      status: 'BROADCASTING',
      createdAt: Date.now(),
      tags: tags.length > 0 ? tags : ['General Emergency'],
      latitude: lat,
      longitude: lng,
      accuracy: acc,
      locationName: 'Current Offline GPS Fix',
      nodesNotified: 14,
      meshHops: 3,
      signalDbm: -64,
      batteryPercent: 94,
      responder: {
        id: 'resp-current',
        name: 'SL Navy Rescue Boat Unit #04',
        unitType: 'boat',
        icon: '🚤',
        distanceMeters: 450,
        etaMinutes: 8,
        bearing: '35° NE',
        radioChannel: 'Ch-04 VHF (156.200 MHz)',
        contactNumber: '+94 11 244 5368',
        status: 'EN_ROUTE',
      },
      timeline: [
        {
          id: 'step-1',
          title: 'SOS Beacon Created & Signed',
          time: 'Just now',
          description: `Distress beacon ${randomId} cryptographically signed with local device key.`,
          status: 'completed',
        },
        {
          id: 'step-2',
          title: 'Direct Broadcast to Nearby Devices',
          time: '5s ago',
          description: 'Emergency packets broadcast via BLE and Wi-Fi Direct to 14 mesh peers.',
          status: 'completed',
        },
        {
          id: 'step-3',
          title: 'Multi-Hop Mesh Forwarding Active',
          time: 'Active',
          description: 'Relayed across 3 node hops toward regional rescue command post.',
          status: 'active',
        },
        {
          id: 'step-4',
          title: 'Rescue Unit Dispatched',
          time: 'Pending',
          description: 'SL Navy Rescue Boat Unit #04 notified and en route.',
          status: 'pending',
        },
      ],
    };

    this.activeAlert = newAlert;
    this.notify();
    return newAlert;
  }

  /**
   * Mark the active SOS as resolved when safe
   */
  public resolveSOS(notes?: string): void {
    if (!this.activeAlert) return;

    const resolvedAlert: SOSAlert = {
      ...this.activeAlert,
      status: 'RESOLVED',
      resolvedAt: Date.now(),
      notes: notes || 'Safe resolution confirmed by user.',
    };

    // Add to history at top
    this.history.unshift(resolvedAlert);
    this.activeAlert = null;
    this.notify();
  }

  /**
   * Cancel the active SOS beacon
   */
  public cancelSOS(): void {
    if (!this.activeAlert) return;

    const cancelledAlert: SOSAlert = {
      ...this.activeAlert,
      status: 'CANCELLED',
      resolvedAt: Date.now(),
      notes: 'Distress beacon cancelled by user.',
    };

    this.history.unshift(cancelledAlert);
    this.activeAlert = null;
    this.notify();
  }
}

export const sosService = new SOSService();
