import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen25_AboutApp: React.FC = () => (
  <View style={styles.container}>
    <Header title="About RelayMesh" subtitle="Decentralized Disaster Relief Protocol" badge="Member 5" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>
        About RelayMesh screen component for Member 5.
      </Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
