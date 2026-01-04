# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application LV1 sur Internet via Vercel.

## 📋 Prérequis

1. Un compte GitHub (gratuit)
2. Un compte Vercel (gratuit) - https://vercel.com
3. Votre projet Supabase configuré
4. Toutes vos clés API (Google, Supabase, etc.)

---

## 🚀 Étape 1 : Préparer votre code

### 1.1 Vérifier que tout fonctionne en local

```bash
# Tester le build
npm run build

# Si le build fonctionne, vous êtes prêt !
```

### 1.2 Créer un dépôt GitHub (si pas déjà fait)

1. Allez sur https://github.com
2. Créez un nouveau dépôt (ou utilisez un existant)
3. Poussez votre code :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

---

## 🌐 Étape 2 : Déployer sur Vercel

### 2.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **Sign Up**
3. Connectez-vous avec votre compte GitHub

### 2.2 Importer votre projet

1. Dans Vercel Dashboard, cliquez sur **Add New Project**
2. Sélectionnez votre dépôt GitHub
3. Vercel détectera automatiquement Next.js

### 2.3 Configurer les variables d'environnement

**⚠️ IMPORTANT :** Ajoutez toutes vos variables d'environnement dans Vercel.

Dans la section **Environment Variables**, ajoutez :

#### Variables Supabase (OBLIGATOIRES)
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Variables Google (OBLIGATOIRES)
```
LLM_PROVIDER=google
GOOGLE_API_KEY=votre-cle-api-google
GOOGLE_MODEL=gemini-2.5-flash
```

#### Variables Images (OPTIONNEL)
```
IMAGE_PROVIDER=pexels
PEXELS_API_KEY=votre-cle-pexels (optionnel)
UNSPLASH_ACCESS_KEY=votre-cle-unsplash (optionnel)
```

#### Variable Next.js (OBLIGATOIRE)
```
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

**⚠️ Note :** Pour `NEXT_PUBLIC_APP_URL`, vous devrez d'abord déployer pour obtenir l'URL, puis mettre à jour cette variable et redéployer.

### 2.4 Configurer le build

Vercel détecte automatiquement Next.js, mais vérifiez ces paramètres :

- **Framework Preset :** Next.js
- **Build Command :** `npm run build` (par défaut)
- **Output Directory :** `.next` (par défaut)
- **Install Command :** `npm install` (par défaut)

### 2.5 Déployer

1. Cliquez sur **Deploy**
2. Attendez que le build se termine (2-5 minutes)
3. Votre application sera accessible sur `https://votre-app.vercel.app`

---

## 🔧 Étape 3 : Configuration post-déploiement

### 3.1 Mettre à jour NEXT_PUBLIC_APP_URL

1. Une fois déployé, notez l'URL de votre application (ex: `https://appli-lv1.vercel.app`)
2. Dans Vercel, allez dans **Settings** → **Environment Variables**
3. Mettez à jour `NEXT_PUBLIC_APP_URL` avec votre URL Vercel
4. Redéployez l'application

### 3.2 Configurer Supabase pour la production

Dans votre projet Supabase :

1. Allez dans **Authentication** → **URL Configuration**
2. Ajoutez votre URL Vercel dans **Site URL** : `https://votre-app.vercel.app`
3. Ajoutez votre URL dans **Redirect URLs** : `https://votre-app.vercel.app/**`

### 3.3 Initialiser la base de données (si nécessaire)

Si c'est la première fois que vous déployez :

```bash
# En local, poussez le schéma vers Supabase
npm run db:push
```

---

## ✅ Étape 4 : Vérification

### 4.1 Tester l'application

1. Visitez votre URL Vercel
2. Testez l'inscription/connexion
3. Testez les exercices
4. Vérifiez que les images se chargent

### 4.2 Vérifier les logs

Dans Vercel Dashboard :
- **Deployments** → Cliquez sur votre déploiement → **Logs**
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🔄 Mises à jour futures

Chaque fois que vous poussez du code sur GitHub :

1. Vercel détecte automatiquement les changements
2. Un nouveau déploiement est lancé automatiquement
3. Votre application est mise à jour en quelques minutes

---

## 🐛 Résolution de problèmes

### Erreur : "Module not found"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build dans Vercel

### Erreur : "Environment variable not found"
- Vérifiez que toutes les variables sont configurées dans Vercel
- Assurez-vous qu'elles sont ajoutées pour **Production**, **Preview**, et **Development**

### Erreur : "Database connection failed"
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que votre base Supabase est accessible depuis Internet

### Erreur : "Authentication failed"
- Vérifiez que `NEXT_PUBLIC_APP_URL` correspond à votre URL Vercel
- Vérifiez la configuration Supabase (URLs de redirection)

---

## 📝 Checklist de déploiement

- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Vercel
- [ ] Toutes les variables d'environnement configurées
- [ ] Build réussi sur Vercel
- [ ] `NEXT_PUBLIC_APP_URL` mis à jour avec l'URL Vercel
- [ ] Supabase configuré avec l'URL de production
- [ ] Base de données initialisée
- [ ] Application testée et fonctionnelle

---

## 🎉 Félicitations !

Votre application est maintenant accessible sur Internet !

**URL de votre application :** `https://votre-app.vercel.app`

Partagez cette URL avec vos utilisateurs pour qu'ils puissent accéder à l'application.

---

## 💡 Astuces

- **Domaine personnalisé :** Vous pouvez ajouter votre propre domaine dans Vercel (Settings → Domains)
- **Environnements multiples :** Vercel crée automatiquement des previews pour chaque pull request
- **Analytics :** Activez Vercel Analytics pour suivre les performances
- **Monitoring :** Utilisez les logs Vercel pour déboguer les problèmes

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Vercel Dashboard
2. Consultez la documentation Vercel : https://vercel.com/docs
3. Consultez la documentation Next.js : https://nextjs.org/docs

