/**
 * TileCacheService.ts
 * Manages regional .mbtiles offline map bundles and tile cache indexing for Module 2.
 */

import { MBTileBundleInfo } from '../types';

export class TileCacheService {
  private static instance: TileCacheService;

  // Cached regional offline vector map bundles
  private bundles: MBTileBundleInfo[] = [
    {
      bundleId: 'mbtiles-colombo-metro-v1',
      regionName: 'Colombo Metro & Flood Plain',
      minZoom: 10,
      maxZoom: 16,
      bounds: {
        minLon: 79.8000,
        minLat: 6.8500,
        maxLon: 79.9500,
        maxLat: 7.0200,
      },
      cachedTileCount: 4280,
      sizeMb: 48.2,
      isCached: true,
      version: '1.2.0',
    },
    {
      bundleId: 'mbtiles-western-province-v1',
      regionName: 'Western Province Regional Corridor',
      minZoom: 8,
      maxZoom: 14,
      bounds: {
        minLon: 79.7000,
        minLat: 6.5000,
        maxLon: 80.2000,
        maxLat: 7.3000,
      },
      cachedTileCount: 12450,
      sizeMb: 112.5,
      isCached: false,
      version: '1.0.0',
    },
  ];

  private constructor() {}

  public static getInstance(): TileCacheService {
    if (!TileCacheService.instance) {
      TileCacheService.instance = new TileCacheService();
    }
    return TileCacheService.instance;
  }

  // Returns all available regional map bundles
  public getBundles(): MBTileBundleInfo[] {
    return [...this.bundles];
  }

  // Gets the currently active cached bundle
  public getActiveCachedBundle(): MBTileBundleInfo | undefined {
    return this.bundles.find((b) => b.isCached);
  }

  // Checks if a given GPS point is covered by offline vector tiles
  public isPointWithinOfflineCache(lat: number, lon: number): boolean {
    const active = this.getActiveCachedBundle();
    if (!active) return false;

    return (
      lon >= active.bounds.minLon &&
      lon <= active.bounds.maxLon &&
      lat >= active.bounds.minLat &&
      lat <= active.bounds.maxLat
    );
  }

  // Summary status string for Screen 05 header badge
  public getOfflineStatusSummary(): string {
    const active = this.getActiveCachedBundle();
    if (!active) return '⚠️ NO OFFLINE TILES';
    return `📶 OFFLINE VECTOR MAP ACTIVE • ${active.regionName} (${active.sizeMb} MB CACHED)`;
  }
}

export const tileCacheService = TileCacheService.getInstance();
