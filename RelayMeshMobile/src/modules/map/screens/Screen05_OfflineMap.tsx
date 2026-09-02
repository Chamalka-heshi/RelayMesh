import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Card, Colors, Typography } from '../../../shared';
import { spatialService } from '../services/SpatialService';
import { hazardService } from '../services/HazardService';
import { tileCacheService } from '../services/TileCacheService';
import { MapMarkerItem } from '../types';

interface Props {
  onSelectResource?: (resourceName: string) => void;
  onFilterPress?: () => void;
  onNavigateHazard?: (hazardId: string) => void;
}

export const Screen05_OfflineMap: React.FC<Props> = ({
  onSelectResource,
  onFilterPress,
  onNavigateHazard,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVersion, setFilterVersion] = useState(0);

  // Live GPS state
  const [isLiveGps, setIsLiveGps] = useState(spatialService.isLiveLocation());
  const [gpsAccuracy, setGpsAccuracy] = useState<number | undefined>(
    spatialService.getGpsAccuracy()
  );

  // Interactive Zoom Level (0.75x to 2.5x)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Request & listen to Live GPS from device or browser
  const requestLiveGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          spatialService.setUserLocation(latitude, longitude, true, accuracy);
          setIsLiveGps(true);
          setGpsAccuracy(accuracy);
          setFilterVersion((v) => v + 1);
        },
        (err) => {
          console.warn('Geolocation access failed or denied:', err.message);
          Alert.alert(
            'GPS Permission Notice',
            'Could not access live device GPS. Falling back to the Colombo disaster simulation baseline.'
          );
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    } else {
      Alert.alert(
        'GPS Unavailable',
        'Device geolocation API is not supported in this runtime. Running in simulation mode.'
      );
    }
  };

  useEffect(() => {
    // Attempt automatic live GPS acquisition on mount
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          spatialService.setUserLocation(latitude, longitude, true, accuracy);
          setIsLiveGps(true);
          setGpsAccuracy(accuracy);
          setFilterVersion((v) => v + 1);
        },
        (err) => {
          // Keep simulated default silently
          console.log('[Screen05] Using baseline disaster coordinates:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );

      // Watch for position updates as device moves
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          spatialService.setUserLocation(latitude, longitude, true, accuracy);
          setIsLiveGps(true);
          setGpsAccuracy(accuracy);
          setFilterVersion((v) => v + 1);
        },
        undefined,
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  // Subscribe to layer filter changes (from Screen 06)
  useEffect(() => {
    const unsubscribe = spatialService.subscribe(() => {
      setFilterVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const userLocation = spatialService.getUserLocation();

  // Query and sort nearest points with real Haversine distance
  const points = useMemo(() => {
    let pts = spatialService.getNearestPoints(
      userLocation.latitude,
      userLocation.longitude,
      selectedFilter
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pts = pts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.details && p.details.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return pts;
  }, [selectedFilter, searchQuery, filterVersion, userLocation]);

  // Selected marker for bottom detail sheet
  const [selectedItem, setSelectedItem] = useState<MapMarkerItem | null>(null);

  useEffect(() => {
    if (points.length > 0 && !selectedItem) {
      setSelectedItem(points[0]);
    } else if (selectedItem && !points.some((p) => p.id === selectedItem.id)) {
      setSelectedItem(points[0] || null);
    }
  }, [points]);

  const filterChips = ['All', 'Shelters', 'Medical', 'Water', 'Food', 'Hazards'];

  // Dynamic Viewport Bounds centered around the user's active position
  // Span of ~0.025 degrees latitude (~2.7 km) and ~0.03 degrees longitude (~3.3 km)
  const latSpan = 0.024;
  const lonSpan = 0.030;
  const minLat = userLocation.latitude - latSpan / 2;
  const maxLat = userLocation.latitude + latSpan / 2;
  const minLon = userLocation.longitude - lonSpan / 2;
  const maxLon = userLocation.longitude + lonSpan / 2;

  const getPositionPercent = (lat: number, lon: number) => {
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
    const clampedLon = Math.max(minLon, Math.min(maxLon, lon));
    const top = Math.round(((maxLat - clampedLat) / (maxLat - minLat)) * 80 + 10);
    const left = Math.round(((clampedLon - minLon) / (maxLon - minLon)) * 80 + 10);
    return { top: `${top}%`, left: `${left}%` };
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(parseFloat((prev + 0.25).toFixed(2)), 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(parseFloat((prev - 0.25).toFixed(2)), 0.75));
  };

  const handleRecenter = () => {
    setZoomLevel(1.0);
    if (points.length > 0) {
      setSelectedItem(points[0]);
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'shelter':
        return '⛺';
      case 'medical':
        return '🏥';
      case 'water':
        return '💧';
      case 'food':
        return '🍞';
      case 'hazard':
        return '⚠️';
      case 'rescue':
        return '🚤';
      case 'relay':
        return '📡';
      default:
        return '📍';
    }
  };

  const getCategoryColor = (category: string, severity?: string) => {
    if (category === 'hazard') {
      return severity === 'CRITICAL' ? Colors.sosRed : Colors.warning;
    }
    switch (category) {
      case 'shelter':
        return Colors.primary;
      case 'medical':
        return Colors.sosRed;
      case 'water':
        return Colors.waterBlue;
      case 'food':
        return Colors.foodOrange;
      case 'rescue':
        return '#0284C7';
      case 'relay':
        return '#8B5CF6';
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <View style={styles.topSearchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search offline map (shelters, water, medical)..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Horizontal Chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {filterChips.map((chip) => {
            const isSelected = selectedFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedFilter(chip)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* GPS Mode Status Bar */}
      <View style={styles.gpsStatusBar}>
        <View style={styles.gpsStatusLeft}>
          <View
            style={[
              styles.gpsDot,
              { backgroundColor: isLiveGps ? '#10B981' : '#F59E0B' },
            ]}
          />
          <Text style={styles.gpsStatusText}>
            {isLiveGps
              ? `LIVE GPS: ${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°`
              : 'SIMULATED DISASTER REGION: Colombo Central'}
            {isLiveGps && gpsAccuracy
              ? ` (±${Math.round(gpsAccuracy)}m)`
              : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.gpsToggleBtn}
          onPress={requestLiveGPS}
          activeOpacity={0.7}
        >
          <Text style={styles.gpsToggleBtnText}>
            {isLiveGps ? '🔄 REFRESH GPS' : '📍 USE LIVE GPS'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vector Offline Map Canvas with Interactive Zoom */}
      <View style={styles.mapCanvas}>
        {/* Zoomable Vector Container */}
        <View
          style={[
            styles.zoomableLayer,
            { transform: [{ scale: zoomLevel }] },
          ]}
        >
          {/* Vector Grid & Road Topography */}
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />

          {/* Dynamic Markers with true geospatial positions & Haversine distance */}
          {points.map((p) => {
            const pos = getPositionPercent(p.latitude, p.longitude);
            const isSelected = selectedItem?.id === p.id;
            const pinColor = getCategoryColor(p.category, p.severity);

            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.markerWrapper,
                  pos as any,
                  isSelected && styles.markerWrapperSelected,
                ]}
                onPress={() => {
                  setSelectedItem(p);
                  if (p.category === 'hazard') {
                    hazardService.setActiveHazard(p.id);
                  }
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: pinColor },
                    isSelected && styles.markerPinSelected,
                  ]}
                >
                  <Text style={styles.markerEmoji}>
                    {getCategoryEmoji(p.category)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.markerLabel,
                    isSelected && styles.markerLabelSelected,
                  ]}
                  numberOfLines={1}
                >
                  {p.name.length > 14 ? p.name.substring(0, 13) + '…' : p.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* User GPS Pulse Marker (Accurately Centered) */}
          {(() => {
            const userPos = getPositionPercent(
              userLocation.latitude,
              userLocation.longitude
            );
            return (
              <View style={[styles.markerWrapper, userPos as any]}>
                <View style={styles.userPulseRing}>
                  <View style={styles.userPulseDot} />
                </View>
                <Text style={[styles.markerLabel, styles.userLabel]}>YOU</Text>
              </View>
            );
          })()}
        </View>

        {/* Map Floating Navigation & Zoom Tools */}
        <View style={styles.mapTools}>
          {/* Zoom Level Indicator */}
          <View style={styles.zoomBadge}>
            <Text style={styles.zoomBadgeText}>{zoomLevel.toFixed(2)}x</Text>
          </View>
          {/* Zoom In Button */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={handleZoomIn}
            activeOpacity={0.7}
          >
            <Text style={styles.toolText}>+</Text>
          </TouchableOpacity>
          {/* Zoom Out Button */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={handleZoomOut}
            activeOpacity={0.7}
          >
            <Text style={styles.toolText}>−</Text>
          </TouchableOpacity>
          {/* Recenter Button */}
          <TouchableOpacity
            style={[styles.toolBtn, styles.recenterBtn]}
            onPress={handleRecenter}
            activeOpacity={0.7}
          >
            <Text style={styles.toolText}>🎯</Text>
          </TouchableOpacity>
        </View>

        {/* Offline Vector Map MBTiles Cache Status Banner */}
        <View style={styles.offlineMapBadge}>
          <Text style={styles.offlineMapBadgeText}>
            {tileCacheService.getOfflineStatusSummary()}
          </Text>
        </View>
      </View>

      {/* Draggable Nearest Resource / Hazard Summary Sheet */}
      {selectedItem && (
        <View style={styles.bottomCardWrapper}>
          <Card style={styles.bottomCard}>
            <View style={styles.bottomCardHeader}>
              <View style={styles.bottomCardTitleCol}>
                <Text style={Typography.h3} numberOfLines={1}>
                  {selectedItem.name}
                </Text>
                <Text style={Typography.caption}>
                  📍 {selectedItem.distanceFormatted || 'Nearby'} away •{' '}
                  {selectedItem.details || 'Active relief point'}
                </Text>
              </View>
              <View
                style={[
                  styles.openBadge,
                  selectedItem.category === 'hazard' && styles.hazardBadge,
                ]}
              >
                <Text
                  style={[
                    styles.openBadgeText,
                    selectedItem.category === 'hazard' &&
                      styles.hazardBadgeText,
                  ]}
                >
                  {selectedItem.category === 'hazard'
                    ? selectedItem.severity || 'WARNING'
                    : 'OPEN'}
                </Text>
              </View>
            </View>

            <View style={styles.facilityRow}>
              {selectedItem.category === 'shelter' && (
                <>
                  <Text style={styles.facilityTag}>💧 Drinking Water</Text>
                  <Text style={styles.facilityTag}>🏥 First Aid</Text>
                  <Text style={styles.facilityTag}>🍞 Food Rations</Text>
                </>
              )}
              {selectedItem.category === 'hazard' && (
                <>
                  <Text style={styles.facilityTag}>⚠️ Road Blockage</Text>
                  <Text style={styles.facilityTag}>🧭 Safe Bypass Route Available</Text>
                </>
              )}
              {selectedItem.category === 'medical' && (
                <>
                  <Text style={styles.facilityTag}>🩺 Triage Unit</Text>
                  <Text style={styles.facilityTag}>🚑 Emergency Transport</Text>
                </>
              )}
              {selectedItem.category === 'water' && (
                <>
                  <Text style={styles.facilityTag}>💧 Tested Potable</Text>
                  <Text style={styles.facilityTag}>🪣 Jerry Can Fill</Text>
                </>
              )}
              {selectedItem.category === 'food' && (
                <>
                  <Text style={styles.facilityTag}>🍞 Dry Food</Text>
                  <Text style={styles.facilityTag}>🍼 Infant Supplies</Text>
                </>
              )}
              {selectedItem.category === 'relay' && (
                <>
                  <Text style={styles.facilityTag}>📡 Relay Hop</Text>
                  <Text style={styles.facilityTag}>🔋 {selectedItem.battery}% Battery</Text>
                </>
              )}
            </View>

            {/* Direct Action Button: Hazard Detour Guidance (Screen 15) */}
            {selectedItem.category === 'hazard' && onNavigateHazard && (
              <TouchableOpacity
                style={styles.hazardActionBtn}
                onPress={() => {
                  hazardService.setActiveHazard(selectedItem.id);
                  onNavigateHazard(selectedItem.id);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.hazardActionBtnText}>
                  🧭 AVOID HAZARD & VIEW DETOUR (SCREEN 15) →
                </Text>
              </TouchableOpacity>
            )}

            {/* Direct Action Button: Resource Detail */}
            {selectedItem.category !== 'hazard' && onSelectResource && (
              <TouchableOpacity
                style={styles.resourceActionBtn}
                onPress={() => onSelectResource(selectedItem.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.resourceActionBtnText}>
                  📋 VIEW RESOURCE DETAILS →
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: Colors.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
  },
  filterIcon: {
    fontSize: 18,
  },
  chipsWrapper: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  gpsStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  gpsStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gpsStatusText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  gpsToggleBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gpsToggleBtnText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E5EFEA',
    position: 'relative',
    overflow: 'hidden',
  },
  zoomableLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#D1E3DA',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#D1E3DA',
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '35%',
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#D1E3DA',
  },
  gridLineVertical2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#D1E3DA',
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerWrapperSelected: {
    zIndex: 30,
    transform: [{ scale: 1.15 }],
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerPinSelected: {
    borderColor: '#0F172A',
    borderWidth: 3,
  },
  markerEmoji: {
    fontSize: 14,
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 2,
    maxWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  markerLabelSelected: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  userPulseRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(22, 112, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  userPulseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userLabel: {
    color: Colors.primary,
    fontWeight: '800',
  },
  mapTools: {
    position: 'absolute',
    right: 14,
    top: 14,
    gap: 8,
    zIndex: 20,
    alignItems: 'center',
  },
  zoomBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 2,
  },
  zoomBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  toolBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recenterBtn: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.primary,
  },
  toolText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  offlineMapBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: '75%',
    zIndex: 20,
  },
  offlineMapBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomCardWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    zIndex: 40,
  },
  bottomCard: {
    padding: 14,
    borderRadius: 16,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottomCardTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  openBadge: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreenBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  openBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  hazardBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  hazardBadgeText: {
    color: Colors.sosRed,
  },
  facilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  facilityTag: {
    fontSize: 11,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: Colors.textSecondary,
  },
  hazardActionBtn: {
    marginTop: 10,
    backgroundColor: Colors.sosRed,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sosRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  hazardActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resourceActionBtn: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
