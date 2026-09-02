import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import {
  resourceService,
  ResourceItem,
  ResourceCategory,
} from '../services/ResourceService';

interface Props {
  onSelectResource?: (resourceId: string) => void;
  onViewMap?: () => void;
}

export const Screen13_EmergencyResourcesDirectory: React.FC<Props> = ({
  onSelectResource,
  onViewMap,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [resources, setResources] = useState<ResourceItem[]>(() =>
    resourceService.getResources('All', '', false)
  );

  useEffect(() => {
    const updateList = () => {
      setResources(resourceService.getResources(activeCategory, searchQuery, onlyAvailable));
    };

    const unsubscribe = resourceService.subscribe(updateList);
    updateList();
    return () => unsubscribe();
  }, [activeCategory, searchQuery, onlyAvailable]);

  // Swapped emojis for Feather icon names
  const categories = [
    { key: 'All', label: 'All Resources', icon: 'list' },
    { key: 'Shelters', label: 'Shelters', icon: 'home' },
    { key: 'Medical', label: 'Medical', icon: 'activity' },
    { key: 'Water', label: 'Clean Water', icon: 'droplet' },
    { key: 'Food', label: 'Food Rations', icon: 'package' },
    { key: 'Power', label: 'Power / Radio', icon: 'zap' },
  ];

  const handleSyncMesh = () => {
    const result = resourceService.refreshMeshSync();
    Alert.alert('Mesh Telemetry Synced', result.message, [{ text: 'OK' }]);
  };

  const getCategoryColor = (category: ResourceCategory) => {
    switch (category) {
      case 'shelter':
        return { text: Colors.primary, bg: Colors.accentGreen, icon: 'home' };
      case 'medical':
        return { text: Colors.sosRed, bg: Colors.sosRedLight, icon: 'activity' };
      case 'water':
        return { text: Colors.waterBlue, bg: Colors.waterBlueLight, icon: 'droplet' };
      case 'food':
        return { text: Colors.foodOrange, bg: Colors.foodOrangeLight, icon: 'package' };
      case 'power':
        return { text: '#D97706', bg: '#FEF3C7', icon: 'zap' };
      default:
        return { text: Colors.primary, bg: Colors.accentGreen, icon: 'box' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'VERIFIED':
        return { bg: '#E8F5EC', border: '#C8E6C9', color: '#167044', dot: '#167044', label: 'OPEN 24/7' };
      case 'LIMITED':
        return { bg: '#FEF3C7', border: '#FDE68A', color: '#B45309', dot: '#F59E0B', label: 'LIMITED SPOTS' };
      case 'FULL':
        return { bg: '#FEE2E2', border: '#FECACA', color: '#DC2626', dot: '#DC2626', label: 'AT CAPACITY' };
      default:
        return { bg: '#F1F5F9', border: '#CBD5E1', color: '#64748B', dot: '#94A3B8', label: 'CLOSED' };
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Emergency Resources"
        subtitle="Verified offline shelter, water & triage directory"
        rightAction={
          onViewMap ? (
            <TouchableOpacity
              style={styles.mapHeaderBtn}
              onPress={onViewMap}
              activeOpacity={0.8}
            >
              <Feather name="map" size={14} color="#FFFFFF" />
              <Text style={styles.mapHeaderBtnText}>Map</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Mesh Relay Freshness Banner */}
      <View style={styles.meshFreshnessBanner}>
        <View style={styles.meshBannerLeft}>
          <View style={styles.meshBeaconDot} />
          <View>
            <Text style={styles.meshBannerTitle}>
              OFFLINE CACHED DIRECTORY • {resources.length} SITES VERIFIED
            </Text>
            <Text style={styles.meshBannerSubtitle}>
              Peer-to-peer data fresh within disaster response corridor
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.syncQuickBtn}
          onPress={handleSyncMesh}
          activeOpacity={0.7}
        >
          <Feather name="refresh-cw" size={10} color="#38BDF8" />
          <Text style={styles.syncQuickBtnText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shelters, clinics, water..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Availability Toggle */}
        <TouchableOpacity
          style={[styles.filterToggle, onlyAvailable && styles.filterToggleActive]}
          onPress={() => setOnlyAvailable(!onlyAvailable)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.filterToggleText, onlyAvailable && styles.filterToggleTextActive]}
          >
            {onlyAvailable ? '✓ Available' : 'Show All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categorized Filter Chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveCategory(cat.key)}
                activeOpacity={0.7}
              >
                <Feather 
                  name={cat.icon as any} 
                  size={14} 
                  color={isActive ? '#FFFFFF' : Colors.textSecondary} 
                />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Resource Listings */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {resources.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Feather name="search" size={32} color={Colors.textMuted} />
            <Text style={[Typography.h3, { textAlign: 'center', marginTop: 12 }]}>
              No Matching Resources Found
            </Text>
            <Text
              style={[
                Typography.caption,
                { textAlign: 'center', color: Colors.textSecondary, marginTop: 4 },
              ]}
            >
              Try adjusting your search query or removing the availability filter.
            </Text>
            <Button
              title="RESET FILTERS"
              variant="outline"
              onPress={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setOnlyAvailable(false);
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        ) : (
          resources.map((item) => {
            const catStyle = getCategoryColor(item.category);
            const statusConfig = getStatusBadge(item.status);
            const freshness = resourceService.getFreshnessInfo(item.lastSyncedAt);

            const occupancyPercent = Math.round(
              (item.occupiedCapacity / item.totalCapacity) * 100
            );

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  resourceService.setSelectedResource(item.id);
                  if (onSelectResource) {
                    onSelectResource(item.id);
                  }
                }}
                activeOpacity={0.75}
              >
                <Card style={styles.resCard}>
                  {/* Top Card Row: Category Badge & Status Badge */}
                  <View style={styles.resTopRow}>
                    <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
                      <Feather name={catStyle.icon as any} size={12} color={catStyle.text} />
                      <Text
                        style={[
                          styles.catBadgeText,
                          { color: catStyle.text },
                        ]}
                      >
                        {item.category.toUpperCase()}
                      </Text>
                    </View>

                    {/* Availability Indicator */}
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: statusConfig.bg,
                          borderColor: statusConfig.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: statusConfig.dot },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Main Title & Landmark */}
                  <Text style={[Typography.bodyBold, styles.resTitle]}>
                    {item.name}
                  </Text>
                  <View style={styles.landmarkRow}>
                    <Feather name="map-pin" size={12} color={Colors.textSecondary} />
                    <Text style={styles.landmarkText}>
                       {item.landmark} • {item.distanceKm} km away
                    </Text>
                  </View>

                  {/* Capacity Bar & Metrics */}
                  <View style={styles.capacitySection}>
                    <View style={styles.capacityHeader}>
                      <Text style={styles.capacityLabel}>
                        Available: <Text style={styles.capacityBold}>{item.availableCapacity}</Text> / {item.totalCapacity} {item.capacityUnit}
                      </Text>
                      <Text style={styles.capacityPercent}>
                        {100 - occupancyPercent}% Free
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(100, occupancyPercent)}%`,
                            backgroundColor:
                              occupancyPercent > 85
                                ? Colors.sosRed
                                : occupancyPercent > 60
                                ? Colors.warning
                                : Colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Key Amenities Preview */}
                  <View style={styles.amenitiesPreview}>
                    {item.amenities.slice(0, 3).map((a) => (
                      <View key={a.id} style={styles.amenityPill}>
                        <Text style={styles.amenityPillText}>
                          {a.icon} {a.name.split('(')[0].trim()}
                        </Text>
                      </View>
                    ))}
                    {item.amenities.length > 3 && (
                      <View style={styles.amenityPillMore}>
                        <Text style={styles.amenityPillMoreText}>
                          +{item.amenities.length - 3} more
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Footer: Data Freshness Timestamp & Mesh Hop */}
                  <View style={styles.resFooter}>
                    <View
                      style={[
                        styles.freshnessBadge,
                        { backgroundColor: freshness.badgeBg },
                      ]}
                    >
                      <View style={styles.freshnessRow}>
                        <Feather name="clock" size={10} color={freshness.color} />
                        <Text
                          style={[
                            styles.freshnessText,
                            { color: freshness.color },
                          ]}
                        >
                          {freshness.status === 'fresh' ? 'FRESH' : 'SYNCED'}: {freshness.label}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.meshNodeRow}>
                      <Feather name="radio" size={10} color={Colors.textMuted} />
                      <Text style={styles.meshNodeText}>
                        {item.verifiedByNode} (Hop #{item.meshHops})
                      </Text>
                    </View>
                    
                    <View style={styles.detailsChevronRow}>
                      <Text style={styles.detailsChevronText}>Details</Text>
                      <Feather name="arrow-right" size={14} color={Colors.primary} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}

        {/* Action Link to Map */}
        {onViewMap && (
          <TouchableOpacity
            style={styles.mapBannerBtn}
            onPress={onViewMap}
            activeOpacity={0.8}
          >
            <View style={styles.mapBannerContent}>
              <View style={styles.mapBannerIconWrapper}>
                <Feather name="map" size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={styles.mapBannerTitle}>
                  View All Resources on Map
                </Text>
                <Text style={styles.mapBannerSubtitle}>
                  Visualize GPS coordinates & safe routes
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#38BDF8" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapHeaderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  meshFreshnessBanner: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  meshBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  meshBeaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E', // Green dot status
  },
  meshBannerTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  meshBannerSubtitle: {
    color: '#94A3B8',
    fontSize: 9,
  },
  syncQuickBtn: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncQuickBtnText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterToggle: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterToggleActive: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.primary,
  },
  filterToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterToggleTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  chipsWrapper: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chipsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 14,
    paddingBottom: 40,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  resCard: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
  },
  resTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  resTitle: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  landmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  capacitySection: {
    marginTop: 12,
    backgroundColor: Colors.surfaceSecondary,
    padding: 10,
    borderRadius: 8,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  capacityBold: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  capacityPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  amenitiesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  amenityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityPillText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  amenityPillMore: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  amenityPillMoreText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
  },
  resFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  freshnessBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  freshnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  freshnessText: {
    fontSize: 9,
    fontWeight: '800',
  },
  meshNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meshNodeText: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  detailsChevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsChevronText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  mapBannerBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#1E293B',
    borderWidth: 1,
  },
  mapBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mapBannerIconWrapper: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  mapBannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  mapBannerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
});