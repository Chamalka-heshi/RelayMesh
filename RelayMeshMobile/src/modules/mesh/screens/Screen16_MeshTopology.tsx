import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen16_MeshTopology: React.FC = () => (
  <View style={styles.container}>
    <Header title="Mesh Topology" subtitle="Active node graph & routing table" badge="Member 4" />
    <Card>
      <Text style={[Typography.h3, { color: Colors.primaryLight }]}>🕸️ Connected Nodes: 6</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Active Relays: 4 • Gateway Nodes: 2</Text>
      <Text style={[Typography.caption, { color: Colors.success, marginTop: 4 }]}>Mesh Health: Excellent (98% Packet Delivery)</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
