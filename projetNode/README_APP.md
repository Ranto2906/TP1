# Application de Gestion des Relevés de Notes - ITU

Application web Vue.js 3 pour consulter les relevés de notes et moyennes des étudiants, inspirée du système ITU.

## 🎯 Fonctionnalités

### Pour les Administrateurs
- ✅ Connexion administrateur sécurisée
- 📋 Liste de tous les semestres
- 👥 Liste des étudiants par semestre avec moyennes S1 à S4
- 📊 Vue détaillée de chaque étudiant
- 📄 Génération de relevés de notes par niveau (L1, L2)
- 🖨️ Impression des relevés au format ITU

### Pour les Étudiants
- ✅ Connexion étudiant sécurisée
- 📊 Consultation de ses propres moyennes
- 📄 Accès à ses relevés de notes
- 📈 Vue d'ensemble de son parcours académique

## 🏗️ Architecture

```
src/
├── views/              # Pages principales
│   ├── Login.vue       # Page de connexion
│   ├── Dashboard.vue   # Tableau de bord
│   ├── ListeSemestres.vue    # Liste des semestres (admin)
│   ├── ListeEtudiants.vue    # Liste des étudiants avec moyennes
│   ├── FicheEtudiant.vue     # Fiche détaillée d'un étudiant
│   └── ReleveNotes.vue       # Relevé de notes format ITU
├── services/
│   └── api.js         # Services API et authentification
├── router/
│   └── index.js       # Configuration des routes
└── App.vue            # Composant racine
```

## 📋 Pages et Navigation

### 1. Login (`/login`)
- Authentification étudiant ou administrateur
- Stockage JWT dans localStorage

### 2. Dashboard (`/`)
- Vue d'accueil personnalisée
- Accès rapide aux fonctionnalités selon le rôle

### 3. Liste des Semestres (`/semestres`) - Admin uniquement
- Affichage de tous les semestres
- Nombre d'étudiants par semestre
- Navigation vers la liste des étudiants

### 4. Liste des Étudiants (`/semestres/:idSemestre/etudiants`) - Admin
- Tableau avec colonnes : N°, Nom, Prénom, Parcours
- **Moyennes S1, S2, S3, S4 cliquables** → Ouvre le relevé correspondant
- Bouton "Voir la fiche" → Ouvre la fiche complète de l'étudiant

### 5. Fiche Étudiant (`/etudiants/:idEtudiant`)
- Informations personnelles de l'étudiant
- Tableau des moyennes par semestre
- Statistiques globales (moyenne générale, crédits)
- **Liens L1 et L2** pour afficher les relevés S1+S2 ou S3+S4

### 6. Relevé de Notes (`/etudiants/:idEtudiant/releve/:niveau`)
- Format inspiré des relevés ITU officiels
- Affichage des notes par UE avec crédits
- Calcul de la moyenne générale et mention
- Fonction d'impression

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 🔌 Configuration API

L'application se connecte à l'API Spring Boot sur `http://localhost:3000/api`

### Endpoints utilisés :

**Authentification :**
- `POST /api/auth/login` - Login étudiant
- `POST /api/auth/admin/login` - Login admin

**Notes et Moyennes (Étudiant) :**
- `GET /api/vue-notes/mes-notes` - Toutes mes notes
- `GET /api/vue-notes/mes-notes/semestre/:id` - Notes par semestre
- `GET /api/vue-notes/mes-moyennes` - Toutes mes moyennes

**Notes et Moyennes (Admin) :**
- `GET /api/vue-notes/admin/notes` - Toutes les notes
- `GET /api/vue-notes/admin/notes/etudiant/:id` - Notes d'un étudiant
- `GET /api/vue-notes/admin/moyennes` - Toutes les moyennes
- `GET /api/vue-notes/admin/moyennes/semestre/:id` - Moyennes par semestre

## 👤 Comptes de Test

### Étudiant
- Email: `jean.rakoto@univ.mg`
- Mot de passe: `jeanpass`

### Administrateur
- Email: `admin@univ.mg`
- Mot de passe: `adminpass`

## 🎨 Design

- Interface moderne et responsive
- Dégradés de couleurs (#667eea → #764ba2)
- Style relevé de notes identique au format ITU
- Animations et transitions fluides
- Support de l'impression pour les relevés

## 🔐 Sécurité

- Authentification JWT
- Routes protégées par guards
- Vérification des permissions (admin vs étudiant)
- Redirection automatique si non authentifié
- Tokens stockés en localStorage

## 📱 Responsive

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (>1024px)
- Tablet (768px - 1024px)
- Mobile (<768px)

## 🖨️ Impression

Les relevés de notes sont optimisés pour l'impression :
- Format A4
- Mise en page respectant le style ITU
- Suppression des éléments de navigation lors de l'impression

## 🛠️ Technologies

- **Vue.js 3** - Framework JavaScript
- **Vue Router 4** - Gestion de la navigation
- **Axios** - Client HTTP pour les appels API
- **Vite** - Build tool moderne et rapide

## 📝 Notes Importantes

1. **Moyennes cliquables** : Dans la liste des étudiants, cliquer sur une moyenne (S1, S2, S3, S4) ouvre directement le relevé correspondant (L1 pour S1-S2, L2 pour S3-S4)

2. **Options de parcours** : L'application gère automatiquement les différentes options de parcours affichées dans les tableaux

3. **Sessions** : Les dates de session sont affichées pour chaque note et semestre

4. **Calculs automatiques** : Moyennes, crédits obtenus, mentions sont calculés automatiquement

## 🐛 Dépannage

### L'API ne répond pas
Vérifiez que le backend Spring Boot est démarré sur le port 3000 :
```bash
cd ../WS_ETU003103_ETU003248
docker-compose up -d
```

### Erreur CORS
Si vous rencontrez des erreurs CORS, vérifiez la configuration Spring Security dans le backend.

### Token expiré
Les tokens JWT expirent après 24h. Reconnectez-vous si nécessaire.

## 📄 Licence

Projet académique - ITU University © 2025
