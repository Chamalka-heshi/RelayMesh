import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Card, Colors, Typography } from '../../../shared';

const SETTINGS_KEY = '@relay_mesh_settings';

export const Screen19_RelaySettings: React.FC = () => {
  const [relayEnabled, setRelayEnabled] = useState(true);
  const [bgRelay, setBgRelay] = useState(true);
  const [powerSaver, setPowerSaver] = useState(false);

  // Load saved settings on screen mount
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
        console.error('Failed to load relay settings:', e);
      }
    };
    loadSettings();
  }, []);

  // Save updated settings to local storage
  const saveSettings = async (newRelay: boolean, newBg: boolean, newPower: boolean) => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ relayEnabled: newRelay, bgRelay: newBg, powerSaver: newPower })
      );
    } catch (e) {
      console.error('Failed to save relay settings:', e);
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
      Alert.alert('Emergency Power Mode', 'BLE scan rate throttled to preserve battery life below 20%.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Relay Radio Configuration"
        subtitle="Configure mesh routing & power options"
      />

      <Card>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={Typography.bodyBold}>Mesh Relay Forwarding</Text>
            <Text style={Typography.caption}>
              {relayEnabled ? 'Active: Forwarding emergency packets for peers.' : 'Disabled: Device will not route peer traffic.'}
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
            <Text style={Typography.bodyBold}>Background Relay Mode</Text>
            <Text style={Typography.caption}>Keep forwarding active when app is minimized.</Text>
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
            <Text style={Typography.bodyBold}>Emergency Power Optimizer</Text>
            <Text style={Typography.caption}>Throttle discovery scan rate when battery falls below 20%.</Text>
          </View>
          <Switch
            value={powerSaver}
            onValueChange={handleTogglePower}
            trackColor={{ true: Colors.primary }}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
});