import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { mySchema } from './schema'
import Conversation from './Conversation'
import Message from './Message'
import EncryptionKey from './EncryptionKey'

// Create the SQLite adapter
const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: true, // Enables synchronous, high-performance C++ execution
  onSetUpError: error => {
    console.error("Database setup failed", error)
  }
})

// Initialize and export the database
export const database = new Database({
  adapter,
  modelClasses: [
    Conversation,
    Message,
    EncryptionKey,
  ],
})