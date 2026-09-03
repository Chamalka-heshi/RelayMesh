import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'; // Using sleek vector icons instead of emojis
import { Colors } from '../';

// Note: If TabName is exported from a shared types file, update it there too!
export type TabName = 'home' | 'map' | 'messages' | 'profile'; 

interface Props {
  activeTab: TabName | string;
  onTabPress: (tab: TabName) => void;
  onSOSPress: () => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onTabPress, onSOSPress }) => {
  const insets = useSafeAreaInsets();
  
  // Helper function to render each tab cleanly
  const renderTab = (id: TabName, label: string, iconName: keyof typeof Feather.glyphMap) => {
    const isActive = activeTab === id;
    
    return (
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onTabPress(id)} 
        activeOpacity={0.7}
      >
        <Feather
          name={iconName}
          size={24}
          color={isActive ? '#137333' : '#94A3B8'} // Forest green when active, slate gray when inactive
        />
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabContainer}>
        {renderTab('home', 'Home', 'home')}
        {renderTab('map', 'Map', 'map')}

        {/* Elevated Center SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity 
            style={styles.sosButton} 
            onPress={onSOSPress} 
            activeOpacity={0.8}
          >
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {renderTab('messages', 'Chat', 'message-square')}
        {renderTab('profile', 'Profile', 'user')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    // Soft shadow for a floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#137333', // Your theme's primary green
    fontWeight: '700',
  },
  sosContainer: {
    width: 70,
    alignItems: 'center',
    marginTop: -32, // Pulls the SOS button up out of the bar
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444', // Danger Red
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF', // Creates the "cutout" look against the background
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
});