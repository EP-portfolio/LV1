# 🚀 Guide : Pousser le code vers GitHub

Ce guide vous explique comment pousser votre code vers le dépôt GitHub de référence : **https://github.com/EP-portfolio/LV1**

## 🎯 Méthode rapide (PowerShell)

Si vous êtes sur Windows avec PowerShell :

```powershell
# Exécuter le script d'installation
.\setup-github.ps1

# Puis pousser vers GitHub
git push -u origin main
```

Si le dépôt GitHub est vide et que vous obtenez une erreur, utilisez :
```powershell
git push -u origin main --force
```

---

## 📋 Méthode manuelle (étape par étape)

### 1. Vérifier que .env.local est ignoré

```bash
git check-ignore .env.local
```

Si cela retourne `.env.local`, c'est bon ✅

### 2. Configurer le remote GitHub

```bash
# Supprimer l'ancien remote s'il existe
git remote remove origin

# Ajouter le nouveau remote
git remote add origin https://github.com/EP-portfolio/LV1.git

# Vérifier
git remote -v
```

### 3. Ajouter tous les fichiers

```bash
git add .
```

### 4. Créer le commit

```bash
git commit -m "Initial commit: Application LV1 - Apprentissage anglais avec vocabulaire, exercices multimédias et progression"
```

### 5. Renommer la branche (si nécessaire)

```bash
git branch -M main
```

### 6. Pousser vers GitHub

```bash
git push -u origin main
```

**⚠️ Si le dépôt GitHub est vide et que vous obtenez une erreur :**

```bash
git push -u origin main --force
```

---

## ✅ Vérification

Après avoir poussé, allez sur **https://github.com/EP-portfolio/LV1** et vérifiez que :
- ✅ Tous vos fichiers sont présents
- ✅ Le README.md est visible
- ✅ Les dossiers `app/`, `components/`, `lib/`, etc. sont présents
- ✅ `.env.local` n'est **PAS** présent (sécurité)

---

## 🔒 Sécurité - Checklist

Avant de pousser, vérifiez que ces fichiers ne sont **PAS** dans le commit :

- ❌ `.env.local` (doit être ignoré)
- ❌ `.env` (doit être ignoré)
- ❌ `node_modules/` (doit être ignoré)
- ❌ `.next/` (doit être ignoré)
- ❌ Toute clé API ou mot de passe

Pour vérifier ce qui sera commité :
```bash
git status
```

---

## 🚀 Après avoir poussé sur GitHub

Une fois le code sur GitHub, vous pouvez :

1. **Déployer sur Vercel** :
   - Allez sur https://vercel.com
   - Connectez-vous avec GitHub
   - Importez le dépôt `EP-portfolio/LV1`
   - Configurez les variables d'environnement
   - Déployez !

2. **Consulter les guides** :
   - `QUICK_DEPLOY.md` pour un déploiement rapide
   - `DEPLOYMENT_GUIDE.md` pour un guide détaillé

---

## 🐛 Problèmes courants

### Erreur : "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/EP-portfolio/LV1.git
```

### Erreur : "failed to push some refs"
Le dépôt GitHub a peut-être un README initial. Dans ce cas :
```bash
git pull origin main --allow-unrelated-histories
# Résoudre les conflits si nécessaire
git push -u origin main
```

Ou si le dépôt est vraiment vide :
```bash
git push -u origin main --force
```

### Erreur : "authentication failed"
Vous devez vous authentifier avec GitHub :
- Utilisez un **Personal Access Token (PAT)** au lieu d'un mot de passe
- Ou configurez **SSH**

Pour créer un PAT : https://github.com/settings/tokens

---

## 📝 Commandes complètes (copier-coller)

```bash
# 1. Configurer le remote
git remote remove origin 2>/dev/null; git remote add origin https://github.com/EP-portfolio/LV1.git

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le commit
git commit -m "Initial commit: Application LV1 complète"

# 4. Renommer la branche
git branch -M main

# 5. Pousser vers GitHub
git push -u origin main
```

Si erreur, utiliser `--force` :
```bash
git push -u origin main --force
```

---

## 🎉 C'est fait !

Votre code est maintenant sur GitHub et prêt pour le déploiement sur Vercel !

**Prochaine étape :** Consultez `QUICK_DEPLOY.md` pour déployer sur Vercel en 5 minutes.
