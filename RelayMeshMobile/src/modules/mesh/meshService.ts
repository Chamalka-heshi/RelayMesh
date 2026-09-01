import AsyncStorage from '@react-native-async-storage/async-storage';
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

const NODES_KEY = '@relay_mesh_nodes';
const PACKETS_KEY = '@relay_mesh_packets';

const INITIAL_NODES: MeshNode[] = [
  { id: '1', name: 'Rescue Team Alpha Unit', dist: '45 m away', role: 'Gateway Node', rssi: '-54 dBm', hops: 'Direct', type: 'rescue' },
  { id: '2', name: 'Volunteer Group Relay #02', dist: '80 m away', role: 'Relay Enabled', rssi: '-68 dBm', hops: 'Direct', type: 'volunteer' },
];

export const MeshService = {
  // --- NODE MANAGEMENT ---
  async getNearbyNodes(): Promise<MeshNode[]> {
    try {
      const data = await AsyncStorage.getItem(NODES_KEY);
      if (!data) {
        await AsyncStorage.setItem(NODES_KEY, JSON.stringify(INITIAL_NODES));
        return INITIAL_NODES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NODES;
    }
  },

  async addDiscoveredNode(node: MeshNode): Promise<MeshNode[]> {
    const currentNodes = await this.getNearbyNodes();
    const updated = [node, ...currentNodes];
    await AsyncStorage.setItem(NODES_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- PACKET QUEUE MANAGEMENT ---
  async getQueuedPackets(): Promise<StoredPacket[]> {
    try {
      // Checked both keys for backward compatibility
      let data = await AsyncStorage.getItem(PACKETS_KEY);
      if (!data) {
        data = await AsyncStorage.getItem('@mesh_packet_queue');
      }
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async addPacketToQueue(packet: StoredPacket): Promise<StoredPacket[]> {
    const current = await this.getQueuedPackets();
    const updated = [packet, ...current];
    await AsyncStorage.setItem(PACKETS_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem('@mesh_packet_queue', JSON.stringify(updated));
    return updated;
  },

  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(PACKETS_KEY);
    await AsyncStorage.removeItem('@mesh_packet_queue');
  },

  // --- SUPABASE CLOUD SYNC (MEMBER 4) ---
  async syncQueueToCloud(): Promise<{ success: boolean; count: number }> {
    const packets = await this.getQueuedPackets();
    console.log('Packets retrieved for sync:', packets.length);

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

      // 2. Perform direct insertion to Supabase cloud table
      const { error } = await supabase
        .from('emergency_packets')
        .insert(payloadToUpload);

      if (error) {
        console.error('Supabase Ingestion Failed:', error.message);
        return { success: false, count: 0 };
      }

      console.log('Successfully inserted packets into Supabase cloud table!');

      // 3. Clear local buffer only after confirmed cloud receipt
      await this.clearQueue();
      return { success: true, count: packets.length };
    } catch (e) {
      console.error('Network exception during Supabase ingestion:', e);
      return { success: false, count: 0 };
    }
  },
};