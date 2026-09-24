package controllers

import (
	"net/http"

	"relaymesh-backend/config"
	"relaymesh-backend/models"
	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetSOSAlertsHandler returns active or filtered citizen distress signals
func GetSOSAlertsHandler(c *gin.Context) {
	status := c.Query("status")
	priority := c.Query("priority")

	store := services.GetStore()
	alerts := store.GetSOSAlerts(status, priority)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    alerts,
	})
}

// CreateSOSHandler allows injecting or receiving citizen distress alerts
func CreateSOSHandler(c *gin.Context) {
	var req models.CreateSOSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid SOS payload: " + err.Error(),
		})
		return
	}

	if req.CitizenName == "" {
		req.CitizenName = "RelayMesh Citizen"
	}
	if req.Priority == "" {
		req.Priority = "CRITICAL"
	}
	if req.HopCount <= 0 {
		req.HopCount = 1
	}

	store := services.GetStore()
	alert := store.CreateSOS(req)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Citizen SOS distress signal successfully registered",
		"data":    alert,
	})
}

// ResolveSOSHandler marks a citizen distress alert as resolved
func ResolveSOSHandler(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "SOS ID is required",
		})
		return
	}

	store := services.GetStore()
	if !store.ResolveSOS(id) {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Distress beacon not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "SOS beacon resolved successfully",
	})
}

// SyncSOSHandler preserves existing mobile mesh bridge endpoint: POST /api/sync/sos
func SyncSOSHandler(c *gin.Context) {
	var payload models.SOSPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	store := services.GetStore()
	store.IngestMeshPacket(payload)

	// If PostGIS database is connected, insert into emergency_alerts table
	if db := config.GetDB(); db != nil {
		query := `
			INSERT INTO emergency_alerts (device_id, triage_tags, location, accuracy, hop_count, status)
			VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, 'ACTIVE')
		`
		_, err := db.Exec(query, payload.DeviceID, payload.TriageTags, payload.Longitude, payload.Latitude, payload.Accuracy, payload.HopCount)
		if err != nil {
			// Ingested into store anyway, log warning
			c.JSON(http.StatusOK, gin.H{
				"status":  "SUCCESS",
				"message": "Emergency SOS ingested (memory standby store active)",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "SUCCESS",
		"message": "Emergency SOS successfully ingested into Central PostGIS & Command Engine",
	})
}

// GetDashboardAlertsHandler preserves existing raw alerts endpoint: GET /api/dashboard/alerts
func GetDashboardAlertsHandler(c *gin.Context) {
	db := config.GetDB()
	if db != nil {
		rows, err := db.Query(`
			SELECT id, device_id, triage_tags, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, status, hop_count, created_at 
			FROM emergency_alerts 
			ORDER BY created_at DESC
			LIMIT 50
		`)
		if err == nil {
			defer rows.Close()
			var alerts []gin.H
			for rows.Next() {
				var id, deviceID, status, createdAt string
				var lon, lat float64
				var hopCount int
				var tags []string

				if err := rows.Scan(&id, &deviceID, &tags, &lon, &lat, &status, &hopCount, &createdAt); err == nil {
					alerts = append(alerts, gin.H{
						"id":          id,
						"device_id":   deviceID,
						"triage_tags": tags,
						"latitude":    lat,
						"longitude":   lon,
						"status":      status,
						"hop_count":   hopCount,
						"created_at":  createdAt,
					})
				}
			}
			if len(alerts) > 0 {
				c.JSON(http.StatusOK, alerts)
				return
			}
		}
	}

	// Fallback to store alerts
	store := services.GetStore()
	alerts := store.GetSOSAlerts("", "")
	var res []gin.H
	for _, a := range alerts {
		res = append(res, gin.H{
			"id":          a.ID,
			"device_id":   a.DeviceID,
			"triage_tags": a.TriageTags,
			"latitude":    a.Latitude,
			"longitude":   a.Longitude,
			"status":      a.Status,
			"hop_count":   a.HopCount,
			"created_at":  a.Timestamp,
		})
	}
	c.JSON(http.StatusOK, res)
}
