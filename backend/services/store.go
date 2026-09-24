package services

import (
	"fmt"
	"math"
	"strings"
	"sync"
	"time"

	"relaymesh-backend/config"
	"relaymesh-backend/models"
)

type Store struct {
	mu                  sync.RWMutex
	metrics             models.Metrics
	incidents           []models.Incident
	activeEmergencies   []models.Emergency
	rescueTeams         []models.RescueTeam
	sosAlerts           []models.SOSAlert
	volunteers          []models.Volunteer
	resources           []models.Resource
	dispatchAssignments []models.DispatchAssignment
	auditLogs           []models.AuditLog
	mapNodes            []models.MapNode
	networkHealth       models.NetworkHealth
	counter             int64
}

var (
	globalStore *Store
	once        sync.Once
)

func GetStore() *Store {
	once.Do(func() {
		globalStore = &Store{}
		globalStore.ResetScenario()
	})
	return globalStore
}

func (s *Store) ResetScenario() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.metrics = models.Metrics{
		AffectedCitizens:         128,
		CriticalCases:            24,
		ActiveRescueTeams:        18,
		DeployedRescueTeams:      12,
		AvailableRescueTeams:     6,
		RespondingRescueTeams:    7,
		OfflineRescueTeams:       2,
		ActiveSOS:                4,
		ActiveIncidents:          4,
		CriticalIncidents:        2,
		ActiveNodes:              184,
		NetworkAvailability:      91,
		ActiveVolunteers:         47,
		AvailableResources:       126,
		AvailableShelterCapacity: 1240,
	}

	s.activeEmergencies = []models.Emergency{
		{
			ID:             "CASE-RM-1042",
			CaseID:         "CASE #RM-1042",
			Severity:       "CRITICAL",
			Location:       "Colombo Fort",
			LocationName:   "Colombo Fort, Sector 1",
			Affected:       3,
			TimeAgo:        "4 min ago",
			ResponseStatus: "Awaiting response",
			Status:         "ACTIVE",
			Latitude:       6.9320,
			Longitude:      79.8550,
		},
		{
			ID:             "CASE-RM-1039",
			CaseID:         "CASE #RM-1039",
			Severity:       "CRITICAL",
			Location:       "Maradana",
			LocationName:   "Maradana Junction",
			Affected:       6,
			TimeAgo:        "7 min ago",
			ResponseStatus: "Team dispatched",
			Status:         "ACTIVE",
			Latitude:       6.9240,
			Longitude:      79.8700,
		},
		{
			ID:             "CASE-RM-1035",
			CaseID:         "CASE #RM-1035",
			Severity:       "HIGH",
			Location:       "Dematagoda",
			LocationName:   "Dematagoda Cross St",
			Affected:       2,
			TimeAgo:        "11 min ago",
			ResponseStatus: "In progress",
			Status:         "ACTIVE",
			Latitude:       6.9290,
			Longitude:      79.8830,
		},
		{
			ID:             "CASE-RM-1028",
			CaseID:         "CASE #RM-1028",
			Severity:       "HIGH",
			Location:       "Riverside Basin",
			LocationName:   "Kelani Riverside Zone 4",
			Affected:       5,
			TimeAgo:        "15 min ago",
			ResponseStatus: "Team dispatched",
			Status:         "ACTIVE",
			Latitude:       6.9448,
			Longitude:      79.8745,
		},
		{
			ID:             "CASE-RM-1022",
			CaseID:         "CASE #RM-1022",
			Severity:       "MODERATE",
			Location:       "Borella Sector",
			LocationName:   "Borella Cross Road",
			Affected:       2,
			TimeAgo:        "22 min ago",
			ResponseStatus: "En route",
			Status:         "ACTIVE",
			Latitude:       6.9155,
			Longitude:      79.8815,
		},
	}

	s.rescueTeams = []models.RescueTeam{
		{
			ID:         "TEAM-R-07",
			TeamID:     "TEAM R-07",
			Callsign:   "R-07",
			Name:       "Alpha Search & Rescue Unit",
			Status:     "DEPLOYED",
			Location:   "Colombo Fort",
			Members:    4,
			Assignment: "CASE #RM-1042",
			ETA:        "8 min",
			Latitude:   6.9310,
			Longitude:  79.8560,
		},
		{
			ID:         "TEAM-R-02",
			TeamID:     "TEAM R-02",
			Callsign:   "R-02",
			Name:       "Swiftwater Boat Unit Beta",
			Status:     "DEPLOYED",
			Location:   "Riverside Basin",
			Members:    5,
			Assignment: "CASE #RM-1028",
			ETA:        "12 min",
			Latitude:   6.9460,
			Longitude:  79.8760,
		},
		{
			ID:         "TEAM-R-05",
			TeamID:     "TEAM R-05",
			Callsign:   "R-05",
			Name:       "Urban Extraction Team Gamma",
			Status:     "RESPONDING",
			Location:   "Maradana",
			Members:    4,
			Assignment: "CASE #RM-1039",
			ETA:        "5 min",
			Latitude:   6.9230,
			Longitude:  79.8680,
		},
		{
			ID:         "TEAM-R-01",
			TeamID:     "TEAM R-01",
			Callsign:   "R-01",
			Name:       "Trauma Paramedic Delta",
			Status:     "AVAILABLE",
			Location:   "Grandpass Depot",
			Members:    4,
			Assignment: "On Standby",
			ETA:        "Immediate",
			Latitude:   6.9500,
			Longitude:  79.8710,
		},
		{
			ID:         "TEAM-R-03",
			TeamID:     "TEAM R-03",
			Callsign:   "R-03",
			Name:       "First Response Unit Epsilon",
			Status:     "AVAILABLE",
			Location:   "Pettah Base",
			Members:    3,
			Assignment: "On Standby",
			ETA:        "Immediate",
			Latitude:   6.9385,
			Longitude:  79.8735,
		},
		{
			ID:         "TEAM-R-08",
			TeamID:     "TEAM R-08",
			Callsign:   "R-08",
			Name:       "Mobile Communications Team",
			Status:     "AVAILABLE",
			Location:   "Hill Tower Station",
			Members:    4,
			Assignment: "On Standby",
			ETA:        "Immediate",
			Latitude:   6.9200,
			Longitude:  79.8600,
		},
	}

	s.incidents = []models.Incident{
		{
			ID:                 "INC-101",
			Title:              "Flooding — Riverside Area",
			Type:               "FLOOD",
			Severity:           "CRITICAL",
			Area:               "Riverside / Kelani Basin (Colombo North)",
			ActiveSOSCount:     17,
			AffectedPopulation: 86,
			StartedAt:          "09:42 AM",
			Status:             "ACTIVE",
			ActiveResponders:   12,
			CriticalNeed:       "Boat Extraction & Potable Water",
			Description:        "Rapid river bank overflow leading to 1.5m flood level across 4 square kilometers.",
			Latitude:           6.9450,
			Longitude:          79.8750,
		},
		{
			ID:                 "INC-102",
			Title:              "Grandpass Structural Wall Collapse",
			Type:               "STRUCTURAL_COLLAPSE",
			Severity:           "CRITICAL",
			Area:               "Grandpass Junction, Colombo 14",
			ActiveSOSCount:     4,
			AffectedPopulation: 28,
			StartedAt:          "10:15 AM",
			Status:             "ACTIVE",
			ActiveResponders:   8,
			CriticalNeed:       "Heavy Extraction & Trauma Medic",
			Description:        "Commercial perimeter wall collapsed over two residential units.",
			Latitude:           6.9501,
			Longitude:          79.8710,
		},
		{
			ID:                 "INC-103",
			Title:              "Borella Storm Debris & Power Outage",
			Type:               "POWER_OUTAGE",
			Severity:           "HIGH",
			Area:               "Borella Cross Road, Colombo 08",
			ActiveSOSCount:     2,
			AffectedPopulation: 14,
			StartedAt:          "10:30 AM",
			Status:             "ACTIVE",
			ActiveResponders:   5,
			CriticalNeed:       "Emergency Generators",
			Description:        "Fallen trees severed central power lines, blocking emergency ambulances.",
			Latitude:           6.9150,
			Longitude:          79.8820,
		},
		{
			ID:                 "INC-104",
			Title:              "Pettah Market Rooftop Evacuation",
			Type:               "FLOOD",
			Severity:           "MODERATE",
			Area:               "Pettah 5th Cross Street",
			ActiveSOSCount:     1,
			AffectedPopulation: 12,
			StartedAt:          "10:45 AM",
			Status:             "ACTIVE",
			ActiveResponders:   4,
			CriticalNeed:       "Rooftop Extraction & Dry Food",
			Description:        "Citizens isolated on second-floor balcony due to fast rising ground water.",
			Latitude:           6.9385,
			Longitude:          79.8735,
		},
	}

	s.sosAlerts = []models.SOSAlert{
		{
			ID:           "SOS-2026-891",
			CitizenName:  "Nimali Senanayake",
			CitizenPhone: "+94 77 482 9102",
			DeviceID:     "RM-84F2",
			LocationName: "Riverside / Kelani Basin (Zone 4)",
			Latitude:     6.9448,
			Longitude:    79.8745,
			Priority:     "CRITICAL",
			Status:       "ACTIVE",
			HopCount:     2,
			TimeAgo:      "2m ago",
			Timestamp:    "10:42 AM",
			MedicalNeeds: "Elderly citizen requiring oxygen tank & high-water boat extraction",
			IncidentID:   "INC-101",
			TriageTags:   []string{"Trapped in Flood", "Elderly Person", "Medical Aid Needed"},
		},
		{
			ID:           "SOS-2026-892",
			CitizenName:  "Kamal Jayawardena",
			CitizenPhone: "+94 71 839 2041",
			DeviceID:     "RM-21A4",
			LocationName: "Grandpass Junction #45",
			Latitude:     6.9510,
			Longitude:    79.8720,
			Priority:     "CRITICAL",
			Status:       "ACTIVE",
			HopCount:     1,
			TimeAgo:      "5m ago",
			Timestamp:    "10:39 AM",
			MedicalNeeds: "Trapped beneath masonry debris, conscious with leg fracture",
			IncidentID:   "INC-102",
			TriageTags:   []string{"Structural Collapse", "Severe Bleeding"},
		},
		{
			ID:           "SOS-2026-893",
			CitizenName:  "Fathima Rizwan",
			CitizenPhone: "+94 76 991 3820",
			DeviceID:     "RM-91C2",
			LocationName: "Pettah Main Street #112",
			Latitude:     6.9380,
			Longitude:    79.8730,
			Priority:     "HIGH",
			Status:       "ACTIVE",
			HopCount:     3,
			TimeAgo:      "9m ago",
			Timestamp:    "10:35 AM",
			MedicalNeeds: "Infant with fever, isolated on commercial rooftop",
			IncidentID:   "INC-104",
			TriageTags:   []string{"Child in Danger", "Clean Water Exhausted"},
		},
		{
			ID:           "SOS-2026-894",
			CitizenName:  "Sunil Wickramasinghe",
			CitizenPhone: "+94 75 120 4938",
			DeviceID:     "RM-4412",
			LocationName: "Borella Cross Road Sector 2",
			Latitude:     6.9155,
			Longitude:    79.8815,
			Priority:     "MODERATE",
			Status:       "DISPATCHED",
			HopCount:     2,
			TimeAgo:      "14m ago",
			Timestamp:    "10:30 AM",
			MedicalNeeds: "Power out for dialysis device, backup battery needed",
			IncidentID:   "INC-103",
			TriageTags:   []string{"Power Outage / Oxygen Needed"},
		},
		{
			ID:           "SOS-2026-895",
			CitizenName:  "Priyantha De Silva",
			CitizenPhone: "+94 77 334 1928",
			DeviceID:     "RM-6721",
			LocationName: "Kelaniya Temple Road",
			Latitude:     6.9580,
			Longitude:    79.9190,
			Priority:     "LOW",
			Status:       "RESOLVED",
			HopCount:     1,
			TimeAgo:      "28m ago",
			Timestamp:    "10:16 AM",
			MedicalNeeds: "Water purification tablets requested — Delivered",
			IncidentID:   "INC-101",
			TriageTags:   []string{"Clean Water Exhausted"},
		},
	}

	s.volunteers = []models.Volunteer{
		{
			ID:             "VOL-001",
			Name:           "Dr. Alexandra Deff",
			Specialization: "Emergency Trauma & First Aid",
			Status:         "AVAILABLE",
			DeviceID:       "RM-84F2",
			Callsign:       "MEDIC-ALPHA",
			BatteryLevel:   94,
			Location:       "Sector 4 Relief Camp",
			Latitude:       6.9440,
			Longitude:      79.8730,
		},
		{
			ID:             "VOL-002",
			Name:           "Edwin Adenike",
			Specialization: "Boat Extraction & Swift Water Rescue",
			Status:         "AVAILABLE",
			DeviceID:       "RM-21A4",
			Callsign:       "RESCUE-BOAT-1",
			BatteryLevel:   88,
			Location:       "Riverside Marine Base",
			Latitude:       6.9460,
			Longitude:      79.8760,
		},
		{
			ID:             "VOL-003",
			Name:           "Isaac Oluwatemilorun",
			Specialization: "Mesh Infrastructure & RF Repeaters",
			Status:         "AVAILABLE",
			DeviceID:       "RM-91C2",
			Callsign:       "MESH-TECH-1",
			BatteryLevel:   76,
			Location:       "Hill Tower Relay Station",
			Latitude:       6.9200,
			Longitude:      79.8600,
		},
		{
			ID:             "VOL-004",
			Name:           "David Oshodi",
			Specialization: "Relief Logistics & Supply Distribution",
			Status:         "DISPATCHED",
			DeviceID:       "RM-4412",
			Callsign:       "SUPPLY-LEAD",
			BatteryLevel:   92,
			Location:       "Central Supply Depot",
			Latitude:       6.9385,
			Longitude:      79.8735,
		},
		{
			ID:             "VOL-005",
			Name:           "Sanjeewa Kumara",
			Specialization: "Disaster Search & Heavy Extraction",
			Status:         "AVAILABLE",
			DeviceID:       "RM-1109",
			Callsign:       "SEARCH-LEAD",
			BatteryLevel:   85,
			Location:       "Grandpass Depot",
			Latitude:       6.9500,
			Longitude:      79.8710,
		},
	}

	s.resources = []models.Resource{
		{
			ID:            "RES-001",
			Name:          "Central Kelani Community Shelter",
			Category:      "SHELTER",
			Location:      "Pettah Municipal Complex, Colombo 11",
			Coordinates:   "6.9385, 79.8735",
			Available:     82,
			Total:         250,
			Unit:          "Beds",
			Status:        "AVAILABLE",
			Freshness:     "Synced 2m ago via Mesh #RM-84F2",
			Description:   "Designated primary flood evacuation center with emergency power and sanitation facilities.",
			ContactPerson: "K. Bandara (Shelter Coordinator)",
		},
		{
			ID:            "RES-002",
			Name:          "Trauma & First Aid Medical Depot Alpha",
			Category:      "MEDICAL",
			Location:      "Kelani River Relief Base 1, Colombo North",
			Coordinates:   "6.9412, 79.8680",
			Available:     14,
			Total:         50,
			Unit:          "Trauma Kits",
			Status:        "LOW_STOCK",
			Freshness:     "Synced 4m ago via Mesh #RM-21A4",
			Description:   "Critical emergency trauma dressings, saline drip kits, insulin supplies and first-response triage equipment.",
			ContactPerson: "Dr. Alexandra Deff (Lead Medical Responder)",
		},
		{
			ID:            "RES-003",
			Name:          "Potable Water Distribution Point 1",
			Category:      "WATER",
			Location:      "Grandpass Junction, Colombo 14",
			Coordinates:   "6.9501, 79.8710",
			Available:     3200,
			Total:         5000,
			Unit:          "Liters",
			Status:        "AVAILABLE",
			Freshness:     "Synced 6m ago via Mesh #RM-91C2",
			Description:   "Chlorine-treated drinking water distribution bowsers with filtration tanks.",
			ContactPerson: "S. Fernando (Water Operations)",
		},
		{
			ID:            "RES-004",
			Name:          "Emergency Dry Food Rations Depot 2",
			Category:      "FOOD",
			Location:      "Borella Community Center, Colombo 08",
			Coordinates:   "6.9150, 79.8820",
			Available:     480,
			Total:         600,
			Unit:          "Family Packs",
			Status:        "AVAILABLE",
			Freshness:     "Synced 8m ago via Mesh #RM-4412",
			Description:   "3-day emergency ready-to-eat ration packs containing canned protein, biscuits and purification tablets.",
			ContactPerson: "M. Jayawardena (Logistics Lead)",
		},
		{
			ID:            "RES-005",
			Name:          "Solar Generator & Battery Storage Hub",
			Category:      "EQUIPMENT",
			Location:      "Hill Station Tower Relay Station",
			Coordinates:   "6.9200, 79.8600",
			Available:     8,
			Total:         10,
			Unit:          "Generators",
			Status:        "AVAILABLE",
			Freshness:     "Synced 1m ago via Mesh #RM-6721",
			Description:   "Portable solar generators and lithium battery packs maintaining repeater mesh links.",
			ContactPerson: "I. Oluwatemilorun (Mesh Technician)",
		},
		{
			ID:            "RES-006",
			Name:          "Rescue Boat & Lifejacket Marine Depot",
			Category:      "EQUIPMENT",
			Location:      "Riverside Marine Base, Colombo North",
			Coordinates:   "6.9450, 79.8750",
			Available:     6,
			Total:         8,
			Unit:          "Rescue Boats",
			Status:        "AVAILABLE",
			Freshness:     "Synced 3m ago via Mesh #RM-1109",
			Description:   "Inflatable rescue boats (IRB) with outboard engines, ropes and life jackets for flood extraction.",
			ContactPerson: "Edwin Adenike (Rescue Lead)",
		},
	}

	s.dispatchAssignments = []models.DispatchAssignment{
		{
			ID:             "DISP-01",
			SOSID:          "SOS-2026-894",
			VolunteerID:    "VOL-004 (David Oshodi)",
			DispatcherName: "Operator Ananya Perera",
			DispatchedAt:   time.Now().Add(-14 * time.Minute).Format(time.RFC3339),
			DistanceKm:     1.2,
			ETAMinutes:     8,
			Status:         "EN_ROUTE",
			MessageSent:    "Deploying with emergency generator and backup medical battery.",
		},
	}

	s.auditLogs = []models.AuditLog{
		{
			ID:        "LOG-001",
			Timestamp: "10:42 AM",
			TimeAgo:   "2m ago",
			Event:     "New SOS received from RelayMesh node RM-84F2",
			Type:      "SOS_RECEIVED",
			Severity:  "CRITICAL",
			Actor:     "Node RM-84F2",
			EntityID:  "SOS-2026-891",
		},
		{
			ID:        "LOG-002",
			Timestamp: "10:38 AM",
			TimeAgo:   "6m ago",
			Event:     "Mesh node RM-21A4 connected via P2P relay",
			Type:      "NODE_CONNECTED",
			Severity:  "INFO",
			Actor:     "System Router",
			EntityID:  "RM-21A4",
		},
		{
			ID:        "LOG-003",
			Timestamp: "10:34 AM",
			TimeAgo:   "10m ago",
			Event:     "Central Community Shelter capacity updated (168/250 occupied)",
			Type:      "SHELTER_UPDATE",
			Severity:  "SUCCESS",
			Actor:     "Shelter Lead",
			EntityID:  "RES-001",
		},
		{
			ID:        "LOG-004",
			Timestamp: "10:30 AM",
			TimeAgo:   "14m ago",
			Event:     "Responder David Oshodi dispatched to SOS-2026-894",
			Type:      "DISPATCH_ASSIGNED",
			Severity:  "HIGH",
			Actor:     "Operator Ananya Perera",
			EntityID:  "DISP-01",
		},
	}

	s.mapNodes = []models.MapNode{
		{
			ID:              "RM-84F2",
			Name:            "Kelani North Gateway",
			Type:            "GATEWAY",
			Status:          "ONLINE",
			Sector:          "Sector 4 Flood Basin",
			Latitude:        6.9450,
			Longitude:       79.8750,
			MessagesHandled: 482,
			Battery:         100,
			Rssi:            -58,
			Packets:         "48.2k",
		},
		{
			ID:              "RM-21A4",
			Name:            "Kolonnawa Solar Repeater",
			Type:            "RELAY_ROUTER",
			Status:          "ONLINE",
			Sector:          "Kolonnawa Elevated",
			Latitude:        6.9501,
			Longitude:       79.8710,
			MessagesHandled: 236,
			Battery:         91,
			Rssi:            -64,
			Packets:         "23.6k",
		},
		{
			ID:              "RM-91C2",
			Name:            "Sedawatta Mobile Node",
			Type:            "MOBILE_NODE",
			Status:          "ONLINE",
			Sector:          "Sedawatta High Ground",
			Latitude:        6.9380,
			Longitude:       79.8730,
			MessagesHandled: 114,
			Battery:         84,
			Rssi:            -71,
			Packets:         "11.4k",
		},
		{
			ID:              "RM-4412",
			Name:            "Orugodawatta Repeater",
			Type:            "RELAY_ROUTER",
			Status:          "ONLINE",
			Sector:          "Orugodawatta Junction",
			Latitude:        6.9150,
			Longitude:       79.8820,
			MessagesHandled: 198,
			Battery:         78,
			Rssi:            -66,
			Packets:         "19.8k",
		},
		{
			ID:              "RM-6721",
			Name:            "Grandpass Tower Node",
			Type:            "SOLAR_TOWER",
			Status:          "ONLINE",
			Sector:          "Grandpass High Mast",
			Latitude:        6.9200,
			Longitude:       79.8600,
			MessagesHandled: 520,
			Battery:         95,
			Rssi:            -54,
			Packets:         "52.0k",
		},
	}

	s.networkHealth = models.NetworkHealth{
		Status:          "OPERATIONAL",
		ConnectedNodes:  42,
		ActiveLinks:     68,
		CoveragePct:     92,
		OnlineNodes:     184,
		OfflineNodes:    19,
		TotalNodes:      203,
		AvailabilityPct: 91,
		MessagesHourly:  1420,
		LastSync:        "just now",
	}
}

// GetOverview returns consolidated situational data for the Command Dashboard
func (s *Store) GetOverview() models.DashboardOverviewData {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Filter active/dispatched alerts for tactical map
	var mapAlerts []models.SOSAlert
	for _, a := range s.sosAlerts {
		if a.Status == "ACTIVE" || a.Status == "DISPATCHED" {
			mapAlerts = append(mapAlerts, a)
		}
	}

	return models.DashboardOverviewData{
		Metrics:           s.metrics,
		Incidents:         s.incidents,
		ActiveEmergencies: s.activeEmergencies,
		RescueTeams:       s.rescueTeams,
		NetworkHealth:     s.networkHealth,
		Activities:        s.auditLogs,
		MapData: models.MapData{
			Alerts:            mapAlerts,
			ActiveEmergencies: s.activeEmergencies,
			Volunteers:        s.volunteers,
			RescueTeams:       s.rescueTeams,
			Resources:         s.resources,
			Nodes:             s.mapNodes,
		},
	}
}

// Incidents
func (s *Store) GetIncidents() []models.Incident {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]models.Incident, len(s.incidents))
	copy(copied, s.incidents)
	return copied
}

func (s *Store) GetIncidentByID(id string) (*models.Incident, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, inc := range s.incidents {
		if strings.EqualFold(inc.ID, id) {
			return &inc, true
		}
	}
	return nil, false
}

// SOS Alerts
func (s *Store) GetSOSAlerts(status, priority string) []models.SOSAlert {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []models.SOSAlert
	for _, a := range s.sosAlerts {
		if status != "" && status != "ALL" && !strings.EqualFold(a.Status, status) {
			continue
		}
		if priority != "" && priority != "ALL" && !strings.EqualFold(a.Priority, priority) {
			continue
		}
		results = append(results, a)
	}
	return results
}

func (s *Store) CreateSOS(req models.CreateSOSRequest) *models.SOSAlert {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.counter++
	newID := fmt.Sprintf("SOS-2026-%03d", len(s.sosAlerts)+891)

	now := time.Now()
	timeStr := now.Format("03:04 PM")

	medicalNeeds := req.MedicalNeeds
	if medicalNeeds == "" {
		if len(req.TriageTags) > 0 {
			medicalNeeds = fmt.Sprintf("Distress condition: %s. %s", strings.Join(req.TriageTags, ", "), req.Notes)
		} else {
			medicalNeeds = req.Notes
		}
	}

	alert := models.SOSAlert{
		ID:           newID,
		CitizenName:  req.CitizenName,
		CitizenPhone: req.CitizenPhone,
		DeviceID:     req.DeviceId,
		LocationName: req.LocationName,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		Priority:     req.Priority,
		Status:       "ACTIVE",
		HopCount:     req.HopCount,
		TimeAgo:      "Just now",
		Timestamp:    timeStr,
		MedicalNeeds: medicalNeeds,
		TriageTags:   req.TriageTags,
		Notes:        req.Notes,
		IncidentID:   "INC-101",
	}

	s.sosAlerts = append([]models.SOSAlert{alert}, s.sosAlerts...)
	s.metrics.ActiveSOS++
	s.metrics.AffectedCitizens++
	if alert.Priority == "CRITICAL" {
		s.metrics.CriticalCases++
	}

	// Also add corresponding active emergency to the overview
	emergency := models.Emergency{
		ID:             fmt.Sprintf("CASE-RM-%d", 1045+len(s.activeEmergencies)),
		CaseID:         fmt.Sprintf("CASE #RM-%d", 1045+len(s.activeEmergencies)),
		Severity:       alert.Priority,
		Location:       alert.LocationName,
		LocationName:   alert.LocationName,
		Affected:       1,
		TimeAgo:        "Just now",
		ResponseStatus: "Awaiting response",
		Status:         "ACTIVE",
		Latitude:       alert.Latitude,
		Longitude:      alert.Longitude,
	}
	s.activeEmergencies = append([]models.Emergency{emergency}, s.activeEmergencies...)

	// Log audit activity
	s.logActivityLocked(
		"SOS_RECEIVED",
		fmt.Sprintf("Citizen SOS distress received from %s (%s)", alert.CitizenName, alert.LocationName),
		alert.Priority,
		"Relay Gateway "+alert.DeviceID,
		alert.ID,
	)

	// Persist to PostgreSQL / PostGIS if database is connected
	if db := config.GetDB(); db != nil {
		go func(a models.SOSAlert) {
			query := `
				INSERT INTO emergency_alerts (device_id, triage_tags, location, accuracy, hop_count, status)
				VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), 5.0, $5, 'ACTIVE');
			`
			_, _ = db.Exec(query, a.DeviceID, a.TriageTags, a.Longitude, a.Latitude, a.HopCount)
		}(alert)
	}

	return &alert
}

func (s *Store) ResolveSOS(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	found := false
	for i := range s.sosAlerts {
		if strings.EqualFold(s.sosAlerts[i].ID, id) {
			s.sosAlerts[i].Status = "RESOLVED"
			found = true
			break
		}
	}

	if found {
		// Update active emergencies
		for i := range s.activeEmergencies {
			if strings.EqualFold(s.activeEmergencies[i].ID, id) {
				s.activeEmergencies[i].Status = "RESOLVED"
				s.activeEmergencies[i].ResponseStatus = "Resolved"
			}
		}

		activeCount := 0
		for _, a := range s.sosAlerts {
			if a.Status == "ACTIVE" {
				activeCount++
			}
		}
		s.metrics.ActiveSOS = activeCount

		s.logActivityLocked(
			"SOS_RESOLVED",
			fmt.Sprintf("Distress Beacon #%s resolved and marked safe", id),
			"SUCCESS",
			"Dispatcher Command Console",
			id,
		)

		if db := config.GetDB(); db != nil {
			go func(sosID string) {
				_, _ = db.Exec("UPDATE emergency_alerts SET status = 'RESOLVED' WHERE id::text = $1 OR device_id = $1", sosID)
			}(id)
		}
	}

	return found
}

// Ingest from field relay / mesh packet
func (s *Store) IngestMeshPacket(p models.SOSPayload) {
	s.CreateSOS(models.CreateSOSRequest{
		CitizenName:  "RelayMesh Citizen",
		CitizenPhone: "Mesh Encrypted",
		DeviceId:     p.DeviceID,
		LocationName: fmt.Sprintf("Sector Coord [%.4f, %.4f]", p.Latitude, p.Longitude),
		Latitude:     p.Latitude,
		Longitude:    p.Longitude,
		Priority:     "CRITICAL",
		HopCount:     p.HopCount,
		TriageTags:   p.TriageTags,
		Notes:        "Multi-hop Bluetooth Low Energy & Wi-Fi Direct packet",
	})
}

// Volunteers
func (s *Store) GetVolunteers(status string) []models.Volunteer {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []models.Volunteer
	for _, v := range s.volunteers {
		if status != "" && status != "ALL" && !strings.EqualFold(v.Status, status) {
			continue
		}
		results = append(results, v)
	}
	return results
}

// Resources
func (s *Store) GetResources() []models.Resource {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]models.Resource, len(s.resources))
	copy(copied, s.resources)
	return copied
}

func (s *Store) AddResource(req models.Resource) *models.Resource {
	s.mu.Lock()
	defer s.mu.Unlock()

	newID := fmt.Sprintf("RES-%03d", len(s.resources)+1)
	req.ID = newID
	if req.Status == "" {
		req.Status = "AVAILABLE"
	}
	if req.Freshness == "" {
		req.Freshness = "Just registered via Central Console"
	}

	s.resources = append([]models.Resource{req}, s.resources...)
	s.metrics.AvailableResources++

	s.logActivityLocked(
		"RESOURCE_REGISTERED",
		fmt.Sprintf("Emergency Depot '%s' registered in %s", req.Name, req.Location),
		"INFO",
		"Central Supply Logistics",
		newID,
	)

	return &req
}

func (s *Store) AllocateResource(id string, amount int, targetSector string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.resources {
		if strings.EqualFold(s.resources[i].ID, id) {
			r := &s.resources[i]
			deduct := amount
			if deduct > r.Available {
				deduct = r.Available
			}
			r.Available -= deduct
			if r.Total > 0 && float64(r.Available)/float64(r.Total) < 0.25 {
				r.Status = "LOW_STOCK"
			}
			r.Freshness = "Dispatched allocation just now"

			s.logActivityLocked(
				"STOCK_ALLOCATED",
				fmt.Sprintf("Dispatched %d %s from '%s' to %s", deduct, r.Unit, r.Name, targetSector),
				"SUCCESS",
				"Dispatcher Command Console",
				r.ID,
			)
			return true
		}
	}
	return false
}

// Dispatch
func (s *Store) GetDispatchAssignments() []models.DispatchAssignment {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]models.DispatchAssignment, len(s.dispatchAssignments))
	copy(copied, s.dispatchAssignments)
	return copied
}

func (s *Store) CreateDispatch(req models.CreateDispatchRequest) (*models.DispatchAssignment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var targetSOS *models.SOSAlert
	for i := range s.sosAlerts {
		if strings.EqualFold(s.sosAlerts[i].ID, req.SOSID) {
			s.sosAlerts[i].Status = "DISPATCHED"
			targetSOS = &s.sosAlerts[i]
			break
		}
	}

	var targetVol *models.Volunteer
	for i := range s.volunteers {
		if strings.EqualFold(s.volunteers[i].ID, req.VolunteerID) || strings.Contains(req.VolunteerID, s.volunteers[i].ID) {
			s.volunteers[i].Status = "DISPATCHED"
			targetVol = &s.volunteers[i]
			break
		}
	}

	// Calculate distance and ETA
	distKm := 1.4
	etaMins := 8
	if targetSOS != nil && targetVol != nil {
		distKm = calculateHaversineDistance(targetVol.Latitude, targetVol.Longitude, targetSOS.Latitude, targetSOS.Longitude)
		etaMins = int(math.Max(4, math.Round(distKm*5)))
	}

	volLabel := req.VolunteerID
	if targetVol != nil {
		volLabel = fmt.Sprintf("%s (%s)", targetVol.Name, targetVol.Callsign)
	}

	assignmentID := fmt.Sprintf("DISP-%02d", len(s.dispatchAssignments)+1)
	newAssignment := models.DispatchAssignment{
		ID:             assignmentID,
		SOSID:          req.SOSID,
		VolunteerID:    volLabel,
		DispatcherName: "Operator Ananya Perera",
		DispatchedAt:   time.Now().Format(time.RFC3339),
		DistanceKm:     math.Round(distKm*10) / 10,
		ETAMinutes:     etaMins,
		Status:         "EN_ROUTE",
		MessageSent:    req.Instructions,
	}

	if newAssignment.MessageSent == "" {
		newAssignment.MessageSent = "Dispatched for immediate emergency assistance and victim extraction."
	}

	s.dispatchAssignments = append([]models.DispatchAssignment{newAssignment}, s.dispatchAssignments...)

	s.logActivityLocked(
		"DISPATCH_CONFIRMED",
		fmt.Sprintf("Rescuer %s dispatched to distress Beacon #%s", volLabel, req.SOSID),
		"HIGH",
		"Operator Ananya Perera",
		assignmentID,
	)

	return &newAssignment, nil
}

// Activity / Logs
func (s *Store) GetActivityLogs() []models.AuditLog {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]models.AuditLog, len(s.auditLogs))
	copy(copied, s.auditLogs)
	return copied
}

func (s *Store) logActivityLocked(actionType, event, severity, actor, entityID string) {
	newID := fmt.Sprintf("LOG-%03d", len(s.auditLogs)+1)
	newLog := models.AuditLog{
		ID:        newID,
		Timestamp: time.Now().Format("03:04 PM"),
		TimeAgo:   "Just now",
		Event:     event,
		Type:      actionType,
		Severity:  severity,
		Actor:     actor,
		EntityID:  entityID,
	}
	s.auditLogs = append([]models.AuditLog{newLog}, s.auditLogs...)
}

func (s *Store) LogActivity(actionType, event, severity, actor, entityID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.logActivityLocked(actionType, event, severity, actor, entityID)
}

// Nodes
func (s *Store) GetNodes() []models.MapNode {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copied := make([]models.MapNode, len(s.mapNodes))
	copy(copied, s.mapNodes)
	return copied
}

// Haversine formula to compute great-circle distance between two GPS coordinates in Kilometers
func calculateHaversineDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadiusKm = 6371.0

	dLat := (lat2 - lat1) * (math.Pi / 180.0)
	dLon := (lon2 - lon1) * (math.Pi / 180.0)

	rLat1 := lat1 * (math.Pi / 180.0)
	rLat2 := lat2 * (math.Pi / 180.0)

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(rLat1)*math.Cos(rLat2)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return earthRadiusKm * c
}
