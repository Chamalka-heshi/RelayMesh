package controllers

import (
	"net/http"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetIncidentsHandler returns all disaster incident sectors
func GetIncidentsHandler(c *gin.Context) {
	store := services.GetStore()
	incidents := store.GetIncidents()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    incidents,
	})
}

// GetIncidentByIDHandler returns specific incident
func GetIncidentByIDHandler(c *gin.Context) {
	id := c.Param("id")
	store := services.GetStore()
	incident, found := store.GetIncidentByID(id)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Incident not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    incident,
	})
}
