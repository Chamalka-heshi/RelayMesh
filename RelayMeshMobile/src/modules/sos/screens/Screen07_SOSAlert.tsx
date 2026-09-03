import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { sosService, SOSAlert } from '../services/SOSService';

interface Props {
  onTrack?: () => void;
  onViewMap?: () => void;
  onCancelSOS?: () => void;
}

export const Screen07_SOSAlert: React.FC<Props> = ({
  onTrack,
  onViewMap,
  onCancelSOS,
}) => {
  const [alertData, setAlertData] = useState<SOSAlert | null>(sosService.getActiveSOS());

  useEffect(() => {
    // If no alert was active, initialize one for seamless demo testing
    if (!alertData) {
      const generated = sosService.triggerSOS(['Medical Urgent', 'Trapped / Evacuation']);
      setAlertData(generated);
    }

    const unsubscribe = sosService.subscribe((active) => {
      setAlertData(active);
    });
    return unsubscribe;
  }, []);

  const handleCancelBeacon = () => {
    Alert.alert(
      'Cancel SOS Distress Signal?',
      'Are you sure you want to stop broadcasting this emergency beacon to the mesh network?',
      [
        { text: 'Keep Broadcasting', style: 'cancel' },
        {
          text: 'Yes, Cancel Beacon',
          style: 'destructive',
          onPress: () => {
            sosService.cancelSOS();
            if (onCancelSOS) onCancelSOS();
          },
        },
      ]
    );
  };

  const beaconId = alertData?.id || '#SOS-4487';
  const nodesCount = alertData?.nodesNotified || 14;
  const hopsCount = alertData?.meshHops || 3;
  const tagsList = alertData?.tags || ['Medical Urgent'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Distress Beacon Active"
        subtitle={`Beacon ${beaconId} broadcasting on mesh`}
        variant="white"
        badge="TRANSMITTING"
      />

      {/* Success Broadcast Icon & Banner */}
      <View style={styles.successSection}>
        <View style={styles.pulseWrapper}>
          <View style={styles.successCircle}>
            <Text style={styles.checkmark}>📡</Text>
          </View>
        </View>
        <Text style={[Typography.h1, { color: Colors.sosRed, marginTop: 12 }]}>
          Signal Broadcasting!
        </Text>
        <Text style={[Typography.body, { textAlign: 'center', marginTop: 4, paddingHorizontal: 16 }]}>
          Emergency packets are relaying across nearby peer nodes without cellular coverage.
        </Text>

        {/* Selected Tags Chips */}
        <View style={styles.tagChipsRow}>
          {tagsList.map((tag) => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>🚨 {tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Broadcast Summary Card */}
      <Card variant="emergencyRed" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{nodesCount}</Text>
            <Text style={styles.summaryLabel}>Mesh Nodes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{hopsCount} Hops</Text>
            <Text style={styles.summaryLabel}>Relay Reach</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.sosRed }]}>BROADCASTING</Text>
            <Text style={styles.summaryLabel}>Signal State</Text>
          </View>
        </View>
      </Card>

      {/* Step-by-Step Propagation Timeline */}
      <View style={styles.timelineSection}>
        <Text style={[Typography.h3, { marginBottom: 12 }]}>
          Mesh Relay Propagation Timeline:
        </Text>

        {(alertData?.timeline || []).map((step, idx) => (
          <TimelineStep
            key={step.id || idx}
            completed={step.status === 'completed'}
            active={step.status === 'active'}
            pending={step.status === 'pending'}
            title={step.title}
            time={step.time}
            desc={step.description}
          />
        ))}
      </View>

      {/* Action Buttons Group */}
      <View style={styles.buttonGroup}>
        <Button
          title="TRACK LIVE RESCUE & TELEMETRY ➔"
          variant="primary"
          onPress={onTrack || (() => {})}
        />

        <Button
          title="VIEW DISTRESS LOCATION ON MAP"
          variant="secondary"
          onPress={onViewMap || (() => {})}
        />

        <Button
          title="CANCEL SOS BEACON"
          variant="danger"
          onPress={handleCancelBeacon}
        />
      </View>
    </ScrollView>
  );
};

interface TimelineStepProps {
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
  title: string;
  time: string;
  desc: string;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  completed,
  active,
  pending,
  title,
  time,
  desc,
}) => (
  <View style={styles.stepRow}>
    <View style={styles.indicatorCol}>
      <View
        style={[
          styles.stepDot,
          completed && styles.stepDotCompleted,
          active && styles.stepDotActive,
          pending && styles.stepDotPending,
        ]}
      >
        <Text style={styles.stepDotIcon}>
          {completed ? '✓' : active ? '●' : '○'}
        </Text>
      </View>
      <View style={styles.stepLine} />
    </View>
    <View style={styles.stepContent}>
      <View style={styles.stepHeaderRow}>
        <Text style={[Typography.bodyBold, active && { color: Colors.sosRed }]}>
          {title}
        </Text>
        <Text style={Typography.caption}>{time}</Text>
      </View>
      <Text style={Typography.caption}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  successSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  pulseWrapper: {
    padding: 6,
    borderRadius: 44,
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.sosRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sosRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  checkmark: {
    fontSize: 30,
  },
  tagChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  tagBadge: {
    backgroundColor: Colors.sosRedLight,
    borderColor: Colors.sosRed,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagBadgeText: {
    fontSize: 11,
    color: Colors.sosRed,
    fontWeight: '700',
  },
  summaryCard: {
    marginVertical: 12,
    padding: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  timelineSection: {
    marginVertical: 12,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  indicatorCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDotActive: {
    backgroundColor: Colors.sosRed,
    borderColor: Colors.sosRed,
  },
  stepDotPending: {
    borderColor: Colors.textMuted,
  },
  stepDotIcon: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  buttonGroup: {
    marginTop: 12,
    gap: 10,
  },
});
