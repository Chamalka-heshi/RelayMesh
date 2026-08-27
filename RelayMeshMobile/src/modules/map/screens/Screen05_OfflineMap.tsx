import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, Colors, Typography } from '../../../shared';

interface Props {
  onSelectResource?: (resourceName: string) => void;
  onFilterPress?: () => void;
}

export const Screen05_OfflineMap: React.FC<Props> = ({
  onSelectResource,
  onFilterPress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChips = ['All', 'Shelters', 'Medical', 'Water', 'Food', 'Hazards'];

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {filterChips.map((chip) => {
            const isSelected = selectedFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedFilter(chip)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Simulated Vector Offline Map Canvas */}
      <View style={styles.mapCanvas}>
        {/* Grid Lines representing offline road topography */}
        <View style={styles.gridLineHorizontal1} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical1} />
        <View style={styles.gridLineVertical2} />

        {/* Map Markers */}
        {/* Shelter Green Marker */}
        <TouchableOpacity
          style={[styles.markerWrapper, { top: '22%', left: '18%' }]}
          onPress={() => onSelectResource && onSelectResource('Community Shelter Point 1')}
        >
          <View style={[styles.markerPin, { backgroundColor: Colors.primary }]}>
            <Text style={styles.markerEmoji}>⛺</Text>
          </View>
          <Text style={styles.markerLabel}>Shelter 1</Text>
        </TouchableOpacity>

        {/* Medical Red Marker */}
        <TouchableOpacity
          style={[styles.markerWrapper, { top: '30%', right: '22%' }]}
          onPress={() => onSelectResource && onSelectResource('St. Mary Medical Base')}
        >
          <View style={[styles.markerPin, { backgroundColor: Colors.sosRed }]}>
            <Text style={styles.markerEmoji}>🏥</Text>
          </View>
          <Text style={styles.markerLabel}>Medical Base</Text>
        </TouchableOpacity>

        {/* Water Blue Marker */}
        <TouchableOpacity
          style={[styles.markerWrapper, { top: '55%', left: '26%' }]}
          onPress={() => onSelectResource && onSelectResource('Clean Water Tank 500L')}
        >
          <View style={[styles.markerPin, { backgroundColor: Colors.waterBlue }]}>
            <Text style={styles.markerEmoji}>💧</Text>
          </View>
          <Text style={styles.markerLabel}>Water 500L</Text>
        </TouchableOpacity>

        {/* Food Orange Marker */}
        <TouchableOpacity
          style={[styles.markerWrapper, { top: '65%', right: '28%' }]}
          onPress={() => onSelectResource && onSelectResource('Food Ration Center')}
        >
          <View style={[styles.markerPin, { backgroundColor: Colors.foodOrange }]}>
            <Text style={styles.markerEmoji}>🍞</Text>
          </View>
          <Text style={styles.markerLabel}>Food Point</Text>
        </TouchableOpacity>

        {/* Hazard Warning Marker */}
        <TouchableOpacity
          style={[styles.markerWrapper, { top: '44%', left: '56%' }]}
          onPress={() => onSelectResource && onSelectResource('Flooded Road Sector 2')}
        >
          <View style={[styles.markerPin, { backgroundColor: Colors.warning }]}>
            <Text style={styles.markerEmoji}>⚠️</Text>
          </View>
          <Text style={styles.markerLabel}>Flooded</Text>
        </TouchableOpacity>

        {/* User Location Pulse Marker */}
        <View style={[styles.markerWrapper, { top: '48%', left: '42%' }]}>
          <View style={styles.userPulseRing}>
            <View style={styles.userPulseDot} />
          </View>
          <Text style={[styles.markerLabel, { color: Colors.primary, fontWeight: '700' }]}>
            YOU
          </Text>
        </View>

        {/* Map Floating Tools (Zoom, Layer, Center) */}
        <View style={styles.mapTools}>
          <TouchableOpacity style={styles.toolBtn}>
            <Text style={styles.toolText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Text style={styles.toolText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <Text style={styles.toolText}>🎯</Text>
          </TouchableOpacity>
        </View>

        {/* Offline Vector Map Banner */}
        <View style={styles.offlineMapBadge}>
          <Text style={styles.offlineMapBadgeText}>
            📶 OFFLINE VECTOR MAP ACTIVE • 8.4 km² CACHED
          </Text>
        </View>
      </View>

      {/* Bottom Resource Summary Card */}
      <View style={styles.bottomCardWrapper}>
        <Card style={styles.bottomCard}>
          <View style={styles.bottomCardHeader}>
            <View>
              <Text style={Typography.h3}>Community Shelter Point 1</Text>
              <Text style={Typography.caption}>
                📍 1.2 km away • Capacity: 150 people • Open 24/7
              </Text>
            </View>
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>OPEN</Text>
            </View>
          </View>
          <View style={styles.facilityRow}>
            <Text style={styles.facilityTag}>💧 Drinking Water</Text>
            <Text style={styles.facilityTag}>🏥 First Aid</Text>
            <Text style={styles.facilityTag}>🍞 Food</Text>
          </View>
        </Card>
      </View>
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
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E5EFEA',
    position: 'relative',
    overflow: 'hidden',
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
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerEmoji: {
    fontSize: 14,
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  userPulseRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(22, 112, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
  mapTools: {
    position: 'absolute',
    right: 14,
    top: 14,
    gap: 8,
  },
  toolBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  toolText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  offlineMapBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(22, 112, 68, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
  facilityRow: {
    flexDirection: 'row',
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
});
