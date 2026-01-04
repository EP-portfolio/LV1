# Configuration des images d'illustration

## 🖼️ Système de recherche d'images

L'application utilise maintenant la **recherche d'images** au lieu de la génération DALL-E. Cela permet d'utiliser des images d'illustration de qualité trouvées sur internet.

## 📚 Fournisseurs disponibles

### 1. Pexels (Recommandé - Gratuit)

**Avantages :**
- ✅ Gratuit et illimité
- ✅ Pas besoin de clé API pour un usage limité
- ✅ Images de haute qualité
- ✅ Bonne variété d'illustrations

**Configuration :**
```env
IMAGE_PROVIDER=pexels
# Optionnel : pour plus de requêtes
PEXELS_API_KEY=votre-clé-pexels
```

**Obtenir une clé (optionnel) :**
1. Aller sur https://www.pexels.com/api/
2. Créer un compte gratuit
3. Obtenir votre clé API
4. Ajouter `PEXELS_API_KEY` dans `.env.local`

**Sans clé :** Fonctionne quand même avec un usage limité (50 requêtes/heure)

### 2. Unsplash (Gratuit avec clé)

**Avantages :**
- ✅ Gratuit
- ✅ Images de très haute qualité
- ✅ Grande base de données

**Configuration :**
```env
IMAGE_PROVIDER=unsplash
UNSPLASH_ACCESS_KEY=votre-clé-unsplash
```

**Obtenir une clé :**
1. Aller sur https://unsplash.com/developers
2. Créer une application
3. Obtenir votre Access Key
4. Ajouter `UNSPLASH_ACCESS_KEY` dans `.env.local`

**Limite :** 50 requêtes/heure en gratuit

## 🔧 Configuration

### Option 1 : Utiliser Pexels (recommandé)

Dans `.env.local` :
```env
IMAGE_PROVIDER=pexels
# PEXELS_API_KEY est optionnel
```

### Option 2 : Utiliser Unsplash

Dans `.env.local` :
```env
IMAGE_PROVIDER=unsplash
UNSPLASH_ACCESS_KEY=votre-clé-unsplash
```

### Option 3 : Sans configuration

Si vous ne configurez rien, Pexels sera utilisé par défaut (sans clé, usage limité).

## 🎯 Comment ça fonctionne

1. **Génération de la description** : Le LLM génère une phrase de traduction
2. **Extraction de mots-clés** : Le système extrait 2-3 mots-clés de la description
3. **Recherche d'image** : Recherche une image d'illustration correspondante
4. **Affichage** : L'image est affichée dans l'exercice

### Exemple

**Description générée :** "Je vais au bureau tous les matins"

**Mots-clés extraits :** "bureau", "travail", "matin"

**Image recherchée :** Illustration d'un bureau professionnel

## 💡 Avantages de cette approche

- ✅ **Gratuit** : Pas besoin d'OpenAI pour les images
- ✅ **Rapide** : Recherche instantanée
- ✅ **Qualité** : Images professionnelles d'illustration
- ✅ **Variété** : Grande base de données
- ✅ **Pédagogique** : Images réelles et pertinentes

## 🔄 Fallback automatique

Si le provider choisi ne trouve pas d'image :
1. Le système essaie automatiquement l'autre provider
2. Si toujours pas d'image, utilise un terme générique ("illustration")
3. Si échec total, retourne une erreur

## 📝 Variables d'environnement

```env
# Provider d'images (pexels ou unsplash)
IMAGE_PROVIDER=pexels

# Clé Pexels (optionnel)
PEXELS_API_KEY=votre-clé

# Clé Unsplash (requis si IMAGE_PROVIDER=unsplash)
UNSPLASH_ACCESS_KEY=votre-clé
```

## ✅ Test

Pour tester la recherche d'images :

```bash
npm run dev
```

Puis allez sur `/practice/multimedia` et sélectionnez un exercice avec image.

