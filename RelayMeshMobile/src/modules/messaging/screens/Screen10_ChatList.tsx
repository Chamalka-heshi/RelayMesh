import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, Colors, Typography } from '../../../shared';

interface Props {
  onSelectChat?: (chatName: string) => void;
  onNewMessage?: () => void;
}

export const Screen10_ChatList: React.FC<Props> = ({
  onSelectChat,
  onNewMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'broadcasts' | 'requests'>('chats');
  const [search, setSearch] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Rescue Team Alpha',
      role: 'Emergency Response Unit',
      lastMessage: 'Please stay where you are. Rescue boat #04 dispatched.',
      time: '2m ago',
      unread: 1,
      hops: '1 hop (Direct)',
      avatar: '🚑',
      status: 'direct',
    },
    {
      id: '2',
      name: 'Volunteer Group South',
      role: 'Community Relief',
      lastMessage: 'Drinking water and ration supplies have arrived at Shelter 1.',
      time: '12m ago',
      unread: 0,
      hops: '2 hops (Relayed)',
      avatar: '🤝',
      status: 'relayed',
    },
    {
      id: '3',
      name: 'Shelter Point 1 Triage',
      role: 'Medical Camp',
      lastMessage: 'Medical triage station is open. Doctor on duty.',
      time: '34m ago',
      unread: 0,
      hops: '3 hops (Relayed)',
      avatar: '🏥',
      status: 'relayed',
    },
    {
      id: '4',
      name: 'Citizen #RM-4481',
      role: 'Peer Node (120m away)',
      lastMessage: 'Anyone have spare power banks near Sector 4?',
      time: '1h ago',
      unread: 0,
      hops: 'Stored locally (Queued)',
      avatar: '👤',
      status: 'queued',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.textPrimary }]}>Messages</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>12 NODES IN RANGE</Text>
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
            Chats (4)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'broadcasts' && styles.tabBtnActive]}
          onPress={() => setActiveTab('broadcasts')}
        >
          <Text style={[styles.tabText, activeTab === 'broadcasts' && styles.tabTextActive]}>
            Broadcasts (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Help Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {conversations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectChat && onSelectChat(item.name)}
            activeOpacity={0.7}
          >
            <Card style={styles.chatCard}>
              <View style={styles.chatRow}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>{item.avatar}</Text>
                </View>

                {/* Content */}
                <View style={styles.chatInfo}>
                  <View style={styles.nameRow}>
                    <Text style={Typography.bodyBold}>{item.name}</Text>
                    <Text style={Typography.caption}>{item.time}</Text>
                  </View>
                  <Text style={[Typography.caption, { color: Colors.primary, marginBottom: 2 }]}>
                    {item.role}
                  </Text>
                  <Text
                    style={[
                      Typography.body,
                      styles.lastMessage,
                      item.unread > 0 && styles.unreadMessage,
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>

                  {/* Mesh Hop Tag */}
                  <View style={styles.hopRow}>
                    <Text style={styles.hopBadge}>{item.hops}</Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button (New Chat) */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
  },
  badge: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreenBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  chatCard: {
    marginVertical: 5,
    padding: 12,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
  },
  avatarIcon: {
    fontSize: 22,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  unreadMessage: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  hopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  hopBadge: {
    fontSize: 10,
    color: Colors.textSecondary,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 22,
  },
});
