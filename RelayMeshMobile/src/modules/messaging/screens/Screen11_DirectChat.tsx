import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen11_DirectChat: React.FC = () => (
  <View style={styles.container}>
    <Header title="Direct Message" subtitle="Encrypted P2P relay channel" badge="Member 3" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textPrimary }]}>Connected to Node: #Beta-04</Text>
      <Text style={[Typography.caption, { color: Colors.success, marginTop: 4 }]}>● End-to-End Mesh Route Established</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
