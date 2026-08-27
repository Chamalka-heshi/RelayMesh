import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

export const Screen04_AddResource: React.FC = () => (
  <View style={styles.container}>
    <Header title="Add Resource Point" subtitle="Register shelter/food/water location" badge="Member 5" />
    <Card>
      <Text style={[Typography.body, { color: Colors.textSecondary }]}>
        Add Resource Point screen component for Member 5.
      </Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
});
