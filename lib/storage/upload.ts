import { createServerComponentClient } from '@/lib/supabase/server'

// Upload d'image
export async function uploadImage(
  file: File | Buffer,
  filename: string,
  userId: string
): Promise<string> {
  const supabase = await createServerComponentClient()
  
  const filePath = `images/${userId}/${filename}`
  
  const { error } = await supabase.storage
    .from('practice-media')
    .upload(filePath, file, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) {
    // Message d'erreur plus clair pour "Bucket not found"
    if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
      throw new Error(`Bucket "practice-media" non trouvé. Exécutez: npm run setup-storage`)
    }
    throw new Error(`Erreur upload image: ${error.message}`)
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from('practice-media')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// Upload d'audio
export async function uploadAudio(
  file: Buffer,
  filename: string,
  userId: string
): Promise<string> {
  const supabase = await createServerComponentClient()
  
  const filePath = `audio/${userId}/${filename}`
  
  const { error } = await supabase.storage
    .from('practice-media')
    .upload(filePath, file, {
      contentType: 'audio/mpeg',
      upsert: true,
    })

  if (error) {
    // Message d'erreur plus clair pour "Bucket not found"
    if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
      throw new Error(`Bucket "practice-media" non trouvé. Exécutez: npm run setup-storage`)
    }
    throw new Error(`Erreur upload audio: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('practice-media')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// Télécharger depuis une URL externe (DALL-E, etc.) et stocker
export async function storeExternalMedia(
  url: string,
  filename: string,
  userId: string,
  type: 'image' | 'audio'
): Promise<string> {
  const response = await fetch(url)
  const buffer = Buffer.from(await response.arrayBuffer())
  
  if (type === 'image') {
    return uploadImage(buffer, filename, userId)
  } else {
    return uploadAudio(buffer, filename, userId)
  }
}

