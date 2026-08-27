import React, { useState } from 'react';
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
import { Card, Colors, Typography } from '../../../shared';

interface Props {
  chatName?: string;
  onBackPress?: () => void;
}

export const Screen11_DirectChat: React.FC<Props> = ({
  chatName = 'Rescue Team Alpha',
  onBackPress,
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Rescue Team Alpha',
      text: 'We received your SOS distress broadcast. What is your current situation and how many people are with you?',
      time: '16:30',
      isMe: false,
      status: 'delivered',
    },
    {
      id: '2',
      sender: 'Me',
      text: 'Trapped on second floor due to rapid water rise. 3 adults, 1 child. Water is at stair level.',
      time: '16:32',
      isMe: true,
      status: 'relayed',
      hops: 'Relayed via 2 nodes',
    },
    {
      id: '3',
      sender: 'Me',
      text: 'Sharing our live GPS coordinate fix below.',
      time: '16:33',
      isMe: true,
      status: 'relayed',
      hops: 'Relayed via 2 nodes',
      isLocationCard: true,
      coords: '6.9271° N, 79.8612° E (Accuracy: 8m)',
    },
    {
      id: '4',
      sender: 'Rescue Team Alpha',
      text: 'Understood. Rescue Boat Unit #04 has been dispatched towards your location. Estimated arrival time 12–15 minutes. Please stay inside.',
      time: '16:35',
      isMe: false,
      status: 'delivered',
    },
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Me',
      text: inputText.trim(),
      time: 'Just now',
      isMe: true,
      status: 'queued',
      hops: 'Broadcasting to nearby mesh...',
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header Bar */}
      <View style={styles.header}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🚑</Text>
        </View>
        <View style={styles.headerTitleCol}>
          <Text style={[Typography.h3, { color: '#FFFFFF' }]}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>
            🟢 12 devices in chat • End-to-End Encrypted
          </Text>
        </View>
        <TouchableOpacity style={styles.callIcon}>
          <Text style={{ fontSize: 18 }}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Mesh Status Info Banner */}
      <View style={styles.meshBanner}>
        <Text style={styles.meshBannerText}>
          🔒 OFFLINE PEER-TO-PEER ENCRYPTED MESH CHANNEL (TTL: 5 HOPS)
        </Text>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.chatScroll}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageWrapper,
              m.isMe ? styles.myMessageWrapper : styles.theirMessageWrapper,
            ]}
          >
            {!m.isMe && (
              <Text style={styles.senderLabel}>{m.sender}</Text>
            )}

            {/* If location card */}
            {m.isLocationCard ? (
              <View style={[styles.bubble, styles.myBubble]}>
                <Text style={[styles.bubbleText, styles.myBubbleText]}>
                  📍 GPS Location Fix Attached:
                </Text>
                <View style={styles.locBox}>
                  <Text style={styles.locBoxText}>{m.coords}</Text>
                </View>
                <View style={styles.msgFooter}>
                  <Text style={styles.myTime}>{m.time}</Text>
                  <Text style={styles.statusTick}>✓✓</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.bubble,
                  m.isMe ? styles.myBubble : styles.theirBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    m.isMe ? styles.myBubbleText : styles.theirBubbleText,
                  ]}
                >
                  {m.text}
                </Text>
                <View style={styles.msgFooter}>
                  <Text style={m.isMe ? styles.myTime : styles.theirTime}>
                    {m.time}
                  </Text>
                  {m.isMe && (
                    <Text style={styles.statusTick}>
                      {m.status === 'relayed' ? '✓✓' : '✓'}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {m.hops && (
              <Text style={styles.hopIndicator}>● {m.hops}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputToolBtn}>
          <Text style={styles.inputToolIcon}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputToolBtn}>
          <Text style={styles.inputToolIcon}>🚨</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerSubtitle: {
    color: '#E8F5EC',
    fontSize: 11,
    marginTop: 2,
  },
  callIcon: {
    padding: 6,
  },
  meshBanner: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentGreenBorder,
    alignItems: 'center',
  },
  meshBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '82%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 3,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myBubbleText: {
    color: '#FFFFFF',
  },
  theirBubbleText: {
    color: Colors.textPrimary,
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  myTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  statusTick: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hopIndicator: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  locBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  locBoxText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputToolBtn: {
    padding: 6,
    marginRight: 4,
  },
  inputToolIcon: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    transform: [{ rotate: '45deg' }],
  },
});
