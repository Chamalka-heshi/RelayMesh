import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, StatusBadge, Colors, Typography } from '../../../shared';

interface Props {
  onNavigate: (screen: string) => void;
  onSOSPress: () => void;
}

export const Screen04_HomeDashboard: React.FC<Props> = ({
  onNavigate,
  onSOSPress,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Green Brand Bar */}
      <View style={styles.topGreenCard}>
        <View style={styles.topRow}>
          <View style={styles.brandGroup}>
            <Text style={styles.brandIcon}>📡</Text>
            <View>
              <Text style={styles.brandTitle}>RelayMesh</Text>
              <Text style={styles.brandSubtitle}>Offline P2P Mesh Network</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={() => onNavigate('profile')}
          >
            <Text style={styles.avatarText}>SN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mesh Network Connection Status Card */}
      <Card variant="accentGreen" style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={[Typography.captionBold, { color: Colors.primary }]}>
              MESH NETWORK STATUS
            </Text>
            <Text style={[Typography.h2, { color: Colors.primaryDark, marginTop: 2 }]}>
              Connected
            </Text>
          </View>
          <StatusBadge status="connected" label="12 Nearby Nodes" />
        </View>

        <View style={styles.statusDetailsRow}>
          <View style={styles.statusCol}>
            <Text style={styles.statusColVal}>12</Text>
            <Text style={styles.statusColLbl}>Peers</Text>
          </View>
          <View style={styles.statusCol}>
            <Text style={styles.statusColVal}>5</Text>
            <Text style={styles.statusColLbl}>Relays</Text>
          </View>
          <View style={styles.statusCol}>
            <Text style={styles.statusColVal}>94%</Text>
            <Text style={styles.statusColLbl}>Battery</Text>
          </View>
          <View style={styles.statusCol}>
            <Text style={styles.statusColVal}>-64 dBm</Text>
            <Text style={styles.statusColLbl}>Signal</Text>
          </View>
        </View>
      </Card>

      {/* Prominent SOS Action Banner */}
      <TouchableOpacity
        style={styles.sosBanner}
        onPress={onSOSPress}
        activeOpacity={0.85}
      >
        <View style={styles.sosBannerLeft}>
          <View style={styles.sosMiniCircle}>
            <Text style={styles.sosMiniText}>SOS</Text>
          </View>
          <View style={styles.sosTextCol}>
            <Text style={styles.sosBannerTitle}>Emergency SOS Distress</Text>
            <Text style={styles.sosBannerSub}>
              One-tap broadcast to rescue teams & nearby nodes
            </Text>
          </View>
        </View>
        <Text style={styles.sosChevron}>➔</Text>
      </TouchableOpacity>

      {/* Quick Action Grid (6 Modules) */}
      <Text style={[Typography.h3, styles.sectionTitle]}>Quick Navigation</Text>

      <View style={styles.grid}>
        {/* Map Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => onNavigate('map')}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#E8F5EC' }]}>
            <Text style={styles.gridIcon}>🗺️</Text>
          </View>
          <Text style={Typography.bodyBold}>Offline Map</Text>
          <Text style={Typography.caption}>Shelters & Water</Text>
        </TouchableOpacity>

        {/* SOS Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={onSOSPress}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: Colors.sosRedLight }]}>
            <Text style={styles.gridIcon}>🚨</Text>
          </View>
          <Text style={[Typography.bodyBold, { color: Colors.sosRed }]}>SOS Alert</Text>
          <Text style={Typography.caption}>Distress Beacon</Text>
        </TouchableOpacity>

        {/* Chat / Messages Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => onNavigate('messages')}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.gridIcon}>💬</Text>
          </View>
          <Text style={Typography.bodyBold}>Messages</Text>
          <Text style={Typography.caption}>P2P Mesh Chat</Text>
        </TouchableOpacity>

        {/* Resources Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => onNavigate('resources')}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#FFEDD5' }]}>
            <Text style={styles.gridIcon}>📦</Text>
          </View>
          <Text style={Typography.bodyBold}>Relief Directory</Text>
          <Text style={Typography.caption}>Food & Medical</Text>
        </TouchableOpacity>

        {/* Mesh Network Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => onNavigate('mesh')}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: '#E8F5EC' }]}>
            <Text style={styles.gridIcon}>🕸️</Text>
          </View>
          <Text style={Typography.bodyBold}>Mesh Topology</Text>
          <Text style={Typography.caption}>12 Active Peers</Text>
        </TouchableOpacity>

        {/* Settings Card */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => onNavigate('settings')}
          activeOpacity={0.7}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: Colors.surfaceSecondary }]}>
            <Text style={styles.gridIcon}>⚙️</Text>
          </View>
          <Text style={Typography.bodyBold}>Settings</Text>
          <Text style={Typography.caption}>Radio & Storage</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Hazard / Emergency Broadcast Banner */}
      <Card style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Text style={[Typography.bodyBold, { color: Colors.warning }]}>
            ⚠️ Flood Hazard Warning
          </Text>
          <Text style={Typography.caption}>12 mins ago</Text>
        </View>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Sector 2 bridge road is flooded (1.5m depth). Safe bypass route via Hill Road is active on offline map.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topGreenCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: '#E8F5EC',
    fontSize: 11,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  statusCard: {
    marginVertical: 4,
    padding: 14,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.accentGreenBorder,
  },
  statusCol: {
    alignItems: 'center',
  },
  statusColVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  statusColLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.sosRedLight,
    borderColor: Colors.sosRedBorder,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    marginVertical: 10,
  },
  sosBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sosMiniCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.sosRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sosMiniText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  sosTextCol: {
    flex: 1,
  },
  sosBannerTitle: {
    color: Colors.sosRed,
    fontWeight: '700',
    fontSize: 14,
  },
  sosBannerSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sosChevron: {
    color: Colors.sosRed,
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  sectionTitle: {
    marginVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 4,
  },
  gridCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  gridIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridIcon: {
    fontSize: 18,
  },
  alertCard: {
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
