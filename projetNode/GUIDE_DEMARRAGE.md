# 🚀 Guide de Démarrage Rapide

## ✅ L'application est maintenant lancée !

### 📍 URLs d'accès

- **Frontend Vue.js** : http://localhost:5173
- **Backend API** : http://localhost:3000

---

## 🔐 Connexion

### Ouvrez votre navigateur et allez sur : http://localhost:5173

Vous verrez la page de connexion. Deux types de comptes sont disponibles :

### 👨‍🎓 Compte Étudiant
```
Email: jean.rakoto@univ.mg
Mot de passe: jeanpass
```

### 👨‍💼 Compte Administrateur
```
Email: admin@univ.mg
Mot de passe: adminpass
```
☑️ **Cocher la case "Se connecter en tant qu'administrateur"**

---

## 🎯 Parcours Étudiant

1. **Connexion** avec le compte étudiant
2. **Dashboard** : Cliquez sur "Voir mes notes"
3. **Fiche Étudiant** : 
   - Consultez vos moyennes par semestre
   - Cliquez sur "Relevé L1" pour voir S1 + S2
   - Cliquez sur "Relevé L2" pour voir S3 + S4
4. **Relevé de Notes** :
   - Format officiel ITU
   - Bouton 🖨️ Imprimer pour sauvegarder en PDF

---

## 🎯 Parcours Administrateur

1. **Connexion** en tant qu'admin (☑️ cocher la case)
2. **Dashboard** : Cliquez sur "Voir les semestres"
3. **Liste des Semestres** : Cliquez sur n'importe quel semestre
4. **Liste des Étudiants** :
   - Tableau complet avec moyennes S1, S2, S3, S4
   - **Cliquez sur une moyenne** → Ouvre le relevé correspondant
   - **Cliquez sur "Voir la fiche"** → Fiche complète de l'étudiant
5. **Fiche Étudiant** :
   - Informations complètes
   - Statistiques
   - Accès aux relevés L1 et L2

---

## 📋 Fonctionnalités Principales

### ✨ Moyennes Cliquables
Dans la liste des étudiants, **cliquez directement sur une moyenne** :
- Moyenne S1 ou S2 → Ouvre le relevé L1 (Semestres 1 et 2)
- Moyenne S3 ou S4 → Ouvre le relevé L2 (Semestres 3 et 4)

### 📄 Relevés de Notes
- Format inspiré des relevés ITU
- Notes détaillées par UE avec crédits
- Calcul automatique des moyennes
- Mention et résultat
- Fonction d'impression optimisée

### 📊 Tableau de Bord
- Vue d'ensemble personnalisée
- Statistiques en temps réel
- Navigation intuitive

---

## 🛠️ Commandes Utiles

### Arrêter l'application frontend
```bash
# Dans le terminal où Vite tourne, appuyez sur Ctrl+C
```

### Relancer l'application
```bash
cd C:\Users\ranto\Documents\S5\MrRojo\TP1\projetNode
npm run dev
```

### Vérifier que le backend est lancé
```bash
cd C:\Users\ranto\Documents\S5\MrRojo\TP1\WS_ETU003103_ETU003248
docker-compose ps
```

### Relancer le backend si nécessaire
```bash
docker-compose up -d
```

---

## 📸 Captures d'écran des Pages

### 1. Login
- Formulaire de connexion
- Option admin/étudiant

### 2. Dashboard Étudiant
- Carte "Mes Notes"
- Carte "Moyennes"

### 3. Dashboard Admin
- Carte "Gestion des Semestres"

### 4. Liste des Étudiants (Admin)
```
+------+--------+---------+----------+------+------+------+------+
| N°   | Nom    | Prénom  | Parcours | S1   | S2   | S3   | S4   |
+------+--------+---------+----------+------+------+------+------+
| 001  | Rakoto | Jean    | L2-INFO  | 13.5 | 14.2 | 13.8 | 13.9 |
+------+--------+---------+----------+------+------+------+------+
```
👆 **Cliquez sur n'importe quelle moyenne !**

### 5. Fiche Étudiant
- Avatar avec initiales
- Informations personnelles
- Tableau des moyennes
- Boutons "Relevé L1" et "Relevé L2"
- Statistiques globales

### 6. Relevé de Notes
```
╔══════════════════════════════════════════════════════════╗
║         ITU - RELEVÉ DE NOTES                           ║
║                                                          ║
║  Prénom: Jean                                           ║
║  N° d'inscription: 000001                               ║
║                                                          ║
║  SEMESTRE 1                                             ║
║  +--------+---------------------------+--------+------+ ║
║  | UE     | Intitulé                  | Crédits| Note | ║
║  +--------+---------------------------+--------+------+ ║
║  | INF201 | Programmation orientée    | 6      | 11.5 | ║
║  | INF202 | Bases de données          | 6      | 9.25 | ║
║  +--------+---------------------------+--------+------+ ║
║  | SEMESTRE 1                        | 30     | 13.5 | ║
║  +--------+---------------------------+--------+------+ ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎨 Personnalisation

### Changer les couleurs
Éditez les gradients dans les fichiers `.vue` :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifier l'URL de l'API
Éditez `src/services/api.js` :
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

---

## ❓ Problèmes Courants

### Erreur "Failed to fetch"
➡️ Vérifiez que le backend Docker est lancé :
```bash
docker ps
```
Vous devez voir `notes_api` et `notes_db` en cours d'exécution.

### Page blanche
➡️ Ouvrez la console du navigateur (F12) pour voir les erreurs JavaScript.

### Erreur 401 Unauthorized
➡️ Votre token a expiré. Reconnectez-vous.

### Erreur CORS
➡️ Vérifiez la configuration Spring Security dans le backend.

---

## 📞 Support

Pour toute question, vérifiez :
1. Les logs du backend : `docker logs notes_api`
2. La console du navigateur (F12)
3. Le fichier `README_APP.md` pour plus de détails

---

## ✅ Checklist de Vérification

- [ ] Backend lancé (`docker ps` montre notes_api et notes_db)
- [ ] Frontend lancé (`npm run dev` affiche l'URL)
- [ ] Navigateur ouvert sur http://localhost:5173
- [ ] Connexion réussie
- [ ] Navigation fonctionnelle
- [ ] Relevés affichés correctement

---

## 🎉 Bon travail !

Votre application de gestion des relevés de notes est maintenant opérationnelle !

**Testez toutes les fonctionnalités :**
- ✅ Connexion admin et étudiant
- ✅ Navigation entre les pages
- ✅ Clics sur les moyennes
- ✅ Affichage des relevés L1 et L2
- ✅ Impression des relevés
- ✅ Déconnexion

Profitez de votre application ! 🚀
