import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Header, Card, Button, Colors, Typography } from '../../../shared';

export const Screen12_BroadcastMessage: React.FC = () => {
  const [broadcastType, setBroadcastType] = useState('General');
  const [messageText, setMessageText] = useState('');
  const [shareLocation, setShareLocation] = useState(true);

  const handleSendBroadcast = () => {
    if (!messageText.trim()) {
      Alert.alert('Empty Message', 'Please enter a broadcast message to flood across the mesh.');
      return;
    }
    Alert.alert('📢 Broadcast Flooded', 'Message has been propagated to all nearby nodes within 5 hops.');
    setMessageText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header
        title="Network Broadcast"
        subtitle="Flood message to all devices in range"
      />

      <Card variant="accentGreen">
        <Text style={Typography.bodyBold}>Broadcast Channel (TTL: 5 Hops)</Text>
        <Text style={[Typography.caption, { marginTop: 2 }]}>
          Every smartphone receiving this message will forward it to others.
        </Text>
      </Card>

      <Card>
        <Text style={[Typography.captionBold, { marginBottom: 8 }]}>SELECT BROADCAST CATEGORY:</Text>
        <View style={styles.catRow}>
          {['General', 'Relief Update', 'Hazard Alert', 'Urgent Help'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, broadcastType === cat && styles.catBtnActive]}
              onPress={() => setBroadcastType(cat)}
            >
              <Text style={[styles.catText, broadcastType === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Write announcement or emergency report..."
          placeholderTextColor={Colors.textMuted}
          value={messageText}
          onChangeText={setMessageText}
          style={styles.textArea}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.locationToggle}
          onPress={() => setShareLocation(!shareLocation)}
        >
          <View style={[styles.checkbox, shareLocation && styles.checkboxActive]}>
            {shareLocation && <Text style={{ color: '#FFFFFF', fontSize: 12 }}>✓</Text>}
          </View>
          <Text style={[Typography.body, { marginLeft: 10 }]}>
            Attach current GPS location fix
          </Text>
        </TouchableOpacity>
      </Card>

      <Button
        title="FLOOD BROADCAST MESSAGE"
        variant="primary"
        onPress={handleSendBroadcast}
        style={{ marginTop: 12 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  catBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: Colors.surfaceSecondary },
  catBtnActive: { backgroundColor: Colors.primary },
  catText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  catTextActive: { color: '#FFFFFF' },
  textArea: { backgroundColor: Colors.surfaceSecondary, borderRadius: 12, padding: 12, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.border, fontSize: 13, color: Colors.textPrimary },
  locationToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});
