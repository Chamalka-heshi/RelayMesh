import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen18_NetworkDiagnostics: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(14);
  const [totalForwarded, setTotalForwarded] = useState(182);
  const [lastSyncTime, setLastSyncTime] = useState('2 mins ago');

  const handleForceSync = () => {
    if (queueCount === 0) {
      Alert.alert('Queue Empty', 'There are no pending offline packets to synchronize.');
      return;
    }

    setIsSyncing(true);

    // Simulate network sync delay
    setTimeout(() => {
      setTotalForwarded((prev) => prev + queueCount);
      setQueueCount(0);
      setLastSyncTime('Just now');
      setIsSyncing(false);
      Alert.alert('Sync Successful', 'All offline emergency packets were successfully delivered to the cloud gateway.');
    }, 2000);
  };

  const handleSimulateNewPacket = () => {
    setQueueCount((prev) => prev + 1);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 40 },
    metricsGrid: { flexDirection: 'row', gap: 12, marginVertical: 12 },
    metricCard: { flex: 1, alignItems: 'center', padding: 16 },
    metricValue: { fontSize: 28, fontWeight: '800', color: Colors.primary },
    infoCard: { padding: 12, marginBottom: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    loadingContainer: { alignItems: 'center', marginVertical: 12 },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Store & Forward Queue"
        subtitle="Manage offline emergency packets awaiting gateway connection"
      />

      <Card style={{ backgroundColor: '#FCE8E6' }}>
        <Text style={Typography.bodyBold}>Local Packet Buffer Status</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Packets are encrypted locally and safely forwarded whenever a gateway node or internet connection is reached.
        </Text>
      </Card>

      {/* Diagnostic Metrics Grid */}
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{queueCount}</Text>
          <Text style={Typography.caption}>Pending Packets</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{totalForwarded}</Text>
          <Text style={Typography.caption}>Total Relayed</Text>
        </Card>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={Typography.caption}>Database Engine:</Text>
          <Text style={Typography.bodyBold}>SQLite / WatermelonDB</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.caption}>Storage Limit:</Text>
          <Text style={Typography.bodyBold}>50 MB / 500 MB</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.caption}>Last Cloud Sync:</Text>
          <Text style={Typography.bodyBold}>{lastSyncTime}</Text>
        </View>
      </Card>

      {isSyncing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[Typography.caption, { marginTop: 8 }]}>Connecting to gateway & flushing queue...</Text>
        </View>
      )}

      <Button
        title={isSyncing ? "SYNCING QUEUE..." : "FORCE SYNC QUEUED DATA"}
        variant="primary"
        onPress={handleForceSync}
        disabled={isSyncing}
      />

      <View style={{ marginTop: 12 }}>
        <Button
          title="+ Simulate Incoming Offline Packet"
          variant="secondary"
          onPress={handleSimulateNewPacket}
          disabled={isSyncing}
        />
      </View>
    </ScrollView>
  );
};

