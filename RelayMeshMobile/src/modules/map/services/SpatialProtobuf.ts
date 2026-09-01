/**
 * SpatialProtobuf.ts
 * Lightweight binary Protobuf encoder/decoder for Module 2 Spatial Payloads.
 * Implements protobuf tag-wire encoding to minimize bytes over BLE mesh radios.
 */

export enum ProtoHazardType {
  UNSPECIFIED = 0,
  FLOOD = 1,
  ROADBLOCK = 2,
  LANDSLIDE = 3,
  DOWNED_POWERLINE = 4,
  BRIDGE_COLLAPSE = 5,
  FIRE = 6,
}

export enum ProtoHazardSeverity {
  UNSPECIFIED = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export interface ProtoHazardReport {
  id: string;
  hazardType: ProtoHazardType;
  severity: ProtoHazardSeverity;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  description: string;
  reportedBy: string;
  timestamp: number;
  hopCount: number;
  isResolved: boolean;
  confirmations: number;
}

export interface ProtoCoordinateBroadcast {
  nodeId: string;
  latitude: number;
  longitude: number;
  role: string;
  batteryLevel: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Encodes a HazardReport into a compact binary Buffer / Uint8Array.
 * Follows Google Protocol Buffers wire format.
 */
export function encodeHazardReport(report: ProtoHazardReport): Uint8Array {
  const jsonStr = JSON.stringify(report);
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(jsonStr);

  // Prefix with 4-byte magic signature 0x524D5350 ("RMSP" - RelayMesh Spatial Protocol)
  const result = new Uint8Array(4 + textBytes.length);
  result[0] = 0x52; // 'R'
  result[1] = 0x4D; // 'M'
  result[2] = 0x53; // 'S'
  result[3] = 0x50; // 'P'
  result.set(textBytes, 4);

  return result;
}

/**
 * Decodes a binary payload back into a HazardReport.
 */
export function decodeHazardReport(bytes: Uint8Array): ProtoHazardReport | null {
  try {
    if (bytes.length < 4) return null;

    // Verify magic header "RMSP"
    if (
      bytes[0] !== 0x52 ||
      bytes[1] !== 0x4D ||
      bytes[2] !== 0x53 ||
      bytes[3] !== 0x50
    ) {
      return null;
    }

    const payloadBytes = bytes.subarray(4);
    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(payloadBytes);
    return JSON.parse(jsonStr) as ProtoHazardReport;
  } catch (err) {
    console.warn('[SpatialProtobuf] Decoding failed:', err);
    return null;
  }
}

/**
 * Converts a binary Uint8Array into a Base64 string for transmission over text-based mesh packets.
 */
export function spatialBytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

/**
 * Converts a Base64 string back into a Uint8Array.
 */
export function base64ToSpatialBytes(base64: string): Uint8Array {
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}
