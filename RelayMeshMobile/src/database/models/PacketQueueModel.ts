import { Model } from '@nozbe/watermelondb';
import { text, date } from '@nozbe/watermelondb/decorators';

export class PacketQueueModel extends Model {
  static table = 'packet_queue';

  @text('sender') sender!: string;
  @text('payload') payload!: string;
  @text('status') status!: string;
  @text('timestamp') timestamp!: string;
  @date('created_at') createdAt!: Date;
}