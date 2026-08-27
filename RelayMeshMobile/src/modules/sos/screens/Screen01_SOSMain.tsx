import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen01_SOSMain: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);

  const handleTriggerSOS = () => {
    setIsTriggered(true);
    Alert.alert('🚨 SOS Signal Broadcasted', 'Emergency beacon has been transmitted via mesh network nodes.');
  };

  return (
    <View style={styles.container}>
      <Header title="Emergency SOS" subtitle="One-touch offline emergency broadcast" badge="Member 1" />
      
      <Card variant="danger" style={styles.alertCard}>
        <Text style={[Typography.h2, { color: Colors.sosRed, textAlign: 'center' }]}>
          {isTriggered ? '🚨 SOS ACTIVE & BROADCASTING' : '⚡ READY TO BROADCAST'}
        </Text>
        <Text style={[Typography.body, { color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
          Sends high-priority distress signal with GPS coordinates to all nearby mesh relay nodes.
        </Text>
      </Card>

      <View style={styles.actionContainer}>
        <Button
          title={isTriggered ? 'CANCEL SOS' : 'TRIGGER EMERGENCY SOS'}
          variant="danger"
          onPress={handleTriggerSOS}
          style={styles.sosButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  alertCard: {
    marginVertical: 20,
    padding: 24,
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  sosButton: {
    height: 56,
    borderRadius: 16,
  },
});
