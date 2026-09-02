package models

// MBTileBundle represents an offline vector map bundle package
type MBTileBundle struct {
	BundleID      string  `json:"bundle_id"`
	RegionName    string  `json:"region_name"`
	MinZoom       int     `json:"min_zoom"`
	MaxZoom       int     `json:"max_zoom"`
	MinLon        float64 `json:"min_lon"`
	MinLat        float64 `json:"min_lat"`
	MaxLon        float64 `json:"max_lon"`
	MaxLat        float64 `json:"max_lat"`
	FileSizeBytes int64   `json:"file_size_bytes"`
	Checksum      string  `json:"checksum"`
	Version       string  `json:"version"`
	DownloadURL   string  `json:"download_url"`
	TileCount     int     `json:"tile_count"`
}
