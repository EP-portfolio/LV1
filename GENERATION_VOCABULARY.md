# Guide de génération des mots de vocabulaire

## 🎯 Objectif

Générer 1500 à 3000 mots de vocabulaire français-anglais dans la base de données, **sans les images** (qui seront ajoutées plus tard).

## ✅ Prérequis

1. **Clé API Google configurée** dans `.env.local` :
   ```env
   GOOGLE_API_KEY="votre-cle-api-google"
   LLM_PROVIDER="google"
   ```

2. **Base de données synchronisée** :
   ```bash
   npm run db:push
   ```

## 🚀 Lancer la génération

### Option 1 : Générer 1500 mots (par défaut)

```bash
npm run generate-vocab
```

### Option 2 : Générer 3000 mots

```bash
npm run generate-vocab:3000
```

### Option 3 : Générer un nombre personnalisé

```bash
npx tsx scripts/cli-generate-vocabulary.ts 2000
```

## 📊 Catégories générées

Le script génère des mots dans 7 catégories :

| Catégorie | Nombre de mots | Exemples |
|-----------|----------------|----------|
| **Produits de consommation** | 400 | pain, lait, fromage, café, shampooing |
| **Verbes courants** | 300 | manger, boire, dormir, travailler |
| **Légumes** | 150 | carotte, tomate, courgette, salade |
| **Fruits** | 150 | pomme, banane, orange, fraise |
| **Animaux domestiques** | 100 | chien, chat, oiseau, lapin |
| **Pays** | 200 | France, Angleterre, Espagne, Italie |
| **Objets quotidiens** | 300 | téléphone, ordinateur, clé, chaise |

**Total : 1600 mots** (peut être étendu jusqu'à 3000)

## ⏱️ Temps estimé

- **1500 mots** : ~50 minutes à 1 heure
- **3000 mots** : ~2 heures

Le script inclut des délais entre les requêtes pour respecter les limites de l'API Google Gemini.

## 📝 Ce qui est généré

Pour chaque mot :
- ✅ **Mot en français** (`frenchWord`)
- ✅ **Traduction en anglais** (`englishWord`)
- ✅ **Catégorie** (`category`)
- ⏳ **Image** (`imageUrl`) : **VIDE pour l'instant** (sera ajoutée plus tard)
- ⏳ **Audio** (`audioUrl`) : **VIDE pour l'instant** (peut être ajouté plus tard)

## 🔍 Vérifier la génération

### Voir le nombre de mots générés

```bash
npx tsx scripts/test-vocabulary-db.ts
```

### Voir les mots dans Prisma Studio

```bash
npm run db:studio
```

Puis allez sur la table `VocabularyWord`.

### Vérifier via SQL (Supabase)

Dans Supabase Dashboard → SQL Editor :

```sql
SELECT COUNT(*) as total FROM "VocabularyWord";
SELECT category, COUNT(*) as count FROM "VocabularyWord" GROUP BY category;
```

## ⚠️ Notes importantes

1. **Les doublons sont automatiquement ignorés** : Si un mot existe déjà, il ne sera pas ajouté à nouveau.

2. **Le script peut être relancé** : Si la génération s'interrompt, vous pouvez relancer le script. Il continuera là où il s'est arrêté.

3. **Respect des limites API** : Le script inclut des délais pour respecter les limites de Google Gemini (60 requêtes/minute).

4. **Images vides** : Le champ `imageUrl` reste `null` pour tous les mots. Les images seront ajoutées dans une étape ultérieure.

## 🆘 Dépannage

### Erreur : "GOOGLE_API_KEY is not configured"

**Solution :** Vérifiez que `GOOGLE_API_KEY` est bien dans votre `.env.local` et redémarrez le terminal.

### Erreur : "Quota exceeded"

**Solution :** Attendez quelques minutes et relancez. Le script reprendra là où il s'est arrêté.

### Erreur : "Database connection error"

**Solution :** Vérifiez que `DATABASE_URL` est correcte dans `.env.local` et que Supabase est accessible.

### La génération est lente

**C'est normal !** Le script génère les mots par lots de 50 avec des délais entre chaque lot pour respecter les limites API. Pour 1500 mots, comptez environ 1 heure.

## 📈 Progression

Le script affiche la progression en temps réel :

```
📂 Catégorie: produits_consommation
  ⏳ Génération lot de 50 mots... (0/400 pour cette catégorie)
  ✅ 50 mots générés, sauvegarde en cours...
    📝 pain → bread (50/1500)
    📝 lait → milk (100/1500)
  ...
```

## ✅ Une fois terminé

Une fois la génération terminée, vous aurez :
- ✅ 1500-3000 mots dans la base de données
- ✅ Prêts à être utilisés pour la Section 1 (Vocabulaire)
- ⏳ Images à ajouter plus tard

Vous pouvez ensuite passer à l'implémentation de la Section 1 avec les 3 niveaux de difficulté !

