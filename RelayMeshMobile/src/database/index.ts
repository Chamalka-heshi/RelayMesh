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