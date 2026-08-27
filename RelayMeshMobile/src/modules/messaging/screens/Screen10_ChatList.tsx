import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen10_ChatList: React.FC = () => (
  <View style={styles.container}>
    <Header title="Mesh Messages" subtitle="Peer-to-peer offline chat channels" badge="Member 3" />
    <Card>
      <Text style={[Typography.h3, { color: Colors.primaryLight }]}>📢 General Broadcast</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>Alpha: "Supplies arrived at North Base"</Text>
      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>Hop Count: 2 • 5 mins ago</Text>
    </Card>
    <Card>
      <Text style={[Typography.h3, { color: Colors.secondaryLight }]}>💬 Direct: Node Beta-04</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>"Signal verified. Standing by."</Text>
      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>Direct Link • 12 mins ago</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
