import { Database } from '@nozbe/watermelondb';
import { dbAdapter } from './adapter';
import Conversation from './Conversation';
import Message from './Message';
import EncryptionKey from './EncryptionKey';
import Resource from './Resource';
import UserProfile from './UserProfile';

// Initialize and export the database
export const database = new Database({
  adapter: dbAdapter,
  modelClasses: [
    Conversation,
    Message,
    EncryptionKey,
    Resource,
    UserProfile,
  ],
});

export {
  Conversation,
  Message,
  EncryptionKey,
  Resource,
  UserProfile,
};