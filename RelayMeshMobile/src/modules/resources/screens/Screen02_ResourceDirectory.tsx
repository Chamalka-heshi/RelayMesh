import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen02_ResourceDirectory: React.FC = () => (
  <View style={styles.container}>
    <Header title="Relief Resources" subtitle="Offline shelter, food & medical directory" badge="Member 5" />
    <Card>
      <Text style={[Typography.h3, { color: Colors.primaryLight }]}>🏥 Community First Aid Station</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Supplies: Bandages, Antiseptics, Oxygen • 350m</Text>
    </Card>
    <Card>
      <Text style={[Typography.h3, { color: Colors.secondaryLight }]}>💧 Clean Drinking Water Point</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Capacity: 500L available • Verified 10m ago</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
