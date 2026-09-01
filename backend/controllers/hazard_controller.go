package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

// InitHazardTable creates the PostGIS hazards table and spatial index if not existing
func InitHazardTable(db *sql.DB) error {
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

		// 1. PostGIS Spatial Deduplication:
		// Check if an active hazard of the same type exists within radius
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
		err := db.QueryRow(dedupQuery, req.HazardType, req.Longitude, req.Latitude, req.RadiusMeters).Scan(&existingID, &existingConfirmations)

		if err == nil && existingID != "" {
			// Increment confirmation count for the existing hazard
			updateQuery := `
				UPDATE hazards 
				SET confirmations = confirmations + 1, updated_at = NOW() 
				WHERE id = $1
				RETURNING confirmations;
			`
			var newConf int
			if err := db.QueryRow(updateQuery, existingID).Scan(&newConf); err == nil {
				c.JSON(http.StatusOK, gin.H{
					"status":        "DEDUPLICATED",
					"message":       "Nearby matching hazard found. Confirmation score incremented.",
					"hazard_id":     existingID,
					"confirmations": newConf,
				})
				return
			}
		}

		// 2. Insert new spatial hazard record
		newID := fmt.Sprintf("hz-%d-%s", time.Now().Unix(), req.HazardType)
		insertQuery := `
			INSERT INTO hazards (id, hazard_type, severity, description, location, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at)
			VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, $9, FALSE, 1, NOW(), NOW());
		`
		_, err = db.Exec(insertQuery, newID, req.HazardType, req.Severity, req.Description, req.Longitude, req.Latitude, req.RadiusMeters, req.ReportedBy, req.HopCount)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert spatial hazard: " + err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"status":    "CREATED",
			"message":   "Spatial hazard successfully ingested into Central PostGIS",
			"hazard_id": newID,
		})
	}
}

// GetHazardsHandler queries hazards by viewport bounding box, radius, or recency
func GetHazardsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		bboxParam := c.Query("bbox")       // minLon,minLat,maxLon,maxLat
		radiusParam := c.Query("radius_km") // e.g. 5
		latParam := c.Query("lat")
		lonParam := c.Query("lon")

		var rows *sql.Rows
		var err error

		if bboxParam != "" {
			// Bounding Box spatial query
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
				rows, err = db.Query(query, minLon, minLat, maxLon, maxLat)
			}
		} else if radiusParam != "" && latParam != "" && lonParam != "" {
			// Radial distance spatial query
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
			rows, err = db.Query(query, lon, lat, radiusMeters)
		} else {
			// Default: recent active hazards
			query := `
				SELECT id, hazard_type, severity, description, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, radius_meters, reported_by, hop_count, is_resolved, confirmations, created_at, updated_at
				FROM hazards
				WHERE is_resolved = FALSE
				ORDER BY created_at DESC
				LIMIT 100;
			`
			rows, err = db.Query(query)
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query PostGIS hazards: " + err.Error()})
			return
		}
		defer rows.Close()

		hazards := []models.Hazard{}
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
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan hazard row: " + err.Error()})
				return
			}
			h.Description = desc.String
			h.ReportedBy = reportedBy.String
			hazards = append(hazards, h)
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "SUCCESS",
			"count":   len(hazards),
			"hazards": hazards,
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

		query := `UPDATE hazards SET is_resolved = TRUE, updated_at = NOW() WHERE id = $1;`
		res, err := db.Exec(query, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve hazard: " + err.Error()})
			return
		}

		rowsAffected, _ := res.RowsAffected()
		if rowsAffected == 0 {
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
