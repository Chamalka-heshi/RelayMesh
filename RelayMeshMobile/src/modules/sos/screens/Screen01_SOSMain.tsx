import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header, Card, Colors, Typography } from '../../../shared';
import { sosService } from '../services/SOSService';
import { spatialService } from '../../map/services/SpatialService';

interface Props {
  onSOSSent?: () => void;
  onCancel?: () => void;
  onViewHistory?: () => void;
}

const EMERGENCY_TAGS = [
  { id: 'medical', label: 'Medical Urgent', icon: '🚑' },
  { id: 'evac', label: 'Trapped / Evacuation', icon: '⚠️' },
  { id: 'food_water', label: 'Food & Clean Water', icon: '🍞' },
  { id: 'vulnerable', label: 'Child / Elderly Care', icon: '👶' },
];

export const Screen01_SOSMain: React.FC<Props> = ({
  onSOSSent,
  onCancel,
  onViewHistory,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['Medical Urgent']);
  const [isActivating, setIsActivating] = useState(false);

  // Live or cached GPS location
  const [location, setLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    accuracy: 10,
    isLive: false,
  });

  useEffect(() => {
    const userLoc = spatialService.getUserLocation();
    if (userLoc) {
      const accuracy = spatialService.getGpsAccuracy();
      setLocation({
        latitude: Number(userLoc.latitude.toFixed(4)),
        longitude: Number(userLoc.longitude.toFixed(4)),
        accuracy: accuracy ? Math.round(accuracy) : 10,
        isLive: spatialService.isLiveLocation(),
      });
    }
  }, []);

  const toggleTag = (label: string) => {
    if (selectedTags.includes(label)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== label));
      }
    } else {
      setSelectedTags([...selectedTags, label]);
    }
  };

  const handleTriggerSOS = () => {
    setIsActivating(true);
    // Broadcast via SOSService
    sosService.triggerSOS(selectedTags, {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
    });

    // Directly navigate to broadcast status screen
    if (onSOSSent) {
      onSOSSent();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Emergency SOS"
        subtitle="One-tap offline mesh distress beacon"
        variant="white"
        badge="CRITICAL"
      />

      {/* Hero Pulsing SOS Button Section */}
      <View style={styles.sosSection}>
        <View style={styles.pulseRingOuter}>
          <View style={styles.pulseRingInner}>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleTriggerSOS}
              activeOpacity={0.8}
              disabled={isActivating}
            >
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>TAP TO BROADCAST</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.instructions}>
          Tap the red beacon to immediately broadcast a high-priority emergency distress signal to nearby mesh nodes.
        </Text>
      </View>

      {/* GPS Telemetry Fix Card */}
      <Card variant="accentGreen" style={styles.locationCard}>
        <View style={styles.locRow}>
          <Text style={styles.locIcon}>📍</Text>
          <View style={styles.locTextCol}>
            <Text style={Typography.bodyBold}>GPS Coordinates Locked</Text>
            <Text style={Typography.caption}>
              {location.latitude}° N, {location.longitude}° E • Accuracy: ±{location.accuracy}m
            </Text>
          </View>
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>
              {location.isLive ? 'LIVE GPS' : 'OFFLINE FIX'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Streamlined Emergency Triage Tags */}
      <View style={styles.tagsSection}>
        <Text style={[Typography.h3, styles.sectionTitle]}>
          Emergency Type / Priority:
        </Text>
        <View style={styles.tagsContainer}>
          {EMERGENCY_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.label);
            return (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                onPress={() => toggleTag(tag.label)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagIcon}>{tag.icon}</Text>
                <Text
                  style={[
                    styles.tagText,
                    isSelected && styles.tagTextSelected,
                  ]}
                >
                  {tag.label}
                </Text>
                {isSelected && <Text style={styles.tagCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Quick Navigation Footer Links */}
      <View style={styles.footerRow}>
        {onViewHistory && (
          <TouchableOpacity style={styles.footerButton} onPress={onViewHistory}>
            <Text style={styles.footerButtonText}>📜 View Past SOS History</Text>
          </TouchableOpacity>
        )}

        {onCancel && (
          <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
            <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>
              Cancel and return to Dashboard
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sosSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pulseRingOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRingInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(229, 57, 53, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: Colors.sosRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sosRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sosSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  instructions: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    color: Colors.textSecondary,
  },
  locationCard: {
    marginVertical: 12,
    padding: 14,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  locTextCol: {
    flex: 1,
  },
  gpsBadge: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreenBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gpsBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  tagsSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tagChipSelected: {
    backgroundColor: Colors.sosRedLight,
    borderColor: Colors.sosRed,
  },
  tagIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: Colors.sosRed,
    fontWeight: '700',
  },
  tagCheck: {
    fontSize: 12,
    color: Colors.sosRed,
    fontWeight: '800',
    marginLeft: 6,
  },
  footerRow: {
    marginTop: 18,
    alignItems: 'center',
    gap: 12,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  cancelLink: {
    padding: 8,
  },
});
