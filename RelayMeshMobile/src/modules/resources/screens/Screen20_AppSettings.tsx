import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';
import { useAuth } from '../../../context';

interface Props {
  onNavigateProfile?: () => void;
  onLogout?: () => void;
}

export const Screen20_AppSettings: React.FC<Props> = ({
  onNavigateProfile,
  onLogout,
}) => {
  const { user, profile, signOut } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'RM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'Sajura Niman';
  const displayRole = profile?.role === 'volunteer' ? 'Volunteer Rescuer' : 'Citizen';
  const displayNodeId = profile?.nodeId || (user ? `#RM-${user.id.slice(0, 4).toUpperCase()}` : '#RM-4587');

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your Supabase account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          if (onLogout) {
            onLogout();
          }
        },
      },
    ]);
  };

  const settingsList = [
    { id: 'profile', icon: '👤', title: 'User Profile & Emergency Card', sub: `${displayName} • ${displayRole}`, action: onNavigateProfile },
    { id: 'device', icon: '📱', title: 'Device & Hardware Identity', sub: `Device Node: ${displayNodeId}` },
    { id: 'network', icon: '📶', title: 'Mesh & Radio Settings', sub: 'Bluetooth, Wi-Fi Direct, Background Relay' },
    { id: 'storage', icon: '💾', title: 'Data & Offline Storage', sub: 'Cached maps: 8.4 MB, message logs' },
    { id: 'privacy', icon: '🔒', title: 'Privacy & Security', sub: 'End-to-end encryption keys' },
    { id: 'notifications', icon: '🔔', title: 'Emergency Sound & Haptics', sub: 'High-pitch SOS strobe alerts' },
    { id: 'help', icon: '❓', title: 'Help & Emergency Quick Guide', sub: 'Offline disaster handbook & FAQs' },
    { id: 'about', icon: 'ℹ️', title: 'About RelayMesh', sub: 'Version 1.0.0 (Supabase Auth Edition)' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Settings" subtitle="Application, radio & profile preferences" />

      {/* User Header Profile Card */}
      <TouchableOpacity onPress={onNavigateProfile} activeOpacity={0.7}>
        <Card variant="accentGreen" style={styles.userCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={Typography.h3}>{displayName}</Text>
              <Text style={Typography.caption}>
                Role: {displayRole} • ID: {displayNodeId}
              </Text>
              <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '600', marginTop: 2 }]}>
                {user ? '● Supabase Connected' : '● Local Relay Active'}
              </Text>
            </View>
            <Text style={styles.chevron}>➔</Text>
          </View>
        </Card>
      </TouchableOpacity>

      {/* Settings Options List */}
      <Card style={styles.listCard}>
        {settingsList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <View style={styles.settingTextCol}>
                <Text style={Typography.bodyBold}>{item.title}</Text>
                <Text style={Typography.caption}>{item.sub}</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Log out / Reset button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>🚪 Log Out / Clear Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  userCard: { marginVertical: 10, padding: 14 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  userInfo: { flex: 1 },
  chevron: { color: Colors.textMuted, fontSize: 18 },
  listCard: { padding: 4, marginVertical: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { fontSize: 20, marginRight: 12 },
  settingTextCol: { flex: 1 },
  logoutBtn: { marginVertical: 20, alignItems: 'center', padding: 12 },
  logoutText: { color: Colors.sosRed, fontWeight: '700', fontSize: 14 },
});
