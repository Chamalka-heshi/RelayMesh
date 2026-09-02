import {
  ResourceService,
  resourceService,
  ResourceItem,
} from '../src/modules/resources/services/ResourceService';

describe('Module 5: Emergency Resource Management & Offline Freshness Telemetry', () => {
  describe('1. Resource Store Initialization & Data Integrity', () => {
    it('should initialize with verified offline disaster relief resources', () => {
      const allResources = resourceService.getResources();
      expect(allResources.length).toBeGreaterThanOrEqual(7);

      allResources.forEach((res) => {
        expect(res.id).toBeDefined();
        expect(res.name).toBeDefined();
        expect(res.title).toBeDefined();
        expect(res.category).toBeDefined();
        expect(res.latitude).toBeGreaterThan(0);
        expect(res.longitude).toBeGreaterThan(0);
        expect(res.totalCapacity).toBeGreaterThan(0);
        expect(res.availableCapacity).toBeGreaterThanOrEqual(0);
        expect(res.occupiedCapacity).toBeGreaterThanOrEqual(0);
        expect(res.totalCapacity).toBe(res.occupiedCapacity + res.availableCapacity);
        expect(res.amenities.length).toBeGreaterThan(0);
        expect(res.contactInfo.coordinator).toBeDefined();
        expect(res.contactInfo.nodeId).toBeDefined();
        expect(res.contactInfo.radioChannel).toBeDefined();
        expect(res.lastSyncedAt).toBeGreaterThan(0);
        expect(res.verifiedByNode).toBeDefined();
        expect(res.meshHops).toBeGreaterThan(0);
      });
    });

    it('should cover all key disaster relief categories', () => {
      const allResources = resourceService.getResources();
      const categories = new Set(allResources.map((r) => r.category));
      expect(categories.has('shelter')).toBe(true);
      expect(categories.has('medical')).toBe(true);
      expect(categories.has('water')).toBe(true);
      expect(categories.has('food')).toBe(true);
      expect(categories.has('power')).toBe(true);
    });
  });

  describe('2. Categorized Listing & Query Filtering (Screen 13)', () => {
    it('should filter resources by category correctly', () => {
      const shelters = resourceService.getResources('Shelters');
      expect(shelters.length).toBeGreaterThanOrEqual(2);
      shelters.forEach((r) => expect(r.category).toBe('shelter'));

      const medical = resourceService.getResources('Medical');
      expect(medical.length).toBeGreaterThanOrEqual(2);
      medical.forEach((r) => expect(r.category).toBe('medical'));

      const water = resourceService.getResources('Water');
      expect(water.length).toBeGreaterThanOrEqual(2);
      water.forEach((r) => expect(r.category).toBe('water'));

      const food = resourceService.getResources('Food');
      expect(food.length).toBeGreaterThanOrEqual(1);
      food.forEach((r) => expect(r.category).toBe('food'));

      const power = resourceService.getResources('Power');
      expect(power.length).toBeGreaterThanOrEqual(1);
      power.forEach((r) => expect(r.category).toBe('power'));
    });

    it('should filter by availability status', () => {
      const availableOnly = resourceService.getResources('All', '', true);
      availableOnly.forEach((r) => {
        expect(['OPEN', 'LIMITED', 'VERIFIED']).toContain(r.status);
      });
    });

    it('should support full-text search across names, landmarks, and amenities', () => {
      const stMaryResults = resourceService.getResources('All', 'St. Mary');
      expect(stMaryResults.length).toBeGreaterThanOrEqual(1);
      expect(stMaryResults[0].name).toContain('St. Mary');

      const solarResults = resourceService.getResources('All', 'Solar');
      expect(solarResults.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('3. Resource Details, Selection & Lookup (Screen 14)', () => {
    it('should lookup resource by ID and name', () => {
      const byId = resourceService.getResourceById('res-shelter-1');
      expect(byId).toBeDefined();
      expect(byId?.name).toBe('Community Shelter Point 1');

      const byName = resourceService.getResourceByName('Central Stadium');
      expect(byName).toBeDefined();
      expect(byName?.id).toBe('res-shelter-2');
    });

    it('should track and change selected resource ID', () => {
      resourceService.setSelectedResource('res-medical-1');
      expect(resourceService.getSelectedResourceId()).toBe('res-medical-1');

      const selected = resourceService.getSelectedResource();
      expect(selected.id).toBe('res-medical-1');
      expect(selected.category).toBe('medical');
    });
  });

  describe('4. Data Freshness Timestamps & Indicators', () => {
    it('should identify fresh telemetry (< 15 minutes)', () => {
      const fourMinsAgo = Date.now() - 4 * 60 * 1000;
      const freshness = resourceService.getFreshnessInfo(fourMinsAgo);
      expect(freshness.status).toBe('fresh');
      expect(freshness.label).toBe('4m ago');
      expect(freshness.color).toBe('#167044'); // Green
    });

    it('should identify recent telemetry (15 - 60 minutes)', () => {
      const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
      const freshness = resourceService.getFreshnessInfo(thirtyMinsAgo);
      expect(freshness.status).toBe('recent');
      expect(freshness.label).toBe('30m ago');
      expect(freshness.color).toBe('#B45309'); // Amber
    });

    it('should identify stale telemetry (> 60 minutes)', () => {
      const twoHoursAgo = Date.now() - 125 * 60 * 1000;
      const freshness = resourceService.getFreshnessInfo(twoHoursAgo);
      expect(freshness.status).toBe('stale');
      expect(freshness.label).toBe('2h ago');
      expect(freshness.color).toBe('#DC2626'); // Red
    });

    it('should format timestamp string (HH:MM:SS)', () => {
      const now = Date.now();
      const freshness = resourceService.getFreshnessInfo(now);
      expect(freshness.formattedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('5. Capacity Telemetry & Dynamic State Updates', () => {
    it('should update capacity and adjust status to LIMITED when >= 80%', () => {
      const target = resourceService.getResourceById('res-shelter-1')!;
      const originalOccupied = target.occupiedCapacity;

      // Update to 85% occupancy (150 * 0.85 = 128)
      resourceService.updateCapacity('res-shelter-1', 130);
      const updated = resourceService.getResourceById('res-shelter-1')!;
      expect(updated.occupiedCapacity).toBe(130);
      expect(updated.availableCapacity).toBe(20);
      expect(updated.status).toBe('LIMITED');

      // Restore
      resourceService.updateCapacity('res-shelter-1', originalOccupied);
    });

    it('should adjust status to FULL when available spots reach 0', () => {
      const target = resourceService.getResourceById('res-shelter-1')!;
      const originalOccupied = target.occupiedCapacity;

      resourceService.updateCapacity('res-shelter-1', target.totalCapacity);
      const updated = resourceService.getResourceById('res-shelter-1')!;
      expect(updated.availableCapacity).toBe(0);
      expect(updated.status).toBe('FULL');

      // Restore
      resourceService.updateCapacity('res-shelter-1', originalOccupied);
    });
  });

  describe('6. Mesh Relay Synchronization Simulation', () => {
    it('should refresh freshness timestamp on mesh sync and notify subscribers', () => {
      let notified = false;
      const unsubscribe = resourceService.subscribe(() => {
        notified = true;
      });

      const beforeSync = Date.now();
      const result = resourceService.refreshMeshSync('res-shelter-1');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Community Shelter Point 1');
      expect(notified).toBe(true);

      const item = resourceService.getResourceById('res-shelter-1')!;
      expect(item.lastSyncedAt).toBeGreaterThanOrEqual(beforeSync);

      const freshness = resourceService.getFreshnessInfo(item.lastSyncedAt);
      expect(freshness.status).toBe('fresh');

      unsubscribe();
    });
  });
});
