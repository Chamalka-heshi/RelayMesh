import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';
import { spatialService } from '../services/SpatialService';
import { LayerFilterState } from '../types';

interface Props {
  onApply?: () => void;
  onReset?: () => void;
}

export const Screen06_NodeLocator: React.FC<Props> = ({ onApply, onReset }) => {
  const [filters, setFilters] = useState<LayerFilterState>(() =>
    spatialService.getFilterState()
  );

  useEffect(() => {
    setFilters(spatialService.getFilterState());
  }, []);

  const toggleFilter = (key: keyof LayerFilterState) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const handleApply = () => {
    spatialService.setFilterState(filters);
    if (onApply) onApply();
  };

  const handleReset = () => {
    spatialService.resetFilterState();
    setFilters(spatialService.getFilterState());
    if (onReset) onReset();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Map Filters"
        subtitle="Customize layer visibility on offline map"
      />

      <Card style={styles.filterCard}>
        <FilterItem
          icon="🚨"
          label="Emergency SOS Alerts"
          checked={filters.sosAlerts}
          onToggle={() => toggleFilter('sosAlerts')}
        />
        <FilterItem
          icon="⛺"
          label="Emergency Shelters"
          checked={filters.shelters}
          onToggle={() => toggleFilter('shelters')}
        />
        <FilterItem
          icon="🏥"
          label="Medical Centers & Triage"
          checked={filters.medicalCenters}
          onToggle={() => toggleFilter('medicalCenters')}
        />
        <FilterItem
          icon="💧"
          label="Drinking Water Points"
          checked={filters.waterSources}
          onToggle={() => toggleFilter('waterSources')}
        />
        <FilterItem
          icon="🍞"
          label="Food Distribution Centers"
          checked={filters.foodDistribution}
          onToggle={() => toggleFilter('foodDistribution')}
        />
        <FilterItem
          icon="⚠️"
          label="Reported Road Hazards"
          checked={filters.hazards}
          onToggle={() => toggleFilter('hazards')}
        />
        <FilterItem
          icon="🚤"
          label="Rescue Teams & Boats"
          checked={filters.rescueTeams}
          onToggle={() => toggleFilter('rescueTeams')}
        />
        <FilterItem
          icon="📡"
          label="Nearby Mesh Relay Nodes"
          checked={filters.nearbyDevices}
          onToggle={() => toggleFilter('nearbyDevices')}
        />
      </Card>

      <View style={styles.buttonGroup}>
        <Button
          title="APPLY FILTERS"
          variant="primary"
          onPress={handleApply}
        />
        <Button
          title="RESET TO DEFAULT"
          variant="outline"
          onPress={handleReset}
        />
      </View>
    </ScrollView>
  );
};

interface FilterItemProps {
  icon: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  icon,
  label,
  checked,
  onToggle,
}) => (
  <TouchableOpacity
    style={styles.itemRow}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.itemLeft}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={[Typography.body, styles.itemLabel]}>{label}</Text>
    </View>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkIcon}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  filterCard: {
    padding: 12,
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemLabel: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonGroup: {
    marginTop: 10,
    gap: 8,
  },
});
