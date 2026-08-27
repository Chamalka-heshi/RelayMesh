import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen09_SOSHistory: React.FC = () => (
  <View style={styles.container}>
    <Header title="SOS Log & History" subtitle="Archived emergency alerts" badge="Member 1" />
    <Card variant="surface">
      <Text style={[Typography.h3, { color: Colors.success }]}>✓ Resolved: Medical Assist</Text>
      <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 4 }]}>Resolved 2 hours ago • Responders: 2 Nodes</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
