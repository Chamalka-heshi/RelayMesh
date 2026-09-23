import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, StatusBadge, Colors, Typography } from '../../../shared';
import { useAuth } from '../../../context';
import { sosService, SOSAlert } from '../../sos';

interface Props {
  onNavigate: (screen: string) => void;
  onSOSPress: () => void;
}

export const Screen04_HomeDashboard: React.FC<Props> = ({
  onNavigate,
  onSOSPress,
}) => {
  const { user, profile } = useAuth();
  const [activeSOS, setActiveSOS] = useState<SOSAlert | null>(sosService.getActiveSOS());

  useEffect(() => {
    const unsubscribe = sosService.subscribe((alert) => {
      setActiveSOS(alert);
    });
    return unsubscribe;
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'RM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Relay User';
  const displayRole = profile?.role === 'volunteer' ? 'Volunteer Rescuer' : 'Citizen Responder';
  const displayNodeId = profile?.nodeId || '#RM-4587';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Green Brand Bar with User Details */}
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
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </TouchableOpacity>
        </View>

        {/* User Identity Banner */}
        <TouchableOpacity 
          style={styles.userBar}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.welcomeText}>Hello, {displayName}</Text>
            <Text style={styles.userRoleText}>{displayRole} • Node: {displayNodeId}</Text>
          </View>
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>ACTIVE NODE</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* System Status */}
      <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
        <Text style={[Typography.h3, { color: Colors.textSecondary, marginBottom: 8 }]}>System Ready</Text>
        <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 }]}>
          Tap the SOS button below if you are in an emergency. Ensure your profile is up to date.
        </Text>
      </View>

      {/* Prominent SOS Action Banner - ONLY show if SOS is active */}
      {activeSOS && (
        <TouchableOpacity
          style={[
            styles.sosBanner,
            { backgroundColor: Colors.sosRed, borderColor: '#FFFFFF', borderWidth: 1 },
          ]}
          onPress={onSOSPress}
          activeOpacity={0.85}
        >
          <View style={styles.sosBannerLeft}>
            <View style={[styles.sosMiniCircle, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.sosMiniText, { color: Colors.sosRed, fontWeight: '900' }]}>
                🚨
              </Text>
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosBannerTitle}>
                ACTIVE SOS: {activeSOS.id}
              </Text>
              <Text style={styles.sosBannerSub}>
                Distress beacon active • {activeSOS.nodesNotified} mesh nodes relaying
              </Text>
            </View>
          </View>
          <Text style={styles.sosChevron}>➔</Text>
        </TouchableOpacity>
      )}
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  userBar: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userRoleText: {
    color: '#E8F5EC',
    fontSize: 12,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statusCol: {
    alignItems: 'center',
  },
  statusColVal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusColLbl: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.sosRed,
    borderRadius: 14,
    padding: 14,
    marginVertical: 12,
  },
  sosBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sosMiniCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sosMiniText: {
    color: Colors.sosRed,
    fontWeight: '900',
    fontSize: 13,
  },
  sosTextCol: {
    flex: 1,
  },
  sosBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sosBannerSub: {
    color: '#FEE2E2',
    fontSize: 11,
    marginTop: 2,
  },
  sosChevron: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  gridIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridIcon: {
    fontSize: 20,
  },
  alertCard: {
    marginTop: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
