import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, BottomNav, TabName } from './src/shared';
import { seedInitialData } from './src/database';
import Conversation from './src/database/Conversation';
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
  const [activeScreen, setActiveScreen] = useState<ScreenId>('splash');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  
  // Combined state variables from both branches
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-shelter-1');
  const [showScreenPicker, setShowScreenPicker] = useState(false);

  useEffect(() => {
    seedInitialData();
  }, []);

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
      case 'profile':
        setActiveScreen('profile');
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
              else if (dest === 'resources') { setActiveScreen('resources'); }
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
            onSelectChat={(conversation: Conversation) => {
              setSelectedChat(conversation);
              setActiveScreen('directChat');
            }}
            onNewMessage={() => setActiveScreen('broadcast')}
          />
        );
      case 'directChat':
        if (!selectedChat) return <Screen10_ChatList onSelectChat={() => {}} />;

        return (
          <Screen11_DirectChat
            conversation={selectedChat}
            onBack={() => setActiveScreen('messages')}
          />
        );
      case 'broadcast':
        return <Screen12_BroadcastMessage />;

      // Member 4: Mesh
      case 'mesh':
        return (
          <Screen16_MeshTopology
            onNavigate={(screenId) => setActiveScreen(screenId as ScreenId)}
          />
        );
      case 'nearby':
        return (
          <Screen17_NodeDiscovery
            onNavigate={(screenId) => setActiveScreen(screenId as ScreenId)}
          />
        );
      case 'storeForward':
        return (
          <Screen18_NetworkDiagnostics
            onNavigate={(screenId) => setActiveScreen(screenId as ScreenId)}
          />
        );
      case 'relayConfig':
        return (
          <Screen19_RelaySettings
            onNavigate={(screenId) => setActiveScreen(screenId as ScreenId)}
          />
        );

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
              // Cast to 'any' because another team member passes a string here, 
              // but your chat system correctly expects a Conversation object.
              setSelectedChat(coordinator as any);
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

  // Hide BottomNav on full-screen flows
  const isFullScreen =
    activeScreen === 'splash' ||
    activeScreen === 'onboarding' ||
    activeScreen === 'login' ||
    activeScreen === 'register' ||
    activeScreen === 'directChat';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Active Screen View */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Persistent Bottom Navigation */}
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
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // 1. Force the app to never exceed the window width
    width: '100%',
    maxWidth: '100%',
    // 2. Hide anything that tries to bleed off the edges globally
    overflow: 'hidden',
  },
  screenContainer: {
    flex: 1,
    // 3. Ensure the screen wrapper strictly respects the parent's boundaries
    width: '100%',
  },
});