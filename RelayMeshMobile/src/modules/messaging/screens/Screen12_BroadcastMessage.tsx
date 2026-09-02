import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Colors, Typography, Card } from '../../../shared';

interface Props {
  onBack?: () => void;
}

const CATEGORIES = ['General', 'Relief Update', 'Hazard Alert', 'Urgent Help'];

export const Screen12_BroadcastMessage: React.FC<Props> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [attachGPS, setAttachGPS] = useState(true);

  const handleBroadcast = () => {
    if (!message.trim()) {
      if (Platform.OS === 'web') {
        // @ts-ignore
        window.alert('Please write a broadcast message first.');
      } else {
        Alert.alert('Empty Message', 'Please write a broadcast message first.');
      }
      return;
    }

    // Prototype logs
    console.log('--- NEW MESH BROADCAST ---');
    console.log('Category:', selectedCategory);
    console.log('Message:', message);
    console.log('Includes GPS:', attachGPS);
    console.log('TTL:', 5, 'Hops');

    // Cross-platform alert handling
    if (Platform.OS === 'web') {
      // @ts-ignore
      window.alert('Broadcast Sent!\n\nYour message is currently routing through the mesh network.');
      if (onBack) onBack(); // Navigate back after clicking OK
    } else {
      Alert.alert(
        'Broadcast Sent',
        'Your message is currently routing through the mesh network.',
        [{ text: 'OK', onPress: onBack }]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={[Typography.h2, { color: Colors.textPrimary }]}>Network Broadcast</Text>
            <Text style={styles.subtitle}>Flood message to all devices in range</Text>
          </View>
        </View>

        {/* TTL Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Broadcast Channel (TTL: 5 Hops)</Text>
          <Text style={styles.infoCardText}>Every smartphone receiving this message will forward it to others.</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          
          <Text style={styles.label}>SELECT BROADCAST CATEGORY:</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Write announcement or emergency report..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* GPS Toggle */}
          <TouchableOpacity 
            style={styles.checkboxRow} 
            activeOpacity={0.7}
            onPress={() => setAttachGPS(!attachGPS)}
          >
            <View style={[styles.checkbox, attachGPS && styles.checkboxActive]}>
              {attachGPS && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Attach current GPS location fix</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.floodButton} onPress={handleBroadcast}>
          <Text style={styles.floodButtonText}>SEND BROADCAST MESSAGE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, paddingBottom: 100, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  
  infoCard: {
    backgroundColor: '#E6F4EA', // Light green from Figma
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CEEAD6',
    marginBottom: 24,
  },
  infoCardTitle: { fontSize: 14, fontWeight: '700', color: '#137333', marginBottom: 4 },
  infoCardText: { fontSize: 13, color: '#137333' },

  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12 },
  
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryPill: { 
    backgroundColor: '#F1F3F4', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  categoryPillActive: { backgroundColor: '#137333' }, // Forest green
  categoryText: { fontSize: 13, color: '#5F6368', fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },

  inputWrapper: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 16,
  },
  textInput: {
    height: 120,
    padding: 16,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { 
    width: 20, height: 20, 
    borderRadius: 4, 
    borderWidth: 2, 
    borderColor: '#137333', 
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#137333' },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 14, color: Colors.textSecondary },

  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  floodButton: {
    backgroundColor: '#137333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  floodButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
});