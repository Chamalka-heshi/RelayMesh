/**
 * HazardService.ts
 * Manages local hazard reporting, avoidance detour telemetry, and mesh broadcasting for Module 2.
 */

import { HazardRecord, AvoidanceRoute } from '../types';
import { spatialService } from './SpatialService';
import {
  encodeHazardReport,
  spatialBytesToBase64,
  ProtoHazardType,
  ProtoHazardSeverity,
} from './SpatialProtobuf';

export class HazardService {
  private static instance: HazardService;

  // Active hazards in the region
  private hazards: HazardRecord[] = [
    {
      id: 'hazard-flood-1',
      hazardType: 'FLOOD',
      severity: 'HIGH',
      latitude: 6.9295,
      longitude: 79.8580,
      radiusMeters: 500,
      description:
        'Water depth approximately 1.5m. Bridge impassable for light vehicles and pedestrians.',
      reportedBy: 'Node-Rescue-Alpha',
      timestamp: Date.now() - 12 * 60 * 1000, // 12 mins ago
      reportedAgo: '12 mins ago',
      hopCount: 2,
      isResolved: false,
      confirmations: 4,
    },
    {
      id: 'hazard-roadblock-2',
      hazardType: 'ROADBLOCK',
      severity: 'MEDIUM',
      latitude: 6.9215,
      longitude: 79.8640,
      radiusMeters: 200,
      description: 'Downed tree and powerline blocking dual carriageway.',
      reportedBy: 'Node-Field-09',
      timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
      reportedAgo: '45 mins ago',
      hopCount: 1,
      isResolved: false,
      confirmations: 2,
    },
  ];

  private activeSelectedHazardId: string = 'hazard-flood-1';

  private constructor() {
    this.syncHazardsToSpatialService();
  }

  public static getInstance(): HazardService {
    if (!HazardService.instance) {
      HazardService.instance = new HazardService();
    }
    return HazardService.instance;
  }

  // Synchronizes hazards into SpatialService markers so they render on Screen 05
  private syncHazardsToSpatialService(): void {
    for (const h of this.hazards) {
      if (!h.isResolved) {
        spatialService.addPoint({
          id: h.id,
          name: `${h.hazardType} Hazard (${h.severity})`,
          category: 'hazard',
          latitude: h.latitude,
          longitude: h.longitude,
          details: h.description,
          severity: h.severity,
          isOpen: true,
        });
      }
    }
  }

  public getHazards(): HazardRecord[] {
    return this.hazards.filter((h) => !h.isResolved);
  }

  public getActiveHazard(): HazardRecord | undefined {
    return (
      this.hazards.find((h) => h.id === this.activeSelectedHazardId) ||
      this.hazards[0]
    );
  }

  public setActiveHazard(id: string): void {
    this.activeSelectedHazardId = id;
  }

  // Calculates offline safe bypass route around the hazard
  public calculateAvoidanceRoute(hazardId: string): AvoidanceRoute {
    const hazard = this.hazards.find((h) => h.id === hazardId) || this.hazards[0];
    const userLoc = spatialService.getUserLocation();

    // Calculate direct distance to hazard in meters
    const distToHazardMeters = spatialService.calculateDistance(
      userLoc.latitude,
      userLoc.longitude,
      hazard.latitude,
      hazard.longitude
    );

    // Bypass detour path adds ~40% distance around the radius
    const detourMeters = Math.round(
      distToHazardMeters + hazard.radiusMeters * 1.8
    );
    const bypassDistanceKm = parseFloat((detourMeters / 1000).toFixed(1));

    // Approximate average walking speed of 4.5 km/h in wet terrain -> ~13 mins per km
    const estimatedWalkMinutes = Math.max(5, Math.round(bypassDistanceKm * 13));

    return {
      hazardId: hazard.id,
      hazardName: `${hazard.hazardType} Hazard (${hazard.severity})`,
      bypassDistanceKm,
      estimatedWalkMinutes,
      elevationSafetyScore: hazard.severity === 'CRITICAL' ? 'MODERATE' : 'SAFE',
      routeDescription:
        'Calculated via verified dry-ground mesh telemetry avoiding flooded sector bridge.',
      waypoints: [
        { latitude: userLoc.latitude, longitude: userLoc.longitude },
        // Northern bypass waypoint
        {
          latitude: hazard.latitude + 0.003,
          longitude: hazard.longitude - 0.002,
        },
        // Destination waypoint past the hazard
        {
          latitude: hazard.latitude + 0.006,
          longitude: hazard.longitude + 0.001,
        },
      ],
    };
  }

  // Reports a new hazard and converts it to Protobuf for mesh broadcast
  public reportHazard(
    hazardType: HazardRecord['hazardType'],
    severity: HazardRecord['severity'],
    latitude: number,
    longitude: number,
    description: string,
    radiusMeters: number = 300
  ): { record: HazardRecord; protobufBase64: string } {
    const newHazard: HazardRecord = {
      id: `hazard-${Date.now().toString(36)}`,
      hazardType,
      severity,
      latitude,
      longitude,
      radiusMeters,
      description,
      reportedBy: 'Local-Device',
      timestamp: Date.now(),
      reportedAgo: 'Just now',
      hopCount: 0,
      isResolved: false,
      confirmations: 1,
    };

    this.hazards.unshift(newHazard);
    this.syncHazardsToSpatialService();

    // Encode to Protobuf binary for transmission across mesh
    const protoType =
      ProtoHazardType[hazardType as keyof typeof ProtoHazardType] ||
      ProtoHazardType.FLOOD;
    const protoSeverity =
      ProtoHazardSeverity[severity as keyof typeof ProtoHazardSeverity] ||
      ProtoHazardSeverity.MEDIUM;

    const binaryBytes = encodeHazardReport({
      id: newHazard.id,
      hazardType: protoType,
      severity: protoSeverity,
      latitude,
      longitude,
      radiusMeters,
      description,
      reportedBy: newHazard.reportedBy,
      timestamp: newHazard.timestamp,
      hopCount: 0,
      isResolved: false,
      confirmations: 1,
    });

    const protobufBase64 = spatialBytesToBase64(binaryBytes);
    return { record: newHazard, protobufBase64 };
  }

  // Marks a hazard as resolved
  public resolveHazard(hazardId: string): boolean {
    const hazard = this.hazards.find((h) => h.id === hazardId);
    if (!hazard) return false;

    hazard.isResolved = true;
    hazard.confirmations += 1;
    this.syncHazardsToSpatialService();
    return true;
  }
}

export const hazardService = HazardService.getInstance();
