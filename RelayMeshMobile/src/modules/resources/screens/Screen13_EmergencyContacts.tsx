import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen13_EmergencyContacts: React.FC = () => (
  <View style={styles.container}>
    <Header title="Emergency Directory" subtitle="Offline emergency numbers & VHF channels" badge="Member 5" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>
        Emergency Directory screen component for Member 5.
      </Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
