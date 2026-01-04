import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { generateTranslationQuestion } from '@/lib/llm/translation'
import { saveAudioFile } from '@/lib/audio/generation'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { direction, level } = await req.json()

    // Générer la question de traduction
    const questionData = await generateTranslationQuestion(direction, level)
    const originalText = direction === 'fr_to_en'
      ? questionData.question
      : questionData.correctAnswer

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

    // Générer l'audio
    const audioUrl = await saveAudioFile(
      originalText,
      direction === 'fr_to_en' ? 'fr' : 'en',
      prismaUser.id
    )

    return NextResponse.json({
      originalText,
      audioUrl,
      correctAnswer: questionData.correctAnswer,
    })
  } catch (error: any) {
    console.error('Erreur génération exercice audio:', error)
    
    // Messages d'erreur plus spécifiques
    let errorMessage = error.message || 'Erreur lors de la génération'
    
    if (error.message?.includes('Text-to-Speech API') || error.message?.includes('texttospeech') || error.message?.includes('has not been used')) {
      errorMessage = 'API Cloud Text-to-Speech non activée. Activez-la dans Google Cloud Console. Voir ACTIVATE_TTS_API.md pour les instructions.'
    } else if (error.message?.includes('API key is not configured') || error.message?.includes('GOOGLE_API_KEY')) {
      errorMessage = 'Clé API Google non configurée. Veuillez ajouter GOOGLE_API_KEY dans .env.local'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

