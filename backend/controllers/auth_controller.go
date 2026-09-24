package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strings"

	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

// Demo accounts recognized by Central Division Command
var demoAccounts = []models.User{
	{
		ID:          "ADM-002",
		Name:        "Ananya Perera",
		Email:       "dispatcher@relaymesh.org",
		Role:        "Emergency Dispatch Officer",
		Division:    "Central Command - Western Province Unit",
		Badge:       "DP-3120",
		BadgeNumber: "DP-3120",
		Color:       "#3b82f6",
	},
	{
		ID:          "ADM-001",
		Name:        "Cmdr. Sarath Wickramasinghe",
		Email:       "admin@relaymesh.org",
		Role:        "Central Division Director",
		Division:    "National Disaster Management Center (NDMC)",
		Badge:       "DM-9041",
		BadgeNumber: "DM-9041",
		Color:       "#ef4444",
	},
	{
		ID:          "ADM-003",
		Name:        "Capt. Dinesh Fernando",
		Email:       "sar.lead@relaymesh.org",
		Role:        "Search & Rescue Coordinator",
		Division:    "Rapid Response Division",
		Badge:       "SR-7714",
		BadgeNumber: "SR-7714",
		Color:       "#10b981",
	},
}

// LoginHandler verifies operator credentials and issues an authentication session token
func LoginHandler(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.LoginResponse{
			Success: false,
			Error:   "Email and password are required",
		})
		return
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	password := req.Password

	// Check demo accounts
	var matchedUser *models.User
	for _, acc := range demoAccounts {
		if strings.ToLower(acc.Email) == email {
			userCopy := acc
			matchedUser = &userCopy
			break
		}
	}

	// In disaster-response prototype mode, allow standard password "password123"
	// or generate dynamic operator profile if valid email provided with "password123"
	if matchedUser == nil {
		if strings.Contains(email, "@") && password == "password123" {
			matchedUser = &models.User{
				ID:          "OP-" + strings.ToUpper(hex.EncodeToString(randomBytes(3))),
				Name:        "Field Officer (" + strings.Split(email, "@")[0] + ")",
				Email:       email,
				Role:        "Field Operations Officer",
				Division:    "Disaster Relief Operations",
				Badge:       "OP-4001",
				BadgeNumber: "OP-4001",
				Color:       "#3b82f6",
			}
		} else {
			c.JSON(http.StatusUnauthorized, models.LoginResponse{
				Success: false,
				Error:   "Invalid credentials. Please use password 'password123'.",
			})
			return
		}
	} else if password != "password123" && password != "admin" {
		c.JSON(http.StatusUnauthorized, models.LoginResponse{
			Success: false,
			Error:   "Invalid password. Standard demo password is 'password123'.",
		})
		return
	}

	token := "rm_sec_" + hex.EncodeToString(randomBytes(16))

	c.JSON(http.StatusOK, models.LoginResponse{
		Success: true,
		Token:   token,
		User:    matchedUser,
	})
}

// LogoutHandler terminates session
func LogoutHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully logged out from RelayMesh Command",
	})
}

func randomBytes(n int) []byte {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return b
}
