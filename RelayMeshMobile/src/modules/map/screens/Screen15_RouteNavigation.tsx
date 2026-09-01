import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';
import { hazardService } from '../services/HazardService';

interface Props {
  onBack?: () => void;
  onNavigateMap?: () => void;
}

export const Screen15_RouteNavigation: React.FC<Props> = ({ onBack, onNavigateMap }) => {
  const [hazard, setHazard] = useState(() => hazardService.getActiveHazard());
  const [isResolved, setIsResolved] = useState(hazard?.isResolved ?? false);
  const [isNavigating, setIsNavigating] = useState(false);

  if (!hazard) {
    return (
      <View style={styles.container}>
        <Header title="Hazard & Route Detail" subtitle="No active hazard selected" />
        <View style={styles.emptyContainer}>
          <Text style={Typography.body}>No active hazards detected in your area.</Text>
          {onBack && (
            <Button
              title="RETURN TO MAP"
              variant="primary"
              onPress={onBack}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </View>
    );
  }

  const avoidanceRoute = hazardService.calculateAvoidanceRoute(hazard.id);

  const handleResolve = () => {
    hazardService.resolveHazard(hazard.id);
    setIsResolved(true);
    Alert.alert(
      '✅ Hazard Marked as Resolved',
      'The clearance status has been recorded and will be broadcast to nearby mesh relay nodes.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (onNavigateMap) onNavigateMap();
          },
        },
      ]
    );
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    Alert.alert(
      '🧭 Offline Bypass Guidance Active',
      `Follow the recommended dry-ground detour (+${avoidanceRoute.bypassDistanceKm} km, ~${avoidanceRoute.estimatedWalkMinutes} mins). Turn-by-turn alerts are active without cellular internet.`,
      [{ text: 'Start' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Hazard & Route Detail"
        subtitle="Offline terrain guidance & risk warning"
      />

      {/* Hazard Warning Status Card */}
      <Card variant={isResolved ? 'accentGreen' : 'emergencyRed'}>
        <View style={styles.headerRow}>
          <Text
            style={[
              Typography.h3,
              { color: isResolved ? Colors.primary : Colors.sosRed },
            ]}
          >
            {isResolved ? '✅ Hazard Cleared' : `⚠️ ${hazard.hazardType} Hazard`}
          </Text>
          <StatusBadge
            status={isResolved ? 'connected' : 'emergency'}
            label={isResolved ? 'RESOLVED' : `${hazard.severity} SEVERITY`}
          />
        </View>
        <Text style={[Typography.caption, { marginTop: 6 }]}>
          Reported {hazard.reportedAgo || 'recently'} • Radius: {hazard.radiusMeters}m •{' '}
          {hazard.confirmations} Mesh Confirmations
        </Text>
        <Text
          style={[Typography.body, { marginTop: 8, color: Colors.textPrimary }]}
        >
          "{hazard.description}"
        </Text>
      </Card>

      {/* Recommended Safe Bypass Detour Card */}
      <Card variant="accentGreen" style={styles.bypassCard}>
        <Text style={Typography.bodyBold}>🧭 Recommended Safe Bypass Route</Text>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          {avoidanceRoute.routeDescription}
        </Text>

        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{avoidanceRoute.bypassDistanceKm} km</Text>
            <Text style={styles.statLbl}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>
              {avoidanceRoute.estimatedWalkMinutes} mins
            </Text>
            <Text style={styles.statLbl}>Est. Walk</Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    avoidanceRoute.elevationSafetyScore === 'SAFE'
                      ? Colors.primary
                      : Colors.warning,
                },
              ]}
            >
              {avoidanceRoute.elevationSafetyScore}
            </Text>
            <Text style={styles.statLbl}>Elevation</Text>
          </View>
        </View>

        {isNavigating && (
          <View style={styles.navBanner}>
            <Text style={styles.navBannerText}>
              🟢 Active GPS Detour: Heading towards waypoint 1 (elevated dry ridge).
            </Text>
          </View>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.btnGroup}>
        <Button
          title={
            isNavigating
              ? 'NAVIGATION ACTIVE (TAP TO RE-CENTER)'
              : 'NAVIGATE AROUND HAZARD'
          }
          variant="primary"
          onPress={handleStartNavigation}
        />
        {!isResolved && (
          <Button
            title="REPORT AS RESOLVED"
            variant="outline"
            onPress={handleResolve}
          />
        )}
        {onBack && (
          <Button
            title="RETURN TO MAP VIEW"
            variant="outline"
            onPress={onBack}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bypassCard: {
    marginTop: 12,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.accentGreenBorder,
  },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  statLbl: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  navBanner: {
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
  },
  navBannerText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  btnGroup: { marginTop: 14, gap: 10 },
});
