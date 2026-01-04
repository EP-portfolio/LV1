# Configuration des variables d'environnement

Ce fichier documente toutes les variables d'environnement nécessaires pour le projet.

## Fichier .env.local

Créer un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# URL de connexion PostgreSQL (trouvable dans Supabase Dashboard > Settings > Database > Connection string)
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"

# URL publique de votre projet Supabase
# Format: https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"

# Clé anonyme Supabase (trouvable dans Supabase Dashboard > Settings > API > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Clé service role Supabase (trouvable dans Supabase Dashboard > Settings > API > service_role secret)
# ⚠️ NE JAMAIS EXPOSER CETTE CLÉ DANS LE CLIENT
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ============================================
# GOOGLE CONFIGURATION (OBLIGATOIRE - Par défaut)
# ============================================

# Fournisseur LLM (par défaut: google)
LLM_PROVIDER="google"

# Clé API Google (utilisée pour Gemini ET Text-to-Speech)
# Obtenez-la sur: https://console.cloud.google.com/apis/credentials
GOOGLE_API_KEY="votre-cle-api-google-ici"

# Modèle Gemini (optionnel)
GOOGLE_MODEL="gemini-pro"  # Options: gemini-pro, gemini-1.5-pro

# ============================================
# ALTERNATIVES (Optionnel)
# ============================================

# Pour utiliser OpenAI à la place :
# LLM_PROVIDER="openai"
# OPENAI_API_KEY="sk-..."
# OPENAI_MODEL="gpt-4"

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

# URL de l'application (localhost en développement, URL Vercel en production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Où trouver ces valeurs ?

### Supabase

1. **DATABASE_URL** :
   - Aller dans Supabase Dashboard
   - Settings → Database
   - Section "Connection string"
   - Copier la "URI" et remplacer `[YOUR-PASSWORD]` par votre mot de passe

2. **NEXT_PUBLIC_SUPABASE_URL** :
   - Dans Supabase Dashboard
   - Settings → API
   - Section "Project URL"
   - Copier l'URL

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** :
   - Dans Supabase Dashboard
   - Settings → API
   - Section "Project API keys"
   - Copier la clé "anon" "public"

4. **SUPABASE_SERVICE_ROLE_KEY** :
   - Dans Supabase Dashboard
   - Settings → API
   - Section "Project API keys"
   - Copier la clé "service_role" "secret"
   - ⚠️ **IMPORTANT** : Cette clé ne doit JAMAIS être exposée côté client

### OpenAI

1. **OPENAI_API_KEY** :
   - Aller sur https://platform.openai.com
   - Se connecter ou créer un compte
   - Aller dans API keys
   - Créer une nouvelle clé API
   - ⚠️ **IMPORTANT** : Sauvegarder la clé immédiatement, elle ne sera plus visible

## Configuration Supabase Storage

Après avoir configuré les variables, il faut configurer le bucket Storage :

1. Dans Supabase Dashboard → Storage
2. Créer un nouveau bucket nommé `practice-media`
3. Le rendre public (optionnel, mais recommandé pour les images)
4. Exécuter le SQL suivant dans l'éditeur SQL :

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
```

## Vérification

Pour vérifier que tout est bien configuré :

1. Lancer `npm run dev`
2. Vérifier qu'il n'y a pas d'erreurs dans la console
3. Essayer de s'inscrire / se connecter
4. Si tout fonctionne, la configuration est correcte !

## Sécurité

⚠️ **IMPORTANT** :
- Ne jamais commiter le fichier `.env.local` dans Git
- Le fichier est déjà dans `.gitignore`
- Ne jamais partager vos clés API
- En production (Vercel), ajouter les variables dans le dashboard Vercel, pas dans le code

