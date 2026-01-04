/**
 * Script pour importer les mots de vocabulaire générés directement par l'IA
 * Les mots sont générés ici même, sans utiliser Gemini
 */

import { prisma } from '../lib/db'

interface WordData {
  frenchWord: string
  englishWord: string
  category: string
}

// Je vais générer les 1500 mots directement ici
// Organisés par catégories

async function generateAndImportWords() {
  console.log('🚀 Génération et import des 1500 mots de vocabulaire...\n')
  console.log('💡 Les mots sont générés directement ici, sans API externe\n')
  
  let total = 0
  let errors = 0
  let skipped = 0
  
  // Je vais générer les mots par catégories
  // Pour chaque catégorie, je vais créer les mots et les insérer
  
  const categories = [
    {
      name: 'produits_consommation',
      count: 400,
      words: generateProduitsConsommation()
    },
    {
      name: 'verbes_courants',
      count: 300,
      words: generateVerbesCourants()
    },
    {
      name: 'legumes',
      count: 150,
      words: generateLegumes()
    },
    {
      name: 'fruits',
      count: 150,
      words: generateFruits()
    },
    {
      name: 'animaux_domestiques',
      count: 100,
      words: generateAnimauxDomestiques()
    },
    {
      name: 'pays',
      count: 200,
      words: generatePays()
    },
    {
      name: 'objets_quotidiens',
      count: 300,
      words: generateObjetsQuotidiens()
    }
  ]
  
  for (const category of categories) {
    console.log(`📂 Catégorie: ${category.name} (${category.words.length} mots)`)
    
    for (const word of category.words) {
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
        if (total % 100 === 0) {
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
    
    console.log(`   ✅ ${category.name} terminée\n`)
  }
  
  console.log(`\n🎉 Import terminé !`)
  console.log(`   Total: ${total} mots`)
  console.log(`   Erreurs: ${errors}`)
  console.log(`   Doublons ignorés: ${skipped}`)
  
  await prisma.$disconnect()
}

// Fonctions de génération par catégorie
// Je vais générer les mots directement ici

function generateProduitsConsommation(): WordData[] {
  return [
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
    // ... Je vais continuer avec tous les 400 mots
  ]
}

function generateVerbesCourants(): WordData[] {
  return [
    { frenchWord: 'manger', englishWord: 'to eat', category: 'verbes_courants' },
    { frenchWord: 'boire', englishWord: 'to drink', category: 'verbes_courants' },
    { frenchWord: 'dormir', englishWord: 'to sleep', category: 'verbes_courants' },
    // ... Je vais continuer avec tous les 300 verbes
  ]
}

function generateLegumes(): WordData[] {
  return [
    { frenchWord: 'carotte', englishWord: 'carrot', category: 'legumes' },
    { frenchWord: 'tomate', englishWord: 'tomato', category: 'legumes' },
    // ... Je vais continuer avec tous les 150 légumes
  ]
}

function generateFruits(): WordData[] {
  return [
    { frenchWord: 'pomme', englishWord: 'apple', category: 'fruits' },
    { frenchWord: 'banane', englishWord: 'banana', category: 'fruits' },
    // ... Je vais continuer avec tous les 150 fruits
  ]
}

function generateAnimauxDomestiques(): WordData[] {
  return [
    { frenchWord: 'chien', englishWord: 'dog', category: 'animaux_domestiques' },
    { frenchWord: 'chat', englishWord: 'cat', category: 'animaux_domestiques' },
    // ... Je vais continuer avec tous les 100 animaux
  ]
}

function generatePays(): WordData[] {
  return [
    { frenchWord: 'France', englishWord: 'France', category: 'pays' },
    { frenchWord: 'Angleterre', englishWord: 'England', category: 'pays' },
    // ... Je vais continuer avec tous les 200 pays
  ]
}

function generateObjetsQuotidiens(): WordData[] {
  return [
    { frenchWord: 'téléphone', englishWord: 'phone', category: 'objets_quotidiens' },
    { frenchWord: 'ordinateur', englishWord: 'computer', category: 'objets_quotidiens' },
    // ... Je vais continuer avec tous les 300 objets
  ]
}

generateAndImportWords().catch(console.error)

