# 🎓 Système de Gestion des Relevés de Notes - ITU

Application complète de gestion des relevés de notes universitaires avec backend Spring Boot et frontend Vue.js, entièrement conteneurisée avec Docker.

---

## 🚀 Démarrage Ultra-Rapide (Une seule commande !)

### Prérequis
- **Docker** et **Docker Compose** installés
- Ports **80**, **3000**, et **3306** disponibles

### Lancer l'application complète

```bash
# À la racine du projet TP1
docker-compose up -d
```

**C'est tout ! 🎉**

Attendez environ 2 minutes que tous les services démarrent, puis :
- **Frontend** : http://localhost
- **Backend API** : http://localhost:3000

---

## 📋 Structure du Projet

```
TP1/
├── docker-compose.yml          # Orchestration complète (DB + Backend + Frontend)
├── WS_ETU003103_ETU003248/     # Backend Spring Boot
│   ├── Dockerfile
│   ├── src/
│   └── script/init.sql
└── projetNode/                  # Frontend Vue.js
    ├── Dockerfile
    ├── nginx.conf
    └── src/
```

---

## 🔐 Comptes de Test

### 👨‍🎓 Compte Étudiant
```
Email: jean.rakoto@univ.mg
Mot de passe: jeanpass
```
Décocher "Se connecter en tant qu'administrateur"

### 👨‍💼 Compte Administrateur
```
Email: admin@univ.mg
Mot de passe: adminpass
```
☑️ **Cocher** "Se connecter en tant qu'administrateur"

---

## 🎯 Fonctionnalités Principales

### Pour l'Étudiant
- ✅ Consultation de ses notes par semestre
- ✅ Affichage des moyennes S1, S2, S3, S4
- ✅ Relevés de notes officiels (format ITU)
- ✅ Relevé L1 (S1 + S2) et L2 (S3 + S4)
- ✅ Impression/Export PDF des relevés
- ✅ Visualisation des crédits obtenus

### Pour l'Administrateur
- ✅ Vue globale de tous les semestres
- ✅ Liste complète des étudiants avec leurs moyennes
- ✅ Accès aux fiches détaillées de chaque étudiant
- ✅ Consultation des relevés de tous les étudiants
- ✅ Navigation intuitive par clic sur les moyennes

### Particularités Techniques
- 🔍 **Vues SQL optimisées** pour les performances
  - `vue_notes_detaillees` : Jointure complète des notes
  - `vue_moyennes_semestre` : Calcul automatique des moyennes
- 🔒 **Authentification JWT** sécurisée
- 🎨 **Interface moderne** inspirée des relevés ITU officiels
- 📱 **Responsive design** (desktop et mobile)
- 🚀 **API REST** complète et documentée

---

## 🐳 Architecture Docker

### Services

1. **notes_db** (MySQL 8.0)
   - Port : 3306
   - Base de données avec vues SQL optimisées
   - Initialisation automatique via `init.sql`

2. **notes_api** (Spring Boot)
   - Port : 3000
   - API REST avec JWT authentication
   - Endpoints pour étudiants et admins

3. **notes_frontend** (Vue.js + Nginx)
   - Port : 80 (HTTP)
   - SPA avec Vue Router
   - Nginx comme reverse proxy vers l'API

### Réseau
- `notes_network` : Bridge network pour communication inter-services

---

## 📦 Commandes Docker

### Démarrer l'application
```bash
docker-compose up -d
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Vérifier l'état des services
```bash
docker-compose ps
```

### Arrêter l'application
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (données)
```bash
docker-compose down -v
```

### Reconstruire après des modifications
```bash
docker-compose up -d --build
```

---

## 🔧 Développement Local (Sans Docker)

### Backend (Spring Boot)
```bash
cd WS_ETU003103_ETU003248
mvn spring-boot:run
```
API accessible sur http://localhost:3000

### Frontend (Vue.js)
```bash
cd projetNode
npm install
npm run dev
```
Application accessible sur http://localhost:5173

⚠️ **Important** : En développement local, assurez-vous que MySQL tourne sur le port 3306.

---

## 📊 Base de Données

### Schéma Principal
- `Etudiant` : Informations des étudiants
- `Parcours` : L1-INFO, L2-INFO, etc.
- `Semestre` : S1, S2, S3, S4...
- `Matiere` : UE avec crédits
- `Note` : Notes des étudiants
- `user` : Comptes administrateurs

### Vues Optimisées
```sql
-- Vue pour les notes détaillées
CREATE VIEW vue_notes_detaillees AS
SELECT 
    e.id_etudiant, e.nom, e.prenom, e.email,
    n.id_note, n.note, n.session,
    m.code_matiere, m.nom_matiere, m.credit,
    s.nom_semestre, s.annee_universitaire,
    p.nom_parcours
FROM Note n
JOIN Etudiant e ON n.id_etudiant = e.id_etudiant
JOIN Matiere m ON n.id_matiere = m.id_matiere
JOIN Semestre s ON m.id_semestre = s.id_semestre
JOIN Parcours p ON e.id_parcours = p.id_parcours;

-- Vue pour les moyennes par semestre
CREATE VIEW vue_moyennes_semestre AS
SELECT 
    e.id_etudiant, e.nom, e.prenom,
    s.id_semestre, s.nom_semestre, s.annee_universitaire,
    AVG(n.note) as moyenne_semestre,
    SUM(m.credit) as total_credits,
    COUNT(DISTINCT n.id_note) as nombre_notes
FROM Note n
JOIN Etudiant e ON n.id_etudiant = e.id_etudiant
JOIN Matiere m ON n.id_matiere = m.id_matiere
JOIN Semestre s ON m.id_semestre = s.id_semestre
GROUP BY e.id_etudiant, s.id_semestre;
```

---

## 🌐 Endpoints API

### Authentification
```
POST /api/auth/login              # Login étudiant
POST /api/auth/admin/login        # Login admin
```

### Étudiants (Token requis)
```
GET  /api/vue-notes/mes-notes                    # Mes notes
GET  /api/vue-notes/mes-notes/semestre/:id       # Notes par semestre
GET  /api/vue-notes/mes-moyennes                 # Mes moyennes
```

### Administrateurs (Token admin requis)
```
GET  /api/vue-notes/admin/notes                  # Toutes les notes
GET  /api/vue-notes/admin/notes/etudiant/:id     # Notes d'un étudiant
GET  /api/vue-notes/admin/moyennes               # Toutes les moyennes
GET  /api/vue-notes/admin/moyennes/semestre/:id  # Moyennes par semestre
```

### Format de réponse
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-21T10:30:00Z",
    "version": "1.0"
  }
}
```

---

## 🎨 Interface Utilisateur

### Pages Principales

1. **Login** (`/login`)
   - Formulaire de connexion
   - Choix étudiant/administrateur

2. **Dashboard** (`/`)
   - Vue personnalisée selon le rôle
   - Cartes d'action rapide

3. **Liste des Semestres** (`/semestres`) [Admin]
   - Tous les semestres disponibles
   - Navigation vers liste des étudiants

4. **Liste des Étudiants** (`/etudiants/:semestreId`) [Admin]
   - Tableau avec moyennes S1-S4
   - Clic sur moyenne → Relevé correspondant
   - Clic sur "Voir fiche" → Fiche détaillée

5. **Fiche Étudiant** (`/etudiant/:id`)
   - Informations personnelles
   - Statistiques globales
   - Tableau des moyennes
   - Boutons "Relevé L1" et "Relevé L2"

6. **Relevé de Notes** (`/releve/:etudiantId`)
   - Format officiel ITU
   - S1+S2 (L1) ou S3+S4 (L2)
   - Détail par UE avec crédits
   - Bouton d'impression

---

## 🛠️ Technologies Utilisées

### Backend
- ☕ **Java 17** avec **Spring Boot 3.2.0**
- 🗄️ **MySQL 8.0** avec vues SQL
- 🔐 **JWT** pour l'authentification
- 📦 **Maven** pour la gestion des dépendances
- 🏥 **Spring Actuator** pour le health check

### Frontend
- 🖼️ **Vue.js 3** avec Composition API
- 🛣️ **Vue Router** pour la navigation
- 📡 **Axios** pour les appels API
- 🎨 **CSS3** avec gradients modernes
- 🚀 **Vite** pour le build
- 🌐 **Nginx** pour le reverse proxy

### DevOps
- 🐳 **Docker** & **Docker Compose**
- 🏗️ **Multi-stage builds** pour optimisation
- 🔍 **Health checks** automatiques
- 📊 **Logs centralisés**

---

## ⚙️ Variables d'Environnement

### Backend (.env dans WS_ETU003103_ETU003248/)
```env
DB_ROOT_PASSWORD=root_password_123
DB_NAME=notes_db
DB_USER=notes_user
DB_PASSWORD=notes_pass_456
DB_PORT=3306
API_PORT=3000
JWT_SECRET=your_super_secret_key
```

---

## 🧪 Tests

### Tester l'API avec curl
```bash
# Login étudiant
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean.rakoto@univ.mg","password":"jeanpass"}'

# Login admin
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@univ.mg","mot_de_passe":"adminpass"}'

# Obtenir les notes (avec token)
curl http://localhost:3000/api/vue-notes/mes-notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Collection Postman
Une collection complète est disponible dans `postman/notes-api-complete-avec-vues.postman_collection.json`

---

## 📝 Données de Test

La base de données est pré-remplie avec :
- ✅ 3 étudiants (Jean, Marie, Paul)
- ✅ 1 administrateur
- ✅ 2 parcours (L1-INFO, L2-INFO)
- ✅ 4 semestres (S1, S2, S3, S4)
- ✅ 15+ matières avec crédits
- ✅ Notes variées pour chaque étudiant

---

## 🐛 Dépannage

### Le port 80 est déjà utilisé
```bash
# Changer le port du frontend dans docker-compose.yml
ports:
  - "8080:80"  # Au lieu de "80:80"
```

### Erreur de connexion à la base de données
```bash
# Vérifier que le service DB est healthy
docker-compose ps

# Voir les logs de la DB
docker-compose logs db
```

### Le frontend affiche "Network Error"
```bash
# Vérifier que le backend est accessible
curl http://localhost:3000/actuator/health

# Reconstruire le frontend
docker-compose up -d --build frontend
```

### Réinitialiser complètement
```bash
# Tout supprimer et recommencer
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📚 Documentation Supplémentaire

- `WS_ETU003103_ETU003248/README.md` - Documentation backend
- `projetNode/README_APP.md` - Documentation frontend
- `GUIDE_TEST_POSTMAN.md` - Guide de test avec Postman
- `ADMIN_FEATURES.md` - Fonctionnalités administrateur

---

## ✅ Checklist de Vérification

Après `docker-compose up -d`, vérifiez :

- [ ] `docker-compose ps` montre 3 services "Up" et "healthy"
- [ ] http://localhost affiche la page de login
- [ ] http://localhost:3000/actuator/health retourne `{"status":"UP"}`
- [ ] Login étudiant fonctionne
- [ ] Login admin fonctionne
- [ ] Navigation entre les pages est fluide
- [ ] Les relevés s'affichent correctement
- [ ] L'impression des relevés fonctionne

---

## 👥 Auteurs

- **ETU003103** - Backend & Base de données
- **ETU003248** - Frontend & Intégration

---

## 📄 Licence

Projet académique - ITU University © 2025

---

## 🎓 Note pour le Professeur

Cette application démontre :
- ✅ Architecture microservices avec Docker
- ✅ API REST sécurisée avec JWT
- ✅ Optimisation SQL avec vues
- ✅ Frontend moderne Vue.js
- ✅ Déploiement conteneurisé complet
- ✅ Reverse proxy Nginx
- ✅ Health checks et monitoring
- ✅ Séparation des préoccupations (Frontend/Backend/DB)

**Commande unique pour tout lancer** : `docker-compose up -d`

**Interface accessible immédiatement** : http://localhost

Merci de votre attention ! 🙏
