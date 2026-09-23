import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '../../../shared';
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* iOS Style Profile Widget */}
      <TouchableOpacity 
        style={styles.iosWidgetCard}
        onPress={() => onNavigate('profile')}
        activeOpacity={0.8}
      >
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>Profile</Text>
          <Text style={styles.widgetActionText}>Edit</Text>
        </View>
        <View style={styles.profileContent}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
          <View style={styles.profileTextGroup}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileRole}>{displayRole}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* iOS Style System Status Widget */}
      <View style={styles.iosWidgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>System Status</Text>
        </View>
        <View style={styles.statusContent}>
          <View style={styles.statusDot} />
          <Text style={styles.statusTextPrimary}>Ready for Emergency</Text>
        </View>
        <Text style={styles.statusTextSecondary}>
          Tap the SOS button below to broadcast an emergency distress signal to nearby mesh nodes.
        </Text>
      </View>

      {/* Prominent SOS Action Banner - ONLY show if SOS is active */}
      {activeSOS && (
        <TouchableOpacity
          style={styles.sosBanner}
          onPress={onSOSPress}
          activeOpacity={0.85}
        >
          <View style={styles.sosBannerLeft}>
            <View style={styles.sosMiniCircle}>
              <Text style={styles.sosMiniText}>🚨</Text>
            </View>
            <View style={styles.sosTextCol}>
              <Text style={styles.sosBannerTitle}>
                ACTIVE SOS: {activeSOS.id}
              </Text>
              <Text style={styles.sosBannerSub}>
                Distress beacon active • {activeSOS.nodesNotified} nodes relaying
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS Grouped background
  },
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  iosWidgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    // iOS standard subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  widgetActionText: {
    fontSize: 15,
    color: '#007AFF', // iOS Blue
    fontWeight: '500',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#8E8E93',
  },
  profileTextGroup: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 15,
    color: '#8E8E93',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759', // iOS Green
    marginRight: 10,
  },
  statusTextPrimary: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  statusTextSecondary: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30', // iOS Red
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  sosBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sosMiniCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sosMiniText: {
    fontSize: 20,
  },
  sosTextCol: {
    flex: 1,
  },
  sosBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sosBannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
});
