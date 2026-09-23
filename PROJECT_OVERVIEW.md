# RelayMesh - Project Overview

**RelayMesh** is a disaster response and emergency coordination system. It is designed to work completely **offline** when cell towers, power grids, and the internet fail (e.g., during earthquakes or hurricanes). 

It allows smartphones to connect to each other directly via Bluetooth and Wi-Fi to create a "mesh network". Messages, SOS signals, and hazard maps hop from phone to phone until one phone connects to the internet, at which point all the emergency data is automatically uploaded to a central command center.

---

## 📂 Project Structure & Folder Breakdown

The project is split into four main parts (folders), each serving a specific role in the system:

### 1. `RelayMeshMobile` (The Mobile App)
**What it is:** A React Native & Expo mobile application used by survivors, citizens, and volunteer rescuers on the ground.
**Key Features:**
- **Emergency SOS:** A one-tap beacon to send a distress signal with GPS and medical severity (triage).
- **Offline Maps:** View maps and navigate around hazards even without internet.
- **Encrypted Chat:** Send secure, private messages or broadcast emergency updates.
- **Mesh Networking:** The magic behind the scenes that allows phones to talk directly to each other without cell service.

### 2. `backend` (The Central Server)
**What it is:** A high-speed server built with Golang that runs in the cloud or at a secure incident command center.
**Key Features:**
- **Data Ingestion:** Receives all the SOS alerts, chat messages, and hazard reports once a mobile device finds internet.
- **Database Connection:** Connects to a PostgreSQL (PostGIS) database to store all geographic locations (like where victims or hazards are).
- **Map Tile Server:** Serves offline map segments to mobile apps when they are connected.

### 3. `web-dashboard` (The Command Center)
**What it is:** A website (built with React) used by emergency dispatchers and mission controllers.
**Key Features:**
- **Live GIS Map:** A real-time map showing where all SOS beacons and rescue workers are.
- **Resource Management:** Manage shelters, food, water, and dispatch rescue teams.
- **System Health:** Monitor the health of the mesh network and incoming data.

### 4. `proto` (The Communication Rules)
**What it is:** Contains Protocol Buffers (`.proto` files).
**Key Features:**
- **Data Compression:** When phones talk to each other offline, data needs to be as small as possible. This folder contains the strict rules (schemas) for how to compress hazard reports and coordinates into tiny binary packets before sending them over Bluetooth.

---

## 💡 How It All Works Together (The Full Idea)

1. **Disaster Strikes:** The internet and cell service go down.
2. **Survivors Use `RelayMeshMobile`:** A trapped survivor presses the SOS button on their phone.
3. **Data Hops (Mesh Network):** The SOS signal hops via Bluetooth to a nearby neighbor's phone, then to a volunteer rescuer's phone.
4. **Internet Found:** The volunteer walks out of the disaster zone and gets cell service.
5. **Sent to `backend`:** The volunteer's phone automatically uploads the trapped survivor's SOS signal to the Golang backend.
6. **Command Center Reacts:** A dispatcher looking at the `web-dashboard` sees the SOS pop up on their map and dispatches a rescue team to the exact GPS coordinates.
