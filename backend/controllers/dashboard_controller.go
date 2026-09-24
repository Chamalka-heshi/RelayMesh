package controllers

import (
	"net/http"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetDashboardOverviewHandler returns full consolidated situational data
func GetDashboardOverviewHandler(c *gin.Context) {
	store := services.GetStore()
	data := store.GetOverview()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}
