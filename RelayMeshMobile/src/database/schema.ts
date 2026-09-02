import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 3,
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
    tableSchema({
      name: 'resources',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
        { name: 'capacity', type: 'number' },
        { name: 'available_capacity', type: 'number' },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'amenities', type: 'string', isOptional: true },
        { name: 'contact_info', type: 'string', isOptional: true },
        { name: 'verified_at', type: 'number', isOptional: true },
        { name: 'last_synced_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'user_profiles',
      columns: [
        { name: 'device_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'role', type: 'string', isIndexed: true }, // 'citizen' | 'volunteer'
        { name: 'public_key', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // --- MODULE 4: HARDWARE BRIDGE & MESH TABLES ---
    tableSchema({
      name: 'mesh_nodes',
      columns: [
        { name: 'node_name', type: 'string' },
        { name: 'dist', type: 'string' },
        { name: 'role', type: 'string', isIndexed: true },
        { name: 'rssi', type: 'string' },
        { name: 'hops', type: 'string' },
        { name: 'node_type', type: 'string' }, // 'rescue' | 'volunteer' | 'citizen' | 'shelter'
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'discovered_peers',
      columns: [
        { name: 'mac_or_uuid', type: 'string', isIndexed: true },
        { name: 'device_name', type: 'string' },
        { name: 'signal_strength', type: 'number' },
        { name: 'last_seen_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'packet_queue',
      columns: [
        { name: 'sender', type: 'string', isIndexed: true },
        { name: 'payload', type: 'string' },
        { name: 'status', type: 'string', isIndexed: true }, // 'pending' | 'relayed' | 'synced'
        { name: 'timestamp', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
  