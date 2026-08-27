package mesh_router

import (
	"encoding/json"
)

// MobileNode wraps our Router to provide a clean JSON interface for React Native
type MobileNode struct {
	router *Router
}

// NewMobileNode initializes the local node instance
func NewMobileNode(nodeID string) *MobileNode {
	return &MobileNode{
		router: NewRouter(nodeID),
	}
}

// RegisterPeer adds a discovered Bluetooth/Wi-Fi peer to the routing table
func (m *MobileNode) RegisterPeer(peerID string) {
	m.router.mu.Lock()
	defer m.router.mu.Unlock()
	m.router.Peers[peerID] = true
}

// HandleIncomingJSONPacket allows React Native to feed raw byte strings 
// received from the hardware layer directly into the Go routing engine
func (m *MobileNode) HandleIncomingJSONPacket(jsonPacketStr string) {
	var p Packet
	err := json.Unmarshal([]byte(jsonPacketStr), &p)
	if err != nil {
		return // Drop malformed packets
	}
	
	// Process through our cycle-detection and TTL graph traversal rules
	m.router.ProcessPacket(p)
}