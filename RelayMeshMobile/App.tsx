import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
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
  Screen20_AppSettings,
  Screen23_UserProfile,
  Screen24_Login,
  Screen25_Register,
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
  const [selectedChat, setSelectedChat] = useState('Rescue Team Alpha');

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

      // Member 2: Map
      case 'map':
        return (
          <Screen05_OfflineMap
            onSelectResource={() => setActiveScreen('resourceDetail')}
            onFilterPress={() => setActiveScreen('mapFilter')}
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
        return <Screen15_RouteNavigation />;

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
          <Screen02_ResourceDirectory
            onSelectResource={() => setActiveScreen('resourceDetail')}
          />
        );
      case 'resourceDetail':
        return (
          <Screen03_ResourceDetails
            onBackPress={() => setActiveScreen('resources')}
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
            onNavigate={() => {}}
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

  if (isFullScreen) {
    return (
      <View style={styles.container}>
        {activeScreen === 'splash' && <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />}
        <View style={styles.screenContainer}>{renderScreen()}</View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Active Screen View */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Persistent Bottom Navigation with Center Floating SOS Button */}
      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onSOSPress={handleSOSPress}
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
