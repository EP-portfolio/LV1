# 🔧 Correction de la connexion à la base de données

## Problème identifié

Prisma essaie de se connecter à `localhost` au lieu de Supabase. Cela signifie que votre `DATABASE_URL` n'est pas correctement configurée.

## ✅ Solution

### Option 1 : Corriger le fichier `.env.local` (RECOMMANDÉ)

1. **Ouvrez le fichier `.env.local`** dans votre éditeur
2. **Vérifiez que la ligne `DATABASE_URL` contient l'URL Supabase** :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
```

**⚠️ IMPORTANT :**
- Remplacez `VOTRE_MOT_DE_PASSE` par votre **vrai mot de passe** Supabase
- Remplacez `xxxxx` par votre **Project Reference** Supabase
- L'URL doit commencer par `postgresql://postgres:` et se terminer par `:5432/postgres`
- **NE doit PAS contenir `localhost`**

### Option 2 : Corriger le fichier `.env`

Si vous avez un fichier `.env` à la racine, il peut écraser `.env.local`. 

1. **Ouvrez le fichier `.env`**
2. **Vérifiez/modifiez la ligne `DATABASE_URL`** pour qu'elle pointe vers Supabase (même format que ci-dessus)

### Où trouver votre DATABASE_URL ?

1. Allez dans votre **Supabase Dashboard**
2. **Settings** → **Database**
3. Section **Connection string**
4. Choisissez **URI** (pas "Session mode")
5. Copiez la chaîne de connexion
6. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

**Exemple de format correct :**
```
postgresql://postgres:monMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## 🔄 Après avoir corrigé

1. **Sauvegardez le fichier** (`.env.local` ou `.env`)
2. **Redémarrez votre terminal** (fermez et rouvrez-le)
3. **Exécutez à nouveau** :

```bash
npm run db:push
```

## ✅ Vérification

Si tout fonctionne, vous devriez voir :

```
✔ Generated Prisma Client
✔ Database synchronized successfully
```

Et dans Supabase Dashboard → **Table Editor**, vous devriez voir les tables :
- `User`
- `PracticeSession`
- `Question`
- `Progress`

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que votre mot de passe ne contient pas de caractères spéciaux non encodés
2. Vérifiez que votre projet Supabase est actif
3. Vérifiez que vous avez bien copié toute l'URL (sans espaces avant/après)

