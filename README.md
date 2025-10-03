# 📝 TODO App - Flask + React + Docker

Application web full-stack de gestion de tâches (CRUD) avec authentification JWT, déployée via Docker avec Traefik comme reverse proxy.

---

## 📚 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Architecture Docker](#-architecture-docker)
- [Prérequis](#-prérequis)
- [Installation rapide](#-installation-rapide)
- [Configuration](#️-configuration)
- [Accès aux services](#-accès-aux-services)
- [Mode développement vs production](#-mode-développement-vs-production)
- [Commandes utiles](#-commandes-utiles)
- [Architecture réseau](#-architecture-réseau)
- [API REST](#-api-rest)
- [Monitoring](#-monitoring)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Technologies utilisées

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** + **ShadcnUI**
- **Axios** pour les requêtes HTTP
- **React Router Dom** (navigation)
- **React Hook Form** + **Zod** (validation)
- **Zustand** (state management)
- **React Query** (data fetching)

### Backend
- **Python 3.11** + **Flask**
- **MySQL 8.0.43** (base de données)
- **SQLAlchemy** (ORM)
- **Flask-Migrate** (migrations)
- **Flask-JWT-Extended** (authentification)
- **Flask-Smorest** (REST API + Swagger)
- **Gunicorn** (serveur WSGI production)

### Infrastructure Docker
- **Traefik v3.0** (reverse proxy)
- **phpMyAdmin 5.2** (gestion DB)
- **Dozzle** (logs temps réel)
- **cAdvisor** (monitoring conteneurs)
- **Docker Compose** (orchestration)

---

## 🏗 Architecture Docker

```
┌─────────────────────────────────────────────────┐
│              Traefik (Port 80)                  │
│         Reverse Proxy & Load Balancer           │
└────┬──────────────────────┬──────────────────┬──┘
     │                      │                  │
     ▼                      ▼                  ▼
┌─────────┐         ┌──────────────┐    ┌──────────┐
│Frontend │         │   Backend    │    │   PMA    │
│ (React) │         │   (Flask)    │    │ (/pma)   │
│   (/)   │         │   (/api)     │    └────┬─────┘
└─────────┘         └──────┬───────┘         │
                           │                 │
                    ┌──────┴─────────────────┘
                    ▼
              ┌──────────┐
              │  MySQL   │
              │  (3306)  │
              └──────────┘

Monitoring:
┌──────────┐  ┌───────────┐
│  Dozzle  │  │ cAdvisor  │
│  :9999   │  │   :8888   │
└──────────┘  └───────────┘
```

---

## ✅ Prérequis

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git**

### Installation Docker

**Windows** : [Docker Desktop](https://www.docker.com/products/docker-desktop)
**macOS** : [Docker Desktop](https://www.docker.com/products/docker-desktop)
**Linux** :
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

---

## 🚀 Installation rapide

### 1. Cloner le projet

```bash
git clone https://github.com/MatthALXdev/todo-app-docker.git
cd todo-app-flask-reactjs
```

### 2. Copier les fichiers d'environnement

```bash
# Fichier .env racine (déjà configuré)
# Pas besoin de modification pour le développement local
```

### 3. Lancer la stack Docker

```bash
docker compose up -d
```

**Attendez 1-2 minutes** que tous les services démarrent (healthchecks).

### 4. Initialiser la base de données

```bash
# Créer les tables
docker compose exec backend flask db upgrade

# Insérer les tags par défaut (20 catégories)
docker compose exec backend python seed.py
```

### 5. Accéder à l'application

Ouvrez votre navigateur : **http://localhost/**

---

## ⚙️ Configuration

### Fichier `.env` (racine du projet)

```env
# MySQL
MYSQL_DATABASE=todo_db
MYSQL_USER=todo_user
MYSQL_PASSWORD=todo_pass
MYSQL_ROOT_PASSWORD=root_pass

# Backend Flask
FLASK_ENV=development
FLASK_APP=application.py
JWT_SECRET_KEY=supersecret

# Frontend
VITE_API_URL=http://localhost/api
```

### Fichier `config.yml`

Configuration centralisée de la stack (versions, ports, réseaux, etc.).

---

## 🌐 Accès aux services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost/ | - |
| **Backend API** | http://localhost/api/v1/tags | - |
| **Swagger UI** | http://localhost:5000/docs | (Accès direct backend, dev only) |
| **phpMyAdmin** | http://localhost/pma/ | `todo_user` / `todo_pass` |
| **Traefik Dashboard** | http://localhost:8090/dashboard/ | - |
| **Dozzle (Logs)** | http://localhost:9999/ | - |
| **cAdvisor (Metrics)** | http://localhost:8888/ | - |

---

## 🔄 Mode développement vs production

### Mode développement (actuel)

```yaml
backend:
  command: flask run --host=0.0.0.0 --reload  # Hot-reload activé
  volumes:
    - ./backend:/app  # Code monté en volume
```

**Caractéristiques** :
- ✅ Hot-reload automatique (backend)
- ✅ Logs détaillés
- ✅ Swagger UI accessible
- ❌ Pas de HTTPS

### Mode production

**Modifications à effectuer dans `.env`** :

```env
FLASK_ENV=production
JWT_SECRET_KEY=<générer_une_clé_aléatoire_32+_caractères>
MYSQL_PASSWORD=<mot_de_passe_fort>
MYSQL_ROOT_PASSWORD=<mot_de_passe_fort>
```

**Dans `config.yml`** :
```yaml
proxy:
  ssl_enabled: true
  domain: "votredomaine.com"
```

**Dans `docker-compose.yml`** :
```yaml
backend:
  command: gunicorn --bind 0.0.0.0:5000 --workers 4 application:app
  volumes: []  # Retirer le volume de développement
```

---

## 📝 Commandes utiles

### Gestion de la stack

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Arrêter + supprimer volumes (⚠️ perte de données)
docker compose down -v

# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend

# Redémarrer un service
docker compose restart backend

# Rebuilder les images
docker compose build --no-cache

# Voir l'état des services
docker compose ps
```

### Base de données

```bash
# Créer une migration
docker compose exec backend flask db migrate -m "Description"

# Appliquer les migrations
docker compose exec backend flask db upgrade

# Accéder à MySQL CLI
docker compose exec mysql mysql -u todo_user -ptodo_pass todo_db

# Backup de la base de données
docker compose exec mysql mysqldump -u root -proot_pass todo_db > backup.sql

# Restore de la base de données
docker compose exec -T mysql mysql -u root -proot_pass todo_db < backup.sql
```

### Développement backend

```bash
# Installer une nouvelle dépendance Python
docker compose exec backend pip install <package>
docker compose exec backend pip freeze > backend/requirements.txt
docker compose build backend

# Accéder au shell Python
docker compose exec backend python
```

---

## 🌐 Architecture réseau

### Réseaux Docker

**`todo-public`** : Communication entre Traefik, frontend, backend, phpMyAdmin
**`todo-internal`** : Communication privée entre MySQL, backend, phpMyAdmin

### Isolation

- ✅ MySQL **n'est PAS** accessible depuis l'extérieur via Traefik
- ✅ Seuls backend et phpMyAdmin peuvent communiquer avec MySQL
- ✅ Traefik route uniquement le trafic HTTP vers les services exposés

---

## 🔌 API REST

### Endpoints disponibles

| Méthode | URL | Description | Auth JWT |
|---------|-----|-------------|----------|
| `POST` | `/api/v1/auth/sign-in` | Authentification utilisateur | ❌ |
| `POST` | `/api/v1/users` | Créer un compte | ❌ |
| `GET` | `/api/v1/users` | Liste des utilisateurs | ✅ |
| `GET` | `/api/v1/users/{id}` | Détails utilisateur | ✅ |
| `DELETE` | `/api/v1/users/account` | Supprimer son compte | ✅ |
| `GET` | `/api/v1/tags` | Liste des tags | ❌ |
| `POST` | `/api/v1/tags` | Créer un tag | ✅ |
| `GET` | `/api/v1/tasks/user` | Mes tâches | ✅ |
| `POST` | `/api/v1/tasks` | Créer une tâche | ✅ |
| `PUT` | `/api/v1/tasks/{id}` | Modifier une tâche | ✅ |
| `DELETE` | `/api/v1/tasks/{id}` | Supprimer une tâche | ✅ |

### Exemple d'utilisation

```bash
# Créer un compte
curl -X POST http://localhost/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'

# Se connecter
curl -X POST http://localhost/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Récupérer les tags
curl http://localhost/api/v1/tags
```

---

## 📊 Monitoring

### Dozzle - Logs Docker

- **URL** : http://localhost:9999
- **Fonctionnalités** :
  - Visualisation des logs en temps réel
  - Recherche et filtrage
  - Multi-conteneurs

### cAdvisor - Métriques

- **URL** : http://localhost:8888
- **Métriques** :
  - CPU usage
  - Mémoire (RAM)
  - Network I/O
  - Disk I/O

---

## 🔧 Troubleshooting

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Vérifier l'état
docker compose ps

# Recréer les conteneurs
docker compose down
docker compose up -d --force-recreate
```

### Erreur "network not found"

```bash
# Nettoyer les réseaux orphelins
docker network prune -f

# Redémarrer
docker compose up -d
```

### Frontend affiche 404

```bash
# Vérifier que le healthcheck est OK
docker compose ps frontend

# Rebuilder le frontend
docker compose build frontend
docker compose up -d frontend
```

### Backend ne peut pas se connecter à MySQL

```bash
# Vérifier que MySQL est healthy
docker compose ps mysql

# Vérifier la variable d'environnement
docker compose exec backend env | grep SQLALCHEMY
```

### Réinitialiser complètement la stack

```bash
docker compose down -v
docker system prune -a --volumes -f
docker compose up -d --build
```

---

## 📦 Structure du projet

```
todo-app-flask-reactjs/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── application.py
│   ├── config.py
│   ├── seed.py
│   └── flaskr/
│       ├── __init__.py
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       └── schemas/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── services/
│       └── components/
├── docker-compose.yml
├── traefik.yml
├── config.yml
├── .env
└── README.md
```

---

## 👨‍💻 Auteurs

**Développement original** : Santiago de Jesús Moraga Caldera - [Remy349](https://github.com/Remy349)
**Dockerisation & Architecture** : Matthieu Alix - [MatthALXdev](https://github.com/MatthALXdev)

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.