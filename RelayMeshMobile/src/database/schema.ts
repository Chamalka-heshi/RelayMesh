import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'conversations',
      columns: [
        { name: 'participant_ids', type: 'string' }, // Array of Node IDs (Stringified)
        { name: 'is_group', type: 'boolean' },
        { name: 'last_message_at', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'conversation_id', type: 'string', isIndexed: true },
        { name: 'sender_id', type: 'string' },
        { name: 'encrypted_payload', type: 'string' }, // AES-GCM encrypted content[cite: 2]
        { name: 'status', type: 'string' }, // e.g., 'Queued', 'Relayed', 'Delivered'[cite: 2]
        { name: 'hop_count', type: 'number' }, // Tracks P2P relay hops[cite: 2]
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'encryption_keys',
      columns: [
        { name: 'node_id', type: 'string', isIndexed: true },
        { name: 'public_key', type: 'string' }, // Curve25519 public key[cite: 2]
        { name: 'private_key', type: 'string', isOptional: true }, // Current user's private key
        { name: 'created_at', type: 'number' },
      ]
    }),
  ]
})