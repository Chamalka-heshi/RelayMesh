import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Card, StatusBadge, Colors, Typography } from '../../../shared';
import { sosService, SOSAlert } from '../services/SOSService';

interface Props {
  onBack?: () => void;
  onSelectAlert?: (alert: SOSAlert) => void;
}

export const Screen09_SOSHistory: React.FC<Props> = ({ onBack, onSelectAlert }) => {
  const [historyList, setHistoryList] = useState<SOSAlert[]>(sosService.getHistory());
  const [activeAlert, setActiveAlert] = useState<SOSAlert | null>(sosService.getActiveSOS());

  useEffect(() => {
    const update = () => {
      setHistoryList(sosService.getHistory());
      setActiveAlert(sosService.getActiveSOS());
    };
    update();
    const unsubscribe = sosService.subscribe(update);
    return unsubscribe;
  }, []);

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="SOS History & Logs"
        subtitle="Archived distress incidents & audit records"
      />

      {/* Active Incident Alert Banner if currently active */}
      {activeAlert && (
        <Card variant="emergencyRed" style={styles.activeCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.emergencyDot}>🚨</Text>
              <Text style={[Typography.bodyBold, { color: Colors.sosRed }]}>
                {activeAlert.id} (CURRENTLY ACTIVE)
              </Text>
            </View>
            <StatusBadge status="emergency" label="Broadcasting" />
          </View>
          <Text style={[Typography.caption, { marginTop: 4 }]}>
            Location: {activeAlert.locationName} • {activeAlert.nodesNotified} Nodes Relaying
          </Text>
          <View style={styles.tagsRow}>
            {activeAlert.tags.map((t) => (
              <View key={t} style={styles.tagBadgeActive}>
                <Text style={styles.tagBadgeTextActive}>{t}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Historical Logs List */}
      <Text style={[Typography.h3, styles.sectionHeader]}>Past Emergency Events</Text>

      {historyList.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={[Typography.body, { textAlign: 'center', color: Colors.textSecondary }]}>
            No past SOS incidents logged on this device.
          </Text>
        </Card>
      ) : (
        historyList.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => onSelectAlert && onSelectAlert(item)}
          >
            <Card style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitleRow}>
                  <Text style={Typography.bodyBold}>{item.id}</Text>
                  <Text style={[Typography.caption, { marginLeft: 8, color: Colors.textSecondary }]}>
                    {formatTimestamp(item.createdAt)}
                  </Text>
                </View>
                <StatusBadge
                  status={item.status === 'RESOLVED' ? 'resolved' : 'warning'}
                  label={item.status}
                />
              </View>

              <Text style={[Typography.body, { marginTop: 6, fontWeight: '600' }]}>
                {item.locationName}
              </Text>

              {/* Tags */}
              <View style={styles.tagsRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Responder info */}
              {item.responder && (
                <View style={styles.responderRow}>
                  <Text style={styles.responderIcon}>{item.responder.icon}</Text>
                  <Text style={styles.responderText}>
                    Responded by {item.responder.name} ({item.responder.radioChannel})
                  </Text>
                </View>
              )}

              {/* Resolution notes */}
              {item.notes && (
                <Text style={[Typography.caption, styles.notesText]}>
                  ✓ {item.notes}
                </Text>
              )}
            </Card>
          </TouchableOpacity>
        ))
      )}

      {/* Back Button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Return to SOS Main</Text>
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
  activeCard: {
    marginVertical: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.sosRed,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyDot: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionHeader: {
    marginVertical: 14,
  },
  historyCard: {
    marginBottom: 12,
    padding: 14,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagBadgeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tagBadgeActive: {
    backgroundColor: Colors.sosRedLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.sosRed,
  },
  tagBadgeTextActive: {
    fontSize: 11,
    color: Colors.sosRed,
    fontWeight: '700',
  },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.surfaceSecondary,
    padding: 8,
    borderRadius: 6,
  },
  responderIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  responderText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  notesText: {
    marginTop: 8,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
