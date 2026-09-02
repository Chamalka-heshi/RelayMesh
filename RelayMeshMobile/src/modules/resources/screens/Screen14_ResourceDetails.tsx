import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // <-- Added Feather icons
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import {
  resourceService,
  ResourceItem,
} from '../services/ResourceService';

interface Props {
  resourceId?: string;
  onBackPress?: () => void;
  onViewMap?: (resource: ResourceItem) => void;
  onContact?: (coordinator: string) => void;
  onBroadcast?: (resource: ResourceItem) => void;
}

export const Screen14_ResourceDetails: React.FC<Props> = ({
  resourceId,
  onBackPress,
  onViewMap,
  onContact,
  onBroadcast,
}) => {
  const [resource, setResource] = useState<ResourceItem>(() => {
    if (resourceId) {
      const found = resourceService.getResourceById(resourceId);
      if (found) return found;
    }
    return resourceService.getSelectedResource();
  });

  // Re-fetch when resourceId or store updates
  useEffect(() => {
    const updateResource = () => {
      const targetId = resourceId || resourceService.getSelectedResourceId();
      const item = resourceService.getResourceById(targetId) || resourceService.getSelectedResource();
      setResource(item);
    };

    const unsubscribe = resourceService.subscribe(updateResource);
    updateResource();
    return () => unsubscribe();
  }, [resourceId]);

  const freshness = resourceService.getFreshnessInfo(resource.lastSyncedAt);
  const occupancyPercent = Math.round(
    (resource.occupiedCapacity / resource.totalCapacity) * 100
  );

  const handleMeshSync = () => {
    const res = resourceService.refreshMeshSync(resource.id);
    Alert.alert(
      'Mesh Telemetry Synced',
      `${res.message}\n\nTimestamp refreshed to current time without internet connectivity.`,
      [{ text: 'OK' }]
    );
  };

  const handleSimulateIntake = (delta: number) => {
    const newOccupied = resource.occupiedCapacity + delta;
    resourceService.updateCapacity(resource.id, newOccupied);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'VERIFIED':
        return {
          bg: '#E8F5EC',
          border: '#C8E6C9',
          color: '#167044',
          dot: '#167044',
          label: 'OPEN 24/7 FOR EVACUEES',
        };
      case 'LIMITED':
        return {
          bg: '#FEF3C7',
          border: '#FDE68A',
          color: '#B45309',
          dot: '#F59E0B',
          label: 'LIMITED AVAILABILITY',
        };
      case 'FULL':
        return {
          bg: '#FEE2E2',
          border: '#FECACA',
          color: '#DC2626',
          dot: '#DC2626',
          label: 'CURRENTLY AT MAXIMUM CAPACITY',
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

  const statusConfig = getStatusConfig(resource.status);

  return (
    <View style={styles.container}>
      <Header
        title="Resource Details"
        subtitle="Capacity, amenities & offline mesh freshness"
        onBackPress={onBackPress}
        rightAction={
          <TouchableOpacity
            style={styles.headerSyncBtn}
            onPress={handleMeshSync}
            activeOpacity={0.7}
          >
            <Feather name="refresh-cw" size={10} color="#38BDF8" />
            <Text style={styles.headerSyncBtnText}>Sync</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Status Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: statusConfig.bg,
                  borderColor: statusConfig.border,
                },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusConfig.dot }]}
              />
              <Text
                style={[styles.statusPillText, { color: statusConfig.color }]}
              >
                {statusConfig.label}
              </Text>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {resource.category.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[Typography.h2, styles.titleText]}>{resource.title}</Text>
          
          <View style={styles.iconTextRow}>
            <Feather name="map-pin" size={14} color={Colors.textSecondary} />
            <Text style={styles.landmarkText}>{resource.landmark}</Text>
          </View>

          <View style={styles.iconTextRow}>
            <Feather name="navigation" size={14} color={Colors.textMuted} />
            <Text style={styles.coordsText}>
              Coordinates: {resource.latitude.toFixed(4)}° N, {resource.longitude.toFixed(4)}° E • {resource.distanceKm} km away
            </Text>
          </View>

          <View style={styles.iconTextRow}>
            <Feather name="clock" size={14} color={Colors.primary} />
            <Text style={styles.hoursText}>
              Hours: {resource.operatingHours}
            </Text>
          </View>

          <Text style={styles.descText}>
            {resource.description}
          </Text>
        </Card>

        {/* Capacity & Occupancy Meter */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={Typography.h3}>Capacity & Occupancy</Text>
            <Text
              style={[
                styles.capacityBadge,
                {
                  color:
                    occupancyPercent > 85
                      ? Colors.sosRed
                      : occupancyPercent > 60
                      ? Colors.warning
                      : Colors.primary,
                },
              ]}
            >
              {occupancyPercent}% Occupied
            </Text>
          </View>

          {/* Visual Progress Bar */}
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

          {/* Capacity Stat Boxes */}
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{resource.totalCapacity}</Text>
              <Text style={styles.statLbl}>Total Capacity</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.sosRed }]}>
                {resource.occupiedCapacity}
              </Text>
              <Text style={styles.statLbl}>Occupied</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: Colors.primary }]}>
                {resource.availableCapacity}
              </Text>
              <Text style={styles.statLbl}>Available Spots</Text>
            </View>
          </View>

          {occupancyPercent >= 80 && (
            <View style={styles.capacityWarningBox}>
              <Feather name="alert-triangle" size={16} color="#B45309" />
              <Text style={styles.warningText}>
                High occupancy warning. Please consider directing new arrivals to nearby secondary shelters if capacity reaches 100%.
              </Text>
            </View>
          )}

          {/* Intake Simulator (Interactive Volunteer Controls) */}
          <View style={styles.simulationBar}>
            <Text style={styles.simLabel}>Volunteer Intake Simulation:</Text>
            <View style={styles.simBtnGroup}>
              <TouchableOpacity
                style={styles.simBtn}
                onPress={() => handleSimulateIntake(-5)}
                disabled={resource.occupiedCapacity <= 0}
                activeOpacity={0.7}
              >
                <Text style={styles.simBtnText}>-5 Check-out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.simBtn, styles.simBtnPrimary]}
                onPress={() => handleSimulateIntake(5)}
                disabled={resource.occupiedCapacity >= resource.totalCapacity}
                activeOpacity={0.7}
              >
                <Text style={styles.simBtnTextPrimary}>+5 Check-in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Amenities & Facilities Checklist */}
        <Card style={styles.sectionCard}>
          <Text style={Typography.h3}>Verified Amenities & Supplies</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: 8 }]}>
            Pre-registered disaster resilience checklist for this facility
          </Text>

          <View style={styles.amenitiesList}>
            {resource.amenities.map((amenity) => (
              <View key={amenity.id} style={styles.amenityRow}>
                <View style={styles.amenityIconCircle}>
                  {/* Rendering the data-provided icon as text, since it comes from the mock DB */}
                  <Text style={styles.amenityIcon}>{amenity.icon}</Text> 
                </View>
                <View style={styles.amenityTextCol}>
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                  {amenity.notes && (
                    <Text style={styles.amenityNotes}>{amenity.notes}</Text>
                  )}
                </View>
                <View style={styles.amenityCheck}>
                  <Feather name="check-circle" size={10} color={Colors.primary} />
                  <Text style={styles.amenityCheckText}>Available</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Data Freshness & Offline Mesh Telemetry */}
        <Card variant="accentGreen" style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.h3, { color: Colors.primaryDark }]}>
              Data Freshness & Offline Telemetry
            </Text>
            <View
              style={[
                styles.freshnessTag,
                { backgroundColor: freshness.badgeBg },
              ]}
            >
              <Text style={[styles.freshnessTagText, { color: freshness.color }]}>
                ● {freshness.status.toUpperCase()}: {freshness.label}
              </Text>
            </View>
          </View>

          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Last Verified Timestamp</Text>
              <Text style={styles.telemetryVal}>
                {freshness.formattedTime} (Offline Synced)
              </Text>
            </View>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Reporting Mesh Node</Text>
              <Text style={styles.telemetryVal}>
                {resource.verifiedByNode}
              </Text>
            </View>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Mesh Hop Distance</Text>
              <Text style={styles.telemetryVal}>
                {resource.meshHops} Hops (P2P Relay)
              </Text>
            </View>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>Peer Confirmations</Text>
              <Text style={styles.telemetryVal}>
                {resource.confirmations} Mesh Nodes Endorsed
              </Text>
            </View>
          </View>

          {/* On-Site Responders & Communications */}
          <View style={styles.contactDivider} />
          <Text style={[Typography.bodyBold, { color: Colors.primaryDark }]}>
            On-Site Emergency Contacts
          </Text>
          <Text style={[Typography.caption, { marginTop: 4, color: Colors.textPrimary }]}>
            Coordinator: <Text style={{ fontWeight: '700' }}>{resource.contactInfo.coordinator}</Text>
          </Text>
          <Text style={[Typography.caption, { color: Colors.textPrimary }]}>
            Emergency Radio: <Text style={{ fontWeight: '700' }}>{resource.contactInfo.radioChannel}</Text>
          </Text>
          {resource.contactInfo.phone && (
            <Text style={[Typography.caption, { color: Colors.textPrimary }]}>
              Satellite / Local Phone: <Text style={{ fontWeight: '700' }}>{resource.contactInfo.phone}</Text>
            </Text>
          )}

          <TouchableOpacity
            style={styles.syncCardBtn}
            onPress={handleMeshSync}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={14} color="#FFFFFF" />
            <Text style={styles.syncCardBtnText}>
              REQUEST IMMEDIATE MESH STATUS UPDATE
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Navigation Action Buttons */}
        <View style={styles.actionGroup}>
          {onViewMap && (
            <Button
              title="VIEW LOCATION ON OFFLINE MAP"
              variant="primary"
              onPress={() => onViewMap(resource)}
            />
          )}

          {onContact && (
            <Button
              title="MESSAGE ON-SITE COORDINATOR"
              variant="outline"
              onPress={() => onContact(resource.contactInfo.coordinator)}
            />
          )}

          {onBroadcast && (
            <Button
              title="BROADCAST RESOURCE OVER MESH"
              variant="outline"
              onPress={() => onBroadcast(resource)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 14,
    paddingBottom: 40,
  },
  headerSyncBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerSyncBtnText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    marginVertical: 6,
    padding: 14,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  titleText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  landmarkText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  hoursText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  descText: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 12,
    lineHeight: 18,
  },
  sectionCard: {
    marginVertical: 6,
    padding: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  capacityBadge: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: Colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  capacityWarningBox: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: '#B45309',
    lineHeight: 16,
    fontWeight: '600',
  },
  simulationBar: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  simBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  simBtn: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  simBtnText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  simBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  simBtnTextPrimary: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  amenitiesList: {
    marginTop: 4,
    gap: 8,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    padding: 8,
    borderRadius: 8,
  },
  amenityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  amenityIcon: {
    fontSize: 16,
  },
  amenityTextCol: {
    flex: 1,
  },
  amenityName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  amenityNotes: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  amenityCheck: {
    backgroundColor: Colors.accentGreen,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amenityCheckText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  freshnessTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freshnessTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  telemetryGrid: {
    marginTop: 4,
    gap: 6,
  },
  telemetryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentGreenBorder,
  },
  telemetryLabel: {
    fontSize: 11,
    color: Colors.primaryDark,
  },
  telemetryVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.accentGreenBorder,
    marginVertical: 10,
  },
  syncCardBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  syncCardBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionGroup: {
    marginTop: 12,
    gap: 10,
  },
});