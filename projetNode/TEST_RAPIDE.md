# Guide de Test Rapide - Mode Développement

## ⚡ Test Immédiat (sans attendre Docker)

### 1. Backend déjà lancé ✅
Le backend tourne sur `http://localhost:3000` (vérifié avec Postman)

### 2. Lancer le Frontend en mode développement

```powershell
cd C:\Users\ranto\Documents\S5\MrRojo\TP1\projetNode
npm run dev
```

### 3. Ouvrir le navigateur
http://localhost:5173

### 4. Tester la connexion

**Admin:**
- Email: `admin@univ.mg`
- Mot de passe: `adminpass`
- ☑️ Cocher "administrateur"

**Étudiant:**
- Email: `jean.rakoto@univ.mg`
- Mot de passe: `jeanpass`

---

## 🐳 Mode Production Docker (quand la construction est terminée)

```powershell
# Vérifier l'état
docker-compose ps

# Une fois tous les services "healthy":
# Frontend: http://localhost
# Backend: http://localhost:3000
```

---

## 🔧 Configuration actuelle

Le fichier `vite.config.js` contient un proxy qui redirige `/api` vers `http://localhost:3000`:

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

Le fichier `api.js` utilise l'URL relative `/api` qui fonctionne avec:
- Le proxy Vite (développement sur port 5173)
- Le proxy Nginx (production Docker sur port 80)

---

## 📝 Logs utiles

```powershell
# Logs du frontend (mode dev)
# Regardez dans le terminal où vous avez lancé `npm run dev`

# Logs du backend
docker logs notes_api -f

# Logs de tous les services Docker
docker-compose logs -f
```

---

## ✅ Vérification rapide

1. Backend répond ? 
   ```powershell
   curl http://localhost:3000/actuator/health
   ```
   Doit retourner: `{"status":"UP"}`

2. Frontend démarre ?
   ```powershell
   npm run dev
   ```
   Doit afficher: `Local: http://localhost:5173/`

3. Login fonctionne ?
   - Ouvrez http://localhost:5173
   - Essayez de vous connecter
   - Ouvrez F12 (console navigateur) pour voir les erreurs

---

## 🐛 Si Network Error persiste

1. Vérifiez la console du navigateur (F12)
2. Regardez l'onglet "Network" pour voir les requêtes
3. Vérifiez que la requête va bien vers `/api/auth/login` ou `/api/auth/admin/login`
4. Si erreur CORS, vérifiez que le proxy Vite fonctionne

---

## 🎯 Solution la plus rapide MAINTENANT

```powershell
# Terminal 1: Backend déjà lancé ✅

# Terminal 2: Lancer le frontend
cd C:\Users\ranto\Documents\S5\MrRojo\TP1\projetNode
npm run dev
```

Puis ouvrez: http://localhost:5173
