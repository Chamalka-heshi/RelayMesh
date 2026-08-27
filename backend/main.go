package main

import (
	"log"
	"os"

	"relaymesh-backend/config"
	"relaymesh-backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables (.env in current or parent directory)
	_ = godotenv.Load(".env", "../.env")

	// 1. Initialize Supabase Database Connection
	db := config.ConnectDatabase()
	defer db.Close()

	// 2. Initialize Gin Engine
	r := gin.Default()

	// 3. Register Routes
	routes.SetupRoutes(r)

	// 4. Start HTTP Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 RelayMesh Backend Server starting on port %s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}


