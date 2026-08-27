import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, StatusBadge, Colors, Typography } from '../../../shared';

export const Screen15_RouteNavigation: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Hazard & Route Detail"
        subtitle="Offline terrain guidance & risk warning"
      />

      <Card variant="emergencyRed">
        <View style={styles.headerRow}>
          <Text style={[Typography.h3, { color: Colors.sosRed }]}>⚠️ Flooded Road Hazard</Text>
          <StatusBadge status="emergency" label="HIGH SEVERITY" />
        </View>
        <Text style={[Typography.caption, { marginTop: 6 }]}>
          Reported 12 mins ago • Distance: 500m ahead • Sector 2 Bridge
        </Text>
        <Text style={[Typography.body, { marginTop: 8, color: Colors.textPrimary }]}>
          "Water depth approximately 1.5m. Bridge impassable for light vehicles and pedestrians."
        </Text>
      </Card>

      <Card variant="accentGreen">
        <Text style={Typography.bodyBold}>🧭 Recommended Safe Bypass Route</Text>
        <Text style={[Typography.caption, { marginTop: 4 }]}>
          Calculated via verified dry-ground mesh telemetry.
        </Text>
        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>1.4 km</Text>
            <Text style={styles.statLbl}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>18 mins</Text>
            <Text style={styles.statLbl}>Est. Walk</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: Colors.primary }]}>SAFE</Text>
            <Text style={styles.statLbl}>Elevation</Text>
          </View>
        </View>
      </Card>

      <View style={styles.btnGroup}>
        <Button title="NAVIGATE AROUND HAZARD" variant="primary" onPress={() => {}} />
        <Button title="REPORT AS RESOLVED" variant="outline" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.accentGreenBorder },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  statLbl: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  btnGroup: { marginTop: 12, gap: 8 },
});
