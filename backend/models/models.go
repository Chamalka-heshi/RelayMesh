package models

import "time"

// HealthResponse represents standard health check response
type HealthResponse struct {
	Status    string    `json:"status"`
	Database  string    `json:"database"`
	Mode      string    `json:"mode,omitempty"`
	Project   string    `json:"project"`
	Version   string    `json:"version,omitempty"`
	Timestamp time.Time `json:"timestamp"`
}

// User represents an authenticated operator in the Command Dashboard
type User struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Role        string `json:"role"`
	Division    string `json:"division"`
	Badge       string `json:"badge,omitempty"`
	BadgeNumber string `json:"badgeNumber,omitempty"`
	Color       string `json:"color,omitempty"`
}

// LoginRequest defines credentials payload
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse defines successful authentication payload
type LoginResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token,omitempty"`
	User    *User  `json:"user,omitempty"`
	Error   string `json:"error,omitempty"`
}

// Metrics captures situational metrics for the command dashboard
type Metrics struct {
	AffectedCitizens         int `json:"affectedCitizens"`
	CriticalCases            int `json:"criticalCases"`
	ActiveRescueTeams        int `json:"activeRescueTeams"`
	DeployedRescueTeams      int `json:"deployedRescueTeams"`
	AvailableRescueTeams     int `json:"availableRescueTeams"`
	RespondingRescueTeams    int `json:"respondingRescueTeams"`
	OfflineRescueTeams       int `json:"offlineRescueTeams"`
	ActiveSOS                int `json:"activeSOS"`
	ActiveIncidents          int `json:"activeIncidents"`
	CriticalIncidents        int `json:"criticalIncidents"`
	ActiveNodes              int `json:"activeNodes"`
	NetworkAvailability      int `json:"networkAvailability"`
	ActiveVolunteers         int `json:"activeVolunteers"`
	AvailableResources       int `json:"availableResources"`
	AvailableShelterCapacity int `json:"availableShelterCapacity"`
}

// Incident represents a macro disaster event sector (e.g. Flooding, Collapse)
type Incident struct {
	ID                 string  `json:"id"`
	Title              string  `json:"title"`
	Type               string  `json:"type"`
	Severity           string  `json:"severity"`
	Area               string  `json:"area"`
	ActiveSOSCount     int     `json:"activeSOSCount"`
	AffectedPopulation int     `json:"affectedPopulation"`
	StartedAt          string  `json:"startedAt"`
	Status             string  `json:"status"`
	ActiveResponders   int     `json:"activeResponders"`
	CriticalNeed       string  `json:"criticalNeed"`
	Description        string  `json:"description"`
	Latitude           float64 `json:"latitude"`
	Longitude          float64 `json:"longitude"`
}

// Emergency represents an urgent rescue case in the situational overview
type Emergency struct {
	ID             string  `json:"id"`
	CaseID         string  `json:"caseId"`
	Severity       string  `json:"severity"`
	Location       string  `json:"location"`
	LocationName   string  `json:"locationName"`
	Affected       int     `json:"affected"`
	TimeAgo        string  `json:"timeAgo"`
	ResponseStatus string  `json:"responseStatus"`
	Status         string  `json:"status"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
}

// RescueTeam represents a deployed search & rescue unit
type RescueTeam struct {
	ID         string  `json:"id"`
	TeamID     string  `json:"teamId"`
	Callsign   string  `json:"callsign"`
	Name       string  `json:"name"`
	Status     string  `json:"status"`
	Location   string  `json:"location"`
	Members    int     `json:"members"`
	Assignment string  `json:"assignment"`
	ETA        string  `json:"eta"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
}

// NetworkHealth details mesh radio connectivity
type NetworkHealth struct {
	Status          string `json:"status"`
	ConnectedNodes  int    `json:"connectedNodes"`
	ActiveLinks     int    `json:"activeLinks"`
	CoveragePct     int    `json:"coveragePct"`
	OnlineNodes     int    `json:"onlineNodes"`
	OfflineNodes    int    `json:"offlineNodes"`
	TotalNodes      int    `json:"totalNodes"`
	AvailabilityPct int    `json:"availabilityPct"`
	MessagesHourly  int    `json:"messagesHourly"`
	LastSync        string `json:"lastSync"`
}

// SOSAlert represents a distress beacon emitted by a citizen device
type SOSAlert struct {
	ID           string   `json:"id"`
	CitizenName  string   `json:"citizenName"`
	CitizenPhone string   `json:"citizenPhone"`
	DeviceID     string   `json:"deviceId"`
	LocationName string   `json:"locationName"`
	Latitude     float64  `json:"latitude"`
	Longitude    float64  `json:"longitude"`
	Priority     string   `json:"priority"` // CRITICAL, HIGH, MODERATE, LOW
	Status       string   `json:"status"`   // ACTIVE, DISPATCHED, RESOLVED
	HopCount     int      `json:"hopCount"`
	TimeAgo      string   `json:"timeAgo"`
	Timestamp    string   `json:"timestamp"`
	MedicalNeeds string   `json:"medicalNeeds"`
	IncidentID   string   `json:"incidentId,omitempty"`
	TriageTags   []string `json:"triageTags,omitempty"`
	Notes        string   `json:"notes,omitempty"`
}

// CreateSOSRequest payload when simulating or dispatching SOS
type CreateSOSRequest struct {
	CitizenName  string   `json:"citizenName"`
	CitizenPhone string   `json:"citizenPhone"`
	LocationName string   `json:"locationName"`
	Latitude     float64  `json:"latitude"`
	Longitude    float64  `json:"longitude"`
	Priority     string   `json:"priority"`
	HopCount     int      `json:"hopCount"`
	TriageTags   []string `json:"triageTags"`
	Notes        string   `json:"notes"`
	MedicalNeeds string   `json:"medicalNeeds"`
	DeviceId     string   `json:"deviceId"`
}

// SOSPayload represents raw mesh packet from mobile/field relay
type SOSPayload struct {
	DeviceID   string   `json:"device_id"`
	TriageTags []string `json:"triage_tags"`
	Latitude   float64  `json:"latitude"`
	Longitude  float64  `json:"longitude"`
	Accuracy   float64  `json:"accuracy"`
	HopCount   int      `json:"hop_count"`
}

// Volunteer represents a registered field volunteer / rescuer
type Volunteer struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	Specialization string  `json:"specialization"`
	Status         string  `json:"status"` // AVAILABLE, DISPATCHED, STANDBY, BUSY
	DeviceID       string  `json:"deviceId"`
	Callsign       string  `json:"callsign"`
	BatteryLevel   int     `json:"batteryLevel"`
	Location       string  `json:"location"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
}

// Resource represents emergency depot supplies / shelters
type Resource struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Category      string `json:"category"` // SHELTER, MEDICAL, WATER, FOOD, EQUIPMENT
	Location      string `json:"location"`
	Coordinates   string `json:"coordinates"`
	Available     int    `json:"available"`
	Total         int    `json:"total"`
	Unit          string `json:"unit"`
	Status        string `json:"status"` // AVAILABLE, LOW_STOCK, DEPLETED
	Freshness     string `json:"freshness"`
	Description   string `json:"description"`
	ContactPerson string `json:"contactPerson"`
}

// AllocateResourceRequest payload for resource allocation
type AllocateResourceRequest struct {
	Amount       int    `json:"amount" binding:"required"`
	TargetSector string `json:"targetSector"`
}

// DispatchAssignment records an active or completed rescuer dispatch
type DispatchAssignment struct {
	ID             string  `json:"id"`
	SOSID          string  `json:"sosId"`
	VolunteerID    string  `json:"volunteerId"`
	DispatcherName string  `json:"dispatcherName"`
	DispatchedAt   string  `json:"dispatchedAt"`
	DistanceKm     float64 `json:"distanceKm"`
	ETAMinutes     int     `json:"etaMinutes"`
	Status         string  `json:"status"` // EN_ROUTE, ARRIVED, COMPLETED
	MessageSent    string  `json:"messageSent"`
}

// CreateDispatchRequest payload for dispatching a volunteer to an SOS
type CreateDispatchRequest struct {
	SOSID        string `json:"sosId" binding:"required"`
	VolunteerID  string `json:"volunteerId" binding:"required"`
	Instructions string `json:"instructions"`
}

// AuditLog represents an immutable timestamped system action log
type AuditLog struct {
	ID        string `json:"id"`
	Timestamp string `json:"timestamp"`
	TimeAgo   string `json:"timeAgo"`
	Event     string `json:"event"`
	Type      string `json:"type"`
	Severity  string `json:"severity"` // CRITICAL, HIGH, SUCCESS, INFO, MODERATE
	Actor     string `json:"actor"`
	EntityID  string `json:"entityId,omitempty"`
}

// MapNode represents a physical mesh router, gateway or repeater
type MapNode struct {
	ID              string  `json:"id"`
	Name            string  `json:"name,omitempty"`
	Type            string  `json:"type"` // GATEWAY, RELAY_ROUTER, MOBILE_NODE, SOLAR_TOWER, REPEATER
	Status          string  `json:"status"`
	Sector          string  `json:"sector,omitempty"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	MessagesHandled int     `json:"messagesHandled"`
	Battery         int     `json:"battery"`
	Rssi            int     `json:"rssi,omitempty"`
	Packets         string  `json:"packets,omitempty"`
}

// MapData aggregate payload for tactical and situational maps
type MapData struct {
	Alerts            []SOSAlert   `json:"alerts"`
	ActiveEmergencies []Emergency  `json:"activeEmergencies"`
	Volunteers        []Volunteer  `json:"volunteers"`
	RescueTeams       []RescueTeam `json:"rescueTeams"`
	Resources         []Resource   `json:"resources"`
	Nodes             []MapNode    `json:"nodes"`
}

// DashboardOverviewData is the complete payload for GET /api/dashboard/overview
type DashboardOverviewData struct {
	Metrics           Metrics       `json:"metrics"`
	Incidents         []Incident    `json:"incidents"`
	ActiveEmergencies []Emergency   `json:"activeEmergencies"`
	RescueTeams       []RescueTeam  `json:"rescueTeams"`
	NetworkHealth     NetworkHealth `json:"networkHealth"`
	Activities        []AuditLog    `json:"activities"`
	MapData           MapData       `json:"mapData"`
}

// MeshNode represents a sample RelayMesh node entity (for backwards compatibility)
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
