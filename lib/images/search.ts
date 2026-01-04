/**
 * Service de recherche d'images d'illustration
 * Utilise Unsplash ou Pexels pour trouver des images pertinentes
 */

export type ImageProvider = 'unsplash' | 'pexels'

/**
 * Extraire des mots-clés de recherche à partir d'une description
 * Utilise le LLM pour identifier les concepts clés
 */
export async function extractImageKeywords(
  description: string,
  language: 'fr' | 'en'
): Promise<string[]> {
  // Si on a un LLM disponible, l'utiliser pour extraire les mots-clés
  // Sinon, utiliser une extraction simple
  
  // Utiliser le client LLM unifié si disponible
  try {
    const { chatWithLLM } = await import('@/lib/llm/client')
    const prompt = language === 'fr'
      ? `Extrais 2-3 mots-clés principaux de cette description pour chercher une image d'illustration: "${description}"
      
Réponds uniquement avec les mots-clés séparés par des virgules, en français.`
      : `Extract 2-3 main keywords from this description to search for an illustration image: "${description}"
      
Respond only with keywords separated by commas, in English.`

    const keywords = await chatWithLLM([
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.3,
      maxTokens: 50,
    })

    return keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0)
  } catch (error) {
    console.error('Erreur extraction mots-clés:', error)
  }

  // Fallback : extraction simple
  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3)

  return words
}

/**
 * Chercher une image sur Unsplash
 */
export async function searchUnsplashImage(
  query: string
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY not configured')
    return null
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      // Utiliser l'URL regular pour une bonne qualité
      return data.results[0].urls.regular
    }

    return null
  } catch (error) {
    console.error('Erreur recherche Unsplash:', error)
    return null
  }
}

/**
 * Chercher une image sur Pexels (gratuit, pas besoin de clé API)
 */
export async function searchPexelsImage(
  query: string,
  retryCount: number = 0
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY
  const MAX_RETRIES = 3
  const RETRY_DELAY = 2000 // 2 secondes

  // Pexels utilise juste la clé API, pas "Bearer"
  const headers: HeadersInit = apiKey
    ? { 'Authorization': apiKey.replace(/^Bearer\s+/i, '') }
    : {}

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers,
      }
    )

    // Gérer les erreurs de rate limit (429) et service indisponible (503)
    if (response.status === 429 || response.status === 503) {
      if (retryCount < MAX_RETRIES) {
        // Attendre avant de réessayer (backoff exponentiel)
        const delay = RETRY_DELAY * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        return searchPexelsImage(query, retryCount + 1)
      }
      // Trop de tentatives, retourner null
      return null
    }

    if (!response.ok) {
      // Si erreur 401/403, la clé est invalide
      if (response.status === 401 || response.status === 403) {
        console.warn(`Pexels API: Clé invalide ou expirée (${response.status})`)
        return null
      }
      // Autres erreurs
      if (retryCount < MAX_RETRIES && response.status >= 500) {
        // Retry sur erreurs serveur
        const delay = RETRY_DELAY * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        return searchPexelsImage(query, retryCount + 1)
      }
      return null
    }

    const data = await response.json()

    if (data.photos && data.photos.length > 0) {
      // Utiliser l'URL medium pour une bonne qualité
      return data.photos[0].src.medium
    }

    return null
  } catch (error: any) {
    // Erreurs réseau - retry si possible
    if (retryCount < MAX_RETRIES && (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED' || error.message?.includes('fetch failed'))) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount)
      await new Promise(resolve => setTimeout(resolve, delay))
      return searchPexelsImage(query, retryCount + 1)
    }
    // Ne pas logger les erreurs réseau normales
    return null
  }
}

/**
 * Chercher une image d'illustration à partir d'une description
 */
export async function searchIllustrationImage(
  description: string,
  language: 'fr' | 'en',
  provider: ImageProvider = 'pexels'
): Promise<string> {
  // Extraire les mots-clés
  const keywords = await extractImageKeywords(description, language)
  const searchQuery = keywords.join(' ')

  console.log(`Recherche d'image pour: "${searchQuery}"`)

  // Essayer le provider choisi
  let imageUrl: string | null = null

  if (provider === 'unsplash') {
    imageUrl = await searchUnsplashImage(searchQuery)
  } else {
    imageUrl = await searchPexelsImage(searchQuery)
  }

  // Fallback : essayer l'autre provider
  if (!imageUrl) {
    if (provider === 'unsplash') {
      imageUrl = await searchPexelsImage(searchQuery)
    } else {
      imageUrl = await searchUnsplashImage(searchQuery)
    }
  }

  // Si toujours pas d'image, utiliser un terme générique
  if (!imageUrl) {
    const genericQuery = language === 'fr' ? 'illustration' : 'illustration'
    imageUrl = await searchPexelsImage(genericQuery)
  }

  if (!imageUrl) {
    throw new Error('Impossible de trouver une image d\'illustration')
  }

  return imageUrl
}

