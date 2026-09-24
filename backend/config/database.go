package config

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	_ "github.com/lib/pq"
)

var (
	DB      *sql.DB
	dbMu    sync.RWMutex
	connStr string
)

// InitDatabase initializes the database connection.
// If the remote PostgreSQL / Supabase instance is unreachable (e.g. paused free-tier project),
// it logs an actionable notice, starts a background reconnect worker, and returns nil so the
// application can continue operating in high-reliability standby mode without crashing.
func InitDatabase() *sql.DB {
	LoadEnv()

	connStr = os.Getenv("DB_URL")
	if connStr == "" {
		connStr = "postgresql://postgres.zokiceiwgigauwqqhrnm:RelayMesh002%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
	}

	db, err := attemptConnection(connStr)
	if err != nil {
		log.Printf("⚠️ Notice: PostgreSQL / Supabase is currently unreachable: %v", err)
		log.Printf("💡 If your Supabase project is paused on free tier, please visit https://supabase.com/dashboard and click 'Restore project'.")
		log.Printf("🚀 The backend will operate in high-reliability standby mode so the dashboard works without interruption.")

		// Start background reconnection worker
		go startReconnectWorker()
		return nil
	}

	dbMu.Lock()
	DB = db
	dbMu.Unlock()

	fmt.Println("🚀 Connected to Supabase PostGIS Database successfully!")
	if err := AutoMigrate(db); err != nil {
		log.Printf("⚠️ Warning during database migration: %v", err)
	}

	return db
}

// ConnectDatabase is kept for backward compatibility with existing code.
func ConnectDatabase() *sql.DB {
	return InitDatabase()
}

// GetDB returns the active database instance, or nil if offline.
func GetDB() *sql.DB {
	dbMu.RLock()
	defer dbMu.RUnlock()
	return DB
}

// IsDBConnected returns true if database is currently reachable.
func IsDBConnected() bool {
	dbMu.RLock()
	defer dbMu.RUnlock()
	if DB == nil {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	return DB.PingContext(ctx) == nil
}

func attemptConnection(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func startReconnectWorker() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		dbMu.RLock()
		alreadyConnected := (DB != nil)
		dbMu.RUnlock()

		if alreadyConnected {
			// Verify connection is still alive
			if IsDBConnected() {
				continue
			}
		}

		db, err := attemptConnection(connStr)
		if err == nil {
			dbMu.Lock()
			DB = db
			dbMu.Unlock()
			fmt.Println("🎉 Reconnected to Supabase PostGIS Database successfully!")
			_ = AutoMigrate(db)
		}
	}
}

// AutoMigrate creates all required tables and PostGIS spatial extensions if they don't exist.
func AutoMigrate(db *sql.DB) error {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS postgis;`,
		`CREATE TABLE IF NOT EXISTS emergency_alerts (
			id SERIAL PRIMARY KEY,
			device_id VARCHAR(64) NOT NULL,
			triage_tags TEXT[],
			location GEOMETRY(Point, 4326),
			accuracy FLOAT DEFAULT 10.0,
			hop_count INT DEFAULT 1,
			status VARCHAR(32) DEFAULT 'ACTIVE',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS emergency_alerts_location_idx ON emergency_alerts USING GIST(location);`,
		`CREATE TABLE IF NOT EXISTS hazards (
			id VARCHAR(64) PRIMARY KEY,
			hazard_type VARCHAR(32) NOT NULL,
			severity VARCHAR(16) NOT NULL,
			description TEXT,
			location GEOMETRY(Point, 4326) NOT NULL,
			radius_meters FLOAT DEFAULT 50.0,
			reported_by VARCHAR(64),
			hop_count INT DEFAULT 0,
			is_resolved BOOLEAN DEFAULT FALSE,
			confirmations INT DEFAULT 1,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS hazards_geo_idx ON hazards USING GIST(location);`,
	}

	for _, q := range queries {
		if _, err := db.Exec(q); err != nil {
			// Non-fatal if extension cannot be created due to permissions
			log.Printf("Migration step: %v", err)
		}
	}

	return nil
}
