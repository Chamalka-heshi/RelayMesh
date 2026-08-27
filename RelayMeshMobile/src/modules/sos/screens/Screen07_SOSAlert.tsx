import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

interface Props {
  onViewMap?: () => void;
  onCancelSOS?: () => void;
}

export const Screen07_SOSAlert: React.FC<Props> = ({
  onViewMap,
  onCancelSOS,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="SOS Alert Sent"
        subtitle="Distress signal active on mesh network"
        variant="white"
      />

      {/* Success Broadcast Icon & Banner */}
      <View style={styles.successSection}>
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={[Typography.h1, { color: Colors.primary, marginTop: 12 }]}>
          Alert Broadcasted!
        </Text>
        <Text style={[Typography.body, { textAlign: 'center', marginTop: 6 }]}>
          Your emergency distress signal has been propagated to nearby devices.
        </Text>
      </View>

      {/* Broadcast Summary Card */}
      <Card variant="accentGreen" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Nodes Notified</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>3 Hops</Text>
            <Text style={styles.summaryLabel}>Mesh Reach</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.sosRed }]}>ACTIVE</Text>
            <Text style={styles.summaryLabel}>Status</Text>
          </View>
        </View>
      </Card>

      {/* Step-by-Step Propagation Timeline */}
      <View style={styles.timelineSection}>
        <Text style={[Typography.h3, { marginBottom: 12 }]}>
          Relay Propagation Timeline:
        </Text>

        <TimelineStep
          completed
          title="SOS Beacon Created"
          time="Just now"
          desc="Distress payload encrypted & signed with device ID #RM-4587."
        />
        <TimelineStep
          completed
          title="Direct Broadcast to Nearby Devices"
          time="10s ago"
          desc="Signal transmitted via BLE & Wi-Fi Direct to 12 nearby phones."
        />
        <TimelineStep
          completed
          title="Multi-Hop Mesh Forwarding"
          time="Active"
          desc="Forwarded across 3 node hops towards nearest rescue relay gateway."
        />
        <TimelineStep
          pending
          title="Connected Gateway Synchronization"
          time="Pending"
          desc="Will sync to Emergency Response Center when node reaches cell range."
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          title="VIEW ACTIVE SOS ON MAP"
          variant="primary"
          onPress={onViewMap || (() => {})}
        />
        <Button
          title="CANCEL SOS BEACON"
          variant="danger"
          onPress={onCancelSOS || (() => {})}
        />
      </View>
    </ScrollView>
  );
};

interface TimelineStepProps {
  completed?: boolean;
  pending?: boolean;
  title: string;
  time: string;
  desc: string;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  completed,
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
          pending && styles.stepDotPending,
        ]}
      >
        <Text style={styles.stepDotIcon}>{completed ? '✓' : '○'}</Text>
      </View>
      <View style={styles.stepLine} />
    </View>
    <View style={styles.stepContent}>
      <View style={styles.stepHeaderRow}>
        <Text style={Typography.bodyBold}>{title}</Text>
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
    marginVertical: 16,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  summaryCard: {
    marginVertical: 12,
    padding: 16,
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
    fontSize: 18,
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
    backgroundColor: Colors.accentGreenBorder,
  },
  timelineSection: {
    marginVertical: 14,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  indicatorCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
  stepDotPending: {
    borderColor: Colors.textMuted,
  },
  stepDotIcon: {
    fontSize: 12,
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
    marginTop: 10,
    gap: 8,
  },
});
