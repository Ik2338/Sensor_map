# 🗺️ SensorMap — Dashboard de Capteurs IoT

Application full-stack pour visualiser des capteurs GPS sur une carte interactive, avec stockage MongoDB et interface d'administration.

## Stack Technique

| Couche          | Technologie                  |
|-----------------|------------------------------|
| Frontend        | React + Vite + Leaflet       |
| Backend         | Node.js + Express            |
| Base de données | MongoDB 7                    |
| Admin DB        | Mongo Express                |
| Proxy           | Nginx                        |
| Conteneurs      | Docker + Docker Compose      |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/install/) installé

### Lancement

```bash


# Lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up --build -d
```

---

## 🌐 Accès aux Services

| Service            | URL                        | Credentials         |
|--------------------|----------------------------|---------------------|
| 🗺 Frontend React  | http://localhost:3000       | —                   |
| ⚙️ Backend API     | http://localhost:5000       | —                   |
| 🍃 Mongo Express   | http://localhost:8081       | admin / admin123    |
| 🗄 MongoDB         | mongodb://localhost:27017   | admin / sensorpass  |

---

## 🍃 Mongo Express

Mongo Express est une interface web pour visualiser et gérer le contenu de MongoDB directement depuis le navigateur.

**Accès :** http://localhost:8081  
**Login :** `admin`  
**Mot de passe :** `admin123`

Depuis cette interface vous pouvez :
- Parcourir la base `sensordb` et la collection `sensors`
- Voir, éditer et supprimer des documents
- Exécuter des requêtes
- Visualiser les index géospatiaux

---

## 📡 Dataset Fixe

Les capteurs sont pré-chargés automatiquement dans MongoDB au démarrage :

| Sensor ID | Latitude   | Longitude    |
|-----------|------------|--------------|
| 400001    | 37.364085  | -121.901149  |
| 400017    | 37.253303  | -121.945440  |
| 400030    | 37.359087  | -121.906538  |
| 400040    | 37.294949  | -121.873109  |
| 400045    | 37.363402  | -121.902233  |

> Zone : **San Jose, Californie, USA**

---

## 🖥️ Fonctionnalités Frontend

### Onglet 🗺 Carte
- Carte sombre interactive (CartoDB Dark)
- Marqueurs verts avec popup au clic (ID, coordonnées, date)
- Zoom automatique sur le capteur sélectionné
- Liste des capteurs dans la sidebar avec recherche par ID

### Onglet 🍃 MongoDB
- Tableau de tous les documents de la collection
- Affichage : `_id`, `sensorId`, `latitude`, `longitude`, `createdAt`, `updatedAt`
- Clic sur une ligne → JSON complet du document
- Pagination
- Bouton **Reseed** : recharge le dataset fixe
- Bouton **Vider** : supprime toute la collection

---

## 🔌 API Backend

| Méthode | Route                   | Description                        |
|---------|-------------------------|------------------------------------|
| GET     | `/api/sensors`          | Liste tous les capteurs (paginé)   |
| GET     | `/api/sensors/stats`    | Total et dernier document inséré   |
| GET     | `/api/sensors/:id`      | Un capteur par sensorId            |
| POST    | `/api/sensors/reseed`   | Recharge le dataset fixe           |
| DELETE  | `/api/sensors`          | Supprime tous les capteurs         |
| GET     | `/health`               | Health check                       |

### Exemple
```bash
curl http://localhost:5000/api/sensors
curl http://localhost:5000/api/sensors/stats
curl -X POST http://localhost:5000/api/sensors/reseed
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

## 🔧 Développement Local (sans Docker)

```bash
# MongoDB doit tourner localement sur le port 27017

# Backend
cd backend
npm install
MONGODB_URI=mongodb://admin:sensorpass@localhost:27017/sensordb?authSource=admin node src/index.js

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 📁 Structure du Projet

```
sensor-map/
├── docker-compose.yml          ← 4 services orchestrés
├── .gitignore
├── README.md
├── mongo-init/
│   └── init.js                 ← Init MongoDB + index 2dsphere
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js            ← API Express + seed automatique
└── frontend/
    ├── Dockerfile              ← Build Vite + Nginx
    ├── nginx.conf
    ├── vite.config.js
    └── src/
        ├── App.jsx             ← Layout + onglets Carte/MongoDB
        ├── services/api.js     ← Appels REST
        └── components/
            ├── SensorMap.jsx   ← Carte Leaflet
            ├── Sidebar.jsx     ← Liste + recherche
            ├── MongoViewer.jsx ← Tableau MongoDB + JSON viewer
            └── StatsBar.jsx    ← Compteurs en-tête
```
