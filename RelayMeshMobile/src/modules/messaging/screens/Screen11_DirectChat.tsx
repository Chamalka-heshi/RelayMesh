import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  const flatListRef = useRef<FlatList>(null);

  // Safely determine display name of the other participant
  const getPeerDisplayName = (participantIdsStr?: string) => {
    if (!participantIdsStr) return 'Mesh Node';
    try {
      const ids = JSON.parse(participantIdsStr);
      if (Array.isArray(ids)) {
        const peer = ids.find((id: string) => id !== 'local_user_id');
        if (peer) {
          if (peer.includes('Officer') || peer.includes('Leader') || peer.includes('Coordinator')) {
            return peer;
          }
          return `Node ${peer.substring(0, 8).toUpperCase()}`;
        }
      }
    } catch {
      if (participantIdsStr.includes('Officer') || participantIdsStr.includes('Leader')) {
        return participantIdsStr;
      }
    }
    return `Node ${participantIdsStr.substring(0, 8)}`;
  };

  const peerDisplayName = getPeerDisplayName(conversation?.participantIds);
  const isCoordinator =
    peerDisplayName.includes('Officer') ||
    peerDisplayName.includes('Leader') ||
    peerDisplayName.includes('Coordinator');

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages?.length]);

  // Helper to determine outgoing status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Queued':
        return '🕒';
      case 'Relayed':
        return '✓';
      case 'Delivered':
        return '✓✓';
      default:
        return '🕒';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messagePayload = inputText.trim();
    setInputText('');

    try {
      let createdUserMsg: Message | null = null;

      // 1. Save user's outgoing message to WatermelonDB
      await database.write(async () => {
        createdUserMsg = await database.collections.get<Message>('messages').create((msg) => {
          msg.conversationId = conversation.id;
          msg.senderId = 'local_user_id';
          msg.encryptedPayload = messagePayload;
          msg.status = 'Queued';
          msg.hopCount = 0;
        });
        await conversation.update((conv) => {
          conv.lastMessageAt = Date.now();
        });
      });

      // 2. Simulate mesh transmission status progression (Queued -> Relayed -> Delivered)
      setTimeout(async () => {
        try {
          if (createdUserMsg) {
            await database.write(async () => {
              await createdUserMsg!.update((m) => {
                m.status = 'Relayed';
                m.hopCount = 1;
              });
            });
          }
        } catch (err) {
          console.log('Error updating relayed status:', err);
        }
      }, 500);

      setTimeout(async () => {
        try {
          if (createdUserMsg) {
            await database.write(async () => {
              await createdUserMsg!.update((m) => {
                m.status = 'Delivered';
                m.hopCount = 2;
              });
            });
          }
        } catch (err) {
          console.log('Error updating delivered status:', err);
        }
      }, 1000);

      // 3. Automated mesh reply from On-Site Coordinator / Peer
      setTimeout(async () => {
        try {
          let peerName = peerDisplayName;
          const textLower = messagePayload.toLowerCase();
          let replyText = '';

          if (textLower.includes('water') || textLower.includes('drink')) {
            replyText = `Copy that! We have clean drinking water reserves (500L tank) active at the site. Supplies are ready for collection.`;
          } else if (
            textLower.includes('medic') ||
            textLower.includes('doctor') ||
            textLower.includes('injur') ||
            textLower.includes('first aid') ||
            textLower.includes('sick') ||
            textLower.includes('pain')
          ) {
            replyText = `Medical priority received! Paramedic station is operational. Please head toward the Red Cross tent or send coordinates if immobilized.`;
          } else if (
            textLower.includes('food') ||
            textLower.includes('ration') ||
            textLower.includes('eat') ||
            textLower.includes('hungry') ||
            textLower.includes('meal')
          ) {
            replyText = `Ration distribution is active right now. Family dry-ration packs and energy biscuits are being issued at Gate 2.`;
          } else if (
            textLower.includes('shelter') ||
            textLower.includes('bed') ||
            textLower.includes('sleep') ||
            textLower.includes('space') ||
            textLower.includes('stay') ||
            textLower.includes('capacity')
          ) {
            replyText = `We have open shelter capacity (approx 65 beds remaining). Check-in desk is open with volunteer assistance.`;
          } else if (
            textLower.includes('where') ||
            textLower.includes('locat') ||
            textLower.includes('pin') ||
            textLower.includes('map') ||
            textLower.includes('direction')
          ) {
            replyText = `Location verified! We are 1.2 km away via the main high-ground road. Avoid low sector 2 due to flooding.`;
          } else if (
            textLower.includes('help') ||
            textLower.includes('sos') ||
            textLower.includes('emergency') ||
            textLower.includes('danger')
          ) {
            replyText = `URGENT transmission received on-site! Dispatching rescue volunteers toward your sector now. Keep your device on and stay in safe elevated cover.`;
          } else if (
            textLower.includes('hello') ||
            textLower.includes('hi') ||
            textLower.includes('hey') ||
            textLower.includes('test')
          ) {
            replyText = `Hello! ${peerDisplayName} here. Loud and clear on VHF/mesh relay. What is your current situation or relief requirement?`;
          } else {
            const genericReplies = [
              `Received loud and clear via mesh node relay. Message logged with on-site operations team. We are standing by to assist.`,
              `Copy your message. On-site volunteers have been briefed. Let us know if you need supplies dispatched or route assistance.`,
              `Acknowledged over mesh channel. Our communication node is holding strong at 2 hops. Stay safe!`,
            ];
            replyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
          }

          await database.write(async () => {
            await database.collections.get<Message>('messages').create((msg) => {
              msg.conversationId = conversation.id;
              msg.senderId = peerName;
              msg.encryptedPayload = replyText;
              msg.status = 'Delivered';
              msg.hopCount = Math.floor(Math.random() * 2) + 1;
            });
            await conversation.update((conv) => {
              conv.lastMessageAt = Date.now();
            });
          });
        } catch (err) {
          console.error('Failed to generate coordinator auto-reply:', err);
        }
      }, 1600);

    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const attachLocation = () => {
    setInputText((prev) => prev + ' [Location Pin: 6.9271, 79.8612] ');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === 'local_user_id';
    const senderLabel = isCoordinator ? peerDisplayName : `Node ${item.senderId.substring(0, 6).toUpperCase()}`;

    return (
      <View style={[styles.messageWrapper, isMine ? styles.messageMine : styles.messageTheirs]}>
        {!isMine && (
          <Text style={styles.senderHeader}>
            {isCoordinator ? '🛡️ ' : '👤 '}{senderLabel}
          </Text>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.messageText, isMine ? styles.messageTextMine : styles.messageTextTheirs]}>
            {item.encryptedPayload}
          </Text>

          <View style={styles.metaRow}>
            {!isMine && item.hopCount > 0 && (
              <Text style={styles.metaText}>via {item.hopCount} hop{item.hopCount > 1 ? 's' : ''}</Text>
            )}
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
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]} numberOfLines={1}>
            {peerDisplayName}
          </Text>
          <View style={styles.e2eBadge}>
            <Text style={styles.e2eIcon}>{isCoordinator ? '🛡️' : '🔒'}</Text>
            <Text style={styles.e2eText}>
              {isCoordinator ? 'On-Site Coordinator • Active Relay' : 'E2E Encrypted • Mesh Direct'}
            </Text>
          </View>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        inverted={false}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={attachLocation} style={styles.attachBtn} activeOpacity={0.7}>
          <Text style={styles.attachIcon}>📍</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Type message to coordinator..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : null]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  backBtn: {
    paddingRight: 14,
    paddingVertical: 4,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
  },
  headerTitleContainer: {
    flex: 1,
  },
  e2eBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  e2eIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  e2eText: {
    fontSize: 11,
    color: Colors.accentGreen,
    fontWeight: '700',
  },

  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 14,
  },
  messageMine: {
    alignItems: 'flex-end',
  },
  messageTheirs: {
    alignItems: 'flex-start',
  },
  senderHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginLeft: 6,
  },

  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageTextTheirs: {
    color: Colors.textPrimary,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  statusIcon: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    marginBottom: Platform.OS === 'ios' ? 12 : 6,
  },
  attachBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});