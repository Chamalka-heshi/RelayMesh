package main

import (
	"fmt"
	"os"

	"relaymesh-backend/config"
	"relaymesh-backend/controllers"
	"relaymesh-backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Initialize environment configuration
	config.LoadEnv()

	// 2. Initialize PostgreSQL / PostGIS database (resilient non-blocking connection)
	db := config.InitDatabase()
	if db != nil {
		_ = controllers.InitHazardTable(db)
	}

	// 3. Set Gin Mode if configured
	if os.Getenv("GIN_MODE") != "" {
		gin.SetMode(os.Getenv("GIN_MODE"))
	}

	// 4. Create router and configure routes & CORS
	r := gin.Default()
	routes.SetupRoutes(r)

	// 5. Determine listening port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("=======================================================")
	fmt.Println("🛰️  RelayMesh — Central Command & PostGIS Disaster API")
	fmt.Printf("📡  Server active and listening on http://localhost:%s\n", port)
	fmt.Println("=======================================================")

	if err := r.Run(":" + port); err != nil {
		fmt.Printf("❌ Failed to start server: %v\n", err)
	}
}
