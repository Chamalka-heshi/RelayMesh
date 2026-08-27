import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen15_RouteNavigation: React.FC = () => (
  <View style={styles.container}>
    <Header title="Safe Evacuation Routing" subtitle="Offline hazard avoidance pathfinding" badge="Member 2" />
    <Card>
      <Text style={[Typography.h3, { color: Colors.secondaryLight }]}>🧭 Route to Central Shelter</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Total Distance: 1.4 km • Est. Time: 18 mins walk</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
