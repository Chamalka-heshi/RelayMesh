import { Model } from '@nozbe/watermelondb';
import { field, text, date } from '@nozbe/watermelondb/decorators';

export class MeshNodeModel extends Model {
  static table = 'mesh_nodes';

  @text('node_name') nodeName!: string;
  @text('dist') dist!: string;
  @text('role') role!: string;
  @text('rssi') rssi!: string;
  @text('hops') hops!: string;
  @text('node_type') nodeType!: string;
  @date('created_at') createdAt!: Date;
}