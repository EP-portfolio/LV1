# 🔊 Activer l'API Cloud Text-to-Speech

## ⚠️ Erreur actuelle

```
Cloud Text-to-Speech API has not been used in project 776548636882 before or it is disabled.
```

## ✅ Solution : Activer l'API

### Méthode 1 : Via le lien direct (le plus rapide)

Cliquez sur ce lien (remplacez `776548636882` par votre Project ID si différent) :
```
https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=776548636882
```

Puis cliquez sur **"Enable"** (Activer)

### Méthode 2 : Via Google Cloud Console

1. **Allez sur Google Cloud Console :**
   - https://console.cloud.google.com/

2. **Sélectionnez votre projet** (ID: 776548636882)

3. **Activez l'API :**
   - Allez dans **"APIs & Services"** → **"Library"**
   - Recherchez **"Cloud Text-to-Speech API"**
   - Cliquez sur **"Enable"**

4. **Attendez quelques minutes** pour que l'activation se propage

## 🔍 Vérifier votre Project ID

Si le Project ID dans l'erreur (776548636882) n'est pas le bon :

1. Allez sur https://console.cloud.google.com/
2. Vérifiez le Project ID dans le sélecteur de projet (en haut)
3. Utilisez ce Project ID dans le lien ci-dessus

## 💡 Alternative : Désactiver temporairement l'audio

Si vous ne voulez pas activer l'API maintenant, l'application fonctionnera quand même **sans audio**. Les exercices avec images fonctionneront, mais sans prononciation audio.

L'audio est maintenant **optionnel** dans le code - l'application continuera de fonctionner même si la génération audio échoue.

## ✅ Après activation

1. Attendez 2-3 minutes pour que l'API soit activée
2. Testez à nouveau l'application
3. L'audio devrait maintenant fonctionner

## 💰 Tarification

- **Gratuit** : 0-4 millions de caractères par mois
- **Payant** : Au-delà, voir [tarification](https://cloud.google.com/text-to-speech/pricing)

Pour un usage normal de l'application, vous resterez dans la limite gratuite.

