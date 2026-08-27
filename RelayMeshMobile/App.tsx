import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Colors, Typography } from './src/shared';

// Import Screen Components from Modules
import { Screen01_SOSMain } from './src/modules/sos';
import { Screen05_OfflineMap } from './src/modules/map';
import { Screen10_ChatList } from './src/modules/messaging';
import { Screen16_MeshTopology } from './src/modules/mesh';
import { Screen02_ResourceDirectory } from './src/modules/resources';

type ModuleType = 'sos' | 'map' | 'messaging' | 'mesh' | 'resources';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('sos');

  const renderActiveScreen = () => {
    switch (activeModule) {
      case 'sos':
        return <Screen01_SOSMain />;
      case 'map':
        return <Screen05_OfflineMap />;
      case 'messaging':
        return <Screen10_ChatList />;
      case 'mesh':
        return <Screen16_MeshTopology />;
      case 'resources':
        return <Screen02_ResourceDirectory />;
      default:
        return <Screen01_SOSMain />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
          📡 RelayMesh Mobile
        </Text>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineBadgeText}>P2P MESH READY</Text>
        </View>
      </View>

      {/* Module Selector Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TabButton
            label="🚨 SOS (M1)"
            active={activeModule === 'sos'}
            onPress={() => setActiveModule('sos')}
          />
          <TabButton
            label="🗺️ Map (M2)"
            active={activeModule === 'map'}
            onPress={() => setActiveModule('map')}
          />
          <TabButton
            label="💬 Chat (M3)"
            active={activeModule === 'messaging'}
            onPress={() => setActiveModule('messaging')}
          />
          <TabButton
            label="🕸️ Mesh (M4)"
            active={activeModule === 'mesh'}
            onPress={() => setActiveModule('mesh')}
          />
          <TabButton
            label="📦 Relief (M5)"
            active={activeModule === 'resources'}
            onPress={() => setActiveModule('resources')}
          />
        </ScrollView>
      </View>

      {/* Active Screen Area */}
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>
    </SafeAreaView>
  );
}

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  onlineBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: Colors.success,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  onlineBadgeText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  tabsContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  tabButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: Colors.textPrimary,
  },
  screenContainer: {
    flex: 1,
  },
});

