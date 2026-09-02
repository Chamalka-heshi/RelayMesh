import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { MeshService, MeshNode, StoredPacket } from '../meshService';
import { HardwareBridge } from '../hardwareBridge'; 
import { MeshNavigationFooter } from '../components/MeshNavigationFooter';

export const Screen17_NodeDiscovery = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyNodes, setNearbyNodes] = useState<MeshNode[]>([]);

  useEffect(() => {
    loadNodes();
    return () => {
      HardwareBridge.stopPhysicalScan();
    };
  }, []);

  const loadNodes = async () => {
    try {
      const nodes = await MeshService.getNearbyNodes();
      setNearbyNodes(nodes);
    } catch (e) {
      console.warn('Could not load devices:', e);
      setNearbyNodes([]);
    }
  };

  const handlePhysicalBLEScan = async () => {
    setIsScanning(true);

    await HardwareBridge.startPhysicalScan(
      async (discoveredNode: MeshNode) => {
        await MeshService.addDiscoveredNode(discoveredNode);
        setNearbyNodes((prev) => {
          const exists = prev.some((n) => n.id === discoveredNode.id);
          if (exists) {
            return prev.map((n) => (n.id === discoveredNode.id ? discoveredNode : n));
          }
          return [discoveredNode, ...prev];
        });
      },
      (error) => {
        Alert.alert('Search Error', error.message);
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
      payload: 'CRITICAL: Need immediate help!',
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };

    await MeshService.addPacketToQueue(sosPacket);
    Alert.alert('🚨 Distress Call Sent', 'Your help message has been saved and shared with nearby devices.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Search Devices"
        subtitle={`${nearbyNodes.length} devices found nearby`}
      />

      <Card style={{ backgroundColor: '#E6F4EA', marginBottom: 12 }}>
        <Text style={Typography.bodyBold}>Bluetooth Device Finder</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Uses Bluetooth to find other phones nearby without cellular service.
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
        title={isScanning ? "STOPPING SEARCH..." : "FIND NEARBY PHONES (10s)"}
        variant="secondary"
        onPress={handlePhysicalBLEScan}
        disabled={isScanning}
      />

      <MeshNavigationFooter currentScreen="Screen17" onNavigate={onNavigate} />
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