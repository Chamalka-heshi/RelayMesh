import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen17_NodeDiscovery: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyNodes, setNearbyNodes] = useState([
    { id: '1', name: 'Rescue Team Alpha Unit', dist: '45 m away', role: 'Gateway Node', rssi: '-54 dBm', hops: 'Direct', type: 'rescue' },
    { id: '2', name: 'Volunteer Group Relay #02', dist: '80 m away', role: 'Relay Enabled', rssi: '-68 dBm', hops: 'Direct', type: 'volunteer' },
    { id: '3', name: 'Citizen Peer Device #448', dist: '120 m away', role: 'Relay Enabled', rssi: '-76 dBm', hops: '1 Hop', type: 'citizen' },
    { id: '4', name: 'Community Shelter Base', dist: '350 m away', role: 'Local Hub', rssi: '-82 dBm', hops: '2 Hops', type: 'shelter' },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate BLE radio scan delay of 1.5 seconds
    setTimeout(() => {
      const newNodeId = (nearbyNodes.length + 1).toString();
      const mockTypes = ['citizen', 'volunteer', 'rescue'];
      const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      
      const newNode = {
        id: newNodeId,
        name: `Discovered Peer #${Math.floor(100 + Math.random() * 900)}`,
        dist: `${Math.floor(20 + Math.random() * 100)} m away`,
        role: 'Relay Enabled',
        rssi: `-${Math.floor(50 + Math.random() * 40)} dBm`,
        hops: 'Direct',
        type: randomType,
      };

      setNearbyNodes((prevNodes) => [newNode, ...prevNodes]);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Nearby Devices"
        subtitle={`${nearbyNodes.length} peer nodes discovered via BLE & Wi-Fi Direct`}
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