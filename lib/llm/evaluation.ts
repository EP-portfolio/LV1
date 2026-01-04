import { chatWithLLM } from './client'

export interface EvaluationResult {
  isCorrect: boolean
  score: number
  feedback: string
}

export async function evaluateTranslation(
  userAnswer: string,
  correctAnswer: string,
  originalText: string,
  direction: 'fr_to_en' | 'en_to_fr'
): Promise<EvaluationResult> {
  const prompt = `Évalue cette traduction pour un apprenant français de plus de 30 ans.
  
Texte original: "${originalText}"
Traduction attendue: "${correctAnswer}"
Traduction de l'utilisateur: "${userAnswer}"
Direction: ${direction === 'fr_to_en' ? 'Français vers Anglais' : 'Anglais vers Français'}

Donne une note sur 10 et un feedback constructif en français. Réponds UNIQUEMENT au format JSON valide, sans texte avant ou après:
{
  "score": nombre entre 0 et 10,
  "feedback": "feedback détaillé en français",
  "isCorrect": boolean (true si score >= 8)
}`

  const response = await chatWithLLM([
    {
      role: 'system',
      content: "Tu es un professeur d'anglais bienveillant et encourageant. Tu réponds toujours en JSON valide."
    },
    {
      role: 'user',
      content: prompt
    }
  ], {
    temperature: 0.3,
    responseFormat: { type: 'json_object' },
  })

  // Nettoyer la réponse (enlever markdown si présent)
  let cleanedResponse = response.trim()
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.replace(/```\n?/g, '')
  }

  let result
  try {
    result = JSON.parse(cleanedResponse)
  } catch (error) {
    // Si le parsing échoue, essayer d'extraire le JSON
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0])
    } else {
      // Fallback si pas de JSON valide
      result = {
        score: 5,
        feedback: 'Erreur lors de l\'évaluation. Veuillez réessayer.',
        isCorrect: false,
      }
    }
  }
  
  return {
    isCorrect: result.isCorrect || false,
    score: result.score || 0,
    feedback: result.feedback || '',
  }
}

