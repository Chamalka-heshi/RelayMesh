import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

interface Props {
  onBackPress?: () => void;
}

export const Screen03_ResourceDetails: React.FC<Props> = ({ onBackPress }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Resource Details"
        subtitle="Full facility inventory & location details"
        onBackPress={onBackPress}
      />

      <Card style={styles.mainCard}>
        <View style={styles.titleRow}>
          <Text style={Typography.h2}>Community Shelter Point 1</Text>
          <View style={styles.openBadge}>
            <Text style={styles.openText}>OPEN 24/7</Text>
          </View>
        </View>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          📍 St. Peter Parish Hall • 1.2 km away
        </Text>
        <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
          Last verified via mesh relay: 4 mins ago
        </Text>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>Available Facilities & Supplies</Text>
        <View style={styles.facList}>
          <Text style={styles.facItem}>✓ Filtered Drinking Water (500L)</Text>
          <Text style={styles.facItem}>✓ First Aid & Trauma Dressing Kit</Text>
          <Text style={styles.facItem}>✓ Rest Area & Dry Bedding (150 person cap.)</Text>
          <Text style={styles.facItem}>✓ Solar Generator / Phone Charging Hub</Text>
          <Text style={styles.facItem}>✓ Ready-to-Eat Emergency Food Packs</Text>
        </View>
      </Card>

      <Card>
        <Text style={Typography.bodyBold}>On-Site Contact & Responders</Text>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Officer in Charge: Volunteer Silva (Node #RM-091){'\n'}
          Radio Channel: VHF Ch. 07 (Emergency Band)
        </Text>
      </Card>

      <View style={styles.btnGroup}>
        <Button title="GET OFFLINE WALKING DIRECTIONS" variant="primary" onPress={() => {}} />
        <Button title="SHARE RESOURCE LOCATION" variant="outline" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  mainCard: { marginVertical: 8 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  openBadge: { backgroundColor: Colors.accentGreen, borderColor: Colors.accentGreenBorder, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  openText: { color: Colors.primary, fontSize: 11, fontWeight: '700' },
  facList: { marginTop: 8, gap: 6 },
  facItem: { fontSize: 13, color: Colors.textPrimary },
  btnGroup: { marginTop: 12, gap: 8 },
});
