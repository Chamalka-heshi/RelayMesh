import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Default initial data for fresh app installs
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
      const data = await AsyncStorage.getItem(PACKETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async addPacketToQueue(packet: StoredPacket): Promise<StoredPacket[]> {
    const current = await this.getQueuedPackets();
    const updated = [packet, ...current];
    await AsyncStorage.setItem(PACKETS_KEY, JSON.stringify(updated));
    return updated;
  },

  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(PACKETS_KEY);
  },
};