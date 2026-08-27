import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, StatusBadge, Colors, Typography } from '../../../shared';

export const Screen09_SOSHistory: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="SOS History & Logs"
        subtitle="Archived emergency events on this device"
      />

      <Card>
        <View style={styles.cardHeader}>
          <Text style={Typography.bodyBold}>Medical Assist Beacon</Text>
          <StatusBadge status="resolved" label="Resolved" />
        </View>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Date: Today, 14:15 • Responders: Volunteer Unit Alpha • 2 Nodes Relayed
        </Text>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={Typography.bodyBold}>Flash Flood Alert #882</Text>
          <StatusBadge status="resolved" label="Resolved" />
        </View>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Date: Yesterday, 19:30 • Evacuation route navigated successfully
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
