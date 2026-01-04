# Guide de dépannage - Problèmes courants

## 🔴 Problème : L'inscription ne fonctionne pas

### Vérifications à faire

#### 1. Vérifier les variables d'environnement

Assurez-vous que votre `.env.local` contient toutes les variables nécessaires :

```bash
# Vérifier que le fichier existe
ls .env.local

# Vérifier le contenu (sans afficher les valeurs sensibles)
cat .env.local | grep -E "^[A-Z_]+="
```

Variables requises :
- ✅ `DATABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

#### 2. Vérifier la connexion à Supabase

```bash
# Tester la connexion Prisma
npm run db:push
```

Si erreur, vérifiez :
- Que `DATABASE_URL` est correct
- Que le mot de passe dans l'URL est correct
- Que le projet Supabase est actif

#### 3. Vérifier la configuration Supabase Auth

Dans le dashboard Supabase :
1. **Settings** → **Auth** → **Email Auth**
2. Vérifier que "Enable email confirmations" est configuré selon vos besoins
3. Si activé, l'utilisateur doit confirmer son email avant de pouvoir se connecter

#### 4. Vérifier les logs

Ouvrez la console du navigateur (F12) et regardez :
- Les erreurs dans l'onglet Console
- Les requêtes dans l'onglet Network
- Les réponses des API routes

#### 5. Tester l'API directement

```bash
# Tester l'inscription via curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"Test"}'
```

### Solutions courantes

#### Problème : "Email already registered"
- L'email existe déjà dans Supabase Auth
- Solution : Utiliser un autre email ou se connecter

#### Problème : "Database connection error"
- La `DATABASE_URL` est incorrecte
- Solution : Vérifier l'URL dans Supabase Dashboard

#### Problème : "Invalid API key"
- Les clés Supabase sont incorrectes
- Solution : Vérifier dans Supabase Dashboard → Settings → API

#### Problème : "Email confirmation required"
- Supabase nécessite une confirmation d'email
- Solution : 
  - Vérifier votre boîte mail
  - Ou désactiver la confirmation dans Supabase Dashboard → Auth → Email Auth

#### Problème : L'inscription réussit mais pas de redirection
- Vérifier que la session est créée
- Vérifier les logs du serveur

### Mode debug

Pour activer plus de logs, vérifiez la console du serveur :

```bash
npm run dev
```

Regardez les logs dans le terminal où le serveur tourne.

### Test étape par étape

1. **Test de connexion Supabase** :
```bash
# Dans le terminal
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); console.log('Supabase client créé')"
```

2. **Test de connexion Prisma** :
```bash
npm run db:push
```

3. **Test de l'inscription** :
- Aller sur http://localhost:3000/register
- Remplir le formulaire
- Vérifier les erreurs dans la console

### Configuration Supabase recommandée pour développement

Dans Supabase Dashboard → **Auth** → **Email Auth** :
- ✅ **Enable email confirmations** : Désactivé (pour développement)
- ✅ **Enable email signup** : Activé
- ✅ **Secure email change** : Activé

Cela permet de tester sans avoir à confirmer l'email.

### Si le problème persiste

1. Vérifier les logs du serveur Next.js
2. Vérifier les logs dans Supabase Dashboard → Logs
3. Vérifier la console du navigateur (F12)
4. Vérifier que toutes les variables d'environnement sont correctes

