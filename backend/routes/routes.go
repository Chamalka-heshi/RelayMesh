package routes

import (
	"relaymesh-backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRoutes registers all application routes and middleware
func SetupRoutes(r *gin.Engine) {
	// Enable CORS
	r.Use(cors.Default())

	// Root Health check
	r.GET("/api/health", controllers.HealthCheckHandler)

	// API v1 Group
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", controllers.HealthCheckHandler)
		v1.GET("/nodes", controllers.GetSampleNodesHandler)
	}
}
