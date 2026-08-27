import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen19_RelaySettings: React.FC = () => {
  const [relayEnabled, setRelayEnabled] = useState(true);
  const [bgRelay, setBgRelay] = useState(true);
  const [powerSaver, setPowerSaver] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Relay Radio Configuration"
        subtitle="Configure mesh routing & power options"
      />

      <Card>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={Typography.bodyBold}>Mesh Relay Forwarding</Text>
            <Text style={Typography.caption}>Allow this device to forward emergency packets for others.</Text>
          </View>
          <Switch value={relayEnabled} onValueChange={setRelayEnabled} trackColor={{ true: Colors.primary }} />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={Typography.bodyBold}>Background Relay Mode</Text>
            <Text style={Typography.caption}>Keep forwarding active when app is minimized.</Text>
          </View>
          <Switch value={bgRelay} onValueChange={setBgRelay} trackColor={{ true: Colors.primary }} />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={Typography.bodyBold}>Emergency Power Optimizer</Text>
            <Text style={Typography.caption}>Throttle discovery scan rate when battery falls below 20%.</Text>
          </View>
          <Switch value={powerSaver} onValueChange={setPowerSaver} trackColor={{ true: Colors.primary }} />
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
