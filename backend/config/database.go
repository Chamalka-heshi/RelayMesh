package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// ConnectDatabase initializes and tests the Supabase PostgreSQL connection
func ConnectDatabase() *sql.DB {
	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		// Fallback to default connection string if not provided in .env
		connStr = "postgresql://postgres.zokiceiwgigauwqqhrnm:RelayMesh002%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	}

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("❌ Database Driver Init Error: %v", err)
	}

	// Connection Pool Settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(10)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Verify Connection
	if err = DB.Ping(); err != nil {
		log.Fatalf("❌ Supabase Connection Failed: %v", err)
	}

	fmt.Println("🚀 Supabase Database Connected Successfully!")
	return DB
}

// GetDB returns the active database instance
func GetDB() *sql.DB {
	return DB
}
