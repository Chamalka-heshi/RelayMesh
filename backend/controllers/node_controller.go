package controllers

import (
	"net/http"

	"relaymesh-backend/services"

	"github.com/gin-gonic/gin"
)

// GetNodesHandler returns the full list of active relay routers, gateways, repeaters and solar towers
func GetNodesHandler(c *gin.Context) {
	store := services.GetStore()
	nodes := store.GetNodes()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    nodes,
	})
}

// GetSampleNodesHandler preserves backward compatibility for /api/v1/nodes
func GetSampleNodesHandler(c *gin.Context) {
	GetNodesHandler(c)
}
