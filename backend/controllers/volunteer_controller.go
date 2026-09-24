package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetVolunteersHandler returns registered rescue volunteers and specialized units
func GetVolunteersHandler(c *gin.Context) {
	status := c.Query("status")
	store := services.GetStore()
	volunteers := store.GetVolunteers(status)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    volunteers,
	})
}

// GetVolunteerNotificationsHandler returns terminal dispatch messages for a specific rescuer
func GetVolunteerNotificationsHandler(c *gin.Context) {
	id := c.Param("id")
	store := services.GetStore()
	assignments := store.GetDispatchAssignments()

	type Notif struct {
		ID        string `json:"id"`
		Title     string `json:"title"`
		Message   string `json:"message"`
		Timestamp string `json:"timestamp"`
	}

	var notifs []Notif
	for _, a := range assignments {
		if strings.Contains(strings.ToLower(a.VolunteerID), strings.ToLower(id)) {
			notifs = append(notifs, Notif{
				ID:        a.ID,
				Title:     "🚨 DISPATCH DIRECTIVE",
				Message:   fmt.Sprintf("Direct command to SOS #%s (Est. %d mins, %.1f km). %s", a.SOSID, a.ETAMinutes, a.DistanceKm, a.MessageSent),
				Timestamp: a.DispatchedAt,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    notifs,
	})
}
