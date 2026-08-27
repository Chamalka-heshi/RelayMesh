import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Conversation extends Model {
  static table = 'conversations' // Links to the schema[cite: 2]

  @text('participant_ids') participantIds!: string
  @field('is_group') isGroup!: boolean
  @date('last_message_at') lastMessageAt!: number
  @readonly @date('created_at') createdAt!: number
}