import { Model } from '@nozbe/watermelondb';
import { text, field, date } from '@nozbe/watermelondb/decorators';

export class DiscoveredPeerModel extends Model {
  static table = 'discovered_peers';

  @text('mac_or_uuid') macOrUuid!: string;
  @text('device_name') deviceName!: string;
  @field('signal_strength') signalStrength!: number;
  @date('last_seen_at') lastSeenAt!: Date;
}