import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { generateImageForDescription } from '@/lib/images/generation'
import { generateTranslationQuestion } from '@/lib/llm/translation'
import { saveAudioFile } from '@/lib/audio/generation'
import { storeExternalMedia } from '@/lib/storage/upload'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { direction, level } = await req.json()

    // Générer une description
    const questionData = await generateTranslationQuestion(direction, level)
    const description = direction === 'fr_to_en' 
      ? questionData.question 
      : questionData.correctAnswer

    // Rechercher une image d'illustration correspondante
    // Utilise Pexels par défaut (gratuit, pas besoin de clé pour usage limité)
    const imageProvider = (process.env.IMAGE_PROVIDER as 'unsplash' | 'pexels') || 'pexels'
    const imageUrl = await generateImageForDescription(
      description,
      direction === 'fr_to_en' ? 'fr' : 'en',
      imageProvider
    )

    // Stocker l'image dans Supabase Storage
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const imageFilename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
    const storedImageUrl = await storeExternalMedia(
      imageUrl,
      imageFilename,
      prismaUser.id,
      'image'
    )

    // Générer l'audio de la description (optionnel - peut échouer si l'API n'est pas activée)
    let audioUrl: string | null = null
    try {
      audioUrl = await saveAudioFile(
        description,
        direction === 'fr_to_en' ? 'fr' : 'en',
        prismaUser.id
      )
    } catch (audioError: any) {
      // Si l'API Text-to-Speech n'est pas activée, on continue sans audio
      console.warn('Génération audio échouée (optionnel):', audioError.message)
      // L'audio sera null, l'application fonctionnera quand même
    }

    return NextResponse.json({
      imageUrl: storedImageUrl,
      description,
      audioUrl, // Peut être null si l'API n'est pas activée
      correctAnswer: questionData.correctAnswer,
    })
  } catch (error: any) {
    console.error('Erreur génération exercice image:', error)
    
    // Messages d'erreur plus spécifiques
    let errorMessage = error.message || 'Erreur lors de la génération'
    
    if (error.message?.includes('API key is not configured') || error.message?.includes('GOOGLE_API_KEY')) {
      errorMessage = 'Clé API Google non configurée. Veuillez ajouter GOOGLE_API_KEY dans .env.local'
    } else if (error.message?.includes('Text-to-Speech API') || error.message?.includes('texttospeech')) {
      errorMessage = 'API Cloud Text-to-Speech non activée. Activez-la dans Google Cloud Console. Voir ACTIVATE_TTS_API.md'
    } else if (error.message?.includes('not configured')) {
      errorMessage = 'Configuration API manquante. Vérifiez vos variables d\'environnement dans .env.local'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

