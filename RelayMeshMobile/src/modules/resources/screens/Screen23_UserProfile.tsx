import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';
import { useAuth } from '../../../context';

interface Props {
  onBackPress?: () => void;
}

export const Screen23_UserProfile: React.FC<Props> = ({ onBackPress }) => {
  const { user, profile } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'RM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'RelayMesh Responder';
  const displayRole = profile?.role === 'volunteer' ? 'Volunteer Rescuer' : 'Citizen Responder';
  const displayNodeId = profile?.nodeId || (user ? `#RM-${user.id.slice(0, 4).toUpperCase()}` : '#RM-4587');
  const displayEmail = user?.email || profile?.email || 'offline-node@relaymesh.local';
  const displayPhone = profile?.phone || '+94 77 123 4567';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="User & Node Profile"
        subtitle="Identity, emergency tags & cryptographic keys"
        onBackPress={onBackPress}
      />

      {/* Avatar Header Box */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
        </View>
        <Text style={[Typography.h1, { marginTop: 10 }]}>{displayName}</Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          {displayRole} • Node ID: {displayNodeId}
        </Text>
        <View style={{ marginTop: 6 }}>
          <StatusBadge
            status={user ? 'connected' : 'offline'}
            label={user ? 'Supabase Auth Verified' : 'Local Standalone Node'}
          />
        </View>
      </View>

      {/* Profile Details Card */}
      <Card>
        <Text style={Typography.bodyBold}>Emergency Identification</Text>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Account Email</Text>
          <Text style={Typography.bodyBold}>{displayEmail}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Registered Phone</Text>
          <Text style={Typography.bodyBold}>{displayPhone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Blood Group</Text>
          <Text style={Typography.bodyBold}>{profile?.bloodGroup || 'O+ Positive'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Medical Notes</Text>
          <Text style={Typography.bodyBold}>{profile?.medicalNotes || 'None specified'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Emergency Contact</Text>
          <Text style={Typography.bodyBold}>{profile?.emergencyContact || '+94 77 123 4567'}</Text>
        </View>
      </Card>

      {/* Mesh Radio Stats Card */}
      <Card variant="accentGreen">
        <Text style={[Typography.bodyBold, { color: Colors.primary }]}>
          Mesh Radio Telemetry
        </Text>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Packets Relayed</Text>
          <Text style={Typography.bodyBold}>184 Packets</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>SOS Beacons Forwarded</Text>
          <Text style={Typography.bodyBold}>3 Beacons</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={Typography.body}>Encryption Key Fingerprint</Text>
          <Text style={[Typography.caption, { fontWeight: '700' }]}>
            {user ? `UID:${user.id.slice(0, 16)}...` : 'SHA256: 4A:9F:88:E2:...'}
          </Text>
        </View>
      </Card>

      <View style={styles.btnGroup}>
        <Button title="EDIT EMERGENCY PROFILE" variant="primary" onPress={() => {}} />
        <Button title="MANAGE PRIVACY & SECURITY" variant="outline" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: 14 },
  avatarCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.accentGreenBorder },
  avatarInitials: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  btnGroup: { marginTop: 14, gap: 8 },
});
