import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen17_NodeDiscovery: React.FC = () => (
  <View style={styles.container}>
    <Header title="Node Discovery" subtitle="Scan BLE & Wi-Fi Direct peers" badge="Member 4" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Scanning for nearby RelayMesh hardware nodes and peer devices...</Text>
    </Card>
    <Button title="START DISCOVERY SCAN" variant="primary" onPress={() => {}} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
