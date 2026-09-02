import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Card, Colors, Typography } from '../../../shared';
import { database } from '../../../database'; 
import Conversation from '../../../database/Conversation';

interface Props {
  onSelectChat?: (chatName: string) => void;
  onNewMessage?: () => void;
  conversations: Conversation[]; // Injected automatically by WatermelonDB
}

const RawScreen10_ChatList: React.FC<Props> = ({
  onSelectChat,
  onNewMessage,
  conversations,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'broadcasts' | 'requests'>('chats');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      {/* Top Header - Glassmorphic styling */}
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.textPrimary }]}>Messages</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MESH ACTIVE</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search messages or peer nodes..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'chats' && styles.tabBtnActive]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.tabTextActive]}>
            Chats ({(conversations || []).length})
          </Text>
        </TouchableOpacity>
        {/* Other tabs omitted for brevity, keep your original ones here! */}
      </View>

      {/* Conversations List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {(conversations || []).map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectChat && onSelectChat(item.id)}
            activeOpacity={0.7}
          >
            <Card style={styles.chatCard}>
              <View style={styles.chatRow}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>{item.isGroup ? '👥' : '👤'}</Text>
                </View>

                {/* Content */}
                <View style={styles.chatInfo}>
                  <View style={styles.nameRow}>
                    <Text style={Typography.bodyBold}>Node {item.participantIds ? item.participantIds.substring(0, 6) : item.id}...</Text>
                    {/* Placeholder for relation fetching */}
                    <Text style={Typography.caption}>Just now</Text>
                  </View>
                  
                  <Text
                    style={[Typography.body, styles.lastMessage]}
                    numberOfLines={1}
                  >
                    Tap to view encrypted messages...
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button - Enhanced shadow and blur aesthetic */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onNewMessage}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- WATERMELONDB SUBSCRIPTION ---
// This observes the 'conversations' table and triggers a re-render anytime the data changes.
const enhance = withObservables([], () => ({
  conversations: database.collections.get<Conversation>('conversations').query().observe(),
}));

// Export the enhanced component
export const Screen10_ChatList = enhance(RawScreen10_ChatList);

const styles = StyleSheet.create({
  // ... Keep all your original styles, but replace these specific ones for the updated aesthetic:
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent glass effect
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Soft transparent overlay
    borderRadius: 16, // Smoother edges
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  // (Paste the rest of your original styles here)
  container: { flex: 1, backgroundColor: Colors.background },
  badge: { backgroundColor: Colors.accentGreen, borderColor: Colors.accentGreenBorder, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'transparent' },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'transparent', gap: 8 },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.05)' },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 80 },
  chatCard: { marginVertical: 5, padding: 12, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8 },
  chatRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarIcon: { fontSize: 22 },
  chatInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  fabIcon: { fontSize: 22 },
});