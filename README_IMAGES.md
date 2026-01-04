# 🖼️ Récupération automatique d'images pour le vocabulaire

## 📋 Description

Ce script récupère automatiquement des images pour tous les mots de vocabulaire en utilisant l'API Pexels (gratuite) ou Unsplash.

## ⚙️ Configuration

### Option 1 : Pexels (Recommandé - Gratuit)

1. **Obtenir une clé API (optionnel mais recommandé)** :
   - Aller sur https://www.pexels.com/api/
   - Créer un compte gratuit
   - Obtenir votre clé API
   - Ajouter dans `.env.local` :
   ```env
   IMAGE_PROVIDER=pexels
   PEXELS_API_KEY=votre-clé-pexels
   ```

2. **Sans clé API** :
   - Pexels fonctionne sans clé mais avec des limites strictes
   - Ajouter dans `.env.local` :
   ```env
   IMAGE_PROVIDER=pexels
   ```

### Option 2 : Unsplash (Gratuit avec clé)

1. Aller sur https://unsplash.com/developers
2. Créer une application
3. Obtenir votre Access Key
4. Ajouter dans `.env.local` :
   ```env
   IMAGE_PROVIDER=unsplash
   UNSPLASH_ACCESS_KEY=votre-clé-unsplash
   ```

## 🚀 Utilisation

### Lancer le script

```bash
npm run fetch-images
```

### Ce que fait le script

1. ✅ Récupère tous les mots de vocabulaire **sans image**
2. 🔍 Cherche une image pour chaque mot (en utilisant le mot anglais)
3. 💾 Met à jour la base de données avec l'URL de l'image
4. ⏸️  Respecte les limites de rate limiting (délai entre requêtes)
5. 📊 Affiche la progression et les statistiques

### Exemple de sortie

```
🖼️  Récupération d'images pour les mots de vocabulaire...

📡 Provider: pexels
⏱️  Délai entre requêtes: 200ms

📊 306 mots sans image à traiter

📦 Lot 1/7 (50 mots)
   [1/306] pain → bread... ✅
   [2/306] lait → milk... ✅
   [3/306] fromage → cheese... ✅
   ...

🎉 Récupération terminée !
   ✅ Images récupérées: 280
   ⚠️  Aucune image trouvée: 20
   ❌ Erreurs: 6
   📊 Total avec images: 280/306
```

## ⚠️ Limitations

- **Pexels sans clé** : ~50 requêtes/heure
- **Pexels avec clé** : 200 requêtes/heure (gratuit)
- **Unsplash** : 50 requêtes/heure (gratuit)

Pour 306 mots, il faudra environ **2-3 heures** avec Pexels gratuit (délai de 200ms entre requêtes).

## 🔄 Relancer le script

Le script ne traite que les mots **sans image**. Vous pouvez le relancer à tout moment :

```bash
npm run fetch-images
```

Il reprendra là où il s'est arrêté et ne traitera que les mots restants.

## 🛠️ Personnalisation

Vous pouvez modifier les paramètres dans `scripts/fetch-images-for-vocab.ts` :

- `DELAY_BETWEEN_REQUESTS` : Délai entre chaque requête (défaut: 200ms)
- `BATCH_SIZE` : Nombre de mots par lot (défaut: 50)

