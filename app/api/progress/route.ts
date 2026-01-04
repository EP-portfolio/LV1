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

    const progress = await prisma.progress.findUnique({
      where: { userId: prismaUser.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    if (!progress) {
      // Créer la progression si elle n'existe pas
      const newProgress = await prisma.progress.create({
        data: {
          userId: prismaUser.id,
          level: 'débutant',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      })
      return NextResponse.json(newProgress)
    }

    return NextResponse.json(progress)
  } catch (error: any) {
    console.error('Erreur récupération progression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

