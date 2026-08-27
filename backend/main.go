package main

import (
"database/sql"
"fmt"
"log"
"net/http"
"os"

"github.com/gin-contrib/cors"
"github.com/gin-gonic/gin"
_ "github.com/lib/pq"
)

type SOSPayload struct {
DeviceID   string   `json:"device_id"`
TriageTags []string `json:"triage_tags"`
Latitude   float64  `json:"latitude"`
Longitude  float64  `json:"longitude"`
Accuracy   float64  `json:"accuracy"`
HopCount   int      `json:"hop_count"`
}

var db *sql.DB

func initDB() {
connStr := os.Getenv("DB_URL")
if connStr == "" {
connStr = "postgresql://postgres:RelayMesh002%40@db.zokiceiwgigauwqqhrnm.supabase.co:5432/postgres?sslmode=require"
}

var err error
db, err = sql.Open("postgres", connStr)
if err != nil {
log.Fatal("❌ Database configuration error: ", err)
}

err = db.Ping()
if err != nil {
log.Fatal("❌ Cannot connect to Supabase: ", err)
}

fmt.Println("🚀 Connected to Supabase PostGIS Database successfully!")
}

func main() {
initDB()

r := gin.Default()
r.Use(cors.Default())

r.GET("/api/health", func(c *gin.Context) {
c.JSON(http.StatusOK, gin.H{
"status":   "ONLINE",
"database": "CONNECTED",
"project":  "RelayMesh - Disaster Response API",
})
})

r.POST("/api/sync/sos", func(c *gin.Context) {
var payload SOSPayload
if err := c.ShouldBindJSON(&payload); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

query := `
INSERT INTO emergency_alerts (device_id, triage_tags, location, accuracy, hop_count)
VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6)
`
_, err := db.Exec(query, payload.DeviceID, payload.TriageTags, payload.Longitude, payload.Latitude, payload.Accuracy, payload.HopCount)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert into PostGIS: " + err.Error()})
return
}

c.JSON(http.StatusOK, gin.H{
"status":  "SUCCESS",
"message": "Emergency SOS successfully ingested into Central PostGIS",
})
})

r.GET("/api/dashboard/alerts", func(c *gin.Context) {
rows, err := db.Query(`
SELECT id, device_id, triage_tags, ST_X(location::geometry) AS lon, ST_Y(location::geometry) AS lat, status, hop_count, created_at 
FROM emergency_alerts 
ORDER BY created_at DESC
`)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
defer rows.Close()

var alerts []gin.H
for rows.Next() {
var id, deviceID, status, createdAt string
var lon, lat float64
var hopCount int
var tags []string

rows.Scan(&id, &deviceID, &tags, &lon, &lat, &status, &hopCount, &createdAt)
alerts = append(alerts, gin.H{
"id":          id,
"device_id":   deviceID,
"triage_tags": tags,
"latitude":    lat,
"longitude":   lon,
"status":      status,
"hop_count":   hopCount,
"created_at":  createdAt,
})
}
c.JSON(http.StatusOK, alerts)
})

port := os.Getenv("PORT")
if port == "" {
port = "8080"
}

fmt.Printf("📡 Server listening on port %s\n", port)
r.Run(":" + port)
}
