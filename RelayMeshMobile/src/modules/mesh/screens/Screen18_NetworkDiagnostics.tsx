import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { MeshService, StoredPacket } from '../meshService';

export const Screen18_NetworkDiagnostics: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [packets, setPackets] = useState<StoredPacket[]>([]);
  const [totalForwarded, setTotalForwarded] = useState(182);

  // Load persistent packet queue on mount
  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const queue = await MeshService.getQueuedPackets();
    setPackets(queue);
  };

  const handleSimulateNewPacket = async () => {
    const newPacket: StoredPacket = {
      id: `pkt_${Date.now()}`,
      sender: `Node_${Math.floor(100 + Math.random() * 900)}`,
      payload: 'SOS: Need medical supplies at Shelter #3',
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };

    const updatedQueue = await MeshService.addPacketToQueue(newPacket);
    setPackets(updatedQueue);
  };

  const handleForceSync = async () => {
      if (packets.length === 0) {
        Alert.alert('Queue Empty', 'There are no pending offline packets to synchronize.');
        return;
      }

      setIsSyncing(true);

      const result = await MeshService.syncQueueToCloud();

      if (result.success) {
        setTotalForwarded((prev) => prev + result.count);
        setPackets([]);
        setIsSyncing(false);

        Alert.alert(
          'Cloud Sync Successful',
          `${result.count} emergency packet(s) successfully pushed to Supabase Gateway!`
        );
      }
    };
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
          <Text style={styles.metricValue}>{packets.length}</Text>
          <Text style={Typography.caption}>Pending Packets</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{totalForwarded}</Text>
          <Text style={Typography.caption}>Total Relayed</Text>
        </Card>
      </View>

      {/* Packet Preview List */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={[Typography.bodyBold, { marginBottom: 8 }]}>Recent Queued Payloads</Text>
        {packets.length === 0 ? (
          <Text style={Typography.caption}>No pending packets in buffer.</Text>
        ) : (
          packets.slice(0, 3).map((pkt) => (
            <View key={pkt.id} style={styles.packetItem}>
              <Text style={Typography.bodyBold}>{pkt.sender}</Text>
              <Text style={Typography.caption}>{pkt.payload} • {pkt.timestamp}</Text>
            </View>
          ))
        )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  metricsGrid: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  metricCard: { flex: 1, alignItems: 'center', padding: 16 },
  metricValue: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  packetItem: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  loadingContainer: { alignItems: 'center', marginVertical: 12 },
});