import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { generateSpeech } from '@/lib/audio/generation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * API pour obtenir l'URL de l'audio "nouvelle phrase"
 * Génère le fichier s'il n'existe pas encore
 */
export async function GET() {
  try {
    // Vérifier les variables d'environnement
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variables d\'environnement Supabase manquantes')
      return NextResponse.json(
        { error: 'Configuration serveur incomplète' },
        { status: 500 }
      )
    }

    const filePath = 'audio/shared/nouvelle_phrase.mp3'
    
    // Vérifier si le fichier existe déjà
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('practice-media')
      .list('audio/shared', {
        search: 'nouvelle_phrase.mp3'
      })

    if (listError) {
      console.error('Erreur liste fichiers:', listError)
      // Continuer quand même pour générer le fichier
    }

    if (existingFiles && existingFiles.length > 0) {
      // Le fichier existe, retourner l'URL
      const { data: urlData } = supabase.storage
        .from('practice-media')
        .getPublicUrl(filePath)
      
      return NextResponse.json({ url: urlData.publicUrl })
    }

    // Le fichier n'existe pas, le générer
    const audioBuffer = await generateSpeech('nouvelle phrase', 'fr')
    
    // Upload dans Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('practice-media')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      })

    if (uploadError) {
      console.error('Erreur upload:', uploadError)
      throw new Error(`Erreur upload: ${uploadError.message}`)
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('practice-media')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('Erreur génération audio "nouvelle phrase":', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

