// WatermelonDB Schema Definition for RelayMesh Offline Storage

export const tableNames = {
  NODES: 'mesh_nodes',
  MESSAGES: 'messages',
  SOS_ALERTS: 'sos_alerts',
  RESOURCES: 'resources',
} as const;

export interface NodeSchema {
  id: string;
  name: string;
  status: 'ACTIVE' | 'RELAYING' | 'INACTIVE';
  latitude: number;
  longitude: number;
  battery: number;
  created_at: number;
  updated_at: number;
}

export interface MessageSchema {
  id: string;
  sender_id: string;
  recipient_id?: string; // null for broadcast
  content: string;
  hop_count: number;
  timestamp: number;
  is_delivered: boolean;
}

export interface SosAlertSchema {
  id: string;
  sender_id: string;
  emergency_type: 'MEDICAL' | 'FIRE' | 'FLOOD' | 'GENERAL';
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'RESOLVED' | 'FORWARDED';
  timestamp: number;
}

export interface ResourceSchema {
  id: string;
  title: string;
  category: 'SHELTER' | 'WATER' | 'FOOD' | 'MEDICAL';
  quantity: number;
  latitude: number;
  longitude: number;
  contact: string;
  updated_at: number;
}
