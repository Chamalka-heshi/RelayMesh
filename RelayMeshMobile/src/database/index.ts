import { Database } from '@nozbe/watermelondb';
import { dbAdapter } from './adapter';
import Conversation from './Conversation';
import Message from './Message';
import EncryptionKey from './EncryptionKey';
import Resource from './Resource';
import UserProfile from './UserProfile';

import { MeshNodeModel } from './models/MeshNodeModel';
import { DiscoveredPeerModel } from './models/DiscoveredPeerModel';
import { PacketQueueModel } from './models/PacketQueueModel';

// Initialize and export the database
export const database = new Database({
  adapter: dbAdapter,
  modelClasses: [
    Conversation,
    Message,
    EncryptionKey,
    Resource,
    UserProfile,
    MeshNodeModel,
    DiscoveredPeerModel,
    PacketQueueModel,
  ],
});

export {
  Conversation,
  Message,
  EncryptionKey,
  Resource,
  UserProfile,
  MeshNodeModel,
  DiscoveredPeerModel,
  PacketQueueModel,
};

export const seedInitialData = async () => {
  const conversationCollection = database.get<Conversation>('conversations');
  const messageCollection = database.get<Message>('messages');

  // 1. Check if we already have data to prevent duplicate seeding on reload
  const existingConversations = await conversationCollection.query().fetch();
  if (existingConversations.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  console.log("Seeding initial mock data...");

  // 2. Perform a database batch write
  await database.write(async () => {
    // Create a mock P2P conversation
    const demoChat = await conversationCollection.create((conv) => {
      conv.participantIds = JSON.stringify(['local_user_id', 'peer_node_abc']);
      conv.isGroup = false;
      conv.lastMessageAt = Date.now();
    });

    // Create a received message (Delivered via 3 hops)
    await messageCollection.create((msg) => {
      msg.conversationId = demoChat.id;
      msg.senderId = 'peer_node_abc';
      msg.encryptedPayload = 'Are you receiving this over the mesh?';
      msg.status = 'Delivered';
      msg.hopCount = 3;
    });

    // Create a sent message (Relayed via 1 hop)
    await messageCollection.create((msg) => {
      msg.conversationId = demoChat.id;
      msg.senderId = 'local_user_id';
      msg.encryptedPayload = 'Yes, loud and clear! Connection stable.';
      msg.status = 'Relayed';
      msg.hopCount = 1;
    });

    // Create a queued message (Waiting for a peer)
    await messageCollection.create((msg) => {
      msg.conversationId = demoChat.id;
      msg.senderId = 'local_user_id';
      msg.encryptedPayload = 'Sending my coordinates now...';
      msg.status = 'Queued';
      msg.hopCount = 0;
    });
  });

  console.log("Mock data seeded successfully!");
};