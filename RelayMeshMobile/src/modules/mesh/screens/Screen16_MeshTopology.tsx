import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';

export const Screen16_MeshTopology: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Mesh Network Topology"
        subtitle="Peer-to-peer radio topology & active routing"
      />

      {/* Main Connection Status Card */}
      <Card variant="accentGreen">
        <View style={styles.headerRow}>
          <View>
            <Text style={[Typography.h2, { color: Colors.primary }]}>Mesh Connected</Text>
            <Text style={[Typography.caption, { marginTop: 2 }]}>
              12 nearby devices • 5 active relays
            </Text>
          </View>
          <StatusBadge status="connected" label="Healthy" />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Connected Peers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Active Relays</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>-62 dBm</Text>
            <Text style={styles.statLabel}>Signal (Avg)</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>98.4%</Text>
            <Text style={styles.statLabel}>Delivery Rate</Text>
          </View>
        </View>
      </Card>

      {/* Visual Node Network Diagram */}
      <Card style={styles.graphCard}>
        <Text style={[Typography.h3, { marginBottom: 12 }]}>🕸️ Live P2P Routing Graph</Text>
        
        <View style={styles.graphCanvas}>
          {/* Center User Node */}
          <View style={[styles.node, styles.userNode, { top: '38%', left: '38%' }]}>
            <Text style={styles.nodeEmoji}>📱</Text>
            <Text style={styles.nodeText}>YOU</Text>
          </View>

          {/* Connected Peripheral Nodes */}
          <View style={[styles.node, { top: '10%', left: '20%' }]}>
            <Text style={styles.nodeEmoji}>🚤</Text>
            <Text style={styles.nodeText}>Rescue #04</Text>
          </View>
          <View style={[styles.node, { top: '15%', right: '18%' }]}>
            <Text style={styles.nodeEmoji}>🤝</Text>
            <Text style={styles.nodeText}>Volunteer</Text>
          </View>
          <View style={[styles.node, { bottom: '15%', left: '15%' }]}>
            <Text style={styles.nodeEmoji}>⛺</Text>
            <Text style={styles.nodeText}>Shelter-1</Text>
          </View>
          <View style={[styles.node, { bottom: '12%', right: '20%' }]}>
            <Text style={styles.nodeEmoji}>📱</Text>
            <Text style={styles.nodeText}>Peer #84</Text>
          </View>
        </View>
        
        <Text style={[Typography.caption, { textAlign: 'center', marginTop: 8 }]}>
          Every smartphone acts as a bridge forwarding encrypted packets.
        </Text>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Radio Transceivers</Text>
        <View style={styles.radioRow}>
          <Text style={Typography.body}>Bluetooth Low Energy (BLE)</Text>
          <Text style={[Typography.captionBold, { color: Colors.primary }]}>ACTIVE (SCANNING)</Text>
        </View>
        <View style={styles.radioRow}>
          <Text style={Typography.body}>Wi-Fi Direct P2P</Text>
          <Text style={[Typography.captionBold, { color: Colors.primary }]}>ACTIVE (RELAYING)</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  statBox: { width: '48%', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.accentGreenBorder },
  statNumber: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  graphCard: { marginVertical: 10 },
  graphCanvas: { height: 200, backgroundColor: Colors.surfaceSecondary, borderRadius: 12, position: 'relative', overflow: 'hidden' },
  node: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  userNode: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.accentGreen, borderColor: Colors.primary, borderWidth: 3 },
  nodeEmoji: { fontSize: 18 },
  nodeText: { fontSize: 8, fontWeight: '700', color: Colors.textPrimary, marginTop: 1 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingVertical: 4 },
});
