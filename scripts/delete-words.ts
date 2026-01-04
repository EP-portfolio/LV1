import { prisma } from '../lib/db'

async function deleteWords() {
  const wordsToDelete = ['cassoulet', 'tartiflette']
  
  console.log('🗑️  Suppression des mots de la base de données...\n')
  
  for (const word of wordsToDelete) {
    try {
      const deleted = await prisma.vocabularyWord.deleteMany({
        where: {
          frenchWord: word
        }
      })
      
      if (deleted.count > 0) {
        console.log(`✅ "${word}" supprimé (${deleted.count} occurrence(s))`)
      } else {
        console.log(`⚠️  "${word}" non trouvé dans la base`)
      }
    } catch (error: any) {
      console.error(`❌ Erreur lors de la suppression de "${word}":`, error.message)
    }
  }
  
  // Vérifier le nombre total de mots
  const total = await prisma.vocabularyWord.count()
  console.log(`\n📊 Total de mots restants: ${total}`)
  
  await prisma.$disconnect()
}

deleteWords().catch(console.error)

