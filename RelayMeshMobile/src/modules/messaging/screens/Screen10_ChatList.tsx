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
  onSelectChat?: (conversation: Conversation) => void;
  onNewMessage?: () => void;
  conversations: Conversation[]; 
}

const RawScreen10_ChatList: React.FC<Props> = ({
  onSelectChat,
  onNewMessage,
  conversations,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'broadcasts' | 'requests'>('chats');
  const [search, setSearch] = useState('');

  // Safely extract the peer's name from the stringified JSON array
  const getPeerName = (participantIdsStr: string) => {
    try {
      const ids = JSON.parse(participantIdsStr);
      const peer = ids.find((id: string) => id !== 'local_user_id');
      return peer ? `Node ${peer.substring(0, 6).toUpperCase()}` : 'Unknown Node';
    } catch (error) {
      // Fallback if parsing fails
      return `Node ${participantIdsStr.substring(0, 6)}`;
    }
  };

  // Convert the timestamp to a readable time format
  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'broadcasts' && styles.tabBtnActive]}
          onPress={() => setActiveTab('broadcasts')}
        >
          <Text style={[styles.tabText, activeTab === 'broadcasts' && styles.tabTextActive]}>
            Broadcasts (0)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {(conversations || []).map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectChat && onSelectChat(item)}
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
                    <Text style={Typography.bodyBold}>
                      {getPeerName(item.participantIds)}
                    </Text>
                    <Text style={Typography.caption}>
                      {formatTime(item.lastMessageAt)}
                    </Text>
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

      {/* Floating Action Button */}
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
const enhance = withObservables([], () => ({
  conversations: database.collections.get<Conversation>('conversations').query().observe(),
}));

export const Screen10_ChatList = enhance(RawScreen10_ChatList);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  badge: { 
    backgroundColor: Colors.accentGreen, 
    borderColor: Colors.accentGreenBorder, 
    borderWidth: 1, 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 8 
  },
  badgeText: { 
    color: Colors.primary, 
    fontSize: 10, 
    fontWeight: '700' 
  },
  searchWrapper: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: 'transparent' 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchIcon: { 
    fontSize: 15, 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 13, 
    color: Colors.textPrimary 
  },
  tabRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: 'transparent', 
    gap: 8 
  },
  tabBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    backgroundColor: 'rgba(0,0,0,0.05)' 
  },
  tabBtnActive: { 
    backgroundColor: Colors.primary 
  },
  tabText: { 
    fontSize: 12, 
    color: Colors.textSecondary, 
    fontWeight: '600' 
  },
  tabTextActive: { 
    color: '#FFFFFF' 
  },
  listContent: { 
    padding: 16, 
    paddingBottom: 80 
  },
  chatCard: { 
    marginVertical: 5, 
    padding: 12, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 8,
    elevation: 1,
  },
  chatRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    backgroundColor: 'rgba(0,0,0,0.03)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  avatarIcon: { 
    fontSize: 22 
  },
  chatInfo: { 
    flex: 1 
  },
  nameRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  lastMessage: { 
    color: Colors.textSecondary, 
    fontSize: 13, 
    marginTop: 2 
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
  fabIcon: { 
    fontSize: 22 
  },
});