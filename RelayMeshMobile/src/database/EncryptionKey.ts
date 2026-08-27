import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class EncryptionKey extends Model {
  static table = 'encryption_keys' // Links to the schema[cite: 2]

  @text('node_id') nodeId!: string
  @text('public_key') publicKey!: string // Curve25519 public key[cite: 2]
  @text('private_key') privateKey?: string 
  @readonly @date('created_at') createdAt!: number
}