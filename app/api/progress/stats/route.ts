import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! }
    })

    if (!prismaUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les statistiques détaillées
    const progress = await prisma.progress.findUnique({
      where: { userId: prismaUser.id }
    })

    const recentSessions = await prisma.practiceSession.findMany({
      where: { userId: prismaUser.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        questions: {
          take: 1,
        }
      }
    })

    const totalSessions = await prisma.practiceSession.count({
      where: { userId: prismaUser.id }
    })

    const sessionsByType = await prisma.practiceSession.groupBy({
      by: ['type'],
      where: { userId: prismaUser.id },
      _count: true,
    })

    const sessionsByDirection = await prisma.practiceSession.groupBy({
      by: ['direction'],
      where: { userId: prismaUser.id },
      _count: true,
    })

    return NextResponse.json({
      progress,
      recentSessions,
      totalSessions,
      sessionsByType,
      sessionsByDirection,
    })
  } catch (error: any) {
    console.error('Erreur récupération stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

