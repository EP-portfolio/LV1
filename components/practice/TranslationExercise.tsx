'use client'

import { useState, useEffect } from 'react'
import { WebSpeechSynthesis } from '@/lib/audio/web-speech'

interface TranslationExerciseProps {
  direction: 'fr_to_en' | 'en_to_fr'
  level?: string
}

export default function TranslationExercise({
  direction,
  level = 'intermédiaire',
}: TranslationExerciseProps) {
  const [mode, setMode] = useState<'written' | 'oral'>('written')
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [questionLoading, setQuestionLoading] = useState(true)

  const speechSynthesis = typeof window !== 'undefined' 
    ? new WebSpeechSynthesis() 
    : null

  useEffect(() => {
    loadQuestion()
  }, [])

  const loadQuestion = async () => {
    setQuestionLoading(true)
    setFeedback('')
    setScore(null)
    setUserAnswer('')
    
    try {
      const response = await fetch('/api/practice/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, level }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        const errorMessage = errorData.error || `Erreur ${response.status}: ${response.statusText}`
        
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour accéder aux exercices')
        } else if (response.status === 500) {
          // Afficher le message d'erreur spécifique du serveur si disponible
          if (errorMessage.includes('GOOGLE_API_KEY') || errorMessage.includes('API key is not configured')) {
            throw new Error('Clé API Google non configurée. Ajoutez GOOGLE_API_KEY dans .env.local')
          }
          throw new Error(errorMessage || 'Erreur serveur. Vérifiez que la clé API est configurée dans .env.local')
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = await response.json()
      
      if (!data.question || !data.correctAnswer) {
        throw new Error('Réponse invalide du serveur')
      }
      
      setQuestion(data.question)
      setCorrectAnswer(data.correctAnswer)
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de la question'
      setFeedback(errorMessage)
    } finally {
      setQuestionLoading(false)
    }
  }

  const handleOralAnswer = async () => {
    // Vérifier si l'API Web Speech Recognition est disponible
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setFeedback('La reconnaissance vocale n\'est pas disponible dans votre navigateur. Utilisez Chrome, Edge ou Safari.')
      return
    }

    try {
      setIsRecording(true)
      setFeedback('🎤 Enregistrement en cours... Parlez maintenant.')
      
      // Créer l'instance de reconnaissance vocale
      const recognition = new SpeechRecognition()
      
      recognition.lang = direction === 'fr_to_en' ? 'en-US' : 'fr-FR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setUserAnswer(transcript)
        setIsRecording(false)
        setFeedback('✅ Réponse enregistrée')
      }

      recognition.onerror = (event: any) => {
        console.error('Erreur reconnaissance:', event.error)
        let errorMessage = 'Erreur lors de la reconnaissance vocale'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'Aucune parole détectée. Réessayez.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone non disponible. Vérifiez vos permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Permission microphone refusée. Autorisez l\'accès au microphone.'
            break
          case 'network':
            errorMessage = 'Erreur réseau. Vérifiez votre connexion.'
            break
        }
        
        setFeedback(errorMessage)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    } catch (error: any) {
      console.error('Erreur:', error)
      setFeedback(`Erreur: ${error.message || 'La reconnaissance vocale n\'est pas disponible'}`)
      setIsRecording(false)
    }
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      setFeedback('Veuillez entrer une réponse')
      return
    }

    setLoading(true)
    setFeedback('')

    try {
      const response = await fetch('/api/practice/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer,
          originalText: question,
          correctAnswer,
          direction,
          mode,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'évaluation')
      }

      const data = await response.json()
      setFeedback(data.feedback)
      setScore(data.score)
    } catch (error) {
      console.error('Erreur:', error)
      setFeedback('Erreur lors de l\'évaluation')
    } finally {
      setLoading(false)
    }
  }

  if (questionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Chargement de la question...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode de réponse
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('written')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === 'written'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Écrit
            </button>
            <button
              onClick={() => setMode('oral')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mode === 'oral'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Oral
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {direction === 'fr_to_en'
              ? 'Phrase à traduire en anglais'
              : 'Phrase à traduire en français'}
          </label>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <p className="text-lg font-medium text-gray-900">{question}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'written' 
              ? 'Votre traduction'
              : 'Réponse vocale'}
          </label>
          {mode === 'written' ? (
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 placeholder-gray-500"
              rows={4}
              placeholder={
                direction === 'fr_to_en'
                  ? 'Écrivez votre traduction en anglais ici...'
                  : 'Écrivez votre traduction en français ici...'
              }
            />
          ) : (
          <div className="mb-4">
            <button
              onClick={handleOralAnswer}
              disabled={isRecording}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                isRecording
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isRecording ? (
                <>
                  <span className="inline-block w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  Enregistrement en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Parler
                </>
              )}
            </button>
            {userAnswer && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Transcription :</p>
                <p className="text-base text-gray-900">{userAnswer}</p>
              </div>
            )}
          </div>
          )}
        </div>

        <button
          onClick={submitAnswer}
          disabled={loading || !userAnswer.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Évaluation en cours...
            </span>
          ) : (
            'Valider ma réponse'
          )}
        </button>
      </div>

      {feedback && (
        <div
          className={`p-6 rounded-lg border-l-4 ${
            score !== null && score >= 8
              ? 'bg-green-50 border-green-500'
              : score !== null && score >= 6
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          }`}
        >
          {score !== null && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-white rounded-md font-semibold text-lg">
                Score : {score.toFixed(1)}/10
              </span>
            </div>
          )}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{feedback}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={loadQuestion}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          Nouvelle question
        </button>
        {score !== null && (
          <span className="text-sm text-gray-500">
            Continuez pour améliorer votre score
          </span>
        )}
      </div>
    </div>
  )
}

