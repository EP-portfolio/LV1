# LV1 - Application d'apprentissage de l'anglais

Application web d'apprentissage de l'anglais pour adultes français de plus de 30 ans, utilisant un LLM comme professeur particulier.

## 🚀 Fonctionnalités

- ✅ Authentification par email et mot de passe (Supabase Auth)
- ✅ Exercices de traduction français → anglais (écrit et oral)
- ✅ Exercices de traduction anglais → français (écrit et oral)
- ✅ Exercices avec images générées par DALL-E
- ✅ Exercices audio avec synthèse vocale OpenAI TTS
- ✅ Évaluation automatique avec feedback personnalisé via LLM
- ✅ Suivi de progression avec statistiques détaillées
- ✅ Graphiques de progression (Chart.js)
- ✅ Historique des sessions

## 🛠️ Stack technique

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL via Supabase, Prisma ORM
- **Authentification**: Supabase Auth
- **Storage**: Supabase Storage (images et audio)
- **IA**: OpenAI API (GPT-4 pour questions/évaluation, DALL-E pour images, TTS pour audio)
- **Déploiement**: Vercel (recommandé)

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Compte OpenAI avec clé API
- Git

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/EP-portfolio/LV1.git
cd LV1
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer les informations suivantes :
   - URL du projet
   - Anon key
   - Service role key
   - Connection string PostgreSQL (Settings → Database → Connection string)

3. Créer un bucket Storage nommé `practice-media` :
   - Aller dans Storage
   - Créer un nouveau bucket `practice-media`
   - Configurer les politiques (voir section Configuration Storage)

### 4. Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google (Gemini + Text-to-Speech)
LLM_PROVIDER="google"
GOOGLE_API_KEY="your-google-api-key"
GOOGLE_MODEL="gemini-pro"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers Supabase
npx prisma db push
```

### 6. Configuration Supabase Storage

Exécuter ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Politique de lecture publique
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'practice-media');

-- Politique d'upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'practice-media' 
  AND auth.role() = 'authenticated'
);

-- Politique de mise à jour pour le propriétaire
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'practice-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 7. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
appli_lv1/
├── app/
│   ├── (auth)/              # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # Routes API
│   │   ├── auth/            # Authentification
│   │   ├── practice/        # Exercices
│   │   └── progress/        # Progression
│   ├── dashboard/           # Tableau de bord
│   ├── practice/            # Pages d'exercices
│   ├── progress/            # Page de progression
│   └── history/             # Historique
├── components/
│   ├── layout/              # Composants de layout
│   └── practice/            # Composants d'exercices
├── lib/
│   ├── supabase/            # Clients Supabase
│   ├── llm/                 # Services LLM
│   ├── images/              # Génération d'images
│   ├── audio/               # Génération audio
│   ├── storage/             # Upload fichiers
│   ├── db.ts                # Client Prisma
│   ├── openai.ts            # Client OpenAI
│   └── progress.ts          # Gestion progression
├── prisma/
│   └── schema.prisma        # Schéma base de données
└── public/                  # Fichiers statiques
```

## 🚢 Déploiement sur Vercel

### 1. Préparer le projet

```bash
# S'assurer que tout fonctionne localement
npm run build
```

### 2. Déployer sur Vercel

1. Installer Vercel CLI : `npm i -g vercel`
2. Se connecter : `vercel login`
3. Déployer : `vercel`
4. Ajouter les variables d'environnement dans le dashboard Vercel

### 3. Variables d'environnement Vercel

Ajouter toutes les variables de `.env.local` dans le dashboard Vercel :
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 📝 Scripts disponibles

- `npm run dev` - Lancer en mode développement
- `npm run build` - Build de production
- `npm start` - Lancer en mode production
- `npm run db:push` - Pousser le schéma Prisma vers la DB
- `npm run db:studio` - Ouvrir Prisma Studio

## 🔒 Sécurité

- Les mots de passe sont gérés par Supabase Auth (hashage automatique)
- Les clés API ne doivent jamais être commitées dans Git
- Le fichier `.env.local` est dans `.gitignore`
- Les routes API vérifient l'authentification

## 🐛 Dépannage

### Erreur de connexion à Supabase
- Vérifier que les variables d'environnement sont correctes
- Vérifier que le projet Supabase est actif

### Erreur Prisma
- Exécuter `npx prisma generate`
- Vérifier la `DATABASE_URL`

### Erreur OpenAI
- Vérifier que la clé API est valide
- Vérifier les crédits OpenAI

## 📄 Licence

Ce projet est un POC (Proof of Concept) pour l'apprentissage de l'anglais.

## 👤 Auteur

Développé pour EP-portfolio

## 🙏 Remerciements

- Next.js pour le framework
- Supabase pour l'infrastructure
- OpenAI pour les services IA
