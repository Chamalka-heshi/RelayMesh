import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context';

interface Props {
  onBackPress?: () => void;
}

export const Screen23_UserProfile: React.FC<Props> = ({ onBackPress }) => {
  const { user, profile, updateProfile } = useAuth();

  const [editName, setEditName] = useState(profile?.fullName || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [editBloodGroup, setEditBloodGroup] = useState(profile?.bloodGroup || '');
  const [editEmergencyContact, setEditEmergencyContact] = useState(profile?.emergencyContact || '');
  const [editMedicalNotes, setEditMedicalNotes] = useState(profile?.medicalNotes || '');

  // Update local state if profile context changes
  useEffect(() => {
    setEditName(profile?.fullName || '');
    setEditPhone(profile?.phone || '');
    setEditBloodGroup(profile?.bloodGroup || '');
    setEditEmergencyContact(profile?.emergencyContact || '');
    setEditMedicalNotes(profile?.medicalNotes || '');
  }, [profile]);

  const getInitials = (name: string) => {
    if (!name) return 'RM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'RelayMesh Responder';
  const displayEmail = user?.email || profile?.email || 'offline-node@relaymesh.local';
  const displayNodeId = profile?.nodeId || (user ? `#RM-${user.id.slice(0, 4).toUpperCase()}` : '#RM-4587');

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      Alert.alert(
        'Offline',
        'You must have an active internet connection to save profile changes.'
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
      Alert.alert('Success', 'Profile saved successfully!');
    }
  };

  const InputBox = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true }: any) => (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.inputText, !editable && { color: '#9CA3AF' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(editName || displayName)}</Text>
            </View>
            <TouchableOpacity style={styles.cameraBadge}>
              <Feather name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{editName || displayName}</Text>
          <Text style={styles.profileHandle}>@{displayNodeId.toLowerCase().replace('#', '')}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <InputBox 
            label="Full name" 
            value={editName} 
            onChangeText={setEditName} 
            placeholder="John Doe" 
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputBox 
                label="Blood Group" 
                value={editBloodGroup} 
                onChangeText={setEditBloodGroup} 
                placeholder="O+" 
              />
            </View>
            <View style={styles.halfWidth}>
              <InputBox 
                label="Phone" 
                value={editPhone} 
                onChangeText={setEditPhone} 
                placeholder="+1 234 567" 
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <InputBox 
            label="Emergency Contact" 
            value={editEmergencyContact} 
            onChangeText={setEditEmergencyContact} 
            placeholder="Contact Number" 
            keyboardType="phone-pad"
          />

          <InputBox 
            label="Medical Notes" 
            value={editMedicalNotes} 
            onChangeText={setEditMedicalNotes} 
            placeholder="Allergies, conditions..." 
          />

          <InputBox 
            label="Email" 
            value={displayEmail} 
            onChangeText={() => {}} 
            placeholder="Email Address" 
            editable={false}
          />

          <InputBox 
            label="Node ID" 
            value={displayNodeId} 
            onChangeText={() => {}} 
            placeholder="Node ID" 
            editable={false}
          />
        </View>

      </ScrollView>

      {/* Fixed Bottom Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Soft off-white to match screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6', // Light gray back button box
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom button
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    borderWidth: 3,
    borderColor: '#111827', // Black border
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4B5563',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FAFAFA',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    padding: 0,
    margin: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
