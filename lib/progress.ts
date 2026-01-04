import { prisma } from '@/lib/db'

export async function updateProgress(
  userId: string,
  score: number,
  _isCorrect: boolean
) {
  const progress = await prisma.progress.findUnique({
    where: { userId }
  })

  if (!progress) {
    // Créer la progression si elle n'existe pas
    await prisma.progress.create({
      data: {
        userId,
        level: 'débutant',
        totalSessions: 1,
        averageScore: score,
        lastPractice: new Date(),
      }
    })
    return
  }

  // Calculer le nouveau score moyen
  const newTotalSessions = progress.totalSessions + 1
  const newAverageScore = 
    (progress.averageScore * progress.totalSessions + score) / newTotalSessions

  // Calculer le streak (jours consécutifs)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const lastPractice = progress.lastPractice
    ? new Date(progress.lastPractice)
    : null
  lastPractice?.setHours(0, 0, 0, 0)

  let newStreak = progress.streak
  if (lastPractice) {
    const daysDiff = Math.floor(
      (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysDiff === 1) {
      // Jour consécutif
      newStreak = progress.streak + 1
    } else if (daysDiff > 1) {
      // Streak rompu
      newStreak = 1
    }
    // Si daysDiff === 0, même jour, on garde le streak
  } else {
    // Première pratique
    newStreak = 1
  }

  // Déterminer le niveau basé sur le score moyen
  let newLevel = progress.level
  if (newAverageScore >= 8) {
    newLevel = 'avancé'
  } else if (newAverageScore >= 6) {
    newLevel = 'intermédiaire'
  } else {
    newLevel = 'débutant'
  }

  // Mettre à jour la progression
  await prisma.progress.update({
    where: { userId },
    data: {
      totalSessions: newTotalSessions,
      averageScore: newAverageScore,
      streak: newStreak,
      level: newLevel,
      lastPractice: new Date(),
    }
  })
}

