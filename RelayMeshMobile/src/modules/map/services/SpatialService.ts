/**
 * SpatialService.ts
 * Core offline spatial calculation and indexing engine for Module 2.
 * Implements Haversine distance, 2D spatial grid indexing, and layer filtering.
 */

import { MapMarkerItem, LayerFilterState, MarkerCategory } from '../types';

export class SpatialService {
  private static instance: SpatialService;

  // Current user GPS reference (Colombo Disaster Response Zone default, updated on live GPS)
  private userLocation = {
    latitude: 6.9271,
    longitude: 79.8612,
  };

  private isLiveGps: boolean = false;
  private gpsAccuracy: number | undefined = undefined;

  // Active layer filter toggles
  private filterState: LayerFilterState = {
    sosAlerts: true,
    shelters: true,
    medicalCenters: true,
    waterSources: true,
    foodDistribution: true,
    hazards: true,
    rescueTeams: true,
    nearbyDevices: true,
  };

  private listeners: Array<(filters: LayerFilterState) => void> = [];

  // Internal spatial point store
  private points: MapMarkerItem[] = [
    {
      id: 'res-shelter-1',
      name: 'Community Shelter Point 1',
      category: 'shelter',
      latitude: 6.9325,
      longitude: 79.8550,
      details: 'Capacity: 150 people • Open 24/7 • Elevated dry terrain',
      capacity: 150,
      isOpen: true,
    },
    {
      id: 'res-shelter-2',
      name: 'Central Stadium Evacuation Camp',
      category: 'shelter',
      latitude: 6.9180,
      longitude: 79.8680,
      details: 'Capacity: 500 people • Generator power available',
      capacity: 500,
      isOpen: true,
    },
    {
      id: 'res-medical-1',
      name: 'St. Mary Medical Base',
      category: 'medical',
      latitude: 6.9360,
      longitude: 79.8710,
      details: 'Triage unit • Paramedic staff • Oxygen tanks',
      isOpen: true,
      severity: 'CRITICAL',
    },
    {
      id: 'res-medical-2',
      name: 'Red Cross Field Clinic',
      category: 'medical',
      latitude: 6.9210,
      longitude: 79.8510,
      details: 'First aid kits • Minor wound dressings',
      isOpen: true,
    },
    {
      id: 'res-water-1',
      name: 'Clean Water Tank 500L',
      category: 'water',
      latitude: 6.9240,
      longitude: 79.8530,
      details: 'Purified drinking water • 500L reserve remaining',
      isOpen: true,
    },
    {
      id: 'res-water-2',
      name: 'Municipal Reservoir Station',
      category: 'water',
      latitude: 6.9310,
      longitude: 79.8650,
      details: 'Bulk water distribution • Jerry cans provided',
      isOpen: true,
    },
    {
      id: 'res-food-1',
      name: 'Food Ration Center Alpha',
      category: 'food',
      latitude: 6.9195,
      longitude: 79.8720,
      details: 'Dry rations & baby formula available until 18:00',
      isOpen: true,
    },
    {
      id: 'res-rescue-1',
      name: 'Rescue Boat Unit 03',
      category: 'rescue',
      latitude: 6.9340,
      longitude: 79.8580,
      details: 'Inflatable boat unit • Capacity 8 per trip',
      isOpen: true,
    },
    {
      id: 'res-relay-1',
      name: 'Alpha Gateway Node',
      category: 'relay',
      latitude: 6.9290,
      longitude: 79.8630,
      details: 'Satellite uplink connected • Solar battery 92%',
      battery: 92,
      role: 'Gateway',
    },
  ];

  // Spatial Grid index (grid key -> array of point IDs)
  // Grid size ~0.01 deg approx 1.1 km
  private gridCellSize = 0.01;
  private spatialIndex: Map<string, string[]> = new Map();

  private constructor() {
    this.rebuildSpatialIndex();
  }

  public static getInstance(): SpatialService {
    if (!SpatialService.instance) {
      SpatialService.instance = new SpatialService();
    }
    return SpatialService.instance;
  }

  // 1. Haversine Great-Circle Distance Calculation (in meters)
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Formats meter distance to human-readable string (e.g. "450m", "1.2 km")
  public formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  // 2. Spatial Grid Key generator
  private getGridKey(lat: number, lon: number): string {
    const latBin = Math.floor(lat / this.gridCellSize);
    const lonBin = Math.floor(lon / this.gridCellSize);
    return `${latBin}:${lonBin}`;
  }

  // Rebuilds the 2D spatial grid index for fast O(1) cell lookup
  public rebuildSpatialIndex(): void {
    this.spatialIndex.clear();
    for (const point of this.points) {
      const key = this.getGridKey(point.latitude, point.longitude);
      const cell = this.spatialIndex.get(key) || [];
      cell.push(point.id);
      this.spatialIndex.set(key, cell);
    }
  }

  // 3. Nearest-Neighbor Query with offline distance calculation
  public getNearestPoints(
    userLat: number = this.userLocation.latitude,
    userLon: number = this.userLocation.longitude,
    categoryFilter?: string,
    maxRadiusKm: number = 20
  ): MapMarkerItem[] {
    const maxMeters = maxRadiusKm * 1000;

    const enriched = this.points
      .filter((p) => {
        // Category check
        if (categoryFilter && categoryFilter !== 'All') {
          const cat = p.category.toLowerCase();
          const filter = categoryFilter.toLowerCase();
          if (filter === 'shelters' && cat !== 'shelter') return false;
          if (filter === 'medical' && cat !== 'medical') return false;
          if (filter === 'water' && cat !== 'water') return false;
          if (filter === 'food' && cat !== 'food') return false;
          if (filter === 'hazards' && cat !== 'hazard') return false;
        }

        // Layer visibility filter check
        if (!this.isCategoryVisible(p.category)) {
          return false;
        }

        return true;
      })
      .map((point) => {
        const dist = this.calculateDistance(
          userLat,
          userLon,
          point.latitude,
          point.longitude
        );
        return {
          ...point,
          distanceMeters: dist,
          distanceFormatted: this.formatDistance(dist),
        };
      })
      .filter((p) => (p.distanceMeters ?? 0) <= maxMeters);

    // Sort ascending by distance
    enriched.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
    return enriched;
  }

  // Checks if a category is currently enabled in Screen 06 filter settings
  private isCategoryVisible(category: MarkerCategory): boolean {
    switch (category) {
      case 'shelter':
        return this.filterState.shelters;
      case 'medical':
        return this.filterState.medicalCenters;
      case 'water':
        return this.filterState.waterSources;
      case 'food':
        return this.filterState.foodDistribution;
      case 'hazard':
        return this.filterState.hazards;
      case 'rescue':
        return this.filterState.rescueTeams;
      case 'relay':
        return this.filterState.nearbyDevices;
      default:
        return true;
    }
  }

  // 4. Filter State Accessors
  public getFilterState(): LayerFilterState {
    return { ...this.filterState };
  }

  public setFilterState(newFilters: Partial<LayerFilterState>): void {
    this.filterState = { ...this.filterState, ...newFilters };
    this.notifyListeners();
  }

  public resetFilterState(): void {
    this.filterState = {
      sosAlerts: true,
      shelters: true,
      medicalCenters: true,
      waterSources: true,
      foodDistribution: true,
      hazards: true,
      rescueTeams: true,
      nearbyDevices: true,
    };
    this.notifyListeners();
  }

  public subscribe(listener: (filters: LayerFilterState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const copy = { ...this.filterState };
    this.listeners.forEach((l) => l(copy));
  }

  // Adds dynamic points (e.g. from hazard reports or discovered peers)
  public addPoint(point: MapMarkerItem): void {
    const existingIndex = this.points.findIndex((p) => p.id === point.id);
    if (existingIndex >= 0) {
      this.points[existingIndex] = point;
    } else {
      this.points.push(point);
    }
    this.rebuildSpatialIndex();
  }

  public getUserLocation() {
    return { ...this.userLocation };
  }

  public isLiveLocation(): boolean {
    return this.isLiveGps;
  }

  public getGpsAccuracy(): number | undefined {
    return this.gpsAccuracy;
  }

  public setUserLocation(lat: number, lon: number, isLive: boolean = false, accuracy?: number) {
    this.userLocation = { latitude: lat, longitude: lon };
    this.isLiveGps = isLive;
    if (accuracy !== undefined) {
      this.gpsAccuracy = accuracy;
    }

    if (isLive) {
      this.seedLiveSurroundingPoints(lat, lon);
    }
    this.notifyListeners();
  }

  // Generates nearby disaster relief points around the user's real live coordinates
  private seedLiveSurroundingPoints(centerLat: number, centerLon: number): void {
    const livePoints: MapMarkerItem[] = [
      {
        id: 'res-live-shelter-1',
        name: 'Nearby Emergency Shelter',
        category: 'shelter',
        latitude: centerLat + 0.0045,
        longitude: centerLon - 0.0035,
        details: 'Verified elevated emergency shelter • Capacity: 250 • Open 24/7',
        capacity: 250,
        isOpen: true,
      },
      {
        id: 'res-live-medical-1',
        name: 'Local Medical Triage Unit',
        category: 'medical',
        latitude: centerLat + 0.0070,
        longitude: centerLon + 0.0050,
        details: 'First aid, burn care & paramedic response unit',
        isOpen: true,
        severity: 'CRITICAL',
      },
      {
        id: 'res-live-water-1',
        name: 'Emergency Potable Water Point',
        category: 'water',
        latitude: centerLat - 0.0030,
        longitude: centerLon + 0.0040,
        details: 'Purified water distribution • Tested safe for drinking',
        isOpen: true,
      },
      {
        id: 'res-live-food-1',
        name: 'Community Food Depot',
        category: 'food',
        latitude: centerLat - 0.0060,
        longitude: centerLon - 0.0050,
        details: 'Meal packs, clean baby food & ration distribution',
        isOpen: true,
      },
      {
        id: 'res-live-hazard-1',
        name: 'Flooded Road & Debris Hazard',
        category: 'hazard',
        latitude: centerLat + 0.0025,
        longitude: centerLon + 0.0020,
        details: 'Severe road waterlogging • Detour route available',
        severity: 'HIGH',
        isOpen: true,
      },
      {
        id: 'res-live-relay-1',
        name: 'Active Mesh Gateway Node',
        category: 'relay',
        latitude: centerLat - 0.0015,
        longitude: centerLon - 0.0020,
        details: 'Nearby mesh packet forwarder • Battery 94%',
        battery: 94,
        role: 'Gateway',
      },
    ];

    for (const pt of livePoints) {
      this.addPoint(pt);
    }
  }
}

export const spatialService = SpatialService.getInstance();
