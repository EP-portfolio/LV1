import { chatWithLLM } from './client'

export interface TranslationQuestion {
  question: string
  correctAnswer: string
  explanation?: string
}

export async function generateTranslationQuestion(
  direction: 'fr_to_en' | 'en_to_fr',
  level: string
): Promise<TranslationQuestion> {
  const prompt = direction === 'fr_to_en'
    ? `Génère une phrase en français de niveau ${level} pour un apprenant de plus de 30 ans. La phrase doit être adaptée à un contexte professionnel ou quotidien. Retourne uniquement la phrase en français.`
    : `Génère une phrase en anglais de niveau ${level} pour un apprenant français de plus de 30 ans. La phrase doit être adaptée à un contexte professionnel ou quotidien. Retourne uniquement la phrase en anglais.`

  const question = await chatWithLLM([
    {
      role: 'system',
      content: "Tu es un professeur d'anglais spécialisé pour les adultes français de plus de 30 ans."
    },
    {
      role: 'user',
      content: prompt
    }
  ], {
    temperature: 0.7,
  })

  // Obtenir la traduction correcte
  const translationPrompt = direction === 'fr_to_en'
    ? `Traduis cette phrase française en anglais de manière naturelle et professionnelle: "${question}"`
    : `Traduis cette phrase anglaise en français de manière naturelle et professionnelle: "${question}"`

  const correctAnswer = await chatWithLLM([
    {
      role: 'user',
      content: translationPrompt
    }
  ], {
    temperature: 0.3,
  })

  return {
    question: question.trim(),
    correctAnswer: correctAnswer.trim(),
  }
}

