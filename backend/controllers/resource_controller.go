package controllers

import (
	"net/http"

	"relaymesh-backend/models"
	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetResourcesHandler returns emergency supplies and shelters
func GetResourcesHandler(c *gin.Context) {
	store := services.GetStore()
	resources := store.GetResources()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resources,
	})
}

// CreateResourceHandler registers a new depot or shelter
func CreateResourceHandler(c *gin.Context) {
	var req models.Resource
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid resource data: " + err.Error(),
		})
		return
	}

	if req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Resource name is required",
		})
		return
	}

	store := services.GetStore()
	created := store.AddResource(req)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Resource depot registered successfully",
		"data":    created,
	})
}

// AllocateResourceHandler dispatches stock to emergency sectors
func AllocateResourceHandler(c *gin.Context) {
	id := c.Param("id")
	var req models.AllocateResourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid allocation payload: " + err.Error(),
		})
		return
	}

	if req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Allocation amount must be greater than zero",
		})
		return
	}

	store := services.GetStore()
	if !store.AllocateResource(id, req.Amount, req.TargetSector) {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Resource not found or insufficient stock",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Resource allocation confirmed and dispatched",
	})
}
