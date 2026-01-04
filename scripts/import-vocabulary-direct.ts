/**
 * Script pour importer directement les mots de vocabulaire
 * Les mots sont générés directement ici, sans API
 */

import { prisma } from '../lib/db'

interface WordData {
  frenchWord: string
  englishWord: string
  category: string
}

// Base de mots pré-générés par catégorie
// Je vais créer les mots directement ici

const VOCABULARY_WORDS: Record<string, WordData[]> = {
  produits_consommation: [
    { frenchWord: 'pain', englishWord: 'bread', category: 'produits_consommation' },
    { frenchWord: 'lait', englishWord: 'milk', category: 'produits_consommation' },
    { frenchWord: 'fromage', englishWord: 'cheese', category: 'produits_consommation' },
    { frenchWord: 'yaourt', englishWord: 'yogurt', category: 'produits_consommation' },
    { frenchWord: 'café', englishWord: 'coffee', category: 'produits_consommation' },
    { frenchWord: 'thé', englishWord: 'tea', category: 'produits_consommation' },
    { frenchWord: 'sucre', englishWord: 'sugar', category: 'produits_consommation' },
    { frenchWord: 'sel', englishWord: 'salt', category: 'produits_consommation' },
    { frenchWord: 'beurre', englishWord: 'butter', category: 'produits_consommation' },
    { frenchWord: 'huile', englishWord: 'oil', category: 'produits_consommation' },
    // ... Je vais continuer avec plus de mots
  ],
  // ... autres catégories
}

async function importVocabulary() {
  console.log('🚀 Import des mots de vocabulaire...\n')
  
  let total = 0
  let errors = 0
  let skipped = 0
  
  for (const [category, words] of Object.entries(VOCABULARY_WORDS)) {
    console.log(`📂 Catégorie: ${category} (${words.length} mots)`)
    
    for (const word of words) {
      try {
        await prisma.vocabularyWord.create({
          data: {
            frenchWord: word.frenchWord,
            englishWord: word.englishWord,
            category: word.category,
            imageUrl: null,
            audioUrl: null,
          }
        })
        total++
        if (total % 50 === 0) {
          console.log(`   ✅ ${total} mots importés...`)
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          skipped++
        } else {
          console.error(`   ❌ Erreur pour ${word.frenchWord}:`, error.message)
          errors++
        }
      }
    }
  }
  
  console.log(`\n✅ Import terminé !`)
  console.log(`   Total: ${total} mots`)
  console.log(`   Erreurs: ${errors}`)
  console.log(`   Doublons ignorés: ${skipped}`)
  
  await prisma.$disconnect()
}

importVocabulary().catch(console.error)

