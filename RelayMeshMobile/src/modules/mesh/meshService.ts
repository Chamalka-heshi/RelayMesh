import { database } from '../../database';
import { MeshNodeModel } from '../../database/models/MeshNodeModel';
import { PacketQueueModel } from '../../database/models/PacketQueueModel';
import { supabase } from '../../services/supabaseClient';

export interface MeshNode {
  id: string;
  name: string;
  dist: string;
  role: string;
  rssi: string;
  hops: string;
  type: 'rescue' | 'volunteer' | 'citizen' | 'shelter';
}

export interface StoredPacket {
  id: string;
  sender: string;
  payload: string;
  timestamp: string;
  status: 'pending' | 'relayed';
}

const INITIAL_NODES: Omit<MeshNode, 'id'>[] = [
  { name: 'Rescue Team Alpha Unit', dist: '45 m away', role: 'Gateway Node', rssi: '-54 dBm', hops: 'Direct', type: 'rescue' },
  { name: 'Volunteer Group Relay #02', dist: '80 m away', role: 'Relay Enabled', rssi: '-68 dBm', hops: 'Direct', type: 'volunteer' },
];

export const MeshService = {
  // --- NODE MANAGEMENT (WatermelonDB) ---
  async getNearbyNodes(): Promise<MeshNode[]> {
    try {
      const nodesCollection = database.collections.get<MeshNodeModel>('mesh_nodes');
      const records = await nodesCollection.query().fetch();

      // Seed initial nodes if database table is completely empty
      if (records.length === 0) {
        await database.write(async () => {
          for (const node of INITIAL_NODES) {
            await nodesCollection.create((r) => {
              r.nodeName = node.name;
              r.dist = node.dist;
              r.role = node.role;
              r.rssi = node.rssi;
              r.hops = node.hops;
              r.nodeType = node.type;
              r.createdAt = new Date();
            });
          }
        });
        const seededRecords = await nodesCollection.query().fetch();
        return seededRecords.map((r) => ({
          id: r.id,
          name: r.nodeName,
          dist: r.dist,
          role: r.role,
          rssi: r.rssi,
          hops: r.hops,
          type: r.nodeType as any,
        }));
      }

      return records.map((r) => ({
        id: r.id,
        name: r.nodeName,
        dist: r.dist,
        role: r.role,
        rssi: r.rssi,
        hops: r.hops,
        type: r.nodeType as any,
      }));
    } catch (e) {
      console.error('Error fetching nodes from WatermelonDB:', e);
      return [];
    }
  },

  async addDiscoveredNode(node: MeshNode): Promise<MeshNode[]> {
    try {
      const nodesCollection = database.collections.get<MeshNodeModel>('mesh_nodes');
      await database.write(async () => {
        await nodesCollection.create((r) => {
          r.nodeName = node.name;
          r.dist = node.dist;
          r.role = node.role;
          r.rssi = node.rssi;
          r.hops = node.hops;
          r.nodeType = node.type;
          r.createdAt = new Date();
        });
      });
      return await this.getNearbyNodes();
    } catch (e) {
      console.error('Error writing node to WatermelonDB:', e);
      return await this.getNearbyNodes();
    }
  },

  // --- PACKET QUEUE MANAGEMENT (WatermelonDB) ---
  async getQueuedPackets(): Promise<StoredPacket[]> {
    try {
      const queueCollection = database.collections.get<PacketQueueModel>('packet_queue');
      const records = await queueCollection.query().fetch();

      return records.map((r) => ({
        id: r.id,
        sender: r.sender,
        payload: r.payload,
        timestamp: r.timestamp,
        status: r.status as any,
      }));
    } catch (e) {
      console.error('Error fetching queued packets from WatermelonDB:', e);
      return [];
    }
  },

  async addPacketToQueue(packet: StoredPacket): Promise<StoredPacket[]> {
    try {
      const queueCollection = database.collections.get<PacketQueueModel>('packet_queue');
      await database.write(async () => {
        await queueCollection.create((r) => {
          r.sender = packet.sender;
          r.payload = packet.payload;
          r.status = packet.status;
          r.timestamp = packet.timestamp;
          r.createdAt = new Date();
        });
      });
      return await this.getQueuedPackets();
    } catch (e) {
      console.error('Error adding packet to WatermelonDB queue:', e);
      return await this.getQueuedPackets();
    }
  },

  async clearQueue(): Promise<void> {
    try {
      const queueCollection = database.collections.get<PacketQueueModel>('packet_queue');
      const records = await queueCollection.query().fetch();
      
      await database.write(async () => {
        for (const record of records) {
          await record.destroyPermanently();
        }
      });
      console.log('Successfully cleared WatermelonDB packet queue.');
    } catch (e) {
      console.error('Error clearing WatermelonDB packet queue:', e);
    }
  },

  // --- SUPABASE CLOUD SYNC (MEMBER 4) ---
  async syncQueueToCloud(): Promise<{ success: boolean; count: number }> {
    const packets = await this.getQueuedPackets();
    console.log('Packets retrieved from WatermelonDB for sync:', packets.length);

    if (packets.length === 0) {
      console.log('No pending packets in local queue to sync.');
      return { success: true, count: 0 };
    }

    try {
      // 1. Format payload for Supabase database table
      const payloadToUpload = packets.map((p) => ({
        sender_node: p.sender,
        payload: p.payload,
        created_at: new Date().toISOString(),
        status: 'synced_to_gateway',
      }));

      // 2. Upload directly to Supabase cloud table
      const { error } = await supabase
        .from('emergency_packets')
        .insert(payloadToUpload);

      if (error) {
        console.error('Supabase Ingestion Failed:', error.message);
        return { success: false, count: 0 };
      }

      console.log('Successfully inserted packets into Supabase cloud table!');

      // 3. Clear WatermelonDB local buffer after confirmed upload
      await this.clearQueue();
      return { success: true, count: packets.length };
    } catch (e) {
      console.error('Network exception during Supabase ingestion:', e);
      return { success: false, count: 0 };
    }
  },
};