package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	// Load .env from current directory or root directory
	_ = godotenv.Load(".env", "../.env")

	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		connStr = "postgresql://postgres.zokiceiwgigauwqqhrnm:RelayMesh002%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("❌ DB Init Error: ", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("❌ Supabase Connection Failed: ", err)
	}

	fmt.Println("🚀 Supabase Database Connected Successfully!")

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "ONLINE",
			"database": "CONNECTED",
		})
	})

	log.Printf("Server starting on port %s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server run failed: ", err)
	}
}

