import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

export type TabName = 'home' | 'map' | 'sos' | 'messages' | 'resources';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onSOSPress: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabPress,
  onSOSPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('home')}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, activeTab === 'home' && styles.activeIcon]}>🏠</Text>
        <Text style={[styles.label, activeTab === 'home' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      {/* Map Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('map')}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, activeTab === 'map' && styles.activeIcon]}>🗺️</Text>
        <Text style={[styles.label, activeTab === 'map' && styles.activeLabel]}>Map</Text>
      </TouchableOpacity>

      {/* Floating Center SOS Button */}
      <View style={styles.sosWrapper}>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={onSOSPress}
          activeOpacity={0.85}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Messages Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('messages')}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, activeTab === 'messages' && styles.activeIcon]}>💬</Text>
        <Text style={[styles.label, activeTab === 'messages' && styles.activeLabel]}>Chat</Text>
      </TouchableOpacity>

      {/* Resources Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress('resources')}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, activeTab === 'resources' && styles.activeIcon]}>📦</Text>
        <Text style={[styles.label, activeTab === 'resources' && styles.activeLabel]}>Relief</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sosWrapper: {
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  sosButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.sosRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sosRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
