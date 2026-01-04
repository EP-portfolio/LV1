# Configuration complète Google (Gemini + Text-to-Speech)

## 🎯 Migration complète vers Google

Votre application utilise maintenant **100% Google** :
- ✅ **Google Gemini** pour les questions et évaluations (LLM)
- ✅ **Google Cloud Text-to-Speech** pour la génération audio

## 📋 Configuration requise

### 1. Activer les APIs dans GCP

Dans votre [Google Cloud Console](https://console.cloud.google.com/) :

1. **APIs & Services** → **Library**
2. Activez ces APIs :
   - ✅ **Generative Language API** (Gemini)
   - ✅ **Cloud Text-to-Speech API**

### 2. Créer une clé API

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **API Key**
3. Copiez la clé
4. **Optionnel** : Restreindre la clé aux APIs nécessaires :
   - Generative Language API
   - Cloud Text-to-Speech API

### 3. Configuration .env.local

Ajoutez dans votre fichier `.env.local` :

```env
# ============================================
# GOOGLE CONFIGURATION (OBLIGATOIRE)
# ============================================

# Fournisseur LLM (par défaut: google)
LLM_PROVIDER="google"

# Clé API Google (utilisée pour Gemini ET Text-to-Speech)
GOOGLE_API_KEY="votre-cle-api-google-ici"

# Modèle Gemini (optionnel)
GOOGLE_MODEL="gemini-pro"  # Options: gemini-pro, gemini-1.5-pro
```

**C'est tout !** Une seule clé API pour tout.

## ✅ Vérification

1. Redémarrez votre serveur :
   ```bash
   npm run dev
   ```

2. Testez les fonctionnalités :
   - **Questions de traduction** : `/practice/translation-fr-en`
   - **Exercices audio** : `/practice/multimedia`
   - **Exercices avec images** : `/practice/multimedia`

## 💰 Tarification Google

### Gemini (gratuit jusqu'à un certain usage)
- **60 requêtes/minute**
- **1,500 requêtes/jour**
- Modèle `gemini-pro` : Gratuit
- Modèle `gemini-1.5-pro` : Payant

### Text-to-Speech
- **Gratuit** : 0-4 millions de caractères/mois
- **Payant** : Au-delà, voir [tarification](https://cloud.google.com/text-to-speech/pricing)

## 🔍 Dépannage

### Erreur : "GOOGLE_API_KEY is not configured"

**Solution :**
- Vérifiez que `GOOGLE_API_KEY` est dans `.env.local`
- Redémarrez le serveur

### Erreur : "API key not valid"

**Solution :**
- Vérifiez que la clé est correcte
- Vérifiez que les APIs sont activées dans GCP
- Vérifiez que la clé n'est pas restreinte à un domaine/IP

### Erreur : "Cloud Text-to-Speech API not enabled"

**Solution :**
- Activez l'API "Cloud Text-to-Speech API" dans GCP Console

### Erreur audio : "No audio content returned"

**Solution :**
- Vérifiez que l'API Text-to-Speech est activée
- Vérifiez que votre clé API a accès à cette API
- Vérifiez vos quotas dans GCP Console

## 📝 Notes importantes

1. **Une seule clé API** : La même clé `GOOGLE_API_KEY` est utilisée pour Gemini ET Text-to-Speech
2. **Pas besoin de credentials de service account** : L'API REST fonctionne avec une simple clé API
3. **Quotas** : Surveillez vos quotas dans GCP Console → APIs & Services → Dashboard

## 🆘 Support

- [Documentation Gemini](https://ai.google.dev/docs)
- [Documentation Text-to-Speech](https://cloud.google.com/text-to-speech/docs)
- [GCP Console](https://console.cloud.google.com/)

