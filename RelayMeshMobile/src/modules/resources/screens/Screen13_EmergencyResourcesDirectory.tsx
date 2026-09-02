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

  const categories = [
    { key: 'All', label: 'All Resources', icon: '🌐' },
    { key: 'Shelters', label: 'Shelters', icon: '⛺' },
    { key: 'Medical', label: 'Medical', icon: '🏥' },
    { key: 'Water', label: 'Clean Water', icon: '💧' },
    { key: 'Food', label: 'Food Rations', icon: '🍲' },
    { key: 'Power', label: 'Power / Radio', icon: '⚡' },
  ];

  const handleSyncMesh = () => {
    const result = resourceService.refreshMeshSync();
    Alert.alert('📡 Mesh Telemetry Synced', result.message, [{ text: 'OK' }]);
  };

  const getCategoryColor = (category: ResourceCategory) => {
    switch (category) {
      case 'shelter':
        return { text: Colors.primary, bg: Colors.accentGreen, icon: '⛺' };
      case 'medical':
        return { text: Colors.sosRed, bg: Colors.sosRedLight, icon: '🏥' };
      case 'water':
        return { text: Colors.waterBlue, bg: Colors.waterBlueLight, icon: '💧' };
      case 'food':
        return { text: Colors.foodOrange, bg: Colors.foodOrangeLight, icon: '🍞' };
      case 'power':
        return { text: '#D97706', bg: '#FEF3C7', icon: '⚡' };
      default:
        return { text: Colors.primary, bg: Colors.accentGreen, icon: '📦' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'VERIFIED':
        return {
          bg: '#E8F5EC',
          border: '#C8E6C9',
          color: '#167044',
          dot: '#167044',
          label: 'OPEN 24/7',
        };
      case 'LIMITED':
        return {
          bg: '#FEF3C7',
          border: '#FDE68A',
          color: '#B45309',
          dot: '#F59E0B',
          label: 'LIMITED SPOTS',
        };
      case 'FULL':
        return {
          bg: '#FEE2E2',
          border: '#FECACA',
          color: '#DC2626',
          dot: '#DC2626',
          label: 'AT CAPACITY',
        };
      default:
        return {
          bg: '#F1F5F9',
          border: '#CBD5E1',
          color: '#64748B',
          dot: '#94A3B8',
          label: 'CLOSED',
        };
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Emergency Resources"
        subtitle="Screen 13 • Verified offline shelter, water & triage directory"
        badge="Screen 13"
        rightAction={
          onViewMap ? (
            <TouchableOpacity
              style={styles.mapHeaderBtn}
              onPress={onViewMap}
              activeOpacity={0.8}
            >
              <Text style={styles.mapHeaderBtnText}>🗺️ Map</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Mesh Relay Freshness Banner */}
      <View style={styles.meshFreshnessBanner}>
        <View style={styles.meshBannerLeft}>
          <Text style={styles.meshBeaconDot}>🟢</Text>
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
          <Text style={styles.syncQuickBtnText}>🔄 Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search shelters, clinics, water, rations..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearText}>✕</Text>
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
            {onlyAvailable ? '✓ Available Only' : 'Show All'}
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
                <Text style={styles.chipIcon}>{cat.icon}</Text>
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
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[Typography.h3, { textAlign: 'center', marginTop: 8 }]}>
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
              style={{ marginTop: 12 }}
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
                      <Text style={styles.catBadgeIcon}>{catStyle.icon}</Text>
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
                  <Text style={styles.landmarkText}>
                    📍 {item.landmark} • {item.distanceKm} km away
                  </Text>

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
                      <Text
                        style={[
                          styles.freshnessText,
                          { color: freshness.color },
                        ]}
                      >
                        ⏱️ {freshness.status === 'fresh' ? 'FRESH' : 'SYNCED'}: {freshness.label}
                      </Text>
                    </View>

                    <Text style={styles.meshNodeText}>
                      📡 {item.verifiedByNode} (Hop #{item.meshHops})
                    </Text>
                    <Text style={styles.detailsChevron}>View Details →</Text>
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
              <Text style={styles.mapBannerIcon}>🗺️</Text>
              <View>
                <Text style={styles.mapBannerTitle}>
                  View All Resources on Offline Map (Screen 05)
                </Text>
                <Text style={styles.mapBannerSubtitle}>
                  Visualize GPS coordinates, safe walking detours & shelter locations
                </Text>
              </View>
            </View>
            <Text style={styles.mapBannerChevron}>➔</Text>
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 10,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingHorizontal: 4,
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
    gap: 5,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  chipIcon: {
    fontSize: 12,
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
  emptyIcon: {
    fontSize: 32,
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
    marginBottom: 6,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  catBadgeIcon: {
    fontSize: 11,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  landmarkText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  capacitySection: {
    marginTop: 10,
    backgroundColor: Colors.surfaceSecondary,
    padding: 8,
    borderRadius: 8,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
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
    marginTop: 8,
  },
  amenityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  amenityPillText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  amenityPillMore: {
    paddingHorizontal: 6,
    paddingVertical: 3,
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
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  freshnessBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freshnessText: {
    fontSize: 9,
    fontWeight: '800',
  },
  meshNodeText: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  detailsChevron: {
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
  mapBannerIcon: {
    fontSize: 24,
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
  mapBannerChevron: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
