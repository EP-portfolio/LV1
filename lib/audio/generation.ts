import { generateSpeechWithGoogle } from './google-tts'
import { uploadAudio } from '@/lib/storage/upload'

// Génération audio avec Google Cloud Text-to-Speech
export async function generateSpeech(
  text: string,
  language: 'fr' | 'en',
  voiceIndex: number = 0
): Promise<Buffer> {
  return generateSpeechWithGoogle(text, language, voiceIndex)
}

// Sauvegarder l'audio et retourner l'URL
export async function saveAudioFile(
  text: string,
  language: 'fr' | 'en',
  userId: string
): Promise<string> {
  const audioBuffer = await generateSpeech(text, language)
  
  // Sauvegarder dans Supabase Storage
  const filename = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`
  const publicUrl = await uploadAudio(audioBuffer, filename, userId)

  return publicUrl
}

