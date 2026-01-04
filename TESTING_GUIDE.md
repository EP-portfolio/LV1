# Guide de test de l'application LV1

## 🚀 Lancer l'application en mode développement

### 1. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

### 2. Ouvrir dans le navigateur

Ouvrez votre navigateur et allez à :
- **http://localhost:3000** - Page d'accueil
- **http://localhost:3000/login** - Page de connexion
- **http://localhost:3000/register** - Page d'inscription

## 📋 Checklist de test

### Configuration préalable

Avant de tester, assurez-vous d'avoir configuré :

1. **Variables d'environnement** (`.env.local`)
   - `DATABASE_URL` - URL de connexion Supabase PostgreSQL
   - `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Clé service role Supabase
   - `OPENAI_API_KEY` - Clé API OpenAI

2. **Base de données Supabase**
   - Projet Supabase créé
   - Schéma Prisma poussé : `npm run db:push`
   - Bucket Storage `practice-media` créé

### Tests à effectuer

#### 1. Test de la page d'accueil
- [ ] Vérifier que la page s'affiche correctement
- [ ] Tester les boutons "Commencer maintenant" et "Se connecter"
- [ ] Vérifier le responsive (mobile, tablette, desktop)

#### 2. Test d'inscription
- [ ] Aller sur `/register`
- [ ] Remplir le formulaire (email, mot de passe, nom, âge)
- [ ] Vérifier que l'inscription fonctionne
- [ ] Vérifier la redirection vers le dashboard

#### 3. Test de connexion
- [ ] Aller sur `/login`
- [ ] Se connecter avec les identifiants créés
- [ ] Vérifier la redirection vers le dashboard

#### 4. Test du dashboard
- [ ] Vérifier l'affichage des statistiques
- [ ] Vérifier les cartes d'exercices
- [ ] Tester les liens vers les différents types d'exercices

#### 5. Test des exercices de traduction

**Exercice FR → EN :**
- [ ] Aller sur `/practice/translation-fr-en`
- [ ] Vérifier le chargement de la question
- [ ] Tester le mode écrit
- [ ] Tester le mode oral (si navigateur supporte)
- [ ] Soumettre une réponse
- [ ] Vérifier l'affichage du feedback

**Exercice EN → FR :**
- [ ] Aller sur `/practice/translation-en-fr`
- [ ] Répéter les mêmes tests

#### 6. Test des exercices multimédias

**Exercice avec image :**
- [ ] Aller sur `/practice/multimedia`
- [ ] Sélectionner "Avec image"
- [ ] Vérifier le chargement de l'image
- [ ] Tester le bouton audio
- [ ] Soumettre une réponse
- [ ] Vérifier le feedback

**Exercice audio :**
- [ ] Sélectionner "Écoute"
- [ ] Vérifier le chargement de l'audio
- [ ] Tester la lecture audio
- [ ] Soumettre une traduction
- [ ] Vérifier le feedback

#### 7. Test de la progression
- [ ] Aller sur `/progress`
- [ ] Vérifier l'affichage des statistiques
- [ ] Vérifier les graphiques
- [ ] Vérifier l'historique des sessions

#### 8. Test de l'historique
- [ ] Aller sur `/history`
- [ ] Vérifier l'affichage des sessions précédentes
- [ ] Vérifier les détails des questions

## 🛠️ Outils de test

### DevTools du navigateur

1. **Console du navigateur** (F12)
   - Vérifier les erreurs JavaScript
   - Vérifier les appels API

2. **Onglet Network** (F12 > Network)
   - Vérifier les requêtes API
   - Vérifier les temps de réponse
   - Vérifier les erreurs HTTP

3. **Responsive Design Mode**
   - Chrome : Ctrl+Shift+M
   - Firefox : Ctrl+Shift+M
   - Tester différentes tailles d'écran

### Tests de performance

```bash
# Build de production pour tester les performances
npm run build
npm start
```

Puis tester sur http://localhost:3000

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifier que les ports 3000 n'est pas utilisé :
```bash
netstat -ano | findstr :3000
```

2. Vérifier les dépendances :
```bash
npm install
```

3. Vérifier les variables d'environnement :
```bash
# Vérifier que .env.local existe et contient toutes les variables
```

### Erreurs de base de données

1. Vérifier la connexion Supabase :
```bash
npm run db:push
```

2. Vérifier Prisma Studio :
```bash
npm run db:studio
```

### Erreurs OpenAI

- Vérifier que `OPENAI_API_KEY` est correcte
- Vérifier les crédits OpenAI
- Les erreurs s'affichent dans la console du navigateur

## 📱 Test responsive

### Tailles d'écran à tester

- **Mobile** : 375px (iPhone), 414px (iPhone Plus)
- **Tablette** : 768px (iPad)
- **Desktop** : 1024px, 1280px, 1920px

### Points de rupture Tailwind

- `sm:` : 640px
- `md:` : 768px
- `lg:` : 1024px
- `xl:` : 1280px

## ✅ Validation finale

Avant de considérer les tests terminés :

- [ ] Toutes les pages s'affichent correctement
- [ ] Tous les formulaires fonctionnent
- [ ] Tous les exercices fonctionnent
- [ ] Le feedback s'affiche correctement
- [ ] La progression est sauvegardée
- [ ] L'historique s'affiche
- [ ] Le responsive fonctionne sur tous les écrans
- [ ] Aucune erreur dans la console
- [ ] Les performances sont acceptables

## 🚀 Test en production

Pour tester comme en production :

```bash
npm run build
npm start
```

Puis tester sur http://localhost:3000

