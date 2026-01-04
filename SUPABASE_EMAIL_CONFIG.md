# Configuration Supabase pour les emails

## Problème : "Email address is invalid"

Si vous recevez l'erreur "Email address is invalid" pour un email valide comme `test@gmail.com`, cela peut être dû à la configuration Supabase.

## ✅ Solutions

### 1. Vérifier la configuration Supabase Auth

Dans votre **Supabase Dashboard** :

1. Allez dans **Settings** → **Auth** → **Email Auth**
2. Vérifiez les paramètres suivants :
   - ✅ **Enable email signup** : Doit être activé
   - ✅ **Enable email confirmations** : Peut être désactivé pour le développement
   - ✅ **Secure email change** : Activé (recommandé)

### 2. Vérifier les restrictions de domaine

Supabase peut avoir des restrictions sur certains domaines d'email :

1. Allez dans **Settings** → **Auth** → **Email Auth**
2. Vérifiez la section **Email Templates** et **Email Restrictions**
3. Assurez-vous qu'il n'y a pas de liste noire de domaines

### 3. Vérifier si l'email existe déjà

L'erreur peut aussi signifier que l'email existe déjà dans Supabase Auth mais pas dans votre base Prisma :

1. Allez dans **Supabase Dashboard** → **Authentication** → **Users**
2. Cherchez si l'email existe déjà
3. Si oui, vous pouvez :
   - Supprimer l'utilisateur depuis Supabase
   - Ou vous connecter avec cet email

### 4. Tester avec un autre email

Essayez avec un email différent pour voir si le problème est spécifique à `test@gmail.com` :

- `votre.nom@gmail.com`
- `test@example.com`
- `user@test.com`

### 5. Vérifier les logs Supabase

1. Allez dans **Supabase Dashboard** → **Logs** → **Auth Logs**
2. Regardez les erreurs récentes
3. Cela vous donnera plus de détails sur pourquoi l'email est rejeté

## 🔧 Corrections apportées dans le code

J'ai amélioré le code pour :

1. **Normaliser l'email** : Trim et lowercase avant validation
2. **Meilleure gestion d'erreur** : Messages d'erreur plus clairs et traduits
3. **Détection des erreurs courantes** : Identification des problèmes spécifiques

## 📝 Test

Après avoir vérifié la configuration Supabase, testez à nouveau l'inscription avec :

1. Un email valide (ex: `votre.nom@gmail.com`)
2. Un mot de passe d'au moins 6 caractères
3. Vérifiez les logs du serveur pour plus de détails

## 🆘 Si le problème persiste

1. Vérifiez les logs du serveur Next.js (terminal où `npm run dev` tourne)
2. Vérifiez les logs Supabase Dashboard → Logs
3. Vérifiez la console du navigateur (F12)
4. Essayez de créer un utilisateur directement depuis Supabase Dashboard pour voir si le problème vient de Supabase ou de notre code

