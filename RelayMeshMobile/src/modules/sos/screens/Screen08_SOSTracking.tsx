import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';
import { sosService, SOSAlert } from '../services/SOSService';

interface Props {
  onBack?: () => void;
  onResolved?: () => void;
  onViewMap?: () => void;
}

export const Screen08_SOSTracking: React.FC<Props> = ({
  onBack,
  onResolved,
  onViewMap,
}) => {
  const [alertData, setAlertData] = useState<SOSAlert | null>(sosService.getActiveSOS());

  useEffect(() => {
    // If no alert active, initialize one for testing
    if (!alertData) {
      const generated = sosService.triggerSOS(['Medical Urgent', 'Trapped / Evacuation']);
      setAlertData(generated);
    }

    const unsubscribe = sosService.subscribe((active) => {
      setAlertData(active);
    });
    return unsubscribe;
  }, []);

  const handleResolveAlert = () => {
    Alert.alert(
      'Mark SOS as Resolved?',
      'Confirm that you are safe or rescue assistance has arrived. This will stop the distress beacon and log the incident to history.',
      [
        { text: 'Keep Active', style: 'cancel' },
        {
          text: 'I Am Safe (Resolve)',
          style: 'default',
          onPress: () => {
            sosService.resolveSOS('Rescued safely by responder unit.');
            if (onResolved) {
              onResolved();
            }
          },
        },
      ]
    );
  };

  const beaconId = alertData?.id || '#SOS-4487';
  const responder = alertData?.responder;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Live SOS Tracking"
        subtitle={`Tracking active distress signal ${beaconId}`}
        badge="ACTIVE"
      />

      {/* Broadcasting Card Banner */}
      <Card variant="emergencyRed" style={styles.broadcastCard}>
        <View style={styles.cardHeader}>
          <View style={styles.beaconTitleRow}>
            <Text style={styles.beaconDot}>🚨</Text>
            <Text style={[Typography.h3, { color: Colors.sosRed }]}>
              BEACON BROADCASTING
            </Text>
          </View>
          <StatusBadge status="emergency" label="Broadcasting" />
        </View>
        <Text style={[Typography.caption, { marginTop: 6, color: Colors.textSecondary }]}>
          Encrypted coordinates transmitted continuously via BLE & Wi-Fi Direct multi-hop mesh.
        </Text>
      </Card>

      {/* Signal Telemetry & Diagnostics */}
      <Card style={styles.telemetryCard}>
        <Text style={Typography.bodyBold}>Mesh Telemetry & Diagnostics</Text>
        <View style={styles.telemetryGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>{alertData?.signalDbm || -64} dBm</Text>
            <Text style={styles.gridLabel}>Signal Strength</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>{alertData?.nodesNotified || 14} Devices</Text>
            <Text style={styles.gridLabel}>Nearby Peers</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>{alertData?.meshHops || 3} Hops</Text>
            <Text style={styles.gridLabel}>Relay Reach</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridValue, { color: Colors.accentGreenBorder }]}>
              {alertData?.batteryPercent || 94}%
            </Text>
            <Text style={styles.gridLabel}>Battery Power</Text>
          </View>
        </View>
      </Card>

      {/* Dispatched Responders Card */}
      <Card variant="accentGreen" style={styles.responderCard}>
        <View style={styles.responderTitleRow}>
          <Text style={Typography.bodyBold}>Dispatched Responder Unit</Text>
          <View style={styles.enRouteBadge}>
            <Text style={styles.enRouteText}>EN ROUTE</Text>
          </View>
        </View>

        {responder ? (
          <View style={styles.responderContent}>
            <View style={styles.responderMainRow}>
              <View style={styles.responderIconWrap}>
                <Text style={styles.responderIcon}>{responder.icon}</Text>
              </View>
              <View style={styles.responderInfo}>
                <Text style={Typography.bodyBold}>{responder.name}</Text>
                <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '700' }]}>
                  {responder.radioChannel}
                </Text>
              </View>
            </View>

            <View style={styles.responderMetricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>{responder.distanceMeters}m</Text>
                <Text style={styles.metricLbl}>Distance</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>~{responder.etaMinutes} min</Text>
                <Text style={styles.metricLbl}>Estimated ETA</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>{responder.bearing}</Text>
                <Text style={styles.metricLbl}>Bearing</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={Typography.caption}>
            Waiting for nearby rescue unit to acknowledge signal...
          </Text>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionGroup}>
        <Button
          title="I AM SAFE / MARK RESOLVED"
          variant="primary"
          onPress={handleResolveAlert}
        />

        {onViewMap && (
          <Button
            title="VIEW RESCUE LOCATION ON MAP"
            variant="secondary"
            onPress={onViewMap}
          />
        )}

        {onBack && (
          <TouchableOpacity style={styles.backLink} onPress={onBack}>
            <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>
              ← Back to Broadcast Status
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  broadcastCard: {
    marginVertical: 10,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beaconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beaconDot: {
    fontSize: 18,
    marginRight: 8,
  },
  telemetryCard: {
    marginVertical: 10,
    padding: 14,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10,
  },
  gridItem: {
    width: '48%',
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: 10,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  responderCard: {
    marginVertical: 10,
    padding: 14,
  },
  responderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  enRouteBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  enRouteText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  responderContent: {
    marginTop: 4,
  },
  responderMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  responderIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  responderIcon: {
    fontSize: 22,
  },
  responderInfo: {
    flex: 1,
  },
  responderMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  metricLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  actionGroup: {
    marginTop: 14,
    gap: 10,
  },
  backLink: {
    padding: 10,
  },
});
