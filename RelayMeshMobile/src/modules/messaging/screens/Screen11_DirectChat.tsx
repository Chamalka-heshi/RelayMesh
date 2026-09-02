import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { Colors, Typography } from '../../../shared';
import { database } from '../../../database';
import Message from '../../../database/Message';
import Conversation from '../../../database/Conversation';

interface Props {
  conversation: Conversation;
  messages: Message[]; // Injected by WatermelonDB
  onBack?: () => void;
}

const RawScreen11_DirectChat: React.FC<Props> = ({ conversation, messages, onBack }) => {
  const [inputText, setInputText] = useState('');

  // Helper to determine the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Queued': return '🕒';
      case 'Relayed': return '✓';
      case 'Delivered': return '✓✓';
      default: return '🕒';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // 1. Capture the text and clear the input immediately for a snappy UI feel
    const messagePayload = inputText;
    setInputText('');

    // 2. Write the new message to WatermelonDB
    try {
      await database.write(async () => {
        await database.collections.get<Message>('messages').create((msg) => {
          msg.conversationId = conversation.id;
          msg.senderId = 'local_user_id';
          msg.encryptedPayload = messagePayload;
          msg.status = 'Queued';
          msg.hopCount = 0;
        });
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const attachLocation = () => {
    setInputText((prev) => prev + " [Location Pin: 6.9271, 79.8612] ");
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === 'local_user_id';

    return (
      <View style={[styles.messageWrapper, isMine ? styles.messageMine : styles.messageTheirs]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.messageText, isMine ? styles.messageTextMine : styles.messageTextTheirs]}>
            {item.encryptedPayload}
          </Text>
          
          <View style={styles.metaRow}>
            {/* Hop Count Indicator */}
            {!isMine && item.hopCount > 0 && (
              <Text style={styles.metaText}>via {item.hopCount} hops</Text>
            )}
            
            {/* Status Indicator (Only for outgoing messages) */}
            {isMine && (
              <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
            Node {conversation.participantIds.substring(0, 6)}...
          </Text>
          <View style={styles.e2eBadge}>
            <Text style={styles.e2eIcon}>🔒</Text>
            <Text style={styles.e2eText}>E2E Encrypted</Text>
          </View>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        inverted={false} // Set to true later if you want bottom-up rendering
      />

      {/* Input Area - Glassmorphic */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={attachLocation} style={styles.attachBtn}>
          <Text style={styles.attachIcon}>📍</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Encrypted message..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : null]} 
          onPress={handleSend}
        >
          <Text style={styles.sendIcon}>↗</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// --- WATERMELONDB SUBSCRIPTION ---
const enhance = withObservables(['conversation'], ({ conversation }: { conversation: Conversation }) => ({
  conversation,
  messages: database.collections
    .get<Message>('messages')
    .query(
      Q.where('conversation_id', conversation.id),
      Q.sortBy('created_at', Q.asc)
    )
    .observe(),
}));

export const Screen11_DirectChat = enhance(RawScreen11_DirectChat);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  backBtn: { paddingRight: 16 },
  backIcon: { fontSize: 24, color: Colors.primary },
  headerTitleContainer: { flex: 1 },
  e2eBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  e2eIcon: { fontSize: 10, marginRight: 4 },
  e2eText: { fontSize: 11, color: Colors.accentGreen, fontWeight: '600' },
  
  chatList: { padding: 16, paddingBottom: 24 },
  messageWrapper: { marginBottom: 12, flexDirection: 'row' },
  messageMine: { justifyContent: 'flex-end' },
  messageTheirs: { justifyContent: 'flex-start' },
  
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextMine: { color: '#FFFFFF' },
  messageTextTheirs: { color: Colors.textPrimary },
  
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 6 },
  metaText: { fontSize: 10, color: Colors.textMuted },
  statusIcon: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', marginBottom: 20 },
  attachBtn: { padding: 10, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 20, marginRight: 8 },
  attachIcon: { fontSize: 18 },
  textInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15, maxHeight: 100, color: Colors.textPrimary },
  sendBtn: { padding: 10, marginLeft: 8, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnActive: { backgroundColor: Colors.primary },
  sendIcon: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }
});