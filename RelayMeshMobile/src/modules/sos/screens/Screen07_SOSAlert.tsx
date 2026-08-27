import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen07_SOSAlert: React.FC = () => (
  <View style={styles.container}>
    <Header title="Incoming SOS Alerts" subtitle="Active distress signals received" badge="Member 1" />
    <Card variant="danger">
      <Text style={[Typography.h3, { color: Colors.sosRed }]}>🚨 Medical Emergency</Text>
      <Text style={[Typography.body, { color: Colors.textPrimary, marginTop: 4 }]}>Node: Alpha-02 (250m away)</Text>
      <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 4 }]}>GPS: 6.9271° N, 79.8612° E • 2 mins ago</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
