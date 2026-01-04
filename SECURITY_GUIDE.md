# Guide de sécurité - Variables d'environnement

## ⚠️ IMPORTANT : Ne partagez JAMAIS vos clés API ou mots de passe

**Ne communiquez JAMAIS :**
- ❌ Votre mot de passe de base de données Supabase
- ❌ Vos clés API (OpenAI, Supabase, etc.)
- ❌ Vos tokens d'authentification
- ❌ Vos secrets d'application

Ces informations sont **confidentielles** et doivent rester privées.

---

## 🔐 Comment configurer les variables d'environnement

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet (il est déjà dans `.gitignore`, donc il ne sera pas commité).

### 2. Récupérer les informations depuis Supabase

#### A. URL de connexion PostgreSQL (DATABASE_URL)

1. Allez dans votre projet Supabase
2. **Settings** → **Database**
3. Section **Connection string**
4. Choisissez **URI** (pas "Session mode")
5. Copiez la chaîne de connexion
6. Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données

**Format :**
```
postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.xxxxx.supabase.co:5432/postgres
```

#### B. URL du projet (NEXT_PUBLIC_SUPABASE_URL)

1. **Settings** → **API**
2. Section **Project URL**
3. Copiez l'URL (format : `https://xxxxx.supabase.co`)

#### C. Clé anonyme (NEXT_PUBLIC_SUPABASE_ANON_KEY)

1. **Settings** → **API**
2. Section **Project API keys**
3. Copiez la clé **anon** **public** (celle-ci peut être exposée côté client)

#### D. Clé service role (SUPABASE_SERVICE_ROLE_KEY)

1. **Settings** → **API**
2. Section **Project API keys**
3. Copiez la clé **service_role** **secret**
4. ⚠️ **ATTENTION** : Cette clé ne doit JAMAIS être exposée côté client

### 3. Récupérer la clé OpenAI

1. Allez sur https://platform.openai.com
2. Connectez-vous ou créez un compte
3. Allez dans **API keys**
4. Créez une nouvelle clé API
5. ⚠️ **Copiez-la immédiatement** (elle ne sera plus visible après)

### 4. Remplir le fichier `.env.local`

Créez le fichier `.env.local` avec ce contenu :

```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# OpenAI Configuration
OPENAI_API_KEY="sk-..."

# Next.js Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Remplacez :**
- `[VOTRE_MOT_DE_PASSE]` par votre mot de passe Supabase
- `xxxxx` par l'ID de votre projet Supabase
- Les clés par vos vraies clés

---

## ✅ Vérification

Une fois configuré, testez que tout fonctionne :

```bash
# Vérifier que le fichier existe
ls .env.local

# Tester la connexion à la base de données
npm run db:push

# Lancer l'application
npm run dev
```

---

## 🔒 Bonnes pratiques de sécurité

### ✅ À FAIRE

- ✅ Garder `.env.local` dans `.gitignore` (déjà fait)
- ✅ Utiliser des variables d'environnement pour tous les secrets
- ✅ Utiliser des clés différentes pour développement et production
- ✅ Régénérer les clés si elles sont compromises
- ✅ Ne jamais commiter les fichiers `.env`

### ❌ À NE JAMAIS FAIRE

- ❌ Partager vos clés API ou mots de passe
- ❌ Commiter le fichier `.env.local` dans Git
- ❌ Exposer la clé `SUPABASE_SERVICE_ROLE_KEY` côté client
- ❌ Utiliser les mêmes clés en développement et production
- ❌ Stocker les clés dans le code source

---

## 🚀 Pour le déploiement (Vercel)

Quand vous déployez sur Vercel :

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez toutes les variables une par une
4. ⚠️ Ne les partagez JAMAIS publiquement

---

## 📝 Résumé

**Vous devez configurer vous-même :**
1. Créer le fichier `.env.local`
2. Récupérer les informations depuis Supabase
3. Récupérer la clé OpenAI
4. Remplir le fichier avec vos vraies valeurs

**Je n'ai pas besoin de vos clés** - je peux vous aider avec le code, mais vous devez configurer les secrets vous-même pour la sécurité.

