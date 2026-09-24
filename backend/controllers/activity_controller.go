package controllers

import (
	"net/http"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetActivityLogsHandler returns system event audit logs
func GetActivityLogsHandler(c *gin.Context) {
	store := services.GetStore()
	logs := store.GetActivityLogs()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    logs,
	})
}
