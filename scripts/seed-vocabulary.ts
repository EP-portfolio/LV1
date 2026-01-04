/**
 * Script pour insérer directement les mots de vocabulaire dans la base de données
 * Sans utiliser d'API LLM - Génération directe
 */

import { prisma } from '../lib/db'
import { VOCABULARY_CATEGORIES } from '../lib/vocabulary/categories'

interface WordData {
  frenchWord: string
  englishWord: string
  category: string
}

// Base de mots par catégorie - Je vais générer les mots directement
const generateWordsForCategory = async (categoryName: string, targetCount: number): Promise<WordData[]> => {
  // Cette fonction sera appelée pour générer les mots
  // Pour l'instant, je vais créer un script qui utilise une approche différente
  return []
}

async function main() {
  console.log('🚀 Génération des mots de vocabulaire...\n')
  
  // Récupérer les mots existants
  const existing = await prisma.vocabularyWord.findMany({
    select: { frenchWord: true }
  })
  const existingSet = new Set(existing.map(w => w.frenchWord.toLowerCase()))
  
  console.log(`📊 Mots existants: ${existing.length}\n`)
  
  // Je vais créer un script qui génère les mots par lots
  // Pour éviter de dépasser les limites, je vais créer un fichier séparé avec les mots
  console.log('💡 Pour générer les 1500 mots, je vais créer un fichier de données')
  console.log('   que vous pourrez importer directement.\n')
  
  await prisma.$disconnect()
}

main()

