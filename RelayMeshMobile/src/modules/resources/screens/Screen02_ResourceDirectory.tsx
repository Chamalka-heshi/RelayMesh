import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';

interface Props {
  onSelectResource?: (resource: any) => void;
}

export const Screen02_ResourceDirectory: React.FC<Props> = ({
  onSelectResource,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Shelters', 'Medical', 'Water', 'Food'];

  const resources = [
    {
      id: '1',
      title: 'Community Shelter Point 1',
      category: 'Shelters',
      distance: '1.2 km away',
      capacity: '150 people capacity',
      status: 'OPEN',
      icon: '⛺',
      color: Colors.primary,
    },
    {
      id: '2',
      title: 'St. Mary Emergency Triage Base',
      category: 'Medical',
      distance: '2.4 km away',
      capacity: 'Doctor on Duty • Oxygen & Bandages',
      status: 'OPEN',
      icon: '🏥',
      color: Colors.sosRed,
    },
    {
      id: '3',
      title: 'Drinking Water Station #04',
      category: 'Water',
      distance: '800 m away',
      capacity: '500L clean filtered water',
      status: 'VERIFIED',
      icon: '💧',
      color: Colors.waterBlue,
    },
    {
      id: '4',
      title: 'Red Cross Food Ration Camp',
      category: 'Food',
      distance: '1.8 km away',
      capacity: 'Dry food packs & baby formula',
      status: 'OPEN',
      icon: '🍞',
      color: Colors.foodOrange,
    },
  ];

  const filtered =
    activeCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  return (
    <View style={styles.container}>
      <Header
        title="Emergency Relief Resources"
        subtitle="Verified offline shelter, water & medical directory"
      />

      {/* Category Filter Chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectResource && onSelectResource(item)}
            activeOpacity={0.7}
          >
            <Card style={styles.resCard}>
              <View style={styles.resRow}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.resIcon}>{item.icon}</Text>
                </View>
                <View style={styles.resInfo}>
                  <View style={styles.resHeader}>
                    <Text style={Typography.bodyBold}>{item.title}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={Typography.caption}>📍 {item.distance}</Text>
                  <Text style={[Typography.caption, { color: Colors.textPrimary, marginTop: 2 }]}>
                    {item.capacity}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  chipsWrapper: { backgroundColor: Colors.surface, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chipsScroll: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.surfaceSecondary },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 40 },
  resCard: { marginVertical: 6, padding: 12 },
  resRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resIcon: { fontSize: 22 },
  resInfo: { flex: 1 },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { backgroundColor: Colors.accentGreen, borderColor: Colors.accentGreenBorder, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
});
