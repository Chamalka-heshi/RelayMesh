import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

interface Props {
  onSOSSent?: () => void;
  onCancel?: () => void;
}

export const Screen01_SOSMain: React.FC<Props> = ({ onSOSSent, onCancel }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['Medical Emergency']);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const tags = [
    'Injured',
    'Trapped',
    'Medical Emergency',
    'Need Evacuation',
    'Need Food',
    'Need Water',
    'Child / Infant',
    'Elderly',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTriggerSOS = () => {
    setIsBroadcasting(true);
    Alert.alert(
      '🚨 SOS Signal Transmitted',
      'Your emergency distress beacon with GPS coordinates has been broadcast to all nearby mesh relay nodes.',
      [
        {
          text: 'View Status',
          onPress: () => {
            if (onSOSSent) onSOSSent();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Emergency SOS"
        subtitle="One-tap offline emergency beacon"
        variant="white"
        badge="CRITICAL"
      />

      {/* Main SOS Red Button Section */}
      <View style={styles.sosSection}>
        <View style={styles.pulseRingOuter}>
          <View style={styles.pulseRingInner}>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={handleTriggerSOS}
              activeOpacity={0.8}
            >
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.sosSubtext}>PRESS TO BROADCAST</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.instructions}>
          Tap to broadcast high-priority emergency beacon to nearby devices and rescue teams.
        </Text>
      </View>

      {/* GPS Location Status Card */}
      <Card variant="accentGreen" style={styles.locationCard}>
        <View style={styles.locRow}>
          <Text style={styles.locIcon}>📍</Text>
          <View style={styles.locTextCol}>
            <Text style={Typography.bodyBold}>GPS Location Available</Text>
            <Text style={Typography.caption}>
              Lat: 6.9271° N, Lng: 79.8612° E • Accuracy: 12m
            </Text>
          </View>
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>OFFLINE FIX</Text>
          </View>
        </View>
      </Card>

      {/* Emergency Tags Selector */}
      <View style={styles.tagsSection}>
        <Text style={[Typography.h3, styles.sectionTitle]}>
          Select Emergency Tags (Optional):
        </Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tagText,
                    isSelected && styles.tagTextSelected,
                  ]}
                >
                  {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Action */}
      <Button
        title="TRIGGER EMERGENCY SOS NOW"
        variant="danger"
        onPress={handleTriggerSOS}
        style={styles.triggerButton}
      />

      {onCancel && (
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>
            Cancel and return to Dashboard
          </Text>
        </TouchableOpacity>
      )}
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
    marginVertical: 20,
  },
  pulseRingOuter: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRingInner: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.sosRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sosRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sosSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  instructions: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  locationCard: {
    marginVertical: 10,
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gpsBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagChipSelected: {
    backgroundColor: Colors.sosRedLight,
    borderColor: Colors.sosRed,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: Colors.sosRed,
    fontWeight: '700',
  },
  triggerButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 14,
  },
  cancelLink: {
    marginTop: 14,
    padding: 8,
  },
});
