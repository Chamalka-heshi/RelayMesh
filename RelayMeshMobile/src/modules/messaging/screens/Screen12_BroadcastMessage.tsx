import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen12_BroadcastMessage: React.FC = () => (
  <View style={styles.container}>
    <Header title="Network Broadcast" subtitle="Flooding message to all nodes" badge="Member 3" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>Enter broadcast message to flood across mesh network (TTL: 5 hops)</Text>
    </Card>
    <Button title="SEND BROADCAST MESSAGE" variant="primary" onPress={() => {}} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
