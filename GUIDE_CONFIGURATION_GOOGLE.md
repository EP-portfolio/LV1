# 📝 Guide de configuration Google - Étape par étape

## 🎯 Ce que vous devez faire

Votre application utilise maintenant **Google** au lieu d'OpenAI. Vous devez :
1. Modifier votre fichier `.env.local`
2. Obtenir une clé API Google
3. Activer les APIs nécessaires dans GCP

---

## 📋 Étape 1 : Modifier votre fichier .env.local

### Ouvrez votre fichier `.env.local`

Le fichier se trouve à la racine de votre projet : `C:\Users\lenovo\Desktop\FREELANCE\appli_lv1\.env.local`

### Modifications à faire

#### ✅ Si vous aviez OpenAI, remplacez ou commentez :

```env
# Ancien (OpenAI) - Vous pouvez le garder commenté ou le supprimer
# OPENAI_API_KEY="sk-..."
```

#### ✅ Ajoutez la configuration Google :

```env
# ============================================
# GOOGLE CONFIGURATION (OBLIGATOIRE)
# ============================================

# Fournisseur LLM (par défaut: google)
LLM_PROVIDER="google"

# Clé API Google (à obtenir ci-dessous)
GOOGLE_API_KEY="votre-cle-api-google-ici"

# Modèle Gemini (optionnel, gemini-pro par défaut)
GOOGLE_MODEL="gemini-pro"
```

### 📝 Exemple de fichier .env.local complet

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ============================================
# GOOGLE CONFIGURATION (NOUVEAU)
# ============================================
LLM_PROVIDER="google"
GOOGLE_API_KEY="votre-cle-api-google-ici"
GOOGLE_MODEL="gemini-pro"

# ============================================
# NEXT.JS CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔑 Étape 2 : Obtenir votre clé API Google

### Option A : Si vous avez déjà un compte GCP

1. **Allez sur [Google Cloud Console](https://console.cloud.google.com/)**
2. **Sélectionnez votre projet** (ou créez-en un nouveau)
3. **Allez dans "APIs & Services" → "Credentials"**
4. **Cliquez sur "Create Credentials" → "API Key"**
5. **Copiez la clé API** qui s'affiche
6. **Collez-la dans votre `.env.local`** à la place de `votre-cle-api-google-ici`

### Option B : Si vous n'avez pas de compte GCP

1. **Créez un compte Google** (si vous n'en avez pas)
2. **Allez sur [Google Cloud Console](https://console.cloud.google.com/)**
3. **Acceptez les conditions** et créez un nouveau projet :
   - Cliquez sur le sélecteur de projet en haut
   - Cliquez sur "New Project"
   - Donnez un nom (ex: "appli-lv1")
   - Cliquez sur "Create"
4. **Suivez ensuite l'Option A** ci-dessus

---

## ⚙️ Étape 3 : Activer les APIs nécessaires

Votre clé API doit avoir accès à **2 APIs** :

### API 1 : Generative Language API (Gemini)

1. Dans [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Library**
3. Recherchez "**Generative Language API**"
4. Cliquez dessus
5. Cliquez sur **"Enable"** (Activer)

### API 2 : Cloud Text-to-Speech API

1. Toujours dans **APIs & Services** → **Library**
2. Recherchez "**Cloud Text-to-Speech API**"
3. Cliquez dessus
4. Cliquez sur **"Enable"** (Activer)

---

## 🔒 Étape 4 : Sécuriser votre clé API (Recommandé)

1. **APIs & Services** → **Credentials**
2. **Cliquez sur votre clé API** (celle que vous venez de créer)
3. Dans **"API restrictions"** :
   - Sélectionnez **"Restrict key"**
   - Choisissez ces APIs uniquement :
     - ✅ **Generative Language API**
     - ✅ **Cloud Text-to-Speech API**
4. **Sauvegardez**

⚠️ **Important** : Cela limite l'utilisation de votre clé à ces APIs uniquement, ce qui est plus sécurisé.

---

## ✅ Étape 5 : Vérifier que tout fonctionne

1. **Sauvegardez** votre fichier `.env.local`
2. **Redémarrez votre serveur** :
   ```bash
   # Arrêtez le serveur (Ctrl+C si il tourne)
   npm run dev
   ```
3. **Testez l'application** :
   - Allez sur `/practice/translation-fr-en`
   - Cliquez sur "Nouvelle question"
   - Si une question s'affiche, c'est bon ! ✅

---

## 🆘 Problèmes courants

### ❌ Erreur : "GOOGLE_API_KEY is not configured"

**Solution :**
- Vérifiez que `GOOGLE_API_KEY` est bien dans `.env.local`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé
- Redémarrez le serveur

### ❌ Erreur : "API key not valid"

**Solution :**
- Vérifiez que vous avez bien copié toute la clé
- Vérifiez que les APIs sont activées (Étape 3)
- Vérifiez que la clé n'est pas restreinte à un domaine/IP spécifique

### ❌ Erreur : "Cloud Text-to-Speech API not enabled"

**Solution :**
- Activez l'API "Cloud Text-to-Speech API" dans GCP Console (Étape 3)

### ❌ Erreur : "Quota exceeded"

**Solution :**
- Vérifiez vos quotas dans GCP Console → APIs & Services → Dashboard
- Le plan gratuit de Gemini a des limites (60 requêtes/minute, 1500/jour)

---

## 📊 Résumé des informations nécessaires

| Information | Où l'obtenir | Exemple |
|------------|--------------|---------|
| **GOOGLE_API_KEY** | GCP Console → Credentials → Create API Key | `AIzaSyB...` |
| **LLM_PROVIDER** | Toujours `"google"` | `"google"` |
| **GOOGLE_MODEL** | Optionnel, par défaut `"gemini-pro"` | `"gemini-pro"` |

---

## 💡 Astuce

Si vous avez déjà une clé API Google pour un autre projet, vous pouvez la réutiliser ! Assurez-vous juste que les APIs nécessaires sont activées dans le projet associé.

---

## 📚 Ressources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentation Gemini](https://ai.google.dev/docs)
- [Documentation Text-to-Speech](https://cloud.google.com/text-to-speech/docs)

---

## ✅ Checklist finale

- [ ] Fichier `.env.local` modifié avec `GOOGLE_API_KEY`
- [ ] Clé API Google obtenue depuis GCP Console
- [ ] API "Generative Language API" activée
- [ ] API "Cloud Text-to-Speech API" activée
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Test effectué (une question s'affiche)

Une fois tout coché, vous êtes prêt ! 🎉

