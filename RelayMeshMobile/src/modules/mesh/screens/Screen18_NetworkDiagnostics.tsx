import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen18_NetworkDiagnostics: React.FC = () => (
  <View style={styles.container}>
    <Header title="Network Diagnostics" subtitle="Packet latency, RSSI & throughput" badge="Member 4" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Average Latency: 42ms • Packet Loss: 0.4% • RSSI: -65 dBm</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
