/**
 * ResourceService.ts
 * Manages emergency relief resources, offline data freshness, capacity telemetry, and mesh synchronization for Module 5.
 */

export type ResourceCategory = 'shelter' | 'medical' | 'water' | 'food' | 'power' | 'logistics';
export type ResourceStatus = 'OPEN' | 'LIMITED' | 'FULL' | 'CLOSED' | 'VERIFIED';

export interface AmenityItem {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  notes?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  title: string;
  category: ResourceCategory;
  description: string;
  latitude: number;
  longitude: number;
  landmark: string;
  distanceKm: number;
  totalCapacity: number;
  occupiedCapacity: number;
  availableCapacity: number;
  capacityUnit: string;
  status: ResourceStatus;
  amenities: AmenityItem[];
  contactInfo: {
    coordinator: string;
    nodeId: string;
    radioChannel: string;
    phone?: string;
  };
  lastSyncedAt: number; // Unix timestamp in ms
  verifiedAt: number;   // Unix timestamp in ms
  verifiedByNode: string;
  meshHops: number;
  operatingHours: string;
  confirmations: number;
}

export interface FreshnessInfo {
  label: string;
  status: 'fresh' | 'recent' | 'stale';
  formattedTime: string;
  color: string;
  badgeBg: string;
}

export class ResourceService {
  private static instance: ResourceService;
  private listeners: Array<() => void> = [];
  private selectedResourceId: string = 'res-shelter-1';

  private resources: ResourceItem[] = [
    {
      id: 'res-shelter-1',
      name: 'Community Shelter Point 1',
      title: 'Community Shelter Point 1 (St. Peter Hall)',
      category: 'shelter',
      description: 'Designated high-ground municipal emergency shelter with clean dry bedding, solar power backup, and trauma triage room.',
      latitude: 6.9325,
      longitude: 79.8550,
      landmark: 'St. Peter Parish Complex, High Street',
      distanceKm: 1.2,
      totalCapacity: 150,
      occupiedCapacity: 85,
      availableCapacity: 65,
      capacityUnit: 'cots / persons',
      status: 'OPEN',
      amenities: [
        { id: 'a1', name: 'Filtered Drinking Water (500L tank)', icon: '💧', available: true },
        { id: 'a2', name: 'Solar Generator & Charging Hub', icon: '⚡', available: true, notes: 'Continuous 24/7' },
        { id: 'a3', name: 'First Aid & Trauma Bandages', icon: '🩹', available: true },
        { id: 'a4', name: 'Rest Area & Dry Bedding', icon: '🛏️', available: true, notes: '65 cots remaining' },
        { id: 'a5', name: 'Clean Restrooms & Sanitation', icon: '🚻', available: true },
        { id: 'a6', name: 'Hot Meals & Baby Formula', icon: '🍲', available: true, notes: 'Supplies for 3 days' },
        { id: 'a7', name: 'VHF Emergency Relay Node', icon: '📻', available: true, notes: 'Ch. 07 connected' },
        { id: 'a8', name: 'Wheelchair & Accessibility Ramp', icon: '♿', available: true },
      ],
      contactInfo: {
        coordinator: 'Officer Silva (Field Leader)',
        nodeId: 'Node-RM-091',
        radioChannel: 'VHF Ch. 07 (146.520 MHz)',
        phone: '+94 77 123 4567',
      },
      lastSyncedAt: Date.now() - 4 * 60 * 1000, // 4 mins ago
      verifiedAt: Date.now() - 15 * 60 * 1000,
      verifiedByNode: 'Node-Rescue-Alpha',
      meshHops: 2,
      operatingHours: '24 Hours Open',
      confirmations: 7,
    },
    {
      id: 'res-shelter-2',
      name: 'Central Stadium Evacuation Camp',
      title: 'Central Stadium Evacuation Mega-Center',
      category: 'shelter',
      description: 'Large capacity multi-purpose stadium camp. Equipped with massive indoor halls, community kitchen, and emergency dispatch.',
      latitude: 6.9180,
      longitude: 79.8680,
      landmark: 'Main City Stadium, North Gate 3',
      distanceKm: 2.8,
      totalCapacity: 500,
      occupiedCapacity: 440,
      availableCapacity: 60,
      capacityUnit: 'persons',
      status: 'LIMITED',
      amenities: [
        { id: 'a1', name: 'Filtered Drinking Water', icon: '💧', available: true },
        { id: 'a2', name: 'Backup Industrial Generator', icon: '⚡', available: true },
        { id: 'a3', name: 'Medical Clinic (Doctor on Duty)', icon: '🏥', available: true },
        { id: 'a4', name: 'Bedding and Emergency Mats', icon: '🛏️', available: true, notes: 'Limited remaining' },
        { id: 'a5', name: 'Portable Latrines & Washrooms', icon: '🚻', available: true },
        { id: 'a6', name: 'Child Care & Family Safe Area', icon: '👶', available: true },
        { id: 'a7', name: 'VHF Base Station', icon: '📻', available: true },
      ],
      contactInfo: {
        coordinator: 'Capt. Fernando (Civil Defense)',
        nodeId: 'Node-Stadium-HQ',
        radioChannel: 'VHF Ch. 04 (146.450 MHz)',
        phone: '+94 71 987 6543',
      },
      lastSyncedAt: Date.now() - 18 * 60 * 1000, // 18 mins ago
      verifiedAt: Date.now() - 30 * 60 * 1000,
      verifiedByNode: 'Node-Relay-Gateway-01',
      meshHops: 1,
      operatingHours: '24 Hours Open',
      confirmations: 12,
    },
    {
      id: 'res-medical-1',
      name: 'St. Mary Medical Base',
      title: 'St. Mary Emergency Triage Base',
      category: 'medical',
      description: 'Field hospital and surgical triage center with oxygen reserves, emergency pharmaceuticals, and ambulances.',
      latitude: 6.9360,
      longitude: 79.8710,
      landmark: 'St. Mary Hospital Grounds, Ward B',
      distanceKm: 2.4,
      totalCapacity: 80,
      occupiedCapacity: 72,
      availableCapacity: 8,
      capacityUnit: 'triage beds',
      status: 'LIMITED',
      amenities: [
        { id: 'a1', name: 'Oxygen & Ventilator Stations', icon: '🫁', available: true },
        { id: 'a2', name: 'Emergency Trauma Surgery', icon: '🩺', available: true },
        { id: 'a3', name: 'Antivenom & Antibiotics', icon: '💊', available: true },
        { id: 'a4', name: 'Uninterrupted Solar Power', icon: '⚡', available: true },
        { id: 'a5', name: 'Sterilized Drinking Water', icon: '💧', available: true },
      ],
      contactInfo: {
        coordinator: 'Dr. Jayawardena (Chief Medical Officer)',
        nodeId: 'Node-Medic-Alpha',
        radioChannel: 'VHF Ch. 09 (146.575 MHz)',
      },
      lastSyncedAt: Date.now() - 8 * 60 * 1000, // 8 mins ago
      verifiedAt: Date.now() - 20 * 60 * 1000,
      verifiedByNode: 'Node-Medic-Alpha',
      meshHops: 3,
      operatingHours: '24 Hours Open',
      confirmations: 9,
    },
    {
      id: 'res-medical-2',
      name: 'Red Cross Field Clinic',
      title: 'Red Cross Mobile Dressing & First Aid Unit',
      category: 'medical',
      description: 'Rapid-deployment first response clinic for lacerations, waterborne sickness, burn care, and emergency vaccines.',
      latitude: 6.9210,
      longitude: 79.8510,
      landmark: 'Victoria Park Pavilion',
      distanceKm: 1.5,
      totalCapacity: 40,
      occupiedCapacity: 15,
      availableCapacity: 25,
      capacityUnit: 'patients',
      status: 'OPEN',
      amenities: [
        { id: 'a1', name: 'Bandages, Splints & Wound Care', icon: '🩹', available: true },
        { id: 'a2', name: 'Rehydration Salts (ORS) & IVs', icon: '💧', available: true },
        { id: 'a3', name: 'Paramedic Staff (3 Nurses)', icon: '🩺', available: true },
        { id: 'a4', name: 'Mesh Relay Node', icon: '📻', available: true },
      ],
      contactInfo: {
        coordinator: 'Nurse Perera (Red Cross)',
        nodeId: 'Node-RedCross-02',
        radioChannel: 'VHF Ch. 07 (146.520 MHz)',
      },
      lastSyncedAt: Date.now() - 25 * 60 * 1000, // 25 mins ago
      verifiedAt: Date.now() - 40 * 60 * 1000,
      verifiedByNode: 'Node-RedCross-02',
      meshHops: 1,
      operatingHours: '06:00 - 22:00',
      confirmations: 5,
    },
    {
      id: 'res-water-1',
      name: 'Clean Water Tank 500L',
      title: 'Drinking Water Purification Point #04',
      category: 'water',
      description: 'Rapid UV and reverse-osmosis filtration point with 500-liter storage bladder. Free clean water for citizens.',
      latitude: 6.9240,
      longitude: 79.8530,
      landmark: 'Municipal Square Water Tower',
      distanceKm: 0.8,
      totalCapacity: 500,
      occupiedCapacity: 180,
      availableCapacity: 320,
      capacityUnit: 'liters remaining',
      status: 'OPEN',
      amenities: [
        { id: 'a1', name: 'Purified Water Taps (4 Outlets)', icon: '💧', available: true },
        { id: 'a2', name: 'Jerry Can Refill Assistance', icon: '🪣', available: true },
        { id: 'a3', name: 'Water Chlorine Purification Tablets', icon: '💊', available: true },
        { id: 'a4', name: 'Solar Pump Mechanism', icon: '⚡', available: true },
      ],
      contactInfo: {
        coordinator: 'Volunteer Kusal',
        nodeId: 'Node-Water-04',
        radioChannel: 'VHF Ch. 02 (146.400 MHz)',
      },
      lastSyncedAt: Date.now() - 2 * 60 * 1000, // 2 mins ago
      verifiedAt: Date.now() - 10 * 60 * 1000,
      verifiedByNode: 'Node-Water-04',
      meshHops: 1,
      operatingHours: 'Continuous Gravity & Solar Flow',
      confirmations: 15,
    },
    {
      id: 'res-water-2',
      name: 'Municipal Reservoir Station',
      title: 'Municipal Reservoir & Tanker Distribution Hub',
      category: 'water',
      description: 'Heavy duty tanker dispatch point for bulk delivery and large volume containers. Supervised by Water Board.',
      latitude: 6.9310,
      longitude: 79.8650,
      landmark: 'Pumping Station No. 2, Lake Road',
      distanceKm: 1.9,
      totalCapacity: 5000,
      occupiedCapacity: 4200,
      availableCapacity: 800,
      capacityUnit: 'liters reserve',
      status: 'LIMITED',
      amenities: [
        { id: 'a1', name: 'Bulk Tanker Refills', icon: '🚛', available: true },
        { id: 'a2', name: 'Quality Tested Potable Water', icon: '💧', available: true },
        { id: 'a3', name: 'Emergency Fuel Generator', icon: '⚡', available: true },
      ],
      contactInfo: {
        coordinator: 'Engineer Wickramasinghe',
        nodeId: 'Node-WaterBoard-01',
        radioChannel: 'VHF Ch. 02 (146.400 MHz)',
      },
      lastSyncedAt: Date.now() - 55 * 60 * 1000, // 55 mins ago
      verifiedAt: Date.now() - 80 * 60 * 1000,
      verifiedByNode: 'Node-WaterBoard-01',
      meshHops: 2,
      operatingHours: '07:00 - 19:00',
      confirmations: 4,
    },
    {
      id: 'res-food-1',
      name: 'Food Ration Center Alpha',
      title: 'Food Ration & Relief Distribution Center Alpha',
      category: 'food',
      description: 'Official UN/WFP dry ration pick-up depot. Distributing rice, canned fish, lentils, baby food, and clean biscuits.',
      latitude: 6.9195,
      longitude: 79.8720,
      landmark: 'Community Center Warehouse, East Gate',
      distanceKm: 1.8,
      totalCapacity: 1000,
      occupiedCapacity: 650,
      availableCapacity: 350,
      capacityUnit: 'family ration packs',
      status: 'OPEN',
      amenities: [
        { id: 'a1', name: '5-Day Family Dry Food Packs', icon: '📦', available: true },
        { id: 'a2', name: 'Baby Milk Powder & Formula', icon: '🍼', available: true },
        { id: 'a3', name: 'Ready-to-Eat Emergency Energy Bars', icon: '🍫', available: true },
        { id: 'a4', name: 'Matchboxes & Candle Sets', icon: '🕯️', available: true },
      ],
      contactInfo: {
        coordinator: 'Ration Officer Saman',
        nodeId: 'Node-Ration-Alpha',
        radioChannel: 'VHF Ch. 06 (146.500 MHz)',
      },
      lastSyncedAt: Date.now() - 11 * 60 * 1000, // 11 mins ago
      verifiedAt: Date.now() - 25 * 60 * 1000,
      verifiedByNode: 'Node-Ration-Alpha',
      meshHops: 2,
      operatingHours: '08:00 - 18:00',
      confirmations: 8,
    },
    {
      id: 'res-power-1',
      name: 'Solar Generator & Communications Station',
      title: 'Emergency Solar Power & Satellite Gateway',
      category: 'power',
      description: 'Off-grid 10kW solar microgrid with battery storage banks. Offers multi-device USB fast charging and satellite relay.',
      latitude: 6.9290,
      longitude: 79.8630,
      landmark: 'Telecommunication Tower Ground, Ridge Hill',
      distanceKm: 1.1,
      totalCapacity: 60,
      occupiedCapacity: 38,
      availableCapacity: 22,
      capacityUnit: 'charging ports',
      status: 'OPEN',
      amenities: [
        { id: 'a1', name: 'USB-C / Micro-USB Fast Charging Plugs', icon: '🔌', available: true },
        { id: 'a2', name: 'Satellite Internet Gateway Link', icon: '🛰️', available: true },
        { id: 'a3', name: 'VHF Handheld Radio Charging Docks', icon: '📻', available: true },
        { id: 'a4', name: 'Sheltered Seating Area', icon: '⛺', available: true },
      ],
      contactInfo: {
        coordinator: 'Comms Tech Roshan',
        nodeId: 'Node-RM-Gateway',
        radioChannel: 'VHF Ch. 01 (146.520 MHz Calling)',
      },
      lastSyncedAt: Date.now() - 3 * 60 * 1000, // 3 mins ago
      verifiedAt: Date.now() - 12 * 60 * 1000,
      verifiedByNode: 'Node-RM-Gateway',
      meshHops: 1,
      operatingHours: '06:30 - 20:30',
      confirmations: 11,
    },
  ];

  private constructor() {}

  public static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }
    return ResourceService.instance;
  }

  /**
   * Returns all resources matching category, search text, and availability filter.
   */
  public getResources(
    category: string = 'All',
    searchQuery: string = '',
    onlyAvailable: boolean = false
  ): ResourceItem[] {
    return this.resources.filter((res) => {
      // Category filter
      if (category !== 'All') {
        const catNorm = category.toLowerCase();
        if (catNorm === 'shelters' && res.category !== 'shelter') return false;
        if (catNorm === 'medical' && res.category !== 'medical') return false;
        if (catNorm === 'water' && res.category !== 'water') return false;
        if (catNorm === 'food' && res.category !== 'food') return false;
        if (catNorm === 'power' && res.category !== 'power') return false;
      }

      // Availability filter
      if (onlyAvailable && res.status !== 'OPEN' && res.status !== 'LIMITED' && res.status !== 'VERIFIED') {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = res.name.toLowerCase().includes(q);
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesLandmark = res.landmark.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesAmenities = res.amenities.some((a) => a.name.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesLandmark && !matchesDesc && !matchesAmenities) {
          return false;
        }
      }

      return true;
    });
  }

  public getResourceById(id: string): ResourceItem | undefined {
    return this.resources.find((r) => r.id === id);
  }

  public getResourceByName(name: string): ResourceItem | undefined {
    const norm = name.toLowerCase().trim();
    return this.resources.find(
      (r) => r.name.toLowerCase().includes(norm) || norm.includes(r.name.toLowerCase())
    );
  }

  public getSelectedResourceId(): string {
    return this.selectedResourceId;
  }

  public setSelectedResource(id: string): void {
    this.selectedResourceId = id;
    this.notifyListeners();
  }

  public getSelectedResource(): ResourceItem {
    const found = this.getResourceById(this.selectedResourceId);
    return found || this.resources[0];
  }

  /**
   * Computes human-friendly data freshness indicators and color themes.
   */
  public getFreshnessInfo(lastSyncedAt: number): FreshnessInfo {
    const elapsedSec = Math.max(0, Math.floor((Date.now() - lastSyncedAt) / 1000));
    const elapsedMin = Math.floor(elapsedSec / 60);

    const date = new Date(lastSyncedAt);
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    const secs = date.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${mins}:${secs}`;

    if (elapsedMin < 15) {
      return {
        label: elapsedMin === 0 ? 'Just now' : `${elapsedMin}m ago`,
        status: 'fresh',
        formattedTime,
        color: '#167044', // Green
        badgeBg: '#E8F5EC',
      };
    } else if (elapsedMin < 60) {
      return {
        label: `${elapsedMin}m ago`,
        status: 'recent',
        formattedTime,
        color: '#B45309', // Amber / Warning
        badgeBg: '#FEF3C7',
      };
    } else {
      const elapsedHours = Math.floor(elapsedMin / 60);
      return {
        label: `${elapsedHours}h ago`,
        status: 'stale',
        formattedTime,
        color: '#DC2626', // Red
        badgeBg: '#FEE2E2',
      };
    }
  }

  /**
   * Simulates an offline mesh relay ping/synchronization for a resource.
   * Updates lastSyncedAt to now, updates confirmations, and notifies listeners.
   */
  public refreshMeshSync(resourceId?: string): { success: boolean; message: string } {
    const targetId = resourceId || this.selectedResourceId;
    const item = this.resources.find((r) => r.id === targetId);

    if (item) {
      item.lastSyncedAt = Date.now();
      item.verifiedAt = Date.now();
      item.confirmations += 1;
      this.notifyListeners();
      return {
        success: true,
        message: `Updated ${item.name} telemetry via Mesh Hop #${item.meshHops} (${item.verifiedByNode}).`,
      };
    }

    // If no specific item, update all
    const now = Date.now();
    this.resources.forEach((r) => {
      r.lastSyncedAt = now;
      r.confirmations += 1;
    });
    this.notifyListeners();
    return {
      success: true,
      message: 'All 8 offline disaster relief resource records refreshed across mesh relays.',
    };
  }

  /**
   * Updates occupancy of a resource (e.g. volunteer updating intake).
   */
  public updateCapacity(resourceId: string, occupied: number): void {
    const item = this.resources.find((r) => r.id === resourceId);
    if (!item) return;

    item.occupiedCapacity = Math.min(item.totalCapacity, Math.max(0, occupied));
    item.availableCapacity = item.totalCapacity - item.occupiedCapacity;

    if (item.availableCapacity === 0) {
      item.status = 'FULL';
    } else if (item.occupiedCapacity / item.totalCapacity >= 0.8) {
      item.status = 'LIMITED';
    } else {
      item.status = 'OPEN';
    }

    item.lastSyncedAt = Date.now();
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l());
  }
}

export const resourceService = ResourceService.getInstance();
