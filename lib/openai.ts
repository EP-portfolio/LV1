/**
 * @deprecated Ce fichier est conservé pour compatibilité mais n'est plus utilisé.
 * L'application utilise maintenant Google Gemini via lib/llm/client.ts
 * Pour utiliser OpenAI, configurez LLM_PROVIDER="openai" dans .env.local
 */

// Désactivé par défaut - utilisez lib/llm/client.ts à la place
export const openai = null

if (process.env.NODE_ENV !== 'test' && process.env.LLM_PROVIDER === 'openai') {
  try {
    // Chargement conditionnel uniquement si OpenAI est explicitement configuré
    const OpenAI = require('openai').default
    if (process.env.OPENAI_API_KEY) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(globalThis as any).__openai_client = client
    }
  } catch (error) {
    console.warn('OpenAI SDK not available. Install with: npm install openai')
  }
}

