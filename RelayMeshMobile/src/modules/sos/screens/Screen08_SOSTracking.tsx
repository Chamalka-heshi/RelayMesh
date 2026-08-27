import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';

export const Screen08_SOSTracking: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Live SOS Tracking"
        subtitle="Tracking active emergency signal #SOS-4487"
        badge="ACTIVE"
      />

      <Card variant="emergencyRed">
        <View style={styles.cardHeader}>
          <Text style={[Typography.h3, { color: Colors.sosRed }]}>🚨 SOS SIGNAL BROADCASTING</Text>
          <StatusBadge status="emergency" label="Broadcasting" />
        </View>
        <Text style={[Typography.caption, { marginTop: 6 }]}>
          Signal transmitted continuously via Bluetooth Low Energy & Wi-Fi Direct Mesh.
        </Text>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Signal Telemetry & Diagnostics</Text>
        <View style={styles.telemetryGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>-64 dBm</Text>
            <Text style={styles.gridLabel}>Signal Strength</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>12 Devices</Text>
            <Text style={styles.gridLabel}>Nearby Nodes</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>4 Hops</Text>
            <Text style={styles.gridLabel}>Forwarding Radius</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridValue}>94%</Text>
            <Text style={styles.gridLabel}>Battery Power</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Dispatched Responders</Text>
        <View style={styles.responderRow}>
          <Text style={styles.responderIcon}>🚤</Text>
          <View style={styles.responderInfo}>
            <Text style={Typography.bodyBold}>Rescue Boat Unit #04</Text>
            <Text style={Typography.caption}>Distance: 450m • ETA: 10 mins • Bearing: 35° NE</Text>
          </View>
        </View>
      </Card>

      <Button title="UPDATE EMERGENCY STATUS" variant="primary" onPress={() => {}} />
      <Button title="CANCEL SOS" variant="danger" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  telemetryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 10 },
  gridItem: { width: '47%', backgroundColor: Colors.surfaceSecondary, padding: 12, borderRadius: 10 },
  gridValue: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  gridLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  responderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  responderIcon: { fontSize: 24, marginRight: 10 },
  responderInfo: { flex: 1 },
});
