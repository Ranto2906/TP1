# Redémarrage de l'application

## Problèmes corrigés :

1. ✅ **Network Error** : Ajout du proxy Vite pour rediriger les appels API vers `http://localhost:3000`
2. ✅ **Affichage trop petit** : Augmentation de toutes les tailles (de 440px → 600px, polices agrandies)

## Pour appliquer les modifications :

### Étape 1 : Arrêter le serveur Vite actuel
Dans le terminal qui exécute `npm run dev`, appuyez sur **Ctrl+C**

### Étape 2 : Redémarrer le serveur
```powershell
cd C:\Users\ranto\Documents\S5\MrRojo\TP1\projetNode
npm run dev
```

### Étape 3 : Recharger la page dans le navigateur
- Ouvrez http://localhost:5173
- Appuyez sur **Ctrl+Shift+R** (rechargement forcé avec vidage du cache)

## Test de connexion :

### Connexion Administrateur :
- Email : `admin@univ.mg`
- Mot de passe : `adminpass`
- ☑️ Cocher "Se connecter en tant qu'administrateur"

### Connexion Étudiant :
- Email : `jean.rakoto@univ.mg`
- Mot de passe : `jeanpass`
- ☐ Laisser décoché

## Vérification :

Si vous voyez toujours "Network Error" :
1. Vérifiez que l'API backend tourne : `docker ps --filter "name=notes"`
2. Vérifiez que le port 3000 est accessible : `curl http://localhost:3000/api/auth/login`
3. Ouvrez la console du navigateur (F12) pour voir les erreurs détaillées

## Configuration du proxy Vite :

Le fichier `vite.config.js` a été modifié pour inclure :
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

Cela permet aux appels à `/api/*` d'être automatiquement redirigés vers `http://localhost:3000/api/*`
