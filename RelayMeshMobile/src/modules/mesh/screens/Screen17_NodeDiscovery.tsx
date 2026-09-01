import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { MeshService, MeshNode } from '../meshService';

export const Screen17_NodeDiscovery: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyNodes, setNearbyNodes] = useState<MeshNode[]>([]);

  // Load stored nodes from MeshService on mount
  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    const nodes = await MeshService.getNearbyNodes();
    setNearbyNodes(nodes);
  };

  const handleScan = async () => {
    setIsScanning(true);
    
    // Simulate BLE discovery delay
    setTimeout(async () => {
      const mockTypes: ('citizen' | 'volunteer' | 'rescue')[] = ['citizen', 'volunteer', 'rescue'];
      const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      
      const newNode: MeshNode = {
        id: Date.now().toString(),
        name: `Discovered Peer #${Math.floor(100 + Math.random() * 900)}`,
        dist: `${Math.floor(15 + Math.random() * 80)} m away`,
        role: 'Relay Enabled',
        rssi: `-${Math.floor(45 + Math.random() * 40)} dBm`,
        hops: 'Direct',
        type: randomType,
      };

      // Save node through local service
      const updatedList = await MeshService.addDiscoveredNode(newNode);
      setNearbyNodes(updatedList);
      setIsScanning(false);
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Nearby Devices"
        subtitle={`${nearbyNodes.length} peer nodes active in mesh storage`}
      />

      <Card style={{ backgroundColor: '#E6F4EA' }}>
        <Text style={Typography.bodyBold}>Mesh Scanner Active</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Automatically discovering and pairing with nearby RelayMesh smartphones.
        </Text>
      </Card>

      {nearbyNodes.map((n) => (
        <Card key={n.id} style={styles.nodeCard}>
          <View style={styles.nodeRow}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>
                {n.type === 'rescue' ? '🚤' : n.type === 'volunteer' ? '🤝' : n.type === 'shelter' ? '⛺' : '📱'}
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
        title={isScanning ? "SCANNING BLE RADIOS..." : "SCAN FOR NEW PEER DEVICES"}
        variant="primary"
        onPress={handleScan}
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