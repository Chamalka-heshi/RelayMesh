import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { useNetworkSync } from '../useNetworkSync';
import { MeshNavigationFooter } from '../components/MeshNavigationFooter';

const SETTINGS_KEY = '@relay_mesh_settings';

export const Screen19_RelaySettings = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const [relayEnabled, setRelayEnabled] = useState(true);
  const [bgRelay, setBgRelay] = useState(true);
  const [powerSaver, setPowerSaver] = useState(false);

  const { isConnected, isSyncing, triggerAutoSync } = useNetworkSync();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const { relayEnabled, bgRelay, powerSaver } = JSON.parse(saved);
          setRelayEnabled(relayEnabled);
          setBgRelay(bgRelay);
          setPowerSaver(powerSaver);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newRelay: boolean, newBg: boolean, newPower: boolean) => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ relayEnabled: newRelay, bgRelay: newBg, powerSaver: newPower })
      );
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleToggleRelay = (val: boolean) => {
    setRelayEnabled(val);
    saveSettings(val, bgRelay, powerSaver);
  };

  const handleToggleBg = (val: boolean) => {
    setBgRelay(val);
    saveSettings(relayEnabled, val, powerSaver);
  };

  const handleTogglePower = (val: boolean) => {
    setPowerSaver(val);
    saveSettings(relayEnabled, bgRelay, val);
    if (val) {
      Alert.alert('Battery Saver Activated', 'Bluetooth scanning speed slowed down to save battery below 20%.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="App Settings"
        subtitle="Manage connections and power saving options"
      />

      <Card style={{ backgroundColor: isConnected ? '#E6F4EA' : '#FFF3CD', marginBottom: 16 }}>
        <Text style={Typography.bodyBold}>
          {isConnected ? '🟢 Internet Status: Online' : '🟡 Internet Status: Offline'}
        </Text>
        <Text style={[Typography.caption, { marginVertical: 4 }]}>
          {isConnected
            ? 'Internet is connected. Messages will send to the internet server.'
            : 'No internet connection. Messages are being saved locally on your phone.'}
        </Text>
        {isSyncing && <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 6 }} />}
        <Button
          title={isSyncing ? "UPLOADING..." : "UPLOAD SAVED MESSAGES NOW"}
          variant="primary"
          onPress={triggerAutoSync}
          disabled={isSyncing || !isConnected}
        />
      </Card>

      <Card>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={Typography.bodyBold}>Share My Phone's Connection</Text>
            <Text style={Typography.caption}>
              {relayEnabled ? 'On: Helps pass emergency messages for people nearby.' : 'Off: Your phone will not pass messages for others.'}
            </Text>
          </View>
          <Switch
            value={relayEnabled}
            onValueChange={handleToggleRelay}
            trackColor={{ true: Colors.primary }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={Typography.bodyBold}>Keep Working in Background</Text>
            <Text style={Typography.caption}>Keep helping nearby phones even when app is closed.</Text>
          </View>
          <Switch
            value={bgRelay}
            onValueChange={handleToggleBg}
            trackColor={{ true: Colors.primary }}
            disabled={!relayEnabled}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={Typography.bodyBold}>Battery Saver Mode</Text>
            <Text style={Typography.caption}>Saves battery power when your battery level drops below 20%.</Text>
          </View>
          <Switch
            value={powerSaver}
            onValueChange={handleTogglePower}
            trackColor={{ true: Colors.primary }}
          />
        </View>
      </Card>

      <MeshNavigationFooter currentScreen="Screen19" onNavigate={onNavigate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
});