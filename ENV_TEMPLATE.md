# Template du fichier .env.local

## 📝 Instructions

1. **Créez un fichier `.env.local`** à la racine du projet
2. **Copiez le contenu ci-dessous**
3. **Remplacez les valeurs** par vos vraies clés

## ⚠️ Important

- Le fichier `.env.local` est déjà dans `.gitignore`
- **NE COMMITEZ JAMAIS** ce fichier dans Git
- **NE PARTAGEZ JAMAIS** vos clés API

---

## 📋 Contenu du fichier .env.local

```env
# ============================================
# SUPABASE (OBLIGATOIRE)
# ============================================
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ============================================
# OPENAI (OBLIGATOIRE pour exercices)
# ============================================
OPENAI_API_KEY="sk-..."

# ============================================
# IMAGES (OPTIONNEL - Pexels par défaut)
# ============================================
IMAGE_PROVIDER="pexels"
# PEXELS_API_KEY="..."  # Optionnel
# UNSPLASH_ACCESS_KEY="..."  # Si vous utilisez Unsplash

# ============================================
# NEXT.JS (OBLIGATOIRE)
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔍 Où trouver chaque valeur ?

### Supabase

1. **DATABASE_URL** :
   - Dashboard Supabase → **Settings** → **Database**
   - Section **Connection string**
   - Choisir **URI**
   - Remplacer `[YOUR-PASSWORD]` par votre mot de passe

2. **NEXT_PUBLIC_SUPABASE_URL** :
   - Dashboard Supabase → **Settings** → **API**
   - Section **Project URL**
   - Copier l'URL complète

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** :
   - Dashboard Supabase → **Settings** → **API**
   - Section **Project API keys**
   - Copier la clé **anon** **public**

4. **SUPABASE_SERVICE_ROLE_KEY** :
   - Dashboard Supabase → **Settings** → **API**
   - Section **Project API keys**
   - Copier la clé **service_role** **secret**

### OpenAI

- **OPENAI_API_KEY** :
  - Aller sur https://platform.openai.com
  - **API keys** → **Create new secret key**
  - Copier la clé (elle ne sera plus visible après)

### Images (Optionnel)

- **PEXELS_API_KEY** (optionnel) :
  - https://www.pexels.com/api/
  - Créer un compte gratuit
  - Obtenir la clé API

- **UNSPLASH_ACCESS_KEY** (si vous utilisez Unsplash) :
  - https://unsplash.com/developers
  - Créer une application
  - Obtenir l'Access Key

---

## ✅ Vérification

Après avoir créé le fichier `.env.local`, vérifiez :

```bash
# Vérifier que le fichier existe
ls .env.local

# Tester la connexion à la base de données
npm run db:push

# Lancer l'application
npm run dev
```

Si tout fonctionne, vous verrez l'application sur http://localhost:3000

---

## 📊 Variables par priorité

### 🔴 Obligatoires (sans elles, l'app ne fonctionne pas)

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (pour les exercices)
- `NEXT_PUBLIC_APP_URL`

### 🟡 Optionnelles (l'app fonctionne sans, mais avec limitations)

- `IMAGE_PROVIDER` (défaut: pexels)
- `PEXELS_API_KEY` (Pexels fonctionne sans clé, mais limité)
- `UNSPLASH_ACCESS_KEY` (si vous utilisez Unsplash)

---

## 💡 Exemple minimal (pour démarrer rapidement)

```env
# Minimum requis pour tester
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
SUPABASE_SERVICE_ROLE_KEY="votre-service-key"
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Avec cette configuration minimale :
- ✅ L'authentification fonctionne
- ✅ Les exercices fonctionnent
- ✅ Les images fonctionnent (Pexels sans clé, usage limité)

