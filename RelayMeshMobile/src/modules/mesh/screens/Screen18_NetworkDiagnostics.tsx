import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';

export const Screen18_NetworkDiagnostics: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Store & Forward Status"
        subtitle="Locally queued data awaiting gateway synchronization"
      />

      <Card variant="accentGreen">
        <View style={styles.headerRow}>
          <Text style={[Typography.h3, { color: Colors.primary }]}>Queue Status</Text>
          <StatusBadge status="syncing" label="Queued for Relay" />
        </View>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Your encrypted reports are safely stored on this device and will be forwarded when another node or internet connection is reached.
        </Text>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Queued Data Inventory</Text>
        <View style={styles.queueItem}>
          <Text style={Typography.body}>💬 Pending Messages</Text>
          <Text style={[Typography.bodyBold, { color: Colors.primary }]}>3 items</Text>
        </View>
        <View style={styles.queueItem}>
          <Text style={Typography.body}>🚨 Pending SOS Reports</Text>
          <Text style={[Typography.bodyBold, { color: Colors.sosRed }]}>1 item</Text>
        </View>
        <View style={styles.queueItem}>
          <Text style={Typography.body}>🗺️ Map Vector Tile Cache</Text>
          <Text style={Typography.bodyBold}>5 regions (8.4 MB)</Text>
        </View>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Synchronization Timeline</Text>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          1. Stored locally in WatermelonDB ✓{'\n'}
          2. Encrypted with public key ✓{'\n'}
          3. Broadcast to mesh relays ✓{'\n'}
          4. Gateway sync (Waiting for cell tower link) ○
        </Text>
      </Card>

      <Button title="FORCE SYNC QUEUED DATA" variant="primary" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  queueItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
});
