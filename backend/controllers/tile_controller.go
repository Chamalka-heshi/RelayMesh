package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"relaymesh-backend/models"

	"github.com/gin-gonic/gin"
)

// Regional offline map bundles available on the tile server
var sampleTileBundles = []models.MBTileBundle{
	{
		BundleID:      "mbtiles-colombo-metro-v1",
		RegionName:    "Colombo Metro & Flood Plain",
		MinZoom:       10,
		MaxZoom:       16,
		MinLon:        79.8000,
		MinLat:        6.8500,
		MaxLon:        79.9500,
		MaxLat:        7.0200,
		FileSizeBytes: 50541363, // ~48.2 MB
		Checksum:      "sha256:4f9a12c8e310ab78f29",
		Version:       "1.2.0",
		DownloadURL:   "/api/tiles/download/mbtiles-colombo-metro-v1.mbtiles",
		TileCount:     4280,
	},
	{
		BundleID:      "mbtiles-western-province-v1",
		RegionName:    "Western Province Regional Corridor",
		MinZoom:       8,
		MaxZoom:       14,
		MinLon:        79.7000,
		MinLat:        6.5000,
		MaxLon:        80.2000,
		MaxLat:        7.3000,
		FileSizeBytes: 117964800, // ~112.5 MB
		Checksum:      "sha256:7b2c99a14d5e8890f11",
		Version:       "1.0.0",
		DownloadURL:   "/api/tiles/download/mbtiles-western-province-v1.mbtiles",
		TileCount:     12450,
	},
}

// GetTileBundlesHandler returns list of regional .mbtiles packages available for offline caching
func GetTileBundlesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "SUCCESS",
		"count":   len(sampleTileBundles),
		"bundles": sampleTileBundles,
	})
}

// GetTileHandler serves metadata / vector tile slice for a specific z/x/y coordinate
func GetTileHandler(c *gin.Context) {
	region := c.Param("region")
	zStr := c.Param("z")
	xStr := c.Param("x")
	yStr := c.Param("y")

	z, err1 := strconv.Atoi(zStr)
	x, err2 := strconv.Atoi(xStr)
	y, err3 := strconv.Atoi(yStr)

	if err1 != nil || err2 != nil || err3 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tile coordinates (z, x, y must be integers)"})
		return
	}

	// Returns simulated vector tile metadata response for tile coordinate
	c.JSON(http.StatusOK, gin.H{
		"status":      "AVAILABLE",
		"region":      region,
		"z":           z,
		"x":           x,
		"y":           y,
		"format":      "pbf",
		"attribution": "OpenStreetMap / RelayMesh Vector Tile Engine",
		"cache_header": fmt.Sprintf("max-age=86400, public"),
	})
}
