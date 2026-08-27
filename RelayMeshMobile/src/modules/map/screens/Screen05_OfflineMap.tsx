import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen05_OfflineMap: React.FC = () => (
  <View style={styles.container}>
    <Header title="Offline Map" subtitle="Cached vector maps & mesh overlays" badge="Member 2" />
    <Card style={styles.mapPlaceholder}>
      <Text style={[Typography.h2, { color: Colors.secondaryLight, textAlign: 'center' }]}>🗺️ Offline Map View</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
        Displays active mesh nodes, shelters, and relief resources on offline tile sets.
      </Text>
    </Card>
    <Button title="DOWNLOAD OFFLINE REGION TILES" variant="secondary" onPress={() => {}} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  mapPlaceholder: { height: 260, justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
});
