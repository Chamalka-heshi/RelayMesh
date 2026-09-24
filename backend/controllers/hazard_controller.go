package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"relaymesh-backend/config"
	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

var (
	memHazardsMu sync.RWMutex
	memHazards   = []models.Hazard{
		{
			ID:            "hz-101-flood",
			HazardType:    models.HazardTypeFlood,
			Severity:      models.SeverityCritical,
			Description:   "Kelani River north embankment breached near Victoria Bridge. Flood level 1.8m rising.",
			Latitude:      6.9535,
			Longitude:     79.8732,
			RadiusMeters:  250.0,
			ReportedBy:    "MobileNode-Gateway-01",
			HopCount:      1,
			IsResolved:    false,
			Confirmations: 5,
			CreatedAt:     time.Now().Add(-45 * time.Minute),
			UpdatedAt:     time.Now().Add(-10 * time.Minute),
		},
		{
			ID:            "hz-102-roadblock",
			HazardType:    models.HazardTypeRoadblock,
			Severity:      models.SeverityHigh,
			Description:   "Low Line Road submerged with heavy debris and fallen tree blocking emergency vehicles.",
			Latitude:      6.9385,
			Longitude:     79.8650,
			RadiusMeters:  80.0,
			ReportedBy:    "FieldRelay-Alpha",
			HopCount:      2,
			IsResolved:    false,
			Confirmations: 3,
			CreatedAt:     time.Now().Add(-2 * time.Hour),
			UpdatedAt:     time.Now().Add(-30 * time.Minute),
		},
		{
			ID:            "hz-103-downed-powerline",
			HazardType:    models.HazardTypeDownedPowerline,
			Severity:      models.SeverityCritical,
			Description:   "Live 33kV high tension cable down in flood water near Grandpass junction.",
			Latitude:      6.9470,
			Longitude:     79.8710,
			RadiusMeters:  60.0,
			ReportedBy:    "Volunteer-Unit-04",
			HopCount:      1,
			IsResolved:    false,
			Confirmations: 4,
			CreatedAt:     time.Now().Add(-80 * time.Minute),
			UpdatedAt:     time.Now().Add(-15 * time.Minute),
		},
	}
)

// InitHazardTable creates the PostGIS hazards table and spatial index if not existing
func InitHazardTable(db *sql.DB) error {
	if db == nil {
		return nil
	}
	query := `
	CREATE TABLE IF NOT EXISTS hazards (
		id VARCHAR(64) PRIMARY KEY,
		hazard_type VARCHAR(32) NOT NULL,
		severity VARCHAR(16) NOT NULL,
		description TEXT,
		location GEOMETRY(Point, 4326) NOT NULL,
		radius_meters FLOAT DEFAULT 50.0,
		reported_by VARCHAR(64),
		hop_count INT DEFAULT 0,
		is_resolved BOOLEAN DEFAULT FALSE,
		confirmations INT DEFAULT 1,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);
	CREATE INDEX IF NOT EXISTS hazards_geo_idx ON hazards USING GIST(location);
	`
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to initialize hazards PostGIS table: %w", err)
	}
	fmt.Println("🚀 PostGIS Hazards Table & Spatial Index verified successfully!")
	return nil
}

// CreateHazardHandler handles spatial ingestion and deduplication of hazards
func CreateHazardHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.CreateHazardRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
			return
		}

		if req.RadiusMeters <= 0 {
			req.RadiusMeters = 50.0 // Default 50m radius
		}

		currentDB := db
		if currentDB == nil {
			currentDB = config.GetDB()
		}

		newID := fmt.Sprintf("hz-%d-%s", time.Now().Unix(), req.HazardType)
		newHazard := models.Hazard{
			ID:            newID,
			HazardType:    req.HazardType,
			Severity:      req.Severity,
			Description:   req.Description,
			Latitude:      req.Latitude,
			Longitude:     req.Longitude,
			RadiusMeters:  req.RadiusMeters,
			ReportedBy:    req.ReportedBy,
			HopCount:      req.HopCount,
			IsResolved:    false,
			Confirmations: 1,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		// 1. PostGIS Spatial Deduplication & Ingestion (if DB reachable)
		if currentDB != nil && config.IsDBConnected() {
			dedupQuery := `
				SELECT id, confirmations 
				FROM hazards 
				WHERE hazard_type = $1 
				  AND is_resolved = FALSE
				  AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, $4)
				LIMIT 1;
			`
			var existingID string
			var existingConfirmations int
			err := currentDB.QueryRow(dedupQuery, req.HazardType, req.Longitude, req.Latitude, req.RadiusMeters).Scan(&existingID, &existingConfirmations)

			if err == nil && existingID != "" {
				updateQuery := `
					UPDATE hazards 
					SET confirmations = confirmations + 1, updated_at = NOW() 
					WHERE id = $1
					RETURNING confirmations;
				`
				var newConf int
				if err := currentDB.QueryRow(updateQuery, existingID).Scan(&newConf); err == nil {
					memHazardsMu.Lock()
					for i := range memHazards {
						if memHazards[i].ID == existingID {
							memHazards[i].Confirmations = newConf
							memHazards[i].UpdatedAt = time.Now()
							break
						}
					}
					memHazardsMu.Unlock()

					c.JSON(http.StatusOK, gin.H{
						"status":        "DEDUPLICATED",
						"message":       "Nearby matching hazard found. Confirmation score incremented.",
						"hazard_id":     existingID,
						"confirmations": newConf,
					})
					return
				}
			}

			// Insert new record into PostGIS
			insertQuery := `
				INSERT INTO hazards (id, hazard_type, severity, description, location, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at)
				VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, $9, FALSE, 1, NOW(), NOW());
			`
			_, _ = currentDB.Exec(insertQuery, newID, req.HazardType, req.Severity, req.Description, req.Longitude, req.Latitude, req.RadiusMeters, req.ReportedBy, req.HopCount)
		}

		// Store in resilient memory buffer
		memHazardsMu.Lock()
		memHazards = append([]models.Hazard{newHazard}, memHazards...)
		memHazardsMu.Unlock()

		c.JSON(http.StatusCreated, gin.H{
			"status":    "CREATED",
			"message":   "Spatial hazard successfully ingested into Central PostGIS & Command Cache",
			"hazard_id": newID,
		})
	}
}

// GetHazardsHandler queries hazards by viewport bounding box, radius, or recency
func GetHazardsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		currentDB := db
		if currentDB == nil {
			currentDB = config.GetDB()
		}

		if currentDB != nil && config.IsDBConnected() {
			bboxParam := c.Query("bbox")       // minLon,minLat,maxLon,maxLat
			radiusParam := c.Query("radius_km") // e.g. 5
			latParam := c.Query("lat")
			lonParam := c.Query("lon")

			var rows *sql.Rows
			var err error

			if bboxParam != "" {
				parts := strings.Split(bboxParam, ",")
				if len(parts) == 4 {
					minLon, _ := strconv.ParseFloat(parts[0], 64)
					minLat, _ := strconv.ParseFloat(parts[1], 64)
					maxLon, _ := strconv.ParseFloat(parts[2], 64)
					maxLat, _ := strconv.ParseFloat(parts[3], 64)

					query := `
						SELECT id, hazard_type, severity, description, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at
						FROM hazards
						WHERE location && ST_MakeEnvelope($1, $2, $3, $4, 4326)
						  AND is_resolved = FALSE
						ORDER BY created_at DESC;
					`
					rows, err = currentDB.Query(query, minLon, minLat, maxLon, maxLat)
				}
			} else if radiusParam != "" && latParam != "" && lonParam != "" {
				lat, _ := strconv.ParseFloat(latParam, 64)
				lon, _ := strconv.ParseFloat(lonParam, 64)
				radiusKm, _ := strconv.ParseFloat(radiusParam, 64)
				radiusMeters := radiusKm * 1000.0

				query := `
					SELECT id, hazard_type, severity, description, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at
					FROM hazards
					WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
					  AND is_resolved = FALSE
					ORDER BY created_at DESC;
				`
				rows, err = currentDB.Query(query, lon, lat, radiusMeters)
			} else {
				query := `
					SELECT id, hazard_type, severity, description, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at
					FROM hazards
					WHERE is_resolved = FALSE
					ORDER BY created_at DESC
					LIMIT 100;
				`
				rows, err = currentDB.Query(query)
			}

			if err == nil {
				defer rows.Close()
				var hazards []models.Hazard
				for rows.Next() {
					var h models.Hazard
					var desc, reportedBy sql.NullString
					if err := rows.Scan(
						&h.ID,
						&h.HazardType,
						&h.Severity,
						&desc,
						&h.Longitude,
						&h.Latitude,
						&h.RadiusMeters,
						&reportedBy,
						&h.HopCount,
						&h.IsResolved,
						&h.Confirmations,
						&h.CreatedAt,
						&h.UpdatedAt,
					); err == nil {
						h.Description = desc.String
						h.ReportedBy = reportedBy.String
						hazards = append(hazards, h)
					}
				}
				if len(hazards) > 0 {
					c.JSON(http.StatusOK, gin.H{
						"status":  "SUCCESS",
						"count":   len(hazards),
						"hazards": hazards,
					})
					return
				}
			}
		}

		// Fallback to memory store hazards
		memHazardsMu.RLock()
		defer memHazardsMu.RUnlock()

		var activeHazards []models.Hazard
		for _, h := range memHazards {
			if !h.IsResolved {
				activeHazards = append(activeHazards, h)
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "SUCCESS",
			"count":   len(activeHazards),
			"hazards": activeHazards,
		})
	}
}

// ResolveHazardHandler marks an existing hazard as resolved
func ResolveHazardHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Hazard ID is required"})
			return
		}

		currentDB := db
		if currentDB == nil {
			currentDB = config.GetDB()
		}

		if currentDB != nil && config.IsDBConnected() {
			query := `UPDATE hazards SET is_resolved = TRUE, updated_at = NOW() WHERE id = $1;`
			_, _ = currentDB.Exec(query, id)
		}

		memHazardsMu.Lock()
		found := false
		for i := range memHazards {
			if memHazards[i].ID == id {
				memHazards[i].IsResolved = true
				memHazards[i].UpdatedAt = time.Now()
				found = true
				break
			}
		}
		memHazardsMu.Unlock()

		if !found && (currentDB == nil || !config.IsDBConnected()) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Hazard not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":    "RESOLVED",
			"message":   "Hazard marked as resolved",
			"hazard_id": id,
		})
	}
}
