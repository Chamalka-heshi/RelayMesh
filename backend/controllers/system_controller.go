package controllers

import (
	"net/http"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// ResetScenarioHandler resets demo data back to clean initial disaster baseline
func ResetScenarioHandler(c *gin.Context) {
	store := services.GetStore()
	store.ResetScenario()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Disaster scenario successfully reset to baseline",
	})
}
