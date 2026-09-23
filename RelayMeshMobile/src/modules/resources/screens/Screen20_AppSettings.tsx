import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context';

interface Props {
  onNavigateProfile?: () => void;
  onLogout?: () => void;
}

export const Screen20_AppSettings: React.FC<Props> = ({
  onNavigateProfile,
  onLogout,
}) => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
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
    { 
      id: 'profile', 
      icon: 'user', 
      iconColor: '#007AFF', 
      title: 'Profile & Emergency Data', 
      action: onNavigateProfile 
    },
    { 
      id: 'network', 
      icon: 'radio', 
      iconColor: '#34C759', 
      title: 'Mesh Network Settings', 
      action: undefined 
    },
    { 
      id: 'notifications', 
      icon: 'bell', 
      iconColor: '#FF3B30', 
      title: 'Sounds & Haptics', 
      action: undefined 
    },
  ];

  return (
    <View style={styles.container}>
      {/* iOS Style Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        {/* Main Settings Group */}
        <View style={styles.listGroup}>
          {settingsList.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconColor }]}>
                    <Feather name={item.icon as any} size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.listLabel}>{item.title}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#C6C6C8" />
              </TouchableOpacity>
              {index < settingsList.length - 1 && <View style={styles.listSeparator} />}
            </React.Fragment>
          ))}
        </View>

        {/* About Group */}
        <View style={styles.listGroup}>
          <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#8E8E93' }]}>
                <Feather name="info" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.listLabel}>About RelayMesh</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.listValue}>v1.0.0</Text>
              <Feather name="chevron-right" size={20} color="#C6C6C8" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Log Out Group */}
        <View style={styles.listGroup}>
          <TouchableOpacity
            style={styles.listItemCenter}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS Grouped background
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 60,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  listGroup: {
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  listItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listLabel: {
    fontSize: 17,
    color: '#000000',
  },
  listValue: {
    fontSize: 17,
    color: '#8E8E93',
  },
  listSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 56, // Align separator with text, not icon
  },
  logoutText: {
    color: '#FF3B30', // iOS Red
    fontSize: 17,
    fontWeight: '400',
  },
});
