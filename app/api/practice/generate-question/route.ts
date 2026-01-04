import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { generateTranslationQuestion } from '@/lib/llm/translation'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { direction, level } = await req.json()
    
    if (!direction || !level) {
      return NextResponse.json(
        { error: 'Direction et niveau requis' },
        { status: 400 }
      )
    }

    const question = await generateTranslationQuestion(
      direction as 'fr_to_en' | 'en_to_fr',
      level
    )

    if (!question.question || !question.correctAnswer) {
      return NextResponse.json(
        { error: 'La génération de la question a échoué' },
        { status: 500 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Erreur génération question:', error)
    
      let errorMessage = 'Erreur lors de la génération'
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('not configured')) {
          const provider = process.env.LLM_PROVIDER || 'google'
          const keyName = provider === 'google' ? 'GOOGLE_API_KEY' : `${provider.toUpperCase()}_API_KEY`
          errorMessage = `Clé API ${provider.toUpperCase()} non configurée. Veuillez configurer ${keyName} dans .env.local`
        } else {
          errorMessage = error.message
        }
      }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

