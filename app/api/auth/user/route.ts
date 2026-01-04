import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const supabase = await createServerComponentClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }

  // Récupérer les informations complètes de l'utilisateur depuis Prisma
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    // Retourner les données combinées : Supabase Auth + Prisma
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: prismaUser?.name || null, // Nom depuis Prisma
      }
    })
  } catch (error) {
    // En cas d'erreur Prisma, retourner au moins les données Supabase
    console.error('Erreur récupération utilisateur Prisma:', error)
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: null,
      }
    })
  }
}

