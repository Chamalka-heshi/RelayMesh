import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';
import { MeshService, MeshNode } from '../meshService';

export const Screen16_MeshTopology: React.FC = () => {
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTopology();
  }, []);

  const fetchTopology = async () => {
    const activeNodes = await MeshService.getNearbyNodes();
    setNodes(activeNodes);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTopology();
    setRefreshing(false);
  };

  // Compute live topology statistics
  const totalNodes = nodes.length;
  const rescueUnits = nodes.filter((n) => n.type === 'rescue').length;
  const directHops = nodes.filter((n) => n.hops === 'Direct').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Header
        title="Network Topology"
        subtitle="Real-time visualization of local mesh routing"
      />

      {/* Network Overview Cards */}
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{totalNodes + 1}</Text>
          <Text style={Typography.caption}>Active Peers (Incl. You)</Text>
        </Card>
        <Card style={styles.metricCard}>
          <Text style={styles.metricValue}>{rescueUnits}</Text>
          <Text style={Typography.caption}>Rescue Gateways</Text>
        </Card>
      </View>

      <Card style={styles.graphCard}>
        <Text style={[Typography.bodyBold, { marginBottom: 12 }]}>Visual Mesh Graph</Text>
        
        {/* Local Node representation */}
        <View style={styles.centralNodeContainer}>
          <View style={styles.centralNode}>
            <Text style={{ fontSize: 24 }}>📱</Text>
          </View>
          <Text style={Typography.bodyBold}>Your Phone (Host Node)</Text>
          <Text style={Typography.caption}>Relay Engine Active</Text>
        </View>

        <View style={styles.dividerLine} />

        {/* Connected Peers topology tree */}
        <Text style={[Typography.caption, { marginBottom: 8, fontWeight: '700' }]}>
          CONNECTED HOP NODES ({directHops} Direct)
        </Text>

        {nodes.map((node) => (
          <View key={node.id} style={styles.nodeHopRow}>
            <View style={styles.nodeIcon}>
              <Text style={{ fontSize: 16 }}>
                {node.type === 'rescue' ? '🚤' : node.type === 'volunteer' ? '🤝' : '📱'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={Typography.bodyBold}>{node.name}</Text>
              <Text style={Typography.caption}>{node.dist} • {node.rssi}</Text>
            </View>
            <View style={styles.linkBadge}>
              <Text style={styles.linkBadgeText}>Link OK</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  metricCard: { flex: 1, alignItems: 'center', padding: 16 },
  metricValue: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  graphCard: { padding: 16 },
  centralNodeContainer: { alignItems: 'center', marginVertical: 12 },
  centralNode: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  dividerLine: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  nodeHopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  nodeIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  linkBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  linkBadgeText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
});