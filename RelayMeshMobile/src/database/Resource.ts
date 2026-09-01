import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export type ResourceCategory = 'shelter' | 'medical' | 'water' | 'food' | 'hazard' | 'other';
export type ResourceStatus = 'OPEN' | 'LIMITED' | 'FULL' | 'CLOSED' | 'VERIFIED';

export default class Resource extends Model {
  static table = 'resources';

  @text('name') name!: string;
  @text('title') title!: string;
  @text('category') category!: string;
  @text('description') description?: string;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('capacity') capacity!: number;
  @field('available_capacity') availableCapacity!: number;
  @text('status') status!: string;
  @text('amenities') amenities?: string;
  @text('contact_info') contactInfo?: string;
  @date('verified_at') verifiedAt?: number;
  @date('last_synced_at') lastSyncedAt?: number;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
