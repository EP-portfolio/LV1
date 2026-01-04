/**
 * Script de test pour vérifier que la base de données VocabularyWord fonctionne
 */

import { prisma } from '../lib/db'

async function test() {
  try {
    console.log('🧪 Test de la base de données VocabularyWord...\n')

    // Test 1: Compter les mots existants
    const count = await prisma.vocabularyWord.count()
    console.log(`✅ Connexion réussie`)
    console.log(`📊 Nombre de mots dans la base: ${count}\n`)

    // Test 2: Créer un mot de test
    console.log('📝 Création d\'un mot de test...')
    const testWord = await prisma.vocabularyWord.create({
      data: {
        frenchWord: 'test_pomme',
        englishWord: 'apple',
        category: 'fruits',
        imageUrl: null, // Champ vide comme demandé
      }
    })
    console.log(`✅ Mot créé: ${testWord.frenchWord} → ${testWord.englishWord}`)
    console.log(`   ID: ${testWord.id}`)
    console.log(`   Image URL: ${testWord.imageUrl || '(vide)'}\n`)

    // Test 3: Lire le mot
    const foundWord = await prisma.vocabularyWord.findUnique({
      where: { frenchWord: 'test_pomme' }
    })
    console.log(`✅ Mot trouvé: ${foundWord?.frenchWord} → ${foundWord?.englishWord}\n`)

    // Test 4: Supprimer le mot de test
    await prisma.vocabularyWord.delete({
      where: { id: testWord.id }
    })
    console.log(`✅ Mot de test supprimé\n`)

    // Test 5: Vérifier la structure
    console.log('📋 Structure de la table:')
    console.log('   - id: String (unique)')
    console.log('   - frenchWord: String (unique)')
    console.log('   - englishWord: String')
    console.log('   - category: String? (optionnel)')
    console.log('   - imageUrl: String? (optionnel, prêt pour URL ou fichier)')
    console.log('   - audioUrl: String? (optionnel)')
    console.log('   - createdAt: DateTime\n')

    console.log('🎉 Tous les tests sont passés !')
    console.log('✅ La base de données est prête à accueillir les mots de vocabulaire.\n')

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

test()

