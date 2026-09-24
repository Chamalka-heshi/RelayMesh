package controllers

import (
	"net/http"

	"relaymesh-backend/models"
	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetDispatchAssignmentsHandler returns active and recent rescuer dispatches
func GetDispatchAssignmentsHandler(c *gin.Context) {
	store := services.GetStore()
	dispatches := store.GetDispatchAssignments()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dispatches,
	})
}

// CreateDispatchHandler pairs a volunteer rescuer to a citizen distress beacon
func CreateDispatchHandler(c *gin.Context) {
	var req models.CreateDispatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "sosId and volunteerId are required",
		})
		return
	}

	store := services.GetStore()
	assignment, err := store.CreateDispatch(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create dispatch: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Rescue unit deployed successfully",
		"data":    assignment,
	})
}
