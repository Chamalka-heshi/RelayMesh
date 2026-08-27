package models

import "time"

// HealthResponse represents standard health check response
type HealthResponse struct {
	Status    string    `json:"status"`
	Database  string    `json:"database"`
	Timestamp time.Time `json:"timestamp"`
}

// MeshNode represents a sample RelayMesh node entity
type MeshNode struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Status    string    `json:"status"` // e.g. "ACTIVE", "INACTIVE", "RELAYING"
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Battery   int       `json:"battery"` // Percentage (0-100)
	CreatedAt time.Time `json:"created_at"`
}

// ApiResponse standard wrapper for API responses
type ApiResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
