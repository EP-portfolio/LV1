/**
 * Génération audio avec Google Cloud Text-to-Speech
 * Utilise l'API REST de Google TTS
 */

export interface GoogleTTSVoice {
  name: string
  languageCode: string
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL'
}

// Voix disponibles pour Google TTS
const GOOGLE_VOICES: Record<'fr' | 'en', GoogleTTSVoice[]> = {
  fr: [
    { name: 'fr-FR-Wavenet-C', languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
    { name: 'fr-FR-Wavenet-D', languageCode: 'fr-FR', ssmlGender: 'MALE' },
    { name: 'fr-FR-Neural2-C', languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
  ],
  en: [
    { name: 'en-US-Wavenet-D', languageCode: 'en-US', ssmlGender: 'MALE' },
    { name: 'en-US-Wavenet-F', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Neural2-D', languageCode: 'en-US', ssmlGender: 'MALE' },
  ],
}

/**
 * Générer de la parole avec Google TTS
 */
export async function generateSpeechWithGoogle(
  text: string,
  language: 'fr' | 'en',
  voiceIndex: number = 0
): Promise<Buffer> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not configured. Please set it in .env.local')
  }

  const voices = GOOGLE_VOICES[language]
  const selectedVoice = voices[voiceIndex % voices.length]

  try {
    // Utiliser l'API REST de Google Text-to-Speech
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: selectedVoice.languageCode,
            name: selectedVoice.name,
            ssmlGender: selectedVoice.ssmlGender,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9, // Légèrement ralenti pour l'apprentissage
            pitch: 0,
            volumeGainDb: 0,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message || `Google TTS API error: ${response.status}`
      )
    }

    const data = await response.json()
    const audioContent = data.audioContent

    if (!audioContent) {
      throw new Error('No audio content returned from Google TTS')
    }

    // Convertir base64 en Buffer
    const audioBuffer = Buffer.from(audioContent, 'base64')
    return audioBuffer
  } catch (error) {
    console.error('Erreur génération audio Google:', error)
    throw error
  }
}

