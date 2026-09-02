import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { MeshService, MeshNode, StoredPacket } from '../meshService';
import { HardwareBridge } from '../hardwareBridge'; 

export const Screen17_NodeDiscovery: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyNodes, setNearbyNodes] = useState<MeshNode[]>([]);

  useEffect(() => {
    loadNodes();
    return () => {
      HardwareBridge.stopPhysicalScan();
    };
  }, []);

  const loadNodes = async () => {
    const nodes = await MeshService.getNearbyNodes();
    setNearbyNodes(nodes);
  };

  const handlePhysicalBLEScan = async () => {
    setIsScanning(true);

    await HardwareBridge.startPhysicalScan(
      async (discoveredNode: MeshNode) => {
        // Save to storage
        await MeshService.addDiscoveredNode(discoveredNode);

        // Update local screen state without duplicate IDs
        setNearbyNodes((prev) => {
          const exists = prev.some((n) => n.id === discoveredNode.id);
          if (exists) {
            return prev.map((n) => (n.id === discoveredNode.id ? discoveredNode : n));
          }
          return [discoveredNode, ...prev];
        });
      },
      (error) => {
        Alert.alert('BLE Scan Error', error.message);
        setIsScanning(false);
      }
    );

    setTimeout(() => {
      HardwareBridge.stopPhysicalScan();
      setIsScanning(false);
    }, 10000);
  };

  const handleBroadcastSOS = async () => {
    const sosPacket: StoredPacket = {
      id: `sos_${Date.now()}`,
      sender: 'HostDevice_User',
      payload: 'CRITICAL: Rising floodwaters - Immediate evacuation needed!',
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };

    // Ensure you await this call
    const updatedQueue = await MeshService.addPacketToQueue(sosPacket);
    console.log('[DEBUG Screen 17] Queue length after insert:', updatedQueue.length);

    await MeshService.addPacketToQueue(sosPacket);
    Alert.alert('🚨 SOS Broadcasted', 'Message staged in local store-and-forward queue.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Nearby Devices"
        subtitle={`${nearbyNodes.length} hardware nodes registered`}
      />

      <Card style={{ backgroundColor: '#FCE8E6', borderColor: '#F5C6CB', borderWidth: 1, marginBottom: 12 }}>
        <Text style={[Typography.bodyBold, { color: '#721C24' }]}>Emergency Broadcast</Text>
        <Text style={[Typography.caption, { color: '#721C24', marginVertical: 4 }]}>
          Broadcast emergency alert into local store-and-forward queue.
        </Text>
        <Button title="🚨 BROADCAST EMERGENCY SOS" variant="primary" onPress={handleBroadcastSOS} />
      </Card>

      <Card style={{ backgroundColor: '#E6F4EA', marginBottom: 12 }}>
        <Text style={Typography.bodyBold}>Native BLE Radio Bridge</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Scans physical 2.4GHz Bluetooth Spectrum for nearby active smartphones.
        </Text>
      </Card>

      {nearbyNodes.map((n) => (
        <Card key={n.id} style={styles.nodeCard}>
          <View style={styles.nodeRow}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>
                {n.type === 'rescue' ? '🚤' : n.type === 'volunteer' ? '🤝' : '📱'}
              </Text>
            </View>
            <View style={styles.nodeInfo}>
              <Text style={Typography.bodyBold}>{n.name}</Text>
              <Text style={Typography.caption}>{n.dist} • {n.role}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.rssiBadge}>📶 {n.rssi}</Text>
                <Text style={styles.hopBadge}>{n.hops}</Text>
              </View>
            </View>
          </View>
        </Card>
      ))}

      {isScanning && <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 10 }} />}

      <Button
        title={isScanning ? "STOPPING BLE RADIO..." : "SCAN PHYSICAL BLE RADIOS (10s)"}
        variant="secondary"
        onPress={handlePhysicalBLEScan}
        disabled={isScanning}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  nodeCard: { marginVertical: 6, padding: 12 },
  nodeRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  nodeInfo: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  rssiBadge: { fontSize: 10, backgroundColor: Colors.accentGreen, color: Colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: '700' },
  hopBadge: { fontSize: 10, backgroundColor: Colors.surfaceSecondary, color: Colors.textSecondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});