import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen19_RelaySettings: React.FC = () => (
  <View style={styles.container}>
    <Header title="Relay Configuration" subtitle="Configure packet forwarding policy" badge="Member 4" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Forwarding Mode: Aggressive • Max Hops: 7 • Low Power Mode: OFF</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
