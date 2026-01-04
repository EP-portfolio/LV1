# Configuration Google Gemini avec GCP

## 🎯 Configuration pour utiliser Google Gemini au lieu d'OpenAI

Ce guide vous explique comment configurer votre application pour utiliser Google Gemini avec votre code GCP.

## 📋 Prérequis

1. Un compte Google Cloud Platform (GCP)
2. Un projet GCP actif
3. Les APIs suivantes activées dans votre projet :
   - **Generative Language API** (Gemini)
   - **Cloud Text-to-Speech API** (pour la génération audio)

## 🔧 Étapes de configuration

### 1. Obtenir une clé API Gemini (Méthode simple - Recommandée)

**Option A : Google AI Studio (Plus simple)**
1. Allez sur : https://makersuite.google.com/app/apikey
   - Ou : https://aistudio.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"** ou **"Get API Key"**
4. Sélectionnez un projet ou créez-en un nouveau
5. Copiez la clé API générée (commence par "AIza")

**Option B : Google Cloud Console**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet (ou créez-en un nouveau)
3. Allez dans **APIs & Services** → **Library**
4. Recherchez et activez :
   - **"Generative Language API"** ou **"Vertex AI API"**
   - Ou allez directement : https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
5. Allez dans **APIs & Services** → **Credentials**
6. Cliquez sur **Create Credentials** → **API Key**
7. Copiez la clé API générée

### 3. Configurer les variables d'environnement

Ajoutez ou modifiez dans votre fichier `.env.local` :

```env
# Utiliser Google Gemini au lieu d'OpenAI
LLM_PROVIDER="google"
GOOGLE_API_KEY="votre-cle-api-gemini-ici"

# Optionnel : spécifier le modèle Gemini
# Options disponibles : gemini-2.5-flash (gratuit, rapide - RECOMMANDÉ), gemini-2.5-pro (payant, plus puissant)
# Autres options : gemini-2.0-flash, gemini-flash-latest, gemini-pro-latest
GOOGLE_MODEL="gemini-2.5-flash"
```

**Important :**
- Remplacez `votre-cle-api-gemini-ici` par votre vraie clé API
- Le modèle par défaut est `gemini-2.5-flash` (gratuit et rapide - RECOMMANDÉ)
- Pour plus de fonctionnalités, utilisez `gemini-2.5-pro` (payant)
- ⚠️ Les anciens modèles (`gemini-pro`, `gemini-1.5-flash`) n'existent plus

### 4. Redémarrer le serveur

Après avoir modifié `.env.local`, redémarrez votre serveur de développement :

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Allez sur une page d'exercice (ex: `/practice/translation-fr-en`)
2. Cliquez sur "Nouvelle question"
3. Si une question s'affiche, la configuration est correcte !

## 🔍 Dépannage

### Erreur : "GOOGLE_API_KEY is not configured"

**Solution :**
- Vérifiez que `GOOGLE_API_KEY` est bien dans `.env.local`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé
- Redémarrez le serveur

### Erreur : "API key not valid"

**Solution :**
- Vérifiez que la clé API est correcte
- Vérifiez que l'API Gemini est activée dans GCP
- Vérifiez que la clé n'est pas restreinte à un domaine/IP spécifique

### Erreur : "Quota exceeded"

**Solution :**
- Vérifiez vos quotas dans GCP Console → APIs & Services → Dashboard
- Le plan gratuit de Gemini a des limites (voir ci-dessous)

## 💰 Tarification Gemini

### Plan gratuit (gemini-2.5-flash)
- **Gratuit jusqu'à 15 requêtes par minute**
- **1 million de tokens par jour**
- Parfait pour le développement et les tests
- Rapide et efficace

### Plan payant (gemini-2.5-pro)
- **Tarification à l'usage**
- Plus de fonctionnalités (vision, etc.)
- Meilleure qualité de réponse
- Voir [Google AI Studio Pricing](https://ai.google.dev/pricing)

## 📝 Modèles disponibles (mis à jour janvier 2025)

| Modèle | Description | Usage | Tarif |
|--------|-------------|-------|-------|
| `gemini-2.5-flash` | ⭐ Modèle rapide et gratuit (RECOMMANDÉ) | Text generation, conversations | Gratuit |
| `gemini-2.5-pro` | Modèle avancé (payant) | Meilleure qualité, plus de tokens | Payant |
| `gemini-2.0-flash` | Modèle flash gratuit | Text generation | Gratuit |
| `gemini-flash-latest` | Alias vers le dernier flash | Text generation | Gratuit |
| `gemini-pro-latest` | Alias vers le dernier pro | Text generation | Payant |
| `gemini-pro` | ⚠️ Obsolète - Ne plus utiliser | - | - |
| `gemini-1.5-flash` | ⚠️ Obsolète - Ne plus utiliser | - | - |

## 🔄 Retour à OpenAI

Si vous voulez revenir à OpenAI :

```env
LLM_PROVIDER="openai"
OPENAI_API_KEY="votre-cle-openai"
```

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs du serveur (terminal où `npm run dev` tourne)
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les quotas dans GCP Console
4. Consultez la [documentation Gemini](https://ai.google.dev/docs)

## 📚 Ressources

- [Documentation Google Gemini](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [GCP Console](https://console.cloud.google.com/)

