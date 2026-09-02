package models

import "time"

// Hazard types classification
const (
	HazardTypeFlood          = "FLOOD"
	HazardTypeRoadblock      = "ROADBLOCK"
	HazardTypeLandslide      = "LANDSLIDE"
	HazardTypeDownedPowerline = "DOWNED_POWERLINE"
	HazardTypeBridgeCollapse = "BRIDGE_COLLAPSE"
	HazardTypeFire           = "FIRE"
)

// Hazard severity levels
const (
	SeverityLow      = "LOW"
	SeverityMedium   = "MEDIUM"
	SeverityHigh     = "HIGH"
	SeverityCritical = "CRITICAL"
)

// Hazard represents a spatial hazard entity stored in PostGIS
type Hazard struct {
	ID            string    `json:"id"`
	HazardType    string    `json:"hazard_type"`
	Severity      string    `json:"severity"`
	Description   string    `json:"description"`
	Latitude      float64   `json:"latitude"`
	Longitude     float64   `json:"longitude"`
	RadiusMeters  float64   `json:"radius_meters"`
	ReportedBy    string    `json:"reported_by"`
	HopCount      int       `json:"hop_count"`
	IsResolved    bool      `json:"is_resolved"`
	Confirmations int       `json:"confirmations"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CreateHazardRequest is the payload received from field devices/mesh gateways
type CreateHazardRequest struct {
	HazardType   string  `json:"hazard_type" binding:"required"`
	Severity     string  `json:"severity" binding:"required"`
	Description  string  `json:"description"`
	Latitude     float64 `json:"latitude" binding:"required"`
	Longitude    float64 `json:"longitude" binding:"required"`
	RadiusMeters float64 `json:"radius_meters"`
	ReportedBy   string  `json:"reported_by"`
	HopCount     int     `json:"hop_count"`
}

// HazardQueryFilter defines bounding box and spatial query filters
type HazardQueryFilter struct {
	MinLon          float64
	MinLat          float64
	MaxLon          float64
	MaxLat          float64
	HazardType      string
	IncludeResolved bool
}
