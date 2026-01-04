import { prisma } from '../lib/db'

async function checkVocabularyCount() {
  console.log('🔍 Vérification de la base de données...\n')
  
  try {
    // Compter tous les mots
    const totalCount = await prisma.vocabularyWord.count()
    console.log(`📊 Total de mots: ${totalCount}`)
    
    // Compter par catégorie
    const byCategory = await prisma.vocabularyWord.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        category: 'asc'
      }
    })
    
    console.log('\n📂 Répartition par catégorie:')
    let sum = 0
    for (const cat of byCategory) {
      console.log(`   ${cat.category || '(sans catégorie)'}: ${cat._count.id} mots`)
      sum += cat._count.id
    }
    
    console.log(`\n   Total vérifié: ${sum} mots`)
    
    // Vérifier les doublons (mots français identiques)
    const allWords = await prisma.vocabularyWord.findMany({
      select: {
        frenchWord: true
      }
    })
    
    const frenchWords = allWords.map(w => w.frenchWord.toLowerCase().trim())
    const uniqueFrench = new Set(frenchWords)
    
    console.log(`\n🔤 Mots français uniques: ${uniqueFrench.size}`)
    console.log(`   (sur ${frenchWords.length} mots au total)`)
    
    if (uniqueFrench.size < frenchWords.length) {
      console.log(`\n⚠️  Attention: ${frenchWords.length - uniqueFrench.size} doublons potentiels détectés`)
      
      // Trouver les doublons
      const duplicates: string[] = []
      const seen = new Set<string>()
      
      for (const word of frenchWords) {
        if (seen.has(word)) {
          duplicates.push(word)
        } else {
          seen.add(word)
        }
      }
      
      if (duplicates.length > 0) {
        console.log(`\n📋 Doublons trouvés:`)
        const uniqueDuplicates = [...new Set(duplicates)]
        for (const dup of uniqueDuplicates.slice(0, 10)) {
          console.log(`   - ${dup}`)
        }
        if (uniqueDuplicates.length > 10) {
          console.log(`   ... et ${uniqueDuplicates.length - 10} autres`)
        }
      }
    } else {
      console.log(`\n✅ Aucun doublon détecté`)
    }
    
    // Vérifier les mots sans image ni audio
    const withoutMedia = await prisma.vocabularyWord.count({
      where: {
        OR: [
          { imageUrl: null },
          { audioUrl: null }
        ]
      }
    })
    
    console.log(`\n📷 Mots sans image ou audio: ${withoutMedia}`)
    
    await prisma.$disconnect()
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkVocabularyCount()

