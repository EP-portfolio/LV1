# 🚀 Déploiement rapide sur Vercel

## Étapes rapides

### 1. Préparer le code
```bash
# Tester que tout fonctionne
npm run build
```

### 2. Créer un dépôt GitHub
- Allez sur https://github.com
- Créez un nouveau dépôt
- Poussez votre code :
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

### 3. Déployer sur Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez sur **Add New Project**
4. Sélectionnez votre dépôt
5. **Configurez les variables d'environnement** (voir ci-dessous)
6. Cliquez sur **Deploy**

### 4. Variables d'environnement à ajouter dans Vercel

Copiez-collez toutes ces variables depuis votre `.env.local` :

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
LLM_PROVIDER
GOOGLE_API_KEY
GOOGLE_MODEL
IMAGE_PROVIDER
NEXT_PUBLIC_APP_URL
```

**⚠️ IMPORTANT :** Pour `NEXT_PUBLIC_APP_URL`, mettez d'abord une URL temporaire, puis après le premier déploiement, remplacez-la par votre URL Vercel (ex: `https://votre-app.vercel.app`)

### 5. Configurer Supabase

Dans Supabase Dashboard → Authentication → URL Configuration :
- **Site URL :** `https://votre-app.vercel.app`
- **Redirect URLs :** `https://votre-app.vercel.app/**`

### 6. C'est tout ! 🎉

Votre application est maintenant accessible sur Internet à l'adresse : `https://votre-app.vercel.app`

---

## 📖 Guide détaillé

Pour plus de détails, consultez `DEPLOYMENT_GUIDE.md`

