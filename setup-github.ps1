# Script PowerShell pour configurer et pousser vers GitHub
# Usage: .\setup-github.ps1

Write-Host "🚀 Configuration du dépôt GitHub..." -ForegroundColor Cyan

# 1. Vérifier que .env.local est ignoré
Write-Host "`n📋 Vérification de .gitignore..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    $ignored = git check-ignore .env.local
    if ($ignored) {
        Write-Host "✅ .env.local est bien ignoré" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Ajout de .env.local à .gitignore..." -ForegroundColor Yellow
        Add-Content .gitignore "`n.env.local"
    }
} else {
    Write-Host "ℹ️  .env.local n'existe pas (normal si pas encore créé)" -ForegroundColor Blue
}

# 2. Configurer le remote
Write-Host "`n🔗 Configuration du remote GitHub..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' existe déjà. Suppression..." -ForegroundColor Yellow
    git remote remove origin
}

git remote add origin https://github.com/EP-portfolio/LV1.git
Write-Host "✅ Remote configuré: https://github.com/EP-portfolio/LV1.git" -ForegroundColor Green

# 3. Ajouter tous les fichiers
Write-Host "`n📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .
Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green

# 4. Créer le commit
Write-Host "`n💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Application LV1 - Apprentissage anglais avec vocabulaire, exercices multimédias et progression"
git commit -m $commitMessage
Write-Host "✅ Commit créé" -ForegroundColor Green

# 5. Renommer la branche en main
Write-Host "`n🌿 Configuration de la branche..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branche renommée en 'main'" -ForegroundColor Green

# 6. Instructions pour pousser
Write-Host "`n🚀 Prêt à pousser vers GitHub!" -ForegroundColor Green
Write-Host "`n📝 Exécutez cette commande pour pousser:" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "`n⚠️  Si le dépôt GitHub est vide, vous devrez peut-être utiliser:" -ForegroundColor Yellow
Write-Host "   git push -u origin main --force" -ForegroundColor White
Write-Host "`n💡 Après avoir poussé, vous pourrez déployer sur Vercel!" -ForegroundColor Cyan

