import {
  spatialService,
  hazardService,
  tileCacheService,
  encodeHazardReport,
  decodeHazardReport,
  spatialBytesToBase64,
  base64ToSpatialBytes,
  ProtoHazardType,
  ProtoHazardSeverity,
} from '../src/modules/map';

describe('Module 2: Offline Spatial Vector Mapping & Hazard Reporting', () => {
  beforeEach(() => {
    spatialService.resetFilterState();
  });

  describe('1. Geodesic Distance (Haversine Formula) & Formatting', () => {
    it('should return 0 meters for identical coordinates', () => {
      const dist = spatialService.calculateDistance(6.9271, 79.8612, 6.9271, 79.8612);
      expect(dist).toBe(0);
    });

    it('should accurately calculate distance between Colombo landmarks (~1.5 km)', () => {
      // Point A: 6.9271, 79.8612
      // Point B: 6.9360, 79.8710 (~1.4 - 1.6 km)
      const dist = spatialService.calculateDistance(6.9271, 79.8612, 6.9360, 79.8710);
      expect(dist).toBeGreaterThan(1200);
      expect(dist).toBeLessThan(1800);
    });

    it('should format distances correctly in meters and kilometers', () => {
      expect(spatialService.formatDistance(350)).toBe('350m');
      expect(spatialService.formatDistance(999)).toBe('999m');
      expect(spatialService.formatDistance(1000)).toBe('1.0 km');
      expect(spatialService.formatDistance(2450)).toBe('2.5 km');
    });
  });

  describe('2. Spatial Indexing & Nearest-Neighbor Search', () => {
    it('should return nearest points sorted ascending by distance', () => {
      const userLoc = spatialService.getUserLocation();
      const nearest = spatialService.getNearestPoints(userLoc.latitude, userLoc.longitude);

      expect(nearest.length).toBeGreaterThan(0);
      for (let i = 0; i < nearest.length - 1; i++) {
        expect(nearest[i].distanceMeters!).toBeLessThanOrEqual(
          nearest[i + 1].distanceMeters!
        );
      }
    });

    it('should filter points when category filter is selected', () => {
      const userLoc = spatialService.getUserLocation();
      const shelters = spatialService.getNearestPoints(
        userLoc.latitude,
        userLoc.longitude,
        'Shelters'
      );

      expect(shelters.length).toBeGreaterThan(0);
      for (const item of shelters) {
        expect(item.category).toBe('shelter');
      }
    });

    it('should respect layer toggles from Screen 06', () => {
      const userLoc = spatialService.getUserLocation();
      const initialCount = spatialService.getNearestPoints(userLoc.latitude, userLoc.longitude).length;

      // Disable shelters layer
      spatialService.setFilterState({ shelters: false });
      const afterDisable = spatialService.getNearestPoints(userLoc.latitude, userLoc.longitude);

      expect(afterDisable.length).toBeLessThan(initialCount);
      expect(afterDisable.some((p) => p.category === 'shelter')).toBe(false);

      // Reset layer filters
      spatialService.resetFilterState();
      const afterReset = spatialService.getNearestPoints(userLoc.latitude, userLoc.longitude);
      expect(afterReset.length).toBe(initialCount);
    });
  });

  describe('3. Protobuf Spatial Payload Encoding & Decoding', () => {
    it('should round-trip encode and decode HazardReport binary payload', () => {
      const report = {
        id: 'hz-test-01',
        hazardType: ProtoHazardType.FLOOD,
        severity: ProtoHazardSeverity.CRITICAL,
        latitude: 6.9295,
        longitude: 79.8580,
        radiusMeters: 450,
        description: 'Flooded sector bridge impassable',
        reportedBy: 'Node-Rescue-Unit',
        timestamp: 1725200000,
        hopCount: 1,
        isResolved: false,
        confirmations: 3,
      };

      const encoded = encodeHazardReport(report);
      expect(encoded).toBeInstanceOf(Uint8Array);
      expect(encoded.length).toBeGreaterThan(10);
      // Magic header "RMSP"
      expect(encoded[0]).toBe(0x52);
      expect(encoded[1]).toBe(0x4d);
      expect(encoded[2]).toBe(0x53);
      expect(encoded[3]).toBe(0x50);

      const decoded = decodeHazardReport(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded!.id).toBe(report.id);
      expect(decoded!.hazardType).toBe(ProtoHazardType.FLOOD);
      expect(decoded!.severity).toBe(ProtoHazardSeverity.CRITICAL);
      expect(decoded!.latitude).toBeCloseTo(6.9295);
      expect(decoded!.longitude).toBeCloseTo(79.8580);
      expect(decoded!.radiusMeters).toBe(450);
      expect(decoded!.description).toBe(report.description);
    });

    it('should reject invalid binary payloads with bad magic header', () => {
      const invalid = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
      const decoded = decodeHazardReport(invalid);
      expect(decoded).toBeNull();
    });

    it('should convert binary to and from Base64 for mesh packet embedding', () => {
      const sample = new Uint8Array([0x52, 0x4d, 0x53, 0x50, 0x7b, 0x7d]);
      const b64 = spatialBytesToBase64(sample);
      expect(typeof b64).toBe('string');
      const recovered = base64ToSpatialBytes(b64);
      expect(recovered).toEqual(sample);
    });
  });

  describe('4. Hazard Telemetry & Detour Routing Calculation', () => {
    it('should calculate avoidance route with safe elevation and positive detour', () => {
      const activeHazard = hazardService.getActiveHazard();
      expect(activeHazard).toBeDefined();

      const route = hazardService.calculateAvoidanceRoute(activeHazard!.id);
      expect(route.bypassDistanceKm).toBeGreaterThan(0);
      expect(route.estimatedWalkMinutes).toBeGreaterThan(0);
      expect(['SAFE', 'MODERATE', 'RISK']).toContain(route.elevationSafetyScore);
      expect(route.waypoints.length).toBeGreaterThan(1);
    });

    it('should add newly reported hazard and generate protobuf payload', () => {
      const { record, protobufBase64 } = hazardService.reportHazard(
        'LANDSLIDE',
        'HIGH',
        6.9350,
        79.8620,
        'Mudslide blocking roadway',
        250
      );

      expect(record.id).toContain('hazard-');
      expect(record.hazardType).toBe('LANDSLIDE');
      expect(protobufBase64.length).toBeGreaterThan(20);

      // Verify the new hazard appears in nearest points
      const userLoc = spatialService.getUserLocation();
      const points = spatialService.getNearestPoints(userLoc.latitude, userLoc.longitude, 'Hazards');
      expect(points.some((p) => p.id === record.id)).toBe(true);
    });

    it('should mark a hazard as resolved', () => {
      const activeHazard = hazardService.getActiveHazard();
      expect(activeHazard).toBeDefined();

      const res = hazardService.resolveHazard(activeHazard!.id);
      expect(res).toBe(true);
      expect(activeHazard!.isResolved).toBe(true);
    });
  });

  describe('5. MBTiles Regional Map Tile Cache Service', () => {
    it('should provide cached regional map bundle metadata', () => {
      const bundles = tileCacheService.getBundles();
      expect(bundles.length).toBeGreaterThan(0);

      const colombo = bundles.find((b) => b.bundleId === 'mbtiles-colombo-metro-v1');
      expect(colombo).toBeDefined();
      expect(colombo!.isCached).toBe(true);
      expect(colombo!.minZoom).toBe(10);
      expect(colombo!.maxZoom).toBe(16);
      expect(colombo!.sizeMb).toBeGreaterThan(0);
    });

    it('should verify if coordinates are covered by offline cached tiles', () => {
      // Inside Colombo bounds (lat: 6.9271, lon: 79.8612)
      expect(tileCacheService.isPointWithinOfflineCache(6.9271, 79.8612)).toBe(true);

      // Far outside bounds (lat: 9.6615, lon: 80.0255 - Jaffna)
      expect(tileCacheService.isPointWithinOfflineCache(9.6615, 80.0255)).toBe(false);
    });

    it('should return offline status summary string', () => {
      const summary = tileCacheService.getOfflineStatusSummary();
      expect(summary).toContain('OFFLINE VECTOR MAP ACTIVE');
    });
  });
});
