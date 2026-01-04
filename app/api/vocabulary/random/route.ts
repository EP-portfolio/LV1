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

    // Récupérer un mot aléatoire qui a une image
    const wordsWithImages = await prisma.vocabularyWord.findMany({
      where: {
        imageUrl: { not: null }
      },
      select: {
        id: true,
        frenchWord: true,
        englishWord: true,
        imageUrl: true,
        audioUrl: true,
        category: true
      }
    })

    if (wordsWithImages.length === 0) {
      return NextResponse.json(
        { error: 'Aucun mot avec image disponible' },
        { status: 404 }
      )
    }

    // Sélectionner un mot aléatoire
    const randomIndex = Math.floor(Math.random() * wordsWithImages.length)
    const randomWord = wordsWithImages[randomIndex]

    return NextResponse.json({
      id: randomWord.id,
      frenchWord: randomWord.frenchWord,
      englishWord: randomWord.englishWord,
      imageUrl: randomWord.imageUrl,
      audioUrl: randomWord.audioUrl,
      category: randomWord.category
    })
  } catch (error: any) {
    console.error('Erreur récupération mot vocabulaire:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

