'use client'

import { useState, useEffect, useRef } from 'react'

interface AudioTranslationExerciseProps {
  direction: 'fr_to_en' | 'en_to_fr'
  level: string
}

export default function AudioTranslationExercise({
  direction,
  level,
}: AudioTranslationExerciseProps) {
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [originalText, setOriginalText] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [score, setScore] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showText, setShowText] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadExercise()
  }, [direction, level])

  const loadExercise = async () => {
    setIsLoading(true)
    setFeedback('')
    setScore(null)
    setUserAnswer('')
    
    try {
      const response = await fetch('/api/practice/generate-audio-exercise', {
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
          throw new Error('Erreur serveur. Vérifiez que la clé Google API est configurée.')
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = await response.json()
      
      if (!data.originalText || !data.correctAnswer) {
        throw new Error('Réponse invalide du serveur')
      }
      
      setAudioUrl(data.audioUrl)
      setOriginalText(data.originalText)
      setCorrectAnswer(data.correctAnswer)
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de l\'exercice'
      setFeedback(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      setFeedback('Veuillez entrer une réponse')
      return
    }

    try {
      const response = await fetch('/api/practice/evaluate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer,
          originalText,
          correctAnswer,
          direction,
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
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Chargement de l'exercice...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {direction === 'fr_to_en'
              ? 'Écoutez et traduisez en anglais'
              : 'Écoutez et traduisez en français'}
          </h2>
          <p className="text-gray-600 text-sm">
            {direction === 'fr_to_en'
              ? 'Écoutez attentivement l\'audio et traduisez la phrase en anglais. Vous pouvez réécouter autant de fois que nécessaire.'
              : 'Écoutez attentivement l\'audio et traduisez la phrase en français. Vous pouvez réécouter autant de fois que nécessaire.'}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-4">
          <button
            onClick={isPlaying ? stopAudio : playAudio}
            className="w-16 h-16 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 3.5A.5.5 0 016 4v12a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zm5 0A.5.5 0 0111 4v12a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowText(!showText)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {showText ? 'Masquer le texte' : 'Afficher le texte'}
          </button>
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {showText && originalText && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg italic">{originalText}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre traduction
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={
              direction === 'fr_to_en'
                ? 'Écrivez votre traduction en anglais ici...'
                : 'Écrivez votre traduction en français ici...'
            }
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 placeholder-gray-500"
            rows={4}
          />
        </div>

        <button
          onClick={submitAnswer}
          disabled={!userAnswer.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all"
        >
          Valider ma traduction
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            score !== null && score >= 8
              ? 'bg-green-50 border border-green-200'
              : score !== null && score >= 6
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {score !== null && (
            <div className="mb-2">
              <span className="font-bold text-lg">Score : {score}/10</span>
            </div>
          )}
          <p className="text-gray-700">{feedback}</p>
        </div>
      )}

      <button
        onClick={loadExercise}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Exercice suivant
      </button>
    </div>
  )
}

