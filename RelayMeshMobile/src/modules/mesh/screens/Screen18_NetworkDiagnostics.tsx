import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { MeshService, StoredPacket } from '../meshService';
import { MeshNavigationFooter } from '../components/MeshNavigationFooter';

export const Screen18_NetworkDiagnostics = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [packets, setPackets] = useState<StoredPacket[]>([]);
  const [totalForwarded, setTotalForwarded] = useState(182);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const queue = await MeshService.getQueuedPackets();
      setPackets(queue);
    } catch (e) {
      console.warn('Could not load outbox:', e);
      setPackets([]);
    }
  };

  const handleSimulateNewPacket = async () => {
    const newPacket: StoredPacket = {
      id: `pkt_${Date.now()}`,
      sender: `User_${Math.floor(100 + Math.random() * 900)}`,
      payload: 'SOS: Need medical supplies nearby',
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };

    const updatedQueue = await MeshService.addPacketToQueue(newPacket);
    setPackets(updatedQueue);
  };

  const handleForceSync = async () => {
    if (packets.length === 0) {
      Alert.alert('Outbox Empty', 'There are no pending messages to send.');
      return;
    }

    setIsSyncing(true);

    try {
      const result = await MeshService.syncQueueToCloud();

      if (result.success) {
        setTotalForwarded((prev) => prev + result.count);
        setPackets([]);
        
        Alert.alert(
          'Messages Sent!',
          `${result.count} emergency message(s) successfully uploaded!`
        );
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'Could not reach the internet server.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Message Outbox"
        subtitle="Saved messages waiting to be sent"
      />

      <Card style={{ backgroundColor: '#FCE8E6' }}>
        <Text style={Typography.bodyBold}>Offline Storage</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Messages are saved safely on your phone and sent automatically when internet or a rescue team is found.
        </Text>
      </Card>

      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{packets.length}</Text>
          <Text style={Typography.caption}>Pending Messages</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{totalForwarded}</Text>
          <Text style={Typography.caption}>Total Delivered</Text>
        </Card>
      </View>

      <Card style={{ marginBottom: 16 }}>
        <Text style={[Typography.bodyBold, { marginBottom: 8 }]}>Pending Messages</Text>
        {packets.length === 0 ? (
          <Text style={Typography.caption}>No pending messages in outbox.</Text>
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
          <Text style={[Typography.caption, { marginTop: 8 }]}>Uploading saved messages...</Text>
        </View>
      )}

      <Button
        title={isSyncing ? "UPLOADING..." : "SEND MESSAGES TO CLOUD NOW"}
        variant="primary"
        onPress={handleForceSync}
        disabled={isSyncing}
      />

      <View style={{ marginTop: 12 }}>
        <Button
          title="+ Test Adding Message"
          variant="secondary"
          onPress={handleSimulateNewPacket}
          disabled={isSyncing}
        />
      </View>

      <MeshNavigationFooter currentScreen="Screen18" onNavigate={onNavigate} />
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