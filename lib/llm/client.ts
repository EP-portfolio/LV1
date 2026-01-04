/**
 * Client LLM unifié
 * Utilise l'abstraction pour supporter différents fournisseurs
 */

import { createLLMClient, LLMClient, LLMMessage } from './provider'
import { llmConfig } from './config'

let clientInstance: LLMClient | null = null

/**
 * Obtient ou crée le client LLM configuré
 */
export function getLLMClient(): LLMClient {
  if (!clientInstance) {
    if (!llmConfig.apiKey) {
      throw new Error(`${llmConfig.provider.toUpperCase()} API key is not configured. Please set ${getEnvVarName(llmConfig.provider)} in .env.local`)
    }
    clientInstance = createLLMClient(llmConfig)
  }
  return clientInstance
}

/**
 * Helper pour obtenir le nom de la variable d'environnement
 */
function getEnvVarName(provider: string): string {
  const mapping: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    together: 'TOGETHER_API_KEY',
  }
  return mapping[provider] || 'LLM_API_KEY'
}

/**
 * Chat simplifié avec le LLM
 */
export async function chatWithLLM(
  messages: LLMMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
    responseFormat?: { type: 'json_object' }
  }
): Promise<string> {
  const client = getLLMClient()
  const response = await client.chat(messages, options)
  return response.content
}

