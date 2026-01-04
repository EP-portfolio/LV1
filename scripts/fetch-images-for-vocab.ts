/**
 * Script pour récupérer automatiquement des images pour tous les mots de vocabulaire
 * Utilise Pexels (gratuit) ou Unsplash pour chercher des images
 */

import { prisma } from '../lib/db'
import { searchPexelsImage, searchUnsplashImage } from '../lib/images/search'

// Configuration
const IMAGE_PROVIDER = (process.env.IMAGE_PROVIDER as 'pexels' | 'unsplash') || 'pexels'
const DELAY_BETWEEN_REQUESTS = 1000 // ms - pour éviter les rate limits (augmenté à 1 seconde)
const BATCH_SIZE = 20 // Traiter par lots plus petits pour éviter les problèmes

async function fetchImageForWord(
  englishWord: string,
  frenchWord: string
): Promise<string | null> {
  // Utiliser le mot anglais pour la recherche (plus de résultats)
  const searchQuery = englishWord.toLowerCase().trim()
  
  try {
    let imageUrl: string | null = null
    
    if (IMAGE_PROVIDER === 'unsplash') {
      imageUrl = await searchUnsplashImage(searchQuery)
    } else {
      imageUrl = await searchPexelsImage(searchQuery)
    }
    
    // Fallback : essayer l'autre provider si le premier échoue
    if (!imageUrl) {
      if (IMAGE_PROVIDER === 'unsplash') {
        imageUrl = await searchPexelsImage(searchQuery)
      } else {
        imageUrl = await searchUnsplashImage(searchQuery)
      }
    }
    
    // Si toujours pas d'image, essayer avec le mot français
    if (!imageUrl) {
      const frenchQuery = frenchWord.toLowerCase().trim()
      if (IMAGE_PROVIDER === 'unsplash') {
        imageUrl = await searchUnsplashImage(frenchQuery)
      } else {
        imageUrl = await searchPexelsImage(frenchQuery)
      }
    }
    
    return imageUrl
  } catch (error: any) {
    console.error(`   ❌ Erreur pour "${englishWord}":`, error.message)
    return null
  }
}

async function fetchImagesForAllWords() {
  console.log('🖼️  Récupération d\'images pour les mots de vocabulaire...\n')
  console.log(`📡 Provider: ${IMAGE_PROVIDER}`)
  console.log(`⏱️  Délai entre requêtes: ${DELAY_BETWEEN_REQUESTS}ms\n`)
  
  try {
    // Récupérer tous les mots sans image
    const wordsWithoutImages = await prisma.vocabularyWord.findMany({
      where: {
        imageUrl: null
      },
      select: {
        id: true,
        frenchWord: true,
        englishWord: true,
        category: true
      }
    })
    
    const total = wordsWithoutImages.length
    
    if (total === 0) {
      console.log('✅ Tous les mots ont déjà une image !')
      await prisma.$disconnect()
      return
    }
    
    console.log(`📊 ${total} mots sans image à traiter\n`)
    
    let success = 0
    let errors = 0
    let skipped = 0
    
    // Traiter par lots
    for (let i = 0; i < wordsWithoutImages.length; i += BATCH_SIZE) {
      const batch = wordsWithoutImages.slice(i, i + BATCH_SIZE)
      const batchNum = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(total / BATCH_SIZE)
      
      console.log(`\n📦 Lot ${batchNum}/${totalBatches} (${batch.length} mots)`)
      
      for (const word of batch) {
        try {
          // Afficher la progression
          const current = i + batch.indexOf(word) + 1
          process.stdout.write(`   [${current}/${total}] ${word.frenchWord} → ${word.englishWord}... `)
          
          const imageUrl = await fetchImageForWord(word.englishWord, word.frenchWord)
          
          if (imageUrl) {
            // Mettre à jour la base de données
            await prisma.vocabularyWord.update({
              where: { id: word.id },
              data: { imageUrl }
            })
            
            success++
            console.log('✅')
          } else {
            skipped++
            console.log('⚠️  (pas d\'image trouvée)')
          }
          
          // Délai entre les requêtes pour éviter les rate limits
          if (current < total) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
          }
        } catch (error: any) {
          errors++
          console.log(`❌ (${error.message})`)
        }
      }
      
      // Pause plus longue entre les lots
      if (i + BATCH_SIZE < wordsWithoutImages.length) {
        console.log(`\n⏸️  Pause de 5 secondes avant le prochain lot...`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
    
    // Statistiques finales
    const finalCount = await prisma.vocabularyWord.count({
      where: { imageUrl: { not: null } }
    })
    
    console.log(`\n\n🎉 Récupération terminée !`)
    console.log(`   ✅ Images récupérées: ${success}`)
    console.log(`   ⚠️  Aucune image trouvée: ${skipped}`)
    console.log(`   ❌ Erreurs: ${errors}`)
    console.log(`   📊 Total avec images: ${finalCount}/${total + finalCount - wordsWithoutImages.length}`)
    
    await prisma.$disconnect()
    
  } catch (error: any) {
    console.error('\n❌ Erreur fatale:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Lancer le script
fetchImagesForAllWords()

