/**
 * Génération audio avec Google Cloud Text-to-Speech
 * Utilise l'API REST de Google TTS avec Wavenet pour une qualité naturelle et humaine
 */

export interface GoogleTTSVoice {
  name: string
  languageCode: string
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL'
}

// Voix disponibles pour Google TTS - Wavenet en priorité pour qualité naturelle
const GOOGLE_VOICES: Record<'fr' | 'en', GoogleTTSVoice[]> = {
  fr: [
    // Wavenet (haute qualité, voix naturelle) - PRIORITÉ
    { name: 'fr-FR-Wavenet-C', languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
    { name: 'fr-FR-Wavenet-D', languageCode: 'fr-FR', ssmlGender: 'MALE' },
    { name: 'fr-FR-Wavenet-A', languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
    { name: 'fr-FR-Wavenet-B', languageCode: 'fr-FR', ssmlGender: 'MALE' },
    // Neural2 (fallback si Wavenet indisponible)
    { name: 'fr-FR-Neural2-C', languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
  ],
  en: [
    // Wavenet (haute qualité, voix naturelle) - PRIORITÉ
    { name: 'en-US-Wavenet-D', languageCode: 'en-US', ssmlGender: 'MALE' },
    { name: 'en-US-Wavenet-F', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Wavenet-A', languageCode: 'en-US', ssmlGender: 'MALE' },
    { name: 'en-US-Wavenet-B', languageCode: 'en-US', ssmlGender: 'MALE' },
    { name: 'en-US-Wavenet-C', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Wavenet-E', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Wavenet-G', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Wavenet-H', languageCode: 'en-US', ssmlGender: 'FEMALE' },
    { name: 'en-US-Wavenet-I', languageCode: 'en-US', ssmlGender: 'MALE' },
    { name: 'en-US-Wavenet-J', languageCode: 'en-US', ssmlGender: 'MALE' },
    // Neural2 (fallback si Wavenet indisponible)
    { name: 'en-US-Neural2-D', languageCode: 'en-US', ssmlGender: 'MALE' },
  ],
}

/**
 * Obtenir une voix Wavenet (force l'utilisation de Wavenet pour qualité naturelle)
 */
function getWavenetVoice(language: 'fr' | 'en', gender?: 'MALE' | 'FEMALE'): GoogleTTSVoice {
  const voices = GOOGLE_VOICES[language]
  
  // Genre par défaut selon la langue
  const defaultGender = gender || (language === 'fr' ? 'FEMALE' : 'MALE')
  
  // Chercher une voix Wavenet avec le genre souhaité
  const wavenetVoice = voices.find(v => 
    v.name.includes('Wavenet') && v.ssmlGender === defaultGender
  )
  
  // Si trouvée, la retourner
  if (wavenetVoice) {
    return wavenetVoice
  }
  
  // Sinon, prendre la première voix Wavenet disponible
  const anyWavenet = voices.find(v => v.name.includes('Wavenet'))
  if (anyWavenet) {
    return anyWavenet
  }
  
  // Fallback : première voix disponible
  return voices[0]
}

/**
 * Générer de la parole avec Google TTS (Wavenet garanti pour qualité naturelle)
 * @param text - Texte à synthétiser
 * @param language - Langue ('fr' ou 'en')
 * @param voiceIndex - Index de la voix (ignoré si forceWavenet=true)
 * @param forceWavenet - Force l'utilisation de Wavenet pour qualité optimale (défaut: true)
 */
export async function generateSpeechWithGoogle(
  text: string,
  language: 'fr' | 'en',
  voiceIndex: number = 0,
  forceWavenet: boolean = true
): Promise<Buffer> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not configured. Please set it in .env.local')
  }

  // Utiliser Wavenet si demandé (par défaut) pour qualité naturelle et humaine
  const selectedVoice = forceWavenet
    ? getWavenetVoice(language)
    : GOOGLE_VOICES[language][voiceIndex % GOOGLE_VOICES[language].length]

  // Log pour debug (seulement en développement)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎵 Utilisation de la voix Wavenet: ${selectedVoice.name} (${selectedVoice.ssmlGender})`)
  }

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
            // Paramètres optimisés pour un rendu naturel et humain
            speakingRate: 1.0, // Vitesse naturelle (1.0 = vitesse normale)
            pitch: 0, // Pas de modification de hauteur (naturel)
            volumeGainDb: 0, // Volume normal
            sampleRateHertz: 24000, // Qualité audio élevée pour clarté
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

