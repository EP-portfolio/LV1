import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createServerComponentClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer une phrase aléatoire
    const phrases = await prisma.socialPhrase.findMany({
      select: {
        id: true,
        frenchPhrase: true,
        englishPhrase: true,
        category: true,
        audioUrlFr: true,
        audioUrlEn: true
      }
    })

    if (phrases.length === 0) {
      return NextResponse.json(
        { error: 'Aucune phrase disponible' },
        { status: 404 }
      )
    }

    // Sélectionner une phrase aléatoire
    const randomIndex = Math.floor(Math.random() * phrases.length)
    const randomPhrase = phrases[randomIndex]

    return NextResponse.json({
      id: randomPhrase.id,
      frenchPhrase: randomPhrase.frenchPhrase,
      englishPhrase: randomPhrase.englishPhrase,
      category: randomPhrase.category,
      audioUrlFr: randomPhrase.audioUrlFr,
      audioUrlEn: randomPhrase.audioUrlEn
    })
  } catch (error: any) {
    console.error('Erreur récupération phrase:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

