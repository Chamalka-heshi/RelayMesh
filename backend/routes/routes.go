package routes

import (
	"relaymesh-backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRoutes registers all application routes, middleware, and API endpoints
func SetupRoutes(r *gin.Engine) {
	// Robust CORS configuration for web dashboard and mobile integrations
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowCredentials = false
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Accept", "X-Requested-With"}
	r.Use(cors.New(corsConfig))

	// Core API routes group: /api
	api := r.Group("/api")
	{
		// Health & Diagnostics
		api.GET("/health", controllers.HealthCheckHandler)

		// Operator Authentication
		api.POST("/auth/login", controllers.LoginHandler)
		api.POST("/auth/logout", controllers.LogoutHandler)

		// Command Dashboard Overview
		api.GET("/dashboard/overview", controllers.GetDashboardOverviewHandler)
		api.GET("/dashboard/alerts", controllers.GetDashboardAlertsHandler)

		// Incident Sectors
		api.GET("/incidents", controllers.GetIncidentsHandler)
		api.GET("/incidents/:id", controllers.GetIncidentByIDHandler)

		// Citizen Distress SOS Alerts & Field Mesh Sync
		api.GET("/sos", controllers.GetSOSAlertsHandler)
		api.POST("/sos", controllers.CreateSOSHandler)
		api.POST("/sos/:id/resolve", controllers.ResolveSOSHandler)
		api.POST("/sync/sos", controllers.SyncSOSHandler)

		// Volunteers & Rescuers
		api.GET("/volunteers", controllers.GetVolunteersHandler)
		api.GET("/volunteers/:id/notifications", controllers.GetVolunteerNotificationsHandler)

		// Emergency Logistics & Depots
		api.GET("/resources", controllers.GetResourcesHandler)
		api.POST("/resources", controllers.CreateResourceHandler)
		api.POST("/resources/:id/allocate", controllers.AllocateResourceHandler)

		// Rescuer Dispatches
		api.GET("/dispatch", controllers.GetDispatchAssignmentsHandler)
		api.POST("/dispatch", controllers.CreateDispatchHandler)

		// Activity & Audit Logs
		api.GET("/activity", controllers.GetActivityLogsHandler)

		// Mesh Nodes & Gateways
		api.GET("/nodes", controllers.GetNodesHandler)

		// System Reset Simulation
		api.POST("/system/reset-scenario", controllers.ResetScenarioHandler)

		// Module 2: Spatial Hazard Reporting & Map Tile Server
		api.POST("/hazards", controllers.CreateHazardHandler(nil))
		api.GET("/hazards", controllers.GetHazardsHandler(nil))
		api.POST("/hazards/:id/resolve", controllers.ResolveHazardHandler(nil))
		api.GET("/tiles/bundles", controllers.GetTileBundlesHandler)
		api.GET("/tiles/:region/:z/:x/:y", controllers.GetTileHandler)
	}

	// API v1 compatibility group: /api/v1
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", controllers.HealthCheckHandler)
		v1.GET("/nodes", controllers.GetSampleNodesHandler)
		v1.GET("/tiles/bundles", controllers.GetTileBundlesHandler)
		v1.GET("/tiles/:region/:z/:x/:y", controllers.GetTileHandler)
		v1.GET("/hazards", controllers.GetHazardsHandler(nil))
		v1.POST("/hazards", controllers.CreateHazardHandler(nil))
		v1.POST("/hazards/:id/resolve", controllers.ResolveHazardHandler(nil))
	}
}
