import { Database } from '@nozbe/watermelondb'
import { dbAdapter } from './adapter'
import Conversation from './Conversation'
import Message from './Message'
import EncryptionKey from './EncryptionKey'

// Initialize and export the database
export const database = new Database({
  adapter: dbAdapter,
  modelClasses: [
    Conversation,
    Message,
    EncryptionKey,
  ],
})