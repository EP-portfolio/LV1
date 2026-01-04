# Configuration de la base de données - Guide de dépannage

## ❌ Erreur : "The table `public.User` does not exist"

Cette erreur signifie que les tables n'ont pas été créées dans votre base de données Supabase.

## ✅ Solution : Créer les tables avec Prisma

### Étape 1 : Vérifier votre fichier `.env.local`

Assurez-vous que votre fichier `.env.local` contient la bonne `DATABASE_URL` :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"
```

**⚠️ IMPORTANT :**
- Remplacez `VOTRE_MOT_DE_PASSE` par votre **vrai mot de passe** Supabase
- Remplacez `xxxxx` par votre **Project Reference** Supabase
- Le format doit être exactement comme ci-dessus

### Étape 2 : Où trouver votre DATABASE_URL ?

1. Allez dans votre **Supabase Dashboard**
2. **Settings** → **Database**
3. Section **Connection string**
4. Choisissez **URI** (pas "Session mode")
5. Copiez la chaîne de connexion
6. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

**Exemple :**
```
postgresql://postgres:monMotDePasse123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### Étape 3 : Vérifier que le fichier est bien lu

Dans votre terminal, vérifiez que la variable est bien chargée :

```bash
# Windows PowerShell
$env:DATABASE_URL

# Windows CMD
echo %DATABASE_URL%

# Linux/Mac
echo $DATABASE_URL
```

Si rien ne s'affiche, le fichier `.env.local` n'est pas correctement configuré.

### Étape 4 : Créer les tables

Une fois que `DATABASE_URL` est correctement configurée, exécutez :

```bash
npm run db:push
```

Cette commande va :
1. Se connecter à votre base de données Supabase
2. Créer toutes les tables nécessaires (User, PracticeSession, Question, Progress)
3. Créer les relations entre les tables

### Étape 5 : Vérifier que ça fonctionne

Si tout s'est bien passé, vous devriez voir :

```
✔ Generated Prisma Client
✔ Database synchronized successfully
```

## 🔍 Dépannage avancé

### Problème : "Can't reach database server at `localhost:...`"

**Cause :** La `DATABASE_URL` pointe vers `localhost` au lieu de Supabase.

**Solution :**
1. Vérifiez que votre `.env.local` contient bien l'URL Supabase (pas localhost)
2. Redémarrez votre serveur de développement (`npm run dev`)
3. Réessayez `npm run db:push`

### Problème : "Authentication failed"

**Cause :** Le mot de passe dans `DATABASE_URL` est incorrect.

**Solution :**
1. Vérifiez votre mot de passe Supabase dans le Dashboard
2. Assurez-vous qu'il n'y a pas d'espaces ou de caractères spéciaux mal échappés
3. Si le mot de passe contient des caractères spéciaux, encodez-les en URL (ex: `@` devient `%40`)

### Problème : "Connection timeout"

**Cause :** Problème de réseau ou firewall.

**Solution :**
1. Vérifiez votre connexion internet
2. Vérifiez que votre firewall n'bloque pas la connexion
3. Essayez de vous connecter depuis l'éditeur SQL de Supabase pour vérifier que la base est accessible

## 📝 Vérification finale

Après avoir exécuté `npm run db:push`, vous pouvez vérifier que les tables existent :

1. Allez dans **Supabase Dashboard** → **Table Editor**
2. Vous devriez voir les tables :
   - `User`
   - `PracticeSession`
   - `Question`
   - `Progress`

Si les tables sont là, tout est bon ! 🎉

## 🆘 Besoin d'aide ?

Si le problème persiste :
1. Vérifiez que votre fichier `.env.local` est bien à la racine du projet
2. Vérifiez qu'il n'y a pas de fichier `.env` qui pourrait écraser les valeurs
3. Redémarrez complètement votre terminal et votre serveur de développement

