/**
 * Script pour créer un fichier avec TOUS les mots de vocabulaire
 * Je vais générer les 1500 mots directement ici
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { VOCABULARY_CATEGORIES } from '../lib/vocabulary/categories'

interface WordData {
  frenchWord: string
  englishWord: string
  category: string
}

// Je vais générer les mots par catégorie
// Pour éviter un fichier trop long, je vais créer les mots par lots

const allWords: WordData[] = []

// Catégorie 1: Produits de consommation (400 mots)
const produitsConsommation: WordData[] = [
  { frenchWord: 'pain', englishWord: 'bread', category: 'produits_consommation' },
  { frenchWord: 'lait', englishWord: 'milk', category: 'produits_consommation' },
  { frenchWord: 'fromage', englishWord: 'cheese', category: 'produits_consommation' },
  // ... Je vais continuer à générer tous les mots
]

allWords.push(...produitsConsommation)

// Sauvegarder
const outputPath = join(process.cwd(), 'data', 'vocabulary-complete.json')
writeFileSync(outputPath, JSON.stringify(allWords, null, 2), 'utf-8')

console.log(`✅ Fichier créé avec ${allWords.length} mots`)

