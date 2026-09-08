# 📡 RelayMesh: Decentralized Offline-First Disaster Response & Mesh Network

[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?logo=postgresql&logoColor=white)](https://postgis.net/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TweetNaCl](https://img.shields.io/badge/Cryptography-TweetNaCl_E2EE-4B32C3)](#security--cryptography)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **RelayMesh** is an autonomous, offline-first disaster response and emergency coordination ecosystem. In catastrophic events where cellular towers, power grids, and internet backbones fail, RelayMesh establishes an ad-hoc peer-to-peer (P2P) mesh network over **Bluetooth Low Energy (BLE)** and **Wi-Fi Direct**. Using **Delay-Tolerant Networking (DTN)** and **Store-and-Forward** routing, RelayMesh transmits life-saving SOS beacons, encrypted communications, spatial hazard intelligence, and relief resource updates—automatically backhauling data to central headquarters whenever any node discovers an internet gateway.

---

## 📑 Table of Contents

- [Overview & The Problem](#-overview--the-problem)
- [System Architecture](#-system-architecture)
- [Core Functional Modules](#-core-functional-modules)
  - [1. Emergency SOS & Life-Threatening Triage](#1-emergency-sos--life-threatening-triage)
  - [2. Offline Spatial Vector Mapping & Hazards](#2-offline-spatial-vector-mapping--hazards)
  - [3. End-to-End Encrypted Messaging (E2EE)](#3-end-to-end-encrypted-messaging-e2ee)
  - [4. Mesh Topology & Delay-Tolerant Routing (DTN)](#4-mesh-topology--delay-tolerant-routing-dtn)
  - [5. Relief Resources, Auth & Incident Command](#5-relief-resources-auth--incident-command)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Protocols & Data Specifications](#-protocols--data-specifications)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Central Go Backend](#1-central-go-backend)
  - [2. Incident Command Web Dashboard](#2-incident-command-web-dashboard)
  - [3. RelayMesh Mobile Application](#3-relaymesh-mobile-application)
- [Security & Cryptography](#-security--cryptography)
- [Roadmap & Contributing](#-roadmap--contributing)

---

## 🌍 Overview & The Problem

When natural disasters strike—earthquakes, hurricanes, flash floods, or infrastructure failures—traditional communication networks are the first to collapse:
- ❌ Cellular base stations lose power or transmission lines.
- ❌ Fiber optic internet backbones are severed.
- ❌ Emergency services and trapped victims lose contact in the critical first 72 hours.

**RelayMesh provides an immediate, zero-infrastructure communication fabric:**
1. **Zero External Infrastructure Required:** Smartphones and field hardware self-organize into dynamic multi-hop mesh topologies.
2. **Store-and-Forward Routing:** Messages travel hop-by-hop across mobile nodes even without continuous end-to-end connectivity.
3. **Opportunistic Cloud Ingestion:** When any single node moves into range of a working satellite terminal, cellular hotspot, or command center, it flushes queued emergency data to the central PostGIS database.
4. **Unified Command and Field Coordination:** Integrates on-the-ground survivors and volunteers with central emergency dispatchers on real-time spatial dashboards.

---

## 🏛 System Architecture

RelayMesh is structured across four primary tiers:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           TIER 1: MOBILE MESH EDGE NODES                         │
│   (React Native · Expo SDK 57 · TypeScript · WatermelonDB · TweetNaCl · BLE-PLX) │
│                                                                                  │
│   [Survivor Device]  <--- BLE Mesh --->  [Volunteer Rescuer]  <--- BLE Mesh ---> │
│   - SOS Beacon                           - Packet Relay                          │
│   - Vector Maps (Offline)                - Store-and-Forward Queue               │
│   - Encrypted Chat                       - Local DB Cache (LokiJS/SQLite)        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Opportunistic Internet Uplink
                                         │ (Cellular / Starlink / Wi-Fi)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     TIER 2: HIGH-THROUGHPUT CENTRAL BACKEND                      │
│                  (Golang 1.22+ · Gin Gonic · Protocol Buffers v3)                │
│                                                                                  │
│   - /api/sync/sos               - /api/hazards             - /api/tiles/bundles  │
│   - Protobuf Parser             - Spatial Hazard Registry  - Tile Server         │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   TIER 3: SPATIAL VECTOR DATABASE (PostGIS)                      │
│                      (Supabase PostgreSQL 15+ · PostGIS)                         │
│                                                                                  │
│   - emergency_alerts (ST_MakePoint, SRID 4326, Triage Tags, Hop Tracking)        │
│   - spatial_hazards (Polygons, Radii, Roadblocks, Flood Inundation Zones)        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Real-Time Queries & WebSockets
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                 TIER 4: INCIDENT COMMAND WEB DASHBOARD                           │
│              (React 19 · Leaflet / React-Leaflet · Lucide Icons)                 │
│                                                                                  │
│   - Live Situation GIS Map               - Emergency SOS Ingestion & Triage      │
│   - Rescue Team Dispatch Management      - Relief Resource Directory             │
│   - Mesh Network Health Telemetry        - System Logs & Audit Trail             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Functional Modules

### 1. Emergency SOS & Life-Threatening Triage
- **One-Tap Emergency Distress Beacon:** Broadcasts an immediate distress signal containing GPS coordinates, elevation, timestamp, and battery level.
- **Medical Triage Tagging (START Protocol):** Categorizes victims by severity:
  - 🔴 **Red (Immediate):** Critical, life-threatening conditions requiring rapid evacuation.
  - 🟡 **Yellow (Delayed):** Serious injuries requiring medical intervention but not immediately fatal.
  - 🟢 **Green (Minor):** Walking wounded capable of self-preservation.
  - ⚫ **Black (Expectant):** Deceased or injuries incompatible with survival under current field conditions.
- **Hop Count & Provenance Tracking:** Monitors how many mesh hops an SOS beacon traversed before reaching an internet uplink or responder.
- **Auto-Sync to Central PostGIS:** Synchronizes automatically with the backend table `emergency_alerts` using spatial point geometry (`ST_SetSRID(ST_MakePoint(lon, lat), 4326)`).

### 2. Offline Spatial Vector Mapping & Hazards
- **Completely Offline Vector Tiles:** Renders regional map tiles (`.mbtiles`) directly from device storage without requesting online map servers.
- **Dynamic Geospatial Hazard Reporting:** Allows field operators and citizens to mark and propagate critical environmental obstacles:
  - Floods & Inundations
  - Roadblocks & Debris
  - Landslides & Mudslides
  - Downed Powerlines & Electrical Hazards
  - Bridge Collapses & Structural Damage
  - Wildfires & Gas Leaks
- **Hazard-Aware Route Navigation:** Computes safe evacuation and supply routes while avoiding hazard radii.
- **Node Locator:** Displays nearby active peers and shelters directly on the offline map.

### 3. End-to-End Encrypted Messaging (E2EE)
- **Zero-Knowledge Privacy:** Intermediary nodes relay packets without having access to cleartext contents.
- **TweetNaCl Cryptographic Box:** Employs **Curve25519** elliptic curve key exchange, **XSalsa20** stream encryption, and **Poly1305** authentication.
- **Two Communication Modes:**
  - **Direct P2P Encrypted Chat:** 1-on-1 private messaging between survivors, coordinators, and rescue personnel.
  - **Emergency Broadcast Channel:** Public unencrypted or emergency-keyed announcements for community evacuation instructions.
- **Message Delivery Lifecycle:** Tracks status through `Queued` ➔ `Relayed` ➔ `Delivered` states with visual acknowledgments.

### 4. Mesh Topology & Delay-Tolerant Routing (DTN)
- **Custom BLE GATT Protocol:** Broadcasts and listens on the dedicated RelayMesh service UUID:
  ```text
  Service UUID: 4fafc201-1fb5-459e-8fcc-c5c9c331914b
  ```
- **Store-and-Forward Engine:** Packets destined for distant nodes are cached in a persistent local queue (`PacketQueueModel`) and transmitted when a viable neighbor node appears.
- **Epidemic & Directed Routing:** Packets include a Time-to-Live (TTL) and hop-limit decrement to prevent network broadcast storms while maximizing delivery probability.
- **Link Quality & Topology Visualization:** Measures Received Signal Strength Indicator (RSSI), hop latency, and battery state, displaying a live graph of the active mesh cluster.

### 5. Relief Resources, Auth & Incident Command
- **Emergency Resource Catalog:** Tracks vital disaster relief assets:
  - Safe Evacuation Shelters & Capacities
  - Clean Drinking Water Distribution Hubs
  - Food & Ration Banks
  - Field Medical Centers & First Aid Posts
- **Coordinator Messaging:** One-tap direct chat connection to on-site shelter coordinators from resource detail screens.
- **Role-Based Profiles:** Differentiates between Citizens, Volunteer Rescuers, and First Responders.
- **Incident Command Center (Web):** Full-featured desktop portal for mission controllers to view live GIS maps, dispatch rescue teams, and allocate relief resources.

---

## 💻 Technology Stack

| Domain | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Mobile Core** | React Native / React | 0.86.3 / 19.2.3 | Cross-platform mobile client framework |
| **App Platform** | Expo SDK | 57.0.x | Universal React runtime and native tooling |
| **Language** | TypeScript | ~6.0.3 | Type-safe code across mobile and backend |
| **Local Database** | WatermelonDB | ^0.28.0 | High-performance reactive database for React Native |
| **Database Adapters**| SQLite & LokiJS | ^1.5.12 | Native SQLite for iOS/Android, LokiJS for web/fallback |
| **P2P Radios** | React Native BLE PLX | ^3.5.1 | Bluetooth Low Energy scanning, advertising, & GATT |
| **Cryptography** | TweetNaCl & TweetNaCl-Util | ^1.0.3 | X25519-XSalsa20-Poly1305 end-to-end encryption |
| **Backend Engine** | Golang | 1.22+ | High-throughput, low-latency microservice backend |
| **Web Framework** | Gin Gonic (`github.com/gin-gonic/gin`) | ^1.10.0 | High-speed REST API routing and middleware |
| **Serialization** | Protocol Buffers v3 | proto3 | Compact binary spatial hazard serialization (`spatial.proto`) |
| **Central DB** | PostgreSQL & PostGIS | 15+ / 3.3+ | Spatial coordinate indexing, geometry, and persistence |
| **Command Portal**| React & CSS3 | 19.2.x | Incident command and dispatcher web interface |
| **Web GIS Maps** | Leaflet & React-Leaflet | ^1.9.4 / ^5.0.0 | Interactive mapping, alert markers, and hazard overlays |
| **Icons & UI** | Lucide React & Expo Vector Icons | Latest | Modern iconography for mobile and web |

---

## 📁 Repository Structure

```
RelayMesh/
├── README.md                           # Master project documentation
├── package.json                        # Root workspace configuration
│
├── RelayMeshMobile/                    # 📱 React Native / Expo Mobile Application
│   ├── App.tsx                         # Main entrypoint & integrated navigation container
│   ├── app.json                        # Expo app configuration & BLE permissions
│   ├── package.json                    # Mobile dependencies (WatermelonDB, BLE, TweetNaCl)
│   ├── tsconfig.json                   # TypeScript configuration
│   │
│   └── src/
│       ├── context/                    # AuthProvider & user session context
│       ├── database/                   # WatermelonDB schemas, migrations, adapters, models
│       │   ├── schema.ts               # Local tables: conversations, messages, packets, etc.
│       │   ├── adapter.ts              # Intelligent SQLite / LokiJS adapter selection
│       │   ├── Conversation.ts         # P2P & group conversation models
│       │   ├── Message.ts              # Encrypted message entity
│       │   └── models/                 # MeshNodeModel, PacketQueueModel, DiscoveredPeerModel
│       │
│       ├── modules/                    # Five core disaster management modules
│       │   ├── sos/                    # Module 1: SOS Beacon, Triage & Tracking
│       │   │   ├── screens/            # Screen01_SOSMain, Screen07_SOSAlert, etc.
│       │   │   └── services/           # SOSService (GPS capture, triage, cloud sync)
│       │   ├── map/                    # Module 2: Offline Vector Maps & Hazards
│       │   │   ├── screens/            # Screen05_OfflineMap, Screen06_NodeLocator, RouteNav
│       │   │   └── services/           # MapTileCacheService, HazardSyncService
│       │   ├── messaging/              # Module 3: Encrypted P2P & Broadcast Messaging
│       │   │   ├── screens/            # Screen10_ChatList, Screen11_DirectChat, Broadcast
│       │   │   └── services/           # CryptoService (TweetNaCl), MeshRouter, BLEService
│       │   ├── mesh/                   # Module 4: Mesh Topology & DTN Store-and-Forward
│       │   │   ├── screens/            # Screen16_MeshTopology, Screen17_NodeDiscovery, etc.
│       │   │   ├── hardwareBridge.ts   # BLE hardware interface & Android 12+ permissions
│       │   │   └── meshService.ts      # Packet relay queue, TTL expiry, RSSI metrics
│       │   └── resources/              # Module 5: Shelters, Relief Goods, Auth & Settings
│       │       ├── screens/            # Screen04_Home, Screen13_Directory, Login, Profile
│       │       └── services/           # ResourceService (inventory, capacity, coordinates)
│       │
│       └── shared/                     # Design system (Colors, Typography, BottomNav, Buttons)
│
├── backend/                            # 📡 Golang High-Performance Central Backend
│   ├── main.go                         # Server initialization, PostGIS connection, REST routes
│   ├── go.mod                          # Go module definitions (Gin, lib/pq, CORS)
│   ├── controllers/                    # Hazard controllers, spatial queries, tile bundle handler
│   ├── models/                         # Go structs for SOS, Hazards, and Mesh Packets
│   ├── mesh_router/                    # Go backend mesh routing and packet ingestion bridge
│   └── routes/                         # Route handlers for disaster API
│
├── web-dashboard/                      # 🖥️ Incident Command & Dispatch Web Dashboard
│   ├── package.json                    # Dashboard dependencies (React, Leaflet, Axios, Lucide)
│   ├── src/
│   │   ├── App.js                      # Root router and command navigation layout
│   │   ├── pages/                      # Dispatch, Live Situation Map, SOS Monitor, Health
│   │   │   ├── LiveSituationMap.js     # Real-time Leaflet map with PostGIS markers
│   │   │   ├── SOSMonitoring.js        # Prioritized emergency triage alert stream
│   │   │   ├── DispatchPage.js         # Volunteer and rescue team deployment
│   │   │   ├── ResourcesPage.js        # Central shelter and inventory management
│   │   │   └── NetworkHealthPage.js    # Remote mesh node diagnostics and backhaul status
│   │   └── services/                   # Supabase & backend API client services
│   │
│   └── public/                         # Static assets and HTML container
│
└── proto/                              # 📜 Protocol Buffers Specification
    └── spatial.proto                   # Protobuf schema for compact spatial hazard exchange
```

---

## 📡 Protocols & Data Specifications

### Protocol Buffers (`proto/spatial.proto`)
For bandwidth-constrained mesh radio transmission, spatial hazards and node locations are encoded into binary Protocol Buffers:

```protobuf
syntax = "proto3";
package relaymesh.spatial;

enum HazardType {
  HAZARD_TYPE_UNSPECIFIED = 0;
  FLOOD = 1;
  ROADBLOCK = 2;
  LANDSLIDE = 3;
  DOWNED_POWERLINE = 4;
  BRIDGE_COLLAPSE = 5;
  FIRE = 6;
}

enum HazardSeverity {
  SEVERITY_UNSPECIFIED = 0;
  LOW = 1;
  MEDIUM = 2;
  HIGH = 3;
  CRITICAL = 4;
}

message HazardReport {
  string id = 1;
  HazardType hazard_type = 2;
  HazardSeverity severity = 3;
  double latitude = 4;
  double longitude = 5;
  float radius_meters = 6;
  string description = 7;
  string reported_by = 8;
  int64 timestamp = 9;
  int32 hop_count = 10;
  bool is_resolved = 11;
  int32 confirmations = 12;
}

message CoordinateBroadcast {
  string node_id = 1;
  double latitude = 2;
  double longitude = 3;
  string role = 4;
  int32 battery_level = 5;
  float accuracy = 6;
  int64 timestamp = 7;
}
```

### Central Backend REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & PostGIS database connectivity verification |
| `POST` | `/api/sync/sos` | Ingests multi-hop emergency SOS alerts into PostGIS |
| `GET` | `/api/dashboard/alerts` | Fetches active prioritized emergency alerts with spatial coordinates |
| `POST` | `/api/hazards` | Reports a new spatial hazard (flood, landslide, obstacle) |
| `GET` | `/api/hazards` | Queries hazards within a geographical bounding box |
| `POST` | `/api/hazards/:id/resolve` | Marks a cleared hazard as resolved |
| `GET` | `/api/tiles/bundles` | Lists available regional offline `.mbtiles` packages |
| `GET` | `/api/tiles/:region/:z/:x/:y` | Serves offline vector tile segments |

---

## 🛠 Getting Started & Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Go:** v1.22 or higher
- **Package Manager:** npm or yarn
- **Database:** PostgreSQL with PostGIS extension (or Supabase instance)
- **Mobile Development:** Expo Go (iOS/Android), Android Studio (for AVD/native build)

---

### 1. Central Go Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database connection string in `.env` or as an environment variable:
   ```bash
   export DB_URL="postgresql://user:password@localhost:5432/relaymesh?sslmode=disable"
   export PORT=8080
   ```
3. Download dependencies and run the server:
   ```bash
   go mod download
   go run main.go
   ```
4. Verify the server is running:
   ```bash
   curl http://localhost:8080/api/health
   # Response: {"database":"CONNECTED","project":"RelayMesh - Disaster Response API","status":"ONLINE"}
   ```

---

### 2. Incident Command Web Dashboard

1. Navigate to the web-dashboard directory:
   ```bash
   cd web-dashboard
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to access the Incident Command Center.

---

### 3. RelayMesh Mobile Application

1. Navigate to the mobile app directory:
   ```bash
   cd RelayMeshMobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   # or: npx expo start
   ```

#### 🌐 Running on Web Browser
Press **`w`** in the terminal, or launch directly:
```bash
npx expo start --web
```
Open [http://localhost:8081](http://localhost:8081) in your browser. (The app includes automatic web fallbacks for SQLite and BLE radios).

#### 📱 Running on Physical Device (Android / iOS)
1. Install **Expo Go** from Google Play Store or Apple App Store.
2. Ensure your mobile phone is connected to the same Wi-Fi network as your development machine.
3. Scan the QR code displayed in the terminal or enter your local IP:
   ```text
   exp://<YOUR_LOCAL_IP>:8081
   ```

#### 🤖 Running on Android Emulator
1. Launch an Android Virtual Device (AVD) from Android Studio.
2. Run:
   ```bash
   npm run android
   ```

---

## 🔐 Security & Cryptography

RelayMesh is designed for hostile and zero-trust disaster environments:

1. **Zero-Knowledge Intermediate Relays:**
   - Payloads are encrypted at the source using the recipient's public key (TweetNaCl box).
   - Relaying nodes can only inspect unencrypted routing headers: `packet_id`, `destination_hash`, `hop_count`, and `ttl`.
   - Intermediary nodes cannot tamper with or read the message content.
2. **Replay Attack & Loop Suppression:**
   - Every transmitted packet contains a cryptographically unique 128-bit hash.
   - Devices maintain an LRU bloom filter/cache of recently seen packet hashes, dropping duplicate packets instantly to eliminate routing loops and denial-of-service packet floods.
3. **Public Key Infrastructure (PKI) on Mesh:**
   - Identity keys are generated on-device at first launch.
   - Keys are shared out-of-band via QR codes or exchanged opportunistically during local BLE peer discovery.

---

## 🗺️ Roadmap & Contributing

- [x] **Phase 1:** Core multi-hop BLE mesh prototype & packet queuing.
- [x] **Phase 2:** START medical triage SOS beacon & PostGIS cloud ingestion.
- [x] **Phase 3:** TweetNaCl end-to-end encrypted direct & broadcast messaging.
- [x] **Phase 4:** Offline vector tile rendering (`.mbtiles`) and spatial hazard reporting.
- [x] **Phase 5:** Web Incident Command Dashboard with real-time GIS live map.
- [ ] **Phase 6:** LoRa radio hardware transceiver integration (ESP32 / Meshtastic bridge).
- [ ] **Phase 7:** Distributed acoustic beacon mode (ultrasound localization for trapped victims).

Contributions, issue reports, and pull requests are warmly welcome! Please submit a PR or open an issue on GitHub.

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.
