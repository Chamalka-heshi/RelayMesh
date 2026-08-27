package controllers

import (
	"net/http"
	"time"

	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

// GetSampleNodesHandler returns a list of mock/sample relay mesh nodes
func GetSampleNodesHandler(c *gin.Context) {
	// Sample node data for demonstration
	sampleNodes := []models.MeshNode{
		{
			ID:        "node-001",
			Name:      "Alpha Gateway",
			Status:    "ACTIVE",
			Latitude:  6.9271,
			Longitude: 79.8612,
			Battery:   95,
			CreatedAt: time.Now(),
		},
		{
			ID:        "node-002",
			Name:      "Beta Repeater",
			Status:    "RELAYING",
			Latitude:  6.9319,
			Longitude: 79.8478,
			Battery:   82,
			CreatedAt: time.Now(),
		},
	}

	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Message: "Sample mesh nodes retrieved successfully",
		Data:    sampleNodes,
	})
}
