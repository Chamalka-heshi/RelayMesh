import { Model } from '@nozbe/watermelondb';
import { text, date, readonly } from '@nozbe/watermelondb/decorators';

export type UserRole = 'citizen' | 'volunteer';

export default class UserProfile extends Model {
  static table = 'user_profiles';

  @text('device_id') deviceId!: string;
  @text('name') name!: string;
  @text('email') email?: string;
  @text('role') role!: UserRole;
  @text('public_key') publicKey!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
