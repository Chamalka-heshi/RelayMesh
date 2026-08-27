import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { Card, Colors, Typography } from '../../../shared';
import { database } from '../../../database';
import Message from '../../../database/Message';
import { encryptMessage, decryptMessage, generateKeyPair } from '../utils/crypto';

// TEMPORARY: Generating dummy keys for testing the UI encryption flow
const TEMP_MY_KEYS = generateKeyPair();
const TEMP_THEIR_KEYS = generateKeyPair();

interface Props {
  conversationId: string;
  chatName?: string;
  onBackPress?: () => void;
  messages: Message[];
}

const RawScreen11_DirectChat: React.FC<Props> = ({
  conversationId,
  chatName = 'Unknown Node',
  onBackPress,
  messages,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    setInputText('');

    // 1. Encrypt the payload before saving it to the database
    const securePayload = encryptMessage(
      trimmedText,
      TEMP_MY_KEYS.privateKey,
      TEMP_THEIR_KEYS.publicKey
    );

    // 2. Write the unreadable ciphertext to WatermelonDB
    await database.write(async () => {
      await database.get<Message>('messages').create((msg) => {
        msg.conversationId = conversationId;
        msg.senderId = 'Me';
        msg.encryptedPayload = securePayload;
        msg.status = 'queued';
        msg.hopCount = 0;
      });
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header Bar - Glassmorphic Aesthetic */}
      <View style={styles.header}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.headerTitleCol}>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>
            🟢 End-to-End Encrypted
          </Text>
        </View>
        <TouchableOpacity style={styles.callIcon}>
          <Text style={{ fontSize: 18 }}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Mesh Status Info Banner */}
      <View style={styles.meshBanner}>
        <Text style={styles.meshBannerText}>
          🔒 OFFLINE PEER-TO-PEER ENCRYPTED MESH CHANNEL
        </Text>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.chatScroll}>
        {messages.map((m) => {
          const isMe = m.senderId === 'Me';

          // 3. Decrypt the payload on the fly for the UI
          const decryptedText = isMe
            ? decryptMessage(m.encryptedPayload, TEMP_THEIR_KEYS.privateKey, TEMP_MY_KEYS.publicKey)
            : decryptMessage(m.encryptedPayload, TEMP_MY_KEYS.privateKey, TEMP_THEIR_KEYS.publicKey);

          const displayText = decryptedText || '🔒 [Decryption Failed - Key Mismatch]';

          return (
            <View
              key={m.id}
              style={[
                styles.messageWrapper,
                isMe ? styles.myMessageWrapper : styles.theirMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.myBubble : styles.theirBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    isMe ? styles.myBubbleText : styles.theirBubbleText,
                  ]}
                >
                  {displayText}
                </Text>
                <View style={styles.msgFooter}>
                  <Text style={isMe ? styles.myTime : styles.theirTime}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {isMe && (
                    <Text style={styles.statusTick}>
                      {m.status === 'relayed' ? '✓✓' : m.status === 'delivered' ? '✓✓' : '✓'}
                    </Text>
                  )}
                </View>
              </View>

              {m.hopCount > 0 && (
                <Text style={styles.hopIndicator}>● Relayed via {m.hopCount} hops</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar - Soft transparent blur effect */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputToolBtn}>
          <Text style={styles.inputToolIcon}>📍</Text>
        </TouchableOpacity>
        
        <TextInput
          placeholder="Type message across mesh..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const enhance = withObservables(['conversationId'], ({ conversationId }) => ({
  messages: database.collections
    .get<Message>('messages')
    .query(Q.where('conversation_id', conversationId), Q.sortBy('created_at', Q.asc))
    .observe(),
}));

export const Screen11_DirectChat = enhance(RawScreen11_DirectChat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glassmorphic header
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { marginRight: 10 },
  backText: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { fontSize: 18 },
  headerTitleCol: { flex: 1 },
  headerSubtitle: { color: Colors.primary, fontSize: 11, marginTop: 2, fontWeight: '600' },
  callIcon: { padding: 6 },
  meshBanner: { backgroundColor: Colors.accentGreen, paddingVertical: 5, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: Colors.accentGreenBorder, alignItems: 'center' },
  meshBannerText: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 0.2 },
  chatScroll: { padding: 16, paddingBottom: 20 },
  messageWrapper: { marginBottom: 12, maxWidth: '82%' },
  myMessageWrapper: { alignSelf: 'flex-end' },
  theirMessageWrapper: { alignSelf: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  myBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  myBubbleText: { color: '#FFFFFF' },
  theirBubbleText: { color: Colors.textPrimary },
  msgFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4, gap: 4 },
  myTime: { fontSize: 10, color: 'rgba(255, 255, 255, 0.75)' },
  theirTime: { fontSize: 10, color: Colors.textMuted },
  statusTick: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  hopIndicator: { fontSize: 10, color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  inputToolBtn: { padding: 6, marginRight: 4 },
  inputToolIcon: { fontSize: 18 },
  textInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: Colors.textPrimary, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 8, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 6 },
  sendBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0 },
  sendIcon: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', transform: [{ rotate: '45deg' }] },
});