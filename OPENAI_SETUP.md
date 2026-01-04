# Configuration OpenAI - Guide de dépannage

## ❌ Erreur : "Erreur lors du chargement de la question"

Cette erreur peut avoir plusieurs causes. Voici comment les diagnostiquer et les résoudre.

## ✅ Vérifications à faire

### 1. Vérifier que la clé OpenAI est configurée

Vérifiez que votre fichier `.env.local` (ou `.env`) contient :

```env
OPENAI_API_KEY="sk-..."
```

**Où trouver votre clé OpenAI :**
1. Allez sur https://platform.openai.com
2. Connectez-vous ou créez un compte
3. Allez dans **API keys**
4. Créez une nouvelle clé API ou utilisez une existante
5. ⚠️ **Copiez-la immédiatement** (elle ne sera plus visible après)

### 2. Vérifier que vous êtes connecté

Les exercices nécessitent une authentification. Assurez-vous d'être connecté :
- Allez sur `/login`
- Connectez-vous avec votre compte
- Retournez sur la page d'exercice

### 3. Vérifier les logs du serveur

Regardez les logs dans le terminal où `npm run dev` tourne. Vous devriez voir :
- `OPENAI_API_KEY is not set` → La clé n'est pas configurée
- `OpenAI API key is not configured` → La clé n'est pas valide
- D'autres erreurs spécifiques

### 4. Vérifier que la clé est valide

Testez votre clé OpenAI :

```bash
# Dans le terminal
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
```

Si vous obtenez une erreur 401, votre clé est invalide ou expirée.

## 🔧 Solutions

### Solution 1 : Configurer la clé OpenAI

1. **Créez ou modifiez** le fichier `.env.local` à la racine du projet
2. **Ajoutez** la ligne :
   ```env
   OPENAI_API_KEY="sk-votre-cle-ici"
   ```
3. **Sauvegardez** le fichier
4. **Redémarrez** le serveur de développement :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

### Solution 2 : Vérifier la connexion

Si vous voyez "Vous devez être connecté pour accéder aux exercices" :
1. Allez sur `/login`
2. Connectez-vous
3. Retournez sur la page d'exercice

### Solution 3 : Vérifier les crédits OpenAI

Si votre clé est valide mais que ça ne fonctionne toujours pas :
1. Allez sur https://platform.openai.com/usage
2. Vérifiez que vous avez des crédits disponibles
3. Si non, ajoutez des crédits à votre compte

## 📝 Messages d'erreur améliorés

J'ai amélioré les messages d'erreur pour qu'ils soient plus clairs :

- **"Vous devez être connecté"** → Connectez-vous d'abord
- **"Clé API OpenAI non configurée"** → Ajoutez `OPENAI_API_KEY` dans `.env.local`
- **"Erreur serveur"** → Vérifiez les logs du serveur pour plus de détails

## 🆘 Si le problème persiste

1. **Vérifiez les logs du serveur** (terminal où `npm run dev` tourne)
2. **Vérifiez la console du navigateur** (F12 → Console)
3. **Vérifiez que `.env.local` est bien lu** :
   ```bash
   # Windows PowerShell
   Get-Content .env.local | Select-String "OPENAI"
   ```
4. **Redémarrez complètement** le serveur de développement

## 💡 Alternative : Utiliser un autre LLM

Si vous ne voulez pas utiliser OpenAI, vous pouvez configurer un autre fournisseur. Voir `LLM_ALTERNATIVES.md` pour plus d'informations.

