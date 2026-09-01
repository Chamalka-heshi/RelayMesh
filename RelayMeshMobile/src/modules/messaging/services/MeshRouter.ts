export interface Packet {
  id: string;
  conversationId: string;
  senderId: string;
  encryptedPayload: string;
  hopCount: number;
  maxHops: number;
  timestamp: number;
}

export class MeshRouter {
  private nodeId: string;
  private peers: Set<string> = new Set();
  private msgCache: Set<string> = new Set(); // Cycle detection (remembers seen packet IDs)

  constructor(nodeId: string) {
    this.nodeId = nodeId;
  }

  // Called when the hardware layer (BLE/Wi-Fi Direct) discovers a new peer
  public registerPeer(peerId: string): void {
    this.peers.add(peerId);
  }

  public removePeer(peerId: string): void {
    this.peers.delete(peerId);
  }

  // Evaluates packets, drops them if invalid, or relays them forward
  public processPacket(packet: Packet): Packet | null {
    // 1. Cycle Detection: Drop if we've already processed this exact packet
    if (this.msgCache.has(packet.id)) {
      return null; // Silently drop to prevent broadcast storms
    }
    this.msgCache.add(packet.id);

    // 2. Hop Limit Enforcement: Drop if maximum physical range is reached
    if (packet.hopCount >= packet.maxHops) {
      return null;
    }

    // 3. Increment hop count for the next traversal
    const relayedPacket: Packet = {
      ...packet,
      hopCount: packet.hopCount + 1,
    };

    // 4. Broadcast to adjacent nodes
    this.broadcastToPeers(relayedPacket);

    return relayedPacket; // Return the valid packet so the UI can save it to WatermelonDB
  }

  private broadcastToPeers(packet: Packet): void {
    this.peers.forEach((peerId) => {
      // NOTE: This is where we will hook up the actual Bluetooth / Wi-Fi Direct TX logic.
      // For now, we simulate the transmission in the console.
      console.log(
        `[Node ${this.nodeId}] Relaying packet ${packet.id} -> Peer ${peerId} (Hop ${packet.hopCount}/${packet.maxHops})`
      );
    });
  }
}

// Export a singleton instance of the router so the whole app uses the same mesh node
export const meshRouter = new MeshRouter('my-local-node-id');