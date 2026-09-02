/**
 * Module 2: Offline Spatial Vector Mapping & Hazard Reporting Types
 */

export type MarkerCategory =
  | 'shelter'
  | 'medical'
  | 'water'
  | 'food'
  | 'hazard'
  | 'rescue'
  | 'relay';

export interface MapMarkerItem {
  id: string;
  name: string;
  category: MarkerCategory;
  latitude: number;
  longitude: number;
  details?: string;
  distanceMeters?: number;
  distanceFormatted?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  capacity?: number;
  isOpen?: boolean;
  battery?: number;
  role?: string;
}

export interface LayerFilterState {
  sosAlerts: boolean;
  shelters: boolean;
  medicalCenters: boolean;
  waterSources: boolean;
  foodDistribution: boolean;
  hazards: boolean;
  rescueTeams: boolean;
  nearbyDevices: boolean;
}

export interface HazardRecord {
  id: string;
  hazardType: 'FLOOD' | 'ROADBLOCK' | 'LANDSLIDE' | 'DOWNED_POWERLINE' | 'BRIDGE_COLLAPSE' | 'FIRE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  radiusMeters: number;
  description: string;
  reportedBy: string;
  timestamp: number;
  reportedAgo?: string;
  hopCount: number;
  isResolved: boolean;
  confirmations: number;
}

export interface AvoidanceRoute {
  hazardId: string;
  hazardName: string;
  bypassDistanceKm: number;
  estimatedWalkMinutes: number;
  elevationSafetyScore: 'SAFE' | 'MODERATE' | 'RISK';
  routeDescription: string;
  waypoints: Array<{ latitude: number; longitude: number }>;
}

export interface MBTileBundleInfo {
  bundleId: string;
  regionName: string;
  minZoom: number;
  maxZoom: number;
  bounds: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  };
  cachedTileCount: number;
  sizeMb: number;
  isCached: boolean;
  version: string;
}
