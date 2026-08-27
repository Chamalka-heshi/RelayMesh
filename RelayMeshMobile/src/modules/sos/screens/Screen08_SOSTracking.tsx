import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen08_SOSTracking: React.FC = () => (
  <View style={styles.container}>
    <Header title="Live SOS Tracking" subtitle="Real-time beacon vector tracking" badge="Member 1" />
    <Card variant="surface">
      <Text style={[Typography.h3, { color: Colors.primaryLight }]}>📍 Tracking Beacon #SOS-449</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Signal Strength: -68 dBm (Strong)</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 2 }]}>Estimated Distance: 180 meters</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
