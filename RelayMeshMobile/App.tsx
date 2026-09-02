import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, BottomNav, TabName } from './src/shared';
import { AuthProvider, useAuth } from './src/context';

// Member 1: SOS Screens
import {
  Screen01_SOSMain,
  Screen07_SOSAlert,
  Screen08_SOSTracking,
  Screen09_SOSHistory,
} from './src/modules/sos';

// Member 2: Map Screens
import {
  Screen05_OfflineMap,
  Screen06_NodeLocator,
  Screen15_RouteNavigation,
} from './src/modules/map';

// Member 3: Messaging Screens
import {
  Screen10_ChatList,
  Screen11_DirectChat,
  Screen12_BroadcastMessage,
} from './src/modules/messaging';

// Member 4: Mesh Screens
import {
  Screen16_MeshTopology,
  Screen17_NodeDiscovery,
  Screen18_NetworkDiagnostics,
  Screen19_RelaySettings,
} from './src/modules/mesh';

// Member 5: Resources, Home, Auth & Settings
import {
  Screen00_Splash,
  Screen01_Onboarding,
  Screen02_ResourceDirectory,
  Screen03_ResourceDetails,
  Screen04_HomeDashboard,
  Screen13_EmergencyResourcesDirectory,
  Screen14_ResourceDetails,
  Screen20_AppSettings,
  Screen23_UserProfile,
  Screen24_Login,
  Screen25_Register,
  resourceService,
} from './src/modules/resources';

type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'home'
  | 'map'
  | 'mapFilter'
  | 'routeNav'
  | 'sos'
  | 'sosAlert'
  | 'sosTracking'
  | 'sosHistory'
  | 'messages'
  | 'directChat'
  | 'broadcast'
  | 'mesh'
  | 'nearby'
  | 'storeForward'
  | 'relayConfig'
  | 'resources'
  | 'resourceDetail'
  | 'settings'
  | 'profile';

function MainNavigator() {
  const { user, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedChat, setSelectedChat] = useState('Rescue Team Alpha');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-shelter-1');

  // Tab switcher
  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setActiveScreen('home');
        break;
      case 'map':
        setActiveScreen('map');
        break;
      case 'messages':
        setActiveScreen('messages');
        break;
      case 'resources':
        setActiveScreen('resources');
        break;
    }
  };

  const handleSOSPress = () => {
    setActiveScreen('sos');
  };

  // Render current active screen
  const renderScreen = () => {
    switch (activeScreen) {
      // Member 5: Auth & Home
      case 'splash':
        return <Screen00_Splash onFinish={() => setActiveScreen(user ? 'home' : 'onboarding')} />;
      case 'onboarding':
        return <Screen01_Onboarding onComplete={() => setActiveScreen(user ? 'home' : 'login')} />;
      case 'login':
        return (
          <Screen24_Login
            onLoginSuccess={() => {
              setActiveTab('home');
              setActiveScreen('home');
            }}
            onNavigateRegister={() => setActiveScreen('register')}
          />
        );
      case 'register':
        return (
          <Screen25_Register
            onRegisterSuccess={() => {
              setActiveTab('home');
              setActiveScreen('home');
            }}
            onNavigateLogin={() => setActiveScreen('login')}
          />
        );
      case 'home':
        return (
          <Screen04_HomeDashboard
            onNavigate={(dest) => {
              if (dest === 'map') { setActiveTab('map'); setActiveScreen('map'); }
              else if (dest === 'messages') { setActiveTab('messages'); setActiveScreen('messages'); }
              else if (dest === 'resources') { setActiveTab('resources'); setActiveScreen('resources'); }
              else if (dest === 'mesh') setActiveScreen('mesh');
              else if (dest === 'settings') setActiveScreen('settings');
              else if (dest === 'profile') setActiveScreen('profile');
            }}
            onSOSPress={handleSOSPress}
          />
        );

      // Member 1: SOS
      case 'sos':
        return (
          <Screen01_SOSMain
            onSOSSent={() => setActiveScreen('sosAlert')}
            onCancel={() => setActiveScreen('home')}
          />
        );
      case 'sosAlert':
        return (
          <Screen07_SOSAlert
            onViewMap={() => { setActiveTab('map'); setActiveScreen('map'); }}
            onCancelSOS={() => setActiveScreen('home')}
          />
        );
      case 'sosTracking':
        return <Screen08_SOSTracking />;
      case 'sosHistory':
        return <Screen09_SOSHistory />;

      // Member 2: Map & Hazard Reporting
      case 'map':
        return (
          <Screen05_OfflineMap
            onSelectResource={(resName) => {
              const found = resourceService.getResourceByName(resName);
              if (found) {
                setSelectedResourceId(found.id);
                resourceService.setSelectedResource(found.id);
              }
              setActiveScreen('resourceDetail');
            }}
            onFilterPress={() => setActiveScreen('mapFilter')}
            onNavigateHazard={(hzId) => setActiveScreen('routeNav')}
          />
        );
      case 'mapFilter':
        return (
          <Screen06_NodeLocator
            onApply={() => setActiveScreen('map')}
            onReset={() => setActiveScreen('map')}
          />
        );
      case 'routeNav':
        return (
          <Screen15_RouteNavigation
            onBack={() => setActiveScreen('map')}
            onNavigateMap={() => setActiveScreen('map')}
          />
        );

      // Member 3: Messaging
      case 'messages':
        return (
          <Screen10_ChatList
            onSelectChat={(name: string) => {
              setSelectedChat(name);
              setActiveScreen('directChat');
            }}
            onNewMessage={() => setActiveScreen('broadcast')}
          />
        );
      case 'directChat':
        return (
          <Screen11_DirectChat
            conversationId="global-mesh-chat"
            chatName={selectedChat}
            onBackPress={() => setActiveScreen('messages')}
          />
        );
      case 'broadcast':
        return <Screen12_BroadcastMessage />;

      // Member 4: Mesh
      case 'mesh':
        return <Screen16_MeshTopology />;
      case 'nearby':
        return <Screen17_NodeDiscovery />;
      case 'storeForward':
        return <Screen18_NetworkDiagnostics />;
      case 'relayConfig':
        return <Screen19_RelaySettings />;

      // Member 5: Resources & Profile
      case 'resources':
        return (
          <Screen13_EmergencyResourcesDirectory
            onSelectResource={(id) => {
              setSelectedResourceId(id);
              resourceService.setSelectedResource(id);
              setActiveScreen('resourceDetail');
            }}
            onViewMap={() => {
              setActiveTab('map');
              setActiveScreen('map');
            }}
          />
        );
      case 'resourceDetail':
        return (
          <Screen14_ResourceDetails
            resourceId={selectedResourceId}
            onBackPress={() => setActiveScreen('resources')}
            onViewMap={(res) => {
              setActiveTab('map');
              setActiveScreen('map');
            }}
            onContact={(coordinator) => {
              setSelectedChat(coordinator);
              setActiveScreen('directChat');
            }}
            onBroadcast={(res) => {
              setActiveScreen('broadcast');
            }}
          />
        );
      case 'settings':
        return (
          <Screen20_AppSettings
            onNavigateProfile={() => setActiveScreen('profile')}
            onLogout={() => {
              setActiveScreen('login');
            }}
          />
        );
      case 'profile':
        return (
          <Screen23_UserProfile
            onBackPress={() => setActiveScreen('settings')}
          />
        );

      default:
        return (
          <Screen04_HomeDashboard
            onNavigate={() => { }}
            onSOSPress={handleSOSPress}
          />
        );
    }
  };

  // Hide BottomNav on full-screen flows (Splash, Onboarding, Login, Register, Direct Chat)
  const isFullScreen =
    activeScreen === 'splash' ||
    activeScreen === 'onboarding' ||
    activeScreen === 'login' ||
    activeScreen === 'register' ||
    activeScreen === 'directChat';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Figma Screen Showcase Switcher Bar */}
      <View style={styles.showcaseBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.showcaseScroll}>
          <Text style={styles.showcaseLabel}>FIGMA SCREENS:</Text>
          <ScreenPill title="Splash" active={activeScreen === 'splash'} onPress={() => setActiveScreen('splash')} />
          <ScreenPill title="Onboard" active={activeScreen === 'onboarding'} onPress={() => setActiveScreen('onboarding')} />
          <ScreenPill title="Login" active={activeScreen === 'login'} onPress={() => setActiveScreen('login')} />
          <ScreenPill title="Register" active={activeScreen === 'register'} onPress={() => setActiveScreen('register')} />
          <ScreenPill title="Home" active={activeScreen === 'home'} onPress={() => { setActiveTab('home'); setActiveScreen('home'); }} />
          <ScreenPill title="Map (05)" active={activeScreen === 'map'} onPress={() => { setActiveTab('map'); setActiveScreen('map'); }} />
          <ScreenPill title="Filters (06)" active={activeScreen === 'mapFilter'} onPress={() => setActiveScreen('mapFilter')} />
          <ScreenPill title="Hazard (15)" active={activeScreen === 'routeNav'} onPress={() => setActiveScreen('routeNav')} />
          <ScreenPill title="SOS" active={activeScreen === 'sos'} onPress={() => setActiveScreen('sos')} />
          <ScreenPill title="SOS Sent" active={activeScreen === 'sosAlert'} onPress={() => setActiveScreen('sosAlert')} />
          <ScreenPill title="Chat 1 (List)" active={activeScreen === 'messages'} onPress={() => { setActiveTab('messages'); setActiveScreen('messages'); }} />
          <ScreenPill title="Chat 2 (Detail)" active={activeScreen === 'directChat'} onPress={() => setActiveScreen('directChat')} />
          <ScreenPill title="Resources (13)" active={activeScreen === 'resources'} onPress={() => { setActiveTab('resources'); setActiveScreen('resources'); }} />
          <ScreenPill title="Res Details (14)" active={activeScreen === 'resourceDetail'} onPress={() => setActiveScreen('resourceDetail')} />

          {/* Member 4: Added buttons for Screens 16, 17, 18, 19 */}
          <ScreenPill title="Mesh Graph (16)" active={activeScreen === 'mesh'} onPress={() => setActiveScreen('mesh')} />
          <ScreenPill title="Nearby Nodes (17)" active={activeScreen === 'nearby'} onPress={() => setActiveScreen('nearby')} />
          <ScreenPill title="Store & Forward (18)" active={activeScreen === 'storeForward'} onPress={() => setActiveScreen('storeForward')} />
          <ScreenPill title="Relay Config (19)" active={activeScreen === 'relayConfig'} onPress={() => setActiveScreen('relayConfig')} />

          <ScreenPill title="Settings" active={activeScreen === 'settings'} onPress={() => setActiveScreen('settings')} />
          <ScreenPill title="Profile" active={activeScreen === 'profile'} onPress={() => setActiveScreen('profile')} />
        </ScrollView>
      </View>

      {/* Active Screen View */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Persistent Bottom Navigation with Center Floating SOS Button */}
      {!isFullScreen && (
        <BottomNav
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onSOSPress={handleSOSPress}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}

const ScreenPill: React.FC<{ title: string; active: boolean; onPress: () => void }> = ({
  title,
  active,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.pill, active && styles.pillActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  showcaseBar: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  showcaseScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  showcaseLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    marginRight: 4,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
  },
  pillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
});