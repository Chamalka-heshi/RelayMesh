import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../../../shared';

interface Props {
  navigation?: any;
  onNavigate?: (screen: string) => void;
  currentScreen: 'Screen16' | 'Screen17' | 'Screen18' | 'Screen19';
}

export const MeshNavigationFooter: React.FC<Props> = ({
  navigation,
  onNavigate,
  currentScreen,
}) => {
  const tabs = [
    { id: 'Screen16', label: 'Map', route: 'Screen16_MeshTopology' },
    { id: 'Screen17', label: 'Search ', route: 'Screen17_NodeDiscovery' },
    { id: 'Screen18', label: ' Messages', route: 'Screen18_NetworkDiagnostics' },
    { id: 'Screen19', label: 'Settings', route: 'Screen19_RelaySettings' },
  ];

  const handlePress = (tab: typeof tabs[0]) => {
    if (currentScreen === tab.id) return;

    if (onNavigate) {
      // Map screen tab IDs to App.tsx activeScreen state strings
      const screenMap: Record<string, string> = {
        Screen16: 'mesh',
        Screen17: 'nearby',
        Screen18: 'storeForward',
        Screen19: 'relayConfig',
      };

      onNavigate(screenMap[tab.id] || tab.id);
    } else if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(tab.route);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => handlePress(tab)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    marginTop: 16,
    borderRadius: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.surfaceSecondary,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});