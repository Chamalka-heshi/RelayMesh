import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen06_NodeLocator: React.FC = () => (
  <View style={styles.container}>
    <Header title="Node Locator" subtitle="Find nearest mesh gateway" badge="Member 2" />
    <Card>
      <Text style={[Typography.h3, { color: Colors.primaryLight }]}>📡 Relay Node #Alpha-01</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Bearing: 45° NE • Distance: 120m</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
