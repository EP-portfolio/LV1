/**
 * Abstraction pour différents fournisseurs LLM
 * Permet de basculer facilement entre OpenAI, Anthropic, etc.
 */

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'together'

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model?: string
  baseURL?: string
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  model?: string
}

/**
 * Interface commune pour tous les fournisseurs LLM
 */
export interface LLMClient {
  chat(messages: LLMMessage[], options?: {
    temperature?: number
    maxTokens?: number
    responseFormat?: { type: 'json_object' }
  }): Promise<LLMResponse>
}

/**
 * Factory pour créer le client LLM approprié
 */
export function createLLMClient(config: LLMConfig): LLMClient {
  switch (config.provider) {
    case 'openai':
      return createOpenAIClient(config)
    case 'anthropic':
      // Chargement conditionnel - ne sera exécuté que si anthropic est utilisé
      if (typeof window === 'undefined') {
        // Server-side only
        try {
          return createAnthropicClient(config)
        } catch (error: any) {
          throw new Error(
            'Anthropic provider requires @anthropic-ai/sdk. Install it with: npm install @anthropic-ai/sdk'
          )
        }
      }
      throw new Error('Anthropic provider is server-side only')
    case 'google':
      return createGoogleClient(config)
    case 'mistral':
      // Chargement conditionnel - ne sera exécuté que si mistral est utilisé
      if (typeof window === 'undefined') {
        // Server-side only
        try {
          return createMistralClient(config)
        } catch (error: any) {
          throw new Error(
            'Mistral provider requires @mistralai/mistralai. Install it with: npm install @mistralai/mistralai'
          )
        }
      }
      throw new Error('Mistral provider is server-side only')
    case 'together':
      return createTogetherClient(config)
    default:
      throw new Error(`Provider ${config.provider} not supported`)
  }
}

// OpenAI Client
function createOpenAIClient(config: LLMConfig): LLMClient {
  const { OpenAI } = require('openai')
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  })

  return {
    async chat(messages, options = {}) {
      const response = await client.chat.completions.create({
        model: config.model || 'gpt-4',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        response_format: options.responseFormat,
      })

      return {
        content: response.choices[0].message.content || '',
        model: response.model,
      }
    },
  }
}

// Anthropic Claude Client
function createAnthropicClient(config: LLMConfig): LLMClient {
  // Utiliser eval avec une chaîne pour éviter l'analyse statique de Next.js
  // Next.js ne peut pas analyser les require() dans eval()
  let Anthropic: any
  let client: any

  try {
    // Utiliser eval pour charger dynamiquement le module
    // Cela empêche Next.js de résoudre le module au build time
    const moduleName = '@anthropic-ai/sdk'
    // eslint-disable-next-line no-eval
    const module = eval(`require('${moduleName}')`)
    Anthropic = module.Anthropic || module.default?.Anthropic || module.default

    client = new Anthropic({
      apiKey: config.apiKey,
    })
  } catch (error: any) {
    throw new Error(
      'Anthropic SDK not installed. Install it with: npm install @anthropic-ai/sdk'
    )
  }

  return {
    async chat(messages, options = {}) {
      // Anthropic utilise un format différent
      const systemMessage = messages.find(m => m.role === 'system')
      const userMessages = messages.filter(m => m.role !== 'system')

      const response = await client.messages.create({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature,
        system: systemMessage?.content || '',
        messages: userMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      })

      return {
        content: response.content[0].text || '',
        model: response.model,
      }
    },
  }
}

// Google Gemini Client
function createGoogleClient(config: LLMConfig): LLMClient {
  const { GoogleGenerativeAI } = require('@google/generative-ai')

  // Le SDK utilise automatiquement la bonne version de l'API
  // Pour les clés API créées via Google AI Studio, utiliser les modèles sans préfixe
  const genAI = new GoogleGenerativeAI(config.apiKey)

  // Modèles disponibles (mis à jour janvier 2025) :
  // - gemini-2.5-flash (gratuit, rapide) - RECOMMANDÉ
  // - gemini-2.5-pro (payant, plus puissant)
  // - gemini-2.0-flash (gratuit)
  // - gemini-flash-latest (alias vers le dernier flash)
  // - gemini-pro-latest (alias vers le dernier pro)
  // Les anciens modèles (gemini-pro, gemini-1.5-flash) n'existent plus
  const modelName = config.model || 'gemini-2.5-flash'

  const model = genAI.getGenerativeModel({ model: modelName })

  return {
    async chat(messages, options = {}) {
      // Gemini utilise un format différent - convertir les messages
      const systemMessage = messages.find(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')

      // Construire le prompt avec le message système si présent
      let fullPrompt = ''
      if (systemMessage) {
        fullPrompt = `${systemMessage.content}\n\n`
      }

      // Convertir les messages en format conversationnel
      const conversationParts = conversationMessages.map(msg => {
        if (msg.role === 'user') {
          return { role: 'user', parts: [{ text: msg.content }] }
        } else if (msg.role === 'assistant') {
          return { role: 'model', parts: [{ text: msg.content }] }
        }
        return null
      }).filter(Boolean) as Array<{ role: string; parts: Array<{ text: string }> }>

      // Si on a un prompt système, l'ajouter au premier message utilisateur
      if (systemMessage && conversationParts.length > 0 && conversationParts[0].role === 'user') {
        conversationParts[0].parts[0].text = fullPrompt + conversationParts[0].parts[0].text
      } else if (systemMessage) {
        // Sinon, créer un message système séparé
        conversationParts.unshift({ role: 'user', parts: [{ text: fullPrompt }] })
      }

      const result = await model.generateContent({
        contents: conversationParts,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens,
        },
      })

      const response = await result.response
      const text = response.text()

      return {
        content: text || '',
        model: modelName,
      }
    },
  }
}

// Mistral AI Client
function createMistralClient(config: LLMConfig): LLMClient {
  // Utiliser eval avec une chaîne pour éviter l'analyse statique de Next.js
  // Next.js ne peut pas analyser les require() dans eval()
  let Mistral: any
  let client: any

  try {
    // Utiliser eval pour charger dynamiquement le module
    // Cela empêche Next.js de résoudre le module au build time
    const moduleName = '@mistralai/mistralai'
    // eslint-disable-next-line no-eval
    const module = eval(`require('${moduleName}')`)
    Mistral = module.Mistral || module.default?.Mistral || module.default

    client = new Mistral({
      apiKey: config.apiKey,
    })
  } catch (error: any) {
    throw new Error(
      'Mistral SDK not installed. Install it with: npm install @mistralai/mistralai'
    )
  }

  return {
    async chat(messages, options = {}) {
      const response = await client.chat.complete({
        model: config.model || 'mistral-large-latest',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      })

      return {
        content: response.choices[0].message.content || '',
        model: response.model,
      }
    },
  }
}

// Together AI Client
function createTogetherClient(config: LLMConfig): LLMClient {
  // Together AI utilise l'API OpenAI-compatible
  return createOpenAIClient({
    ...config,
    baseURL: 'https://api.together.xyz/v1',
    model: config.model || 'meta-llama/Llama-3-70b-chat-hf',
  })
}

