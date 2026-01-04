import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  name: z.string().optional(),
  age: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Normaliser l'email (trim et lowercase)
    if (body.email) {
      body.email = body.email.trim().toLowerCase()
    }
    
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const validatedData = result.data

    const supabase = await createServerComponentClient()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
        data: {
          name: validatedData.name,
          age: validatedData.age,
        }
      }
    })

    if (authError) {
      console.error('Erreur Supabase Auth:', authError)
      
      // Gérer les erreurs spécifiques de Supabase
      let errorMessage = authError.message || 'Erreur lors de la création du compte'
      
      // Traduire les erreurs courantes
      if (authError.message?.includes('invalid') && authError.message?.includes('email')) {
        errorMessage = 'Format d\'email invalide. Veuillez utiliser une adresse email valide.'
      } else if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
        errorMessage = 'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.'
      } else if (authError.message?.includes('password')) {
        errorMessage = 'Le mot de passe ne respecte pas les critères requis.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Supabase peut retourner null si l'email nécessite une confirmation
    // Dans ce cas, authData.user peut être null mais l'utilisateur est créé
    if (!authData.user && !authData.session) {
      // Vérifier si c'est à cause de la confirmation d'email
      return NextResponse.json(
        { 
          error: "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail.",
          requiresEmailConfirmation: true 
        },
        { status: 200 } // 200 car l'inscription a réussi, mais nécessite confirmation
      )
    }

    // Créer l'utilisateur dans Prisma (pour vos données métier)
    // Utiliser l'ID de Supabase si disponible, sinon générer un nouvel ID
    let user
    try {
      user = await prisma.user.create({
        data: {
          id: authData.user?.id || undefined, // Utiliser l'ID Supabase si disponible
          email: validatedData.email,
          name: validatedData.name || null,
          age: validatedData.age || null,
        }
      })

      // Créer la progression initiale
      await prisma.progress.create({
        data: {
          userId: user.id,
          level: 'débutant',
        }
      })
    } catch (prismaError: any) {
      console.error('Erreur Prisma:', prismaError)
      
      // Si l'utilisateur existe déjà dans Prisma mais pas dans Supabase Auth
      // (cas de réinscription après suppression Supabase)
      if (prismaError.code === 'P2002') {
        // Essayer de récupérer l'utilisateur existant
        user = await prisma.user.findUnique({
          where: { email: validatedData.email }
        })
        
        if (!user) {
          throw new Error('Erreur lors de la création de l\'utilisateur dans la base de données')
        }
      } else {
        throw prismaError
      }
    }

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      session: authData.session,
      requiresEmailConfirmation: !authData.session && !!authData.user
    })
  } catch (error) {
    console.error('Erreur inscription:', error)
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'inscription"
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

