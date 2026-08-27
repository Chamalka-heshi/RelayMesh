package controllers

import (
	"net/http"
	"time"

	"relaymesh-backend/config"
	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

// HealthCheckHandler handles /api/v1/health
func HealthCheckHandler(c *gin.Context) {
	db := config.GetDB()
	dbStatus := "CONNECTED"

	if db == nil || db.Ping() != nil {
		dbStatus = "DISCONNECTED"
	}

	response := models.HealthResponse{
		Status:    "ONLINE",
		Database:  dbStatus,
		Timestamp: time.Now(),
	}

	c.JSON(http.StatusOK, response)
}
