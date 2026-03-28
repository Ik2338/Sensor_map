# 🗺️ SensorMap — Dashboard de Capteurs avec Docker & MongoDB

Application full-stack pour importer et visualiser des capteurs IoT sur une carte interactive.

## Stack Technique

| Couche     | Technologie              |
|------------|--------------------------|
| Frontend   | React + Vite + Leaflet   |
| Backend    | Node.js + Express        |
| Base de données | MongoDB (via Docker) |
| Proxy      | Nginx                    |
| Conteneurs | Docker + Docker Compose  |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/install/) installé

### Lancement

```bash
# Cloner le projet et entrer dans le dossier
cd sensor-map

# Lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up --build -d
```

### Accès
| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:5000       |
| MongoDB   | mongodb://localhost:27017   |

---

## 📂 Format du Dataset

L'application accepte **CSV**, **XLSX** et **JSON**.

### Colonnes requises
| Colonne             | Description        |
|---------------------|--------------------|
| `latitude` / `lat`  | Latitude du capteur |
| `longitude` / `lon` | Longitude du capteur |

### Colonnes optionnelles
| Colonne       | Description                          | Valeur par défaut |
|---------------|--------------------------------------|-------------------|
| `name`        | Nom du capteur                       | `Sensor N`        |
| `type`        | Type (temperature, humidity, etc.)   | `generic`         |
| `status`      | `active`, `inactive`, `warning`, `error` | `active`      |
| `value`       | Valeur mesurée                       | —                 |
| `unit`        | Unité (°C, %, AQI...)                | —                 |
| `description` | Description libre                    | —                 |

### Exemple CSV
```csv
name,latitude,longitude,type,status,value,unit
Capteur_01,33.5731,-7.5898,temperature,active,24.5,°C
Capteur_02,34.0209,-6.8416,humidity,warning,65.2,%
```

### Exemple JSON
```json
[
  {
    "name": "Capteur_01",
    "latitude": 33.5731,
    "longitude": -7.5898,
    "type": "temperature",
    "status": "active",
    "value": 24.5,
    "unit": "°C"
  }
]
```

---

## 🔌 API Backend

| Méthode | Route              | Description                  |
|---------|--------------------|------------------------------|
| GET     | `/api/sensors`     | Récupère tous les capteurs   |
| GET     | `/api/sensors/stats` | Statistiques globales      |
| GET     | `/api/sensors/types` | Liste des types de capteurs |
| POST    | `/api/upload`      | Importe un fichier dataset   |
| DELETE  | `/api/sensors`     | Supprime tous les capteurs   |
| GET     | `/health`          | Health check                 |

### Paramètres de filtre (GET /api/sensors)
```
?type=temperature
?status=active
?limit=500
```

---

## 🛑 Arrêt

```bash
# Arrêter les services
docker-compose down

# Arrêter ET supprimer les données MongoDB
docker-compose down -v
```

---

## 🔧 Développement local (sans Docker)

```bash
# Backend
cd backend
npm install
MONGODB_URI=mongodb://admin:sensorpass@localhost:27017/sensordb?authSource=admin node src/index.js

# Frontend
cd frontend
npm install
npm run dev
```
