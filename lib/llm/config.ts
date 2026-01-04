/**
 * Configuration du fournisseur LLM
 * Modifiez cette configuration pour changer de fournisseur
 */

import { LLMConfig, LLMProvider } from './provider'

// Détermine le fournisseur à utiliser depuis les variables d'environnement
// Par défaut: Google Gemini
const provider = (process.env.LLM_PROVIDER || 'google') as LLMProvider

// Configuration par défaut
export const llmConfig: LLMConfig = {
  provider,
  apiKey: getApiKeyForProvider(provider),
  model: getModelForProvider(provider),
  baseURL: process.env.LLM_BASE_URL,
}

function getApiKeyForProvider(provider: LLMProvider): string {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY || ''
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || ''
    case 'google':
      return process.env.GOOGLE_API_KEY || ''
    case 'mistral':
      return process.env.MISTRAL_API_KEY || ''
    case 'together':
      return process.env.TOGETHER_API_KEY || ''
    default:
      return ''
  }
}

function getModelForProvider(provider: LLMProvider): string {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_MODEL || 'gpt-4'
    case 'anthropic':
      return process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'
    case 'google':
      return process.env.GOOGLE_MODEL || 'gemini-2.5-flash'
    case 'mistral':
      return process.env.MISTRAL_MODEL || 'mistral-large-latest'
    case 'together':
      return process.env.TOGETHER_MODEL || 'meta-llama/Llama-3-70b-chat-hf'
    default:
      return 'gpt-4'
  }
}

