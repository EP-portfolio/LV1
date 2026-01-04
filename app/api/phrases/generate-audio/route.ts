import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { saveAudioFile } from '@/lib/audio/generation'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { phraseId, frenchPhrase, englishPhrase } = await req.json()

    if (!phraseId || !frenchPhrase || !englishPhrase) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Générer les audios (à la volée)
    let audioUrlFr: string | null = null
    let audioUrlEn: string | null = null

    try {
      audioUrlFr = await saveAudioFile(frenchPhrase, 'fr', prismaUser.id)
    } catch (error: any) {
      console.warn('⚠️ Erreur génération audio FR:', error.message)
    }

    try {
      audioUrlEn = await saveAudioFile(englishPhrase, 'en', prismaUser.id)
    } catch (error: any) {
      console.warn('⚠️ Erreur génération audio EN:', error.message)
    }

    // Mettre à jour la phrase dans la base de données avec les URLs audio
    if (audioUrlFr || audioUrlEn) {
      await prisma.socialPhrase.update({
        where: { id: phraseId },
        data: {
          audioUrlFr: audioUrlFr || undefined,
          audioUrlEn: audioUrlEn || undefined
        }
      })
    }

    return NextResponse.json({
      audioUrlFr,
      audioUrlEn
    })
  } catch (error: any) {
    console.error('Erreur génération audio phrase:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

