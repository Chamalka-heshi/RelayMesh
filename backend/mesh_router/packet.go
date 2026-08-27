package mesh_router

// Packet represents a discrete unit of data moving through the mesh network.
type Packet struct {
	ID               string `json:"id"`
	ConversationID   string `json:"conversation_id"`
	SenderID         string `json:"sender_id"`
	EncryptedPayload string `json:"encrypted_payload"`
	HopCount         int    `json:"hop_count"`
	MaxHops          int    `json:"max_hops"` // TTL threshold
	Timestamp        int64  `json:"timestamp"`
}