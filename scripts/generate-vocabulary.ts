import { chatWithLLM } from '../lib/llm/client'
import { prisma } from '../lib/db'
import { VOCABULARY_CATEGORIES, VocabularyCategory } from '../lib/vocabulary/categories'

interface GeneratedWord {
  frenchWord: string
  englishWord: string
  category: string
}

/**
 * Générer un lot de mots pour une catégorie
 */
async function generateWordsBatch(
  category: VocabularyCategory,
  batchSize: number,
  existingWords: Set<string>
): Promise<GeneratedWord[]> {
  const prompt = `Génère exactement ${batchSize} mots de vocabulaire français de la catégorie "${category.name}" (${category.description}).

CONTRAINTES STRICTES :
1. Génère EXACTEMENT ${batchSize} mots, pas plus, pas moins
2. Chaque mot doit être UNIQUE (vérifie que tu ne répètes pas)
3. Les mots doivent être de la vie courante en France
4. Pour les verbes, utilise TOUJOURS l'infinitif
5. Les mots doivent être simples et courants (pas de mots techniques rares)
6. Exemples de mots de cette catégorie : ${category.examples.join(', ')}
7. Ne génère PAS de mots déjà dans cette liste : ${Array.from(existingWords).slice(-20).join(', ')}

Réponds UNIQUEMENT au format JSON strict suivant, sans texte avant ou après :
{
  "words": [
    {
      "frenchWord": "mot en français",
      "englishWord": "word in English"
    }
  ]
}`

  try {
    const response = await chatWithLLM([
      {
        role: 'system',
        content: 'Tu es un expert en vocabulaire français et anglais. Tu génères des listes de mots au format JSON strict. Tu respectes toujours les contraintes données.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.8,
      maxTokens: 4000,
      responseFormat: { type: 'json_object' }
    })

    // Parser la réponse JSON
    let parsed: { words: GeneratedWord[] }
    try {
      let cleaned = response.trim()
      // Enlever les markdown code blocks si présents
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '')
      }
      parsed = JSON.parse(cleaned)
    } catch (error) {
      console.error('Erreur parsing JSON:', error)
      console.error('Réponse reçue (premiers 300 caractères):', response.substring(0, 300))
      return []
    }

    // Filtrer les doublons et valider
    const uniqueWords: GeneratedWord[] = []
    for (const word of parsed.words || []) {
      const frenchLower = word.frenchWord?.trim().toLowerCase()
      const englishLower = word.englishWord?.trim().toLowerCase()
      
      if (
        frenchLower &&
        englishLower &&
        !existingWords.has(frenchLower) &&
        frenchLower.length > 1 &&
        englishLower.length > 1 &&
        frenchLower.length < 50 && // Éviter les phrases
        englishLower.length < 50
      ) {
        uniqueWords.push({
          frenchWord: word.frenchWord.trim(),
          englishWord: word.englishWord.trim(),
          category: category.name
        })
        existingWords.add(frenchLower)
      }
    }

    return uniqueWords
  } catch (error) {
    console.error(`Erreur génération batch pour ${category.name}:`, error)
    return []
  }
}

/**
 * Sauvegarder un mot dans la base de données (sans image pour l'instant)
 */
async function saveWordToDatabase(
  word: GeneratedWord
): Promise<void> {
  try {
    await prisma.vocabularyWord.create({
      data: {
        frenchWord: word.frenchWord,
        englishWord: word.englishWord,
        category: word.category,
        imageUrl: null, // Vide pour l'instant
        audioUrl: null, // Peut être ajouté plus tard
      }
    })
  } catch (error: any) {
    // Si c'est une erreur de doublon, on l'ignore
    if (error.code === 'P2002') {
      console.log(`    ⚠️  Doublon ignoré: ${word.frenchWord}`)
    } else {
      throw error
    }
  }
}

/**
 * Générer tous les mots de vocabulaire
 */
export async function generateAllVocabulary(
  targetTotal: number = 1500
): Promise<{ total: number; errors: number; skipped: number }> {
  console.log(`🚀 Début génération de ${targetTotal} mots de vocabulaire...`)
  console.log(`📝 Les images seront ajoutées plus tard\n`)
  
  // Récupérer les mots existants pour éviter les doublons
  const existingWords = await prisma.vocabularyWord.findMany({
    select: { frenchWord: true }
  })
  const existingSet = new Set(existingWords.map(w => w.frenchWord.toLowerCase()))
  
  let totalGenerated = existingWords.length
  let totalErrors = 0
  let totalSkipped = 0
  const BATCH_SIZE = 50 // Générer 50 mots à la fois
  const DELAY_BETWEEN_BATCHES = 2000 // 2 secondes entre les lots (pour respecter les limites API)

  console.log(`📊 Mots existants: ${totalGenerated}`)
  console.log(`🎯 Objectif: ${targetTotal} mots\n`)

  for (const category of VOCABULARY_CATEGORIES) {
    if (totalGenerated >= targetTotal) {
      console.log(`\n✅ Objectif atteint (${totalGenerated} mots) !`)
      break
    }

    console.log(`\n📂 Catégorie: ${category.name}`)
    console.log(`   Description: ${category.description}`)
    console.log(`   Objectif: ${category.targetCount} mots\n`)
    
    let categoryCount = 0
    const categoryTarget = Math.min(
      category.targetCount,
      targetTotal - totalGenerated
    )

    while (categoryCount < categoryTarget && totalGenerated < targetTotal) {
      const remaining = categoryTarget - categoryCount
      const currentBatchSize = Math.min(BATCH_SIZE, remaining)

      console.log(`  ⏳ Génération lot de ${currentBatchSize} mots... (${categoryCount}/${categoryTarget} pour cette catégorie)`)

      // Générer les mots
      const words = await generateWordsBatch(
        category,
        currentBatchSize,
        existingSet
      )

      if (words.length === 0) {
        console.log(`  ⚠️  Aucun mot généré pour ce lot`)
        totalErrors++
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
        continue
      }

      console.log(`  ✅ ${words.length} mots générés, sauvegarde en cours...`)

      // Sauvegarder chaque mot
      for (const word of words) {
        try {
          await saveWordToDatabase(word)
          categoryCount++
          totalGenerated++
          existingSet.add(word.frenchWord.toLowerCase())

          if (categoryCount % 10 === 0 || categoryCount === categoryTarget) {
            console.log(`    📝 ${word.frenchWord} → ${word.englishWord} (${totalGenerated}/${targetTotal})`)
          }
        } catch (error: any) {
          if (error.code === 'P2002') {
            totalSkipped++
          } else {
            console.error(`    ❌ Erreur pour ${word.frenchWord}:`, error.message)
            totalErrors++
          }
        }
      }

      // Délai entre les lots pour respecter les limites API
      if (categoryCount < categoryTarget && totalGenerated < targetTotal) {
        console.log(`  ⏸️  Pause de ${DELAY_BETWEEN_BATCHES}ms avant le prochain lot...`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
    }

    console.log(`  ✅ Catégorie ${category.name} terminée: ${categoryCount} mots générés`)
  }

  const finalCount = await prisma.vocabularyWord.count()
  
  console.log(`\n🎉 Génération terminée !`)
  console.log(`   Total dans la base: ${finalCount} mots`)
  console.log(`   Nouveaux mots ajoutés: ${totalGenerated - existingWords.length}`)
  console.log(`   Erreurs: ${totalErrors}`)
  console.log(`   Doublons ignorés: ${totalSkipped}`)

  return { 
    total: finalCount, 
    errors: totalErrors,
    skipped: totalSkipped
  }
}

