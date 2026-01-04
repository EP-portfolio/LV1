import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { updateProgress } from '@/lib/progress'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { userAnswer, correctAnswer, vocabularyWordId, level } = await req.json()

    if (!userAnswer || !correctAnswer || !vocabularyWordId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Comparaison simple (peut être améliorée avec un LLM pour plus de flexibilité)
    const correctAnswerLower = correctAnswer.toLowerCase().trim()
    const userAnswerLower = userAnswer.toLowerCase().trim()
    
    const isCorrect = userAnswerLower === correctAnswerLower || 
                     userAnswerLower.includes(correctAnswerLower) ||
                     correctAnswerLower.includes(userAnswerLower)

    // Calculer le score (10 si correct, 0 si incorrect)
    const score = isCorrect ? 10 : 0

    // Récupérer l'utilisateur Prisma
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer le mot de vocabulaire
    const vocabularyWord = await prisma.vocabularyWord.findUnique({
      where: { id: vocabularyWordId }
    })

    if (!vocabularyWord) {
      return NextResponse.json(
        { error: 'Mot de vocabulaire non trouvé' },
        { status: 404 }
      )
    }

    // Sauvegarder la session de pratique
    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: prismaUser.id,
        type: 'VOCABULARY',
        direction: 'FR_TO_EN', // Toujours français vers anglais pour le vocabulaire
        mode: 'ORAL', // Mode oral pour les exercices de vocabulaire
        score: score,
        totalQuestions: 1,
        correctAnswers: isCorrect ? 1 : 0,
        duration: 0,
        questions: {
          create: {
            originalText: vocabularyWord.frenchWord,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            feedback: isCorrect 
              ? `Excellent ! "${vocabularyWord.frenchWord}" se traduit bien par "${correctAnswer}".`
              : `La réponse correcte est "${correctAnswer}". Continuez vos efforts !`,
            imageUrl: vocabularyWord.imageUrl || null,
          }
        }
      }
    })

    // Mettre à jour la progression
    await updateProgress(prismaUser.id, score, isCorrect)

    return NextResponse.json({
      isCorrect,
      score,
      feedback: isCorrect 
        ? `Excellent ! "${vocabularyWord.frenchWord}" se traduit bien par "${correctAnswer}".`
        : `La réponse correcte est "${correctAnswer}". Continuez vos efforts !`,
      sessionId: practiceSession.id,
    })
  } catch (error: any) {
    console.error('Erreur évaluation vocabulaire:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'évaluation' },
      { status: 500 }
    )
  }
}

