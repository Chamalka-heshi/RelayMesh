import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';
import { useAuth } from '../../../context';

interface Props {
  onBackPress?: () => void;
}

export const Screen23_UserProfile: React.FC<Props> = ({ onBackPress }) => {
  const { user, profile, updateProfile } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editEmergencyContact, setEditEmergencyContact] = useState('');
  const [editMedicalNotes, setEditMedicalNotes] = useState('');

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

  const openEditModal = () => {
    setEditName(profile?.fullName || '');
    setEditPhone(profile?.phone || '');
    setEditBloodGroup(profile?.bloodGroup || 'O+ Positive');
    setEditEmergencyContact(profile?.emergencyContact || '+94 77 123 4567');
    setEditMedicalNotes(profile?.medicalNotes || 'None specified');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      Alert.alert(
        'Offline',
        'You must have an active internet connection to save profile changes to the central command server.'
      );
      return;
    }

    const result = await updateProfile({
      fullName: editName.trim(),
      phone: editPhone.trim(),
      bloodGroup: editBloodGroup.trim(),
      emergencyContact: editEmergencyContact.trim(),
      medicalNotes: editMedicalNotes.trim(),
    });

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

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
            label={user ? 'Mock Auth Verified' : 'Local Standalone Node'}
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
          <Text style={Typography.body}>Node Encryption Key</Text>
          <Text style={[Typography.caption, { fontWeight: '700' }]}>
            {displayNodeId}-ED25519-KEY
          </Text>
        </View>
      </Card>

      <View style={styles.btnGroup}>
        <Button 
          title="EDIT EMERGENCY PROFILE" 
          variant="primary" 
          onPress={openEditModal} 
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[Typography.h2, { marginBottom: 16 }]}>Edit Emergency Profile</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.textInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Full Name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.textInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BLOOD GROUP</Text>
                <TextInput
                  style={styles.textInput}
                  value={editBloodGroup}
                  onChangeText={setEditBloodGroup}
                  placeholder="e.g. O+ Positive, A-, B+"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMERGENCY CONTACT</Text>
                <TextInput
                  style={styles.textInput}
                  value={editEmergencyContact}
                  onChangeText={setEditEmergencyContact}
                  placeholder="Contact Name & Number"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>MEDICAL NOTES</Text>
                <TextInput
                  style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                  value={editMedicalNotes}
                  onChangeText={setEditMedicalNotes}
                  placeholder="Allergies, chronic conditions..."
                  multiline
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
