# 🔑 Guide : Obtenir une clé API Google Gemini

## Méthode 1 : Google AI Studio (Recommandée - Plus simple)

Cette méthode est la plus simple et ne nécessite pas de compte Google Cloud Platform.

### Étapes :

1. **Allez sur Google AI Studio :**
   - Ouvrez : https://makersuite.google.com/app/apikey
   - Ou : https://aistudio.google.com/app/apikey

2. **Connectez-vous avec votre compte Google**

3. **Créez une clé API :**
   - Cliquez sur **"Create API Key"** ou **"Get API Key"**
   - Sélectionnez un projet Google Cloud existant OU créez-en un nouveau
   - La clé API sera générée automatiquement

4. **Copiez la clé API :**
   - ⚠️ **Important** : Copiez-la immédiatement, elle ne sera plus visible après
   - Format : `AIza...` (commence par "AIza")

5. **Ajoutez-la dans `.env.local` :**
   ```env
   GOOGLE_API_KEY="AIzaSyC-votre-cle-ici"
   ```

## Méthode 2 : Google Cloud Console (Si vous avez déjà un projet GCP)

Si vous préférez utiliser Google Cloud Console :

### Étapes :

1. **Allez sur Google Cloud Console :**
   - https://console.cloud.google.com/

2. **Sélectionnez ou créez un projet**

3. **Activez l'API Gemini :**
   - Allez dans **"APIs & Services"** → **"Library"**
   - Recherchez **"Generative Language API"** ou **"Gemini API"**
   - Si vous ne la trouvez pas, recherchez **"Vertex AI API"** et activez-la
   - Ou allez directement sur : https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

4. **Créez une clé API :**
   - Allez dans **"APIs & Services"** → **"Credentials"**
   - Cliquez sur **"Create Credentials"** → **"API Key"**
   - Copiez la clé générée

5. **Ajoutez-la dans `.env.local` :**
   ```env
   GOOGLE_API_KEY="AIzaSyC-votre-cle-ici"
   ```

## ✅ Vérification

Après avoir ajouté la clé, vérifiez avec :

```bash
npm run check-api
```

Vous devriez voir :
```
✅ GOOGLE_API_KEY est configurée
```

## 🔒 Sécurité

- ⚠️ **Ne partagez jamais votre clé API**
- ⚠️ **Ne commitez jamais `.env.local` dans Git**
- Vous pouvez restreindre la clé API dans Google Cloud Console si nécessaire

## 💰 Tarification

- **Plan gratuit** : Jusqu'à 60 requêtes/minute et 1,500 requêtes/jour
- Parfait pour le développement et les tests
- Voir : https://ai.google.dev/pricing

## 🆘 Problèmes courants

### "API key not valid"
- Vérifiez que vous avez bien copié toute la clé (commence par "AIza")
- Vérifiez qu'il n'y a pas d'espaces avant/après dans `.env.local`
- Redémarrez le serveur après modification

### "Quota exceeded"
- Vous avez atteint la limite gratuite
- Attendez quelques minutes ou passez à un plan payant

### L'API n'apparaît pas dans GCP
- Utilisez la **Méthode 1** (Google AI Studio) à la place
- C'est plus simple et fonctionne de la même manière

