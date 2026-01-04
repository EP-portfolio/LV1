/**
 * Script CLI pour générer les mots de vocabulaire
 * Usage: npx tsx scripts/cli-generate-vocabulary.ts [nombre]
 */

import { generateAllVocabulary } from './generate-vocabulary'
import { prisma } from '../lib/db'

async function main() {
  const targetTotal = process.argv[2] ? parseInt(process.argv[2]) : 1500
  
  if (isNaN(targetTotal) || targetTotal < 1 || targetTotal > 3000) {
    console.error('❌ Nombre invalide. Doit être entre 1 et 3000.')
    console.error('Usage: npx tsx scripts/cli-generate-vocabulary.ts [nombre]')
    console.error('Exemple: npx tsx scripts/cli-generate-vocabulary.ts 2000')
    process.exit(1)
  }

  // Vérifier la connexion à la base de données
  try {
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie\n')
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error)
    process.exit(1)
  }

  // Vérifier que GOOGLE_API_KEY est configurée
  if (!process.env.GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_API_KEY n\'est pas configurée dans .env.local')
    console.error('   Veuillez configurer votre clé API Google avant de continuer')
    process.exit(1)
  }

  console.log(`🚀 Génération de ${targetTotal} mots de vocabulaire...`)
  console.log(`⏱️  Temps estimé: ${Math.ceil(targetTotal * 2 / 60)} minutes\n`)
  console.log('⚠️  Note: Les images seront ajoutées plus tard\n')
  
  try {
    const result = await generateAllVocabulary(targetTotal)
    
    console.log(`\n✅ Terminé !`)
    console.log(`   Mots dans la base: ${result.total}`)
    console.log(`   Erreurs: ${result.errors}`)
    console.log(`   Doublons ignorés: ${result.skipped}`)
  } catch (error: any) {
    console.error('\n❌ Erreur lors de la génération:', error.message)
    if (error.message.includes('API key')) {
      console.error('   Vérifiez que GOOGLE_API_KEY est correctement configurée')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
  
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})

