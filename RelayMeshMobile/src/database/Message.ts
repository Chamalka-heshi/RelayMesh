import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Message extends Model {
  static table = 'messages' // Links to the schema[cite: 2]

  @text('conversation_id') conversationId!: string
  @text('sender_id') senderId!: string
  @text('encrypted_payload') encryptedPayload!: string // AES-GCM encrypted content[cite: 2]
  @text('status') status!: string // Queued, Relayed, Delivered[cite: 2]
  @field('hop_count') hopCount!: number // Tracks P2P relay hops[cite: 2]
  @readonly @date('created_at') createdAt!: number
}