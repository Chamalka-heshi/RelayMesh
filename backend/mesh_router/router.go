package mesh_router

import (
	"fmt"
	"sync"
)

type Router struct {
	NodeID    string
	Peers     map[string]bool // Adjacency list of active connections
	mu        sync.RWMutex
	msgCache  map[string]bool // O(1) lookup cache to prevent infinite routing cycles
}

// NewRouter initializes a fresh mesh node
func NewRouter(nodeID string) *Router {
	return &Router{
		NodeID:   nodeID,
		Peers:    make(map[string]bool),
		msgCache: make(map[string]bool),
	}
}

// ProcessPacket evaluates incoming data, drops it if invalid, or relays it forward.
func (r *Router) ProcessPacket(p Packet) {
	r.mu.Lock()
	defer r.mu.Unlock()

	// 1. Cycle Detection: Have we seen this packet before?
	if r.msgCache[p.ID] {
		return // Silently drop to prevent broadcast storms
	}
	
	// Cache the signature so we don't process it again
	r.msgCache[p.ID] = true

	// 2. Hop Limit Enforcement
	if p.HopCount >= p.MaxHops {
		return // Packet has reached its maximum physical range
	}

	// 3. Increment hop count for the next traversal
	p.HopCount++

	// 4. Relay to adjacent nodes
	r.broadcastToPeers(p)
}

func (r *Router) broadcastToPeers(p Packet) {
	for peerID := range r.Peers {
		// Placeholder: This is where we will eventually write the bytes 
		// down to the BLE/Wi-Fi Direct hardware sockets.
		fmt.Printf("[Node %s] Relaying packet %s -> Peer %s (Hop %d/%d)\n", 
			r.NodeID, p.ID, peerID, p.HopCount, p.MaxHops)
	}
}