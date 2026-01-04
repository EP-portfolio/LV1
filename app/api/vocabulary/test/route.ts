import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Récupérer tous les mots avec leurs images (limité à 100 pour l'affichage)
    const words = await prisma.vocabularyWord.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        frenchWord: true,
        englishWord: true,
        category: true,
        imageUrl: true
      }
    })

    // Compter le total
    const total = await prisma.vocabularyWord.count()
    const withImages = await prisma.vocabularyWord.count({
      where: {
        imageUrl: { not: null }
      }
    })

    return NextResponse.json({
      words,
      stats: {
        total,
        withImages,
        withoutImages: total - withImages
      }
    })
  } catch (error: any) {
    console.error('Erreur récupération vocabulaire:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Erreur lors de la récupération',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

