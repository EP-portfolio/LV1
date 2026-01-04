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
    const { userAnswer, description, direction, imageUrl } = await req.json()

    if (!userAnswer || !description || !direction) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Pour l'exercice image, on compare avec la description traduite
    // On doit générer la traduction correcte
    const correctAnswer = direction === 'fr_to_en'
      ? description // Si description en FR, la traduction EN est la réponse
      : description // Si description en EN, la traduction FR est la réponse

    // Évaluer la traduction
    const evaluation = await evaluateTranslation(
      userAnswer,
      correctAnswer,
      description,
      direction
    )

    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Sauvegarder la session
    await prisma.practiceSession.create({
      data: {
        userId: prismaUser.id,
        type: 'TRANSLATION',
        direction: direction === 'fr_to_en' ? 'FR_TO_EN' : 'EN_TO_FR',
        mode: 'WRITTEN',
        score: evaluation.score,
        totalQuestions: 1,
        correctAnswers: evaluation.isCorrect ? 1 : 0,
        duration: 0,
        questions: {
          create: {
            originalText: description,
            userAnswer,
            correctAnswer,
            isCorrect: evaluation.isCorrect,
            feedback: evaluation.feedback,
            imageUrl,
          }
        }
      }
    })

    // Mettre à jour la progression
    await updateProgress(prismaUser.id, evaluation.score, evaluation.isCorrect)

    return NextResponse.json(evaluation)
  } catch (error: any) {
    console.error('Erreur évaluation image:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'évaluation' },
      { status: 500 }
    )
  }
}

