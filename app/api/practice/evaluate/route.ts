import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { evaluateTranslation } from '@/lib/llm/evaluation'
import { prisma } from '@/lib/db'
import { updateProgress } from '@/lib/progress'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { userAnswer, originalText, correctAnswer, direction, mode } = await req.json()

    if (!userAnswer || !originalText || !correctAnswer || !direction) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Évaluer la traduction
    const evaluation = await evaluateTranslation(
      userAnswer,
      correctAnswer,
      originalText,
      direction
    )

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

    // Sauvegarder la session de pratique
    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: prismaUser.id,
        type: 'TRANSLATION',
        direction: direction === 'fr_to_en' ? 'FR_TO_EN' : 'EN_TO_FR',
        mode: mode === 'written' ? 'WRITTEN' : 'ORAL',
        score: evaluation.score,
        totalQuestions: 1,
        correctAnswers: evaluation.isCorrect ? 1 : 0,
        duration: 0,
        questions: {
          create: {
            originalText,
            userAnswer,
            correctAnswer,
            isCorrect: evaluation.isCorrect,
            feedback: evaluation.feedback,
          }
        }
      }
    })

    // Mettre à jour la progression
    await updateProgress(prismaUser.id, evaluation.score, evaluation.isCorrect)

    return NextResponse.json({
      ...evaluation,
      sessionId: practiceSession.id,
    })
  } catch (error: any) {
    console.error('Erreur évaluation:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'évaluation' },
      { status: 500 }
    )
  }
}

