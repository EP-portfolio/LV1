/**
 * Service de génération/recherche d'images
 * Utilise maintenant la recherche d'images plutôt que la génération DALL-E
 */

import { searchIllustrationImage, ImageProvider } from './search'

/**
 * Rechercher une image d'illustration pour un vocabulaire
 * @deprecated Utiliser searchIllustrationImage directement
 */
export async function generateImageForVocabulary(
  word: string,
  context: string
): Promise<string> {
  // Utiliser la recherche d'images au lieu de la génération
  const query = `${word} ${context}`
  return searchIllustrationImage(query, 'en', 'pexels')
}

/**
 * Rechercher une image d'illustration pour un exercice de description
 * Utilise maintenant la recherche d'images sur Unsplash/Pexels
 */
export async function generateImageForDescription(
  description: string,
  language: 'fr' | 'en',
  provider: ImageProvider = 'pexels'
): Promise<string> {
  return searchIllustrationImage(description, language, provider)
}

