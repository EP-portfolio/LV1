'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import SwipeReveal from './SwipeReveal'

interface ImageTranslationExerciseProps {
  direction: 'fr_to_en' | 'en_to_fr'
  level: string // 'débutant', 'intermédiaire', 'avancé'
}

interface VocabularyWord {
  id: string
  frenchWord: string
  englishWord: string
  imageUrl: string
  audioUrl: string | null
  category: string | null
}

export default function ImageTranslationExercise({
  direction,
  level,
}: ImageTranslationExerciseProps) {
  const [word, setWord] = useState<VocabularyWord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Déterminer les fonctionnalités selon le niveau
  const levelConfig = {
    'débutant': { swipeEnabled: true, audioEnabled: true, levelNumber: 1 },
    'intermédiaire': { swipeEnabled: true, audioEnabled: false, levelNumber: 2 },
    'avancé': { swipeEnabled: false, audioEnabled: false, levelNumber: 3 },
  }

  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig['intermédiaire']

  useEffect(() => {
    loadWord()
  }, [direction, level])

  const loadWord = async () => {
    setIsLoading(true)
    setFeedback('')
    setUserAnswer('')
    setIsCorrect(null)
    setScore(null)
    
    try {
      const response = await fetch('/api/vocabulary/random', {
        credentials: 'include', // Inclure les cookies de session pour l'authentification
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        const errorMessage = errorData.error || `Erreur ${response.status}`
        
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour accéder aux exercices. Redirection vers la page de connexion...')
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setWord(data)
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement du mot'
      setFeedback(errorMessage)
      
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      if (errorMessage.includes('connecté') || errorMessage.includes('401')) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = async () => {
    if (!word || !config.audioEnabled) return

    try {
      setIsPlaying(true)

      // Si l'audio existe déjà, l'utiliser
      if (word.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        const audio = new Audio(word.audioUrl)
        audioRef.current = audio
        audio.play()
        
        audio.onended = () => {
          setIsPlaying(false)
          audioRef.current = null
        }

        audio.onerror = () => {
          setIsPlaying(false)
          setFeedback('Erreur lors de la lecture de l\'audio')
          audioRef.current = null
        }
      } else {
        // Générer l'audio à la volée avec Web Speech API (fallback)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(word.englishWord)
          utterance.lang = 'en-US'
          utterance.rate = 0.8
          utterance.pitch = 1
          utterance.volume = 1

          utterance.onend = () => {
            setIsPlaying(false)
          }

          utterance.onerror = () => {
            setIsPlaying(false)
            setFeedback('Erreur lors de la lecture de l\'audio')
          }

          window.speechSynthesis.speak(utterance)
        } else {
          setIsPlaying(false)
          setFeedback('La synthèse vocale n\'est pas disponible dans votre navigateur')
        }
      }
    } catch (error) {
      setIsPlaying(false)
      setFeedback('Erreur lors de la lecture de l\'audio')
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
      setFeedback('🎤 Enregistrement en cours... Dites le mot en anglais.')
      
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US' // Toujours en anglais pour cet exercice
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase()
        setUserAnswer(transcript)
        validateAnswer(transcript)
        setIsRecording(false)
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

  const validateAnswer = async (answer: string) => {
    if (!word) return

    try {
      setFeedback('Évaluation en cours...')
      
      const response = await fetch('/api/practice/evaluate-vocabulary', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: answer,
          correctAnswer: word.englishWord,
          vocabularyWordId: word.id,
          level: level,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || `Erreur ${response.status}`)
      }

      const data = await response.json()
      setIsCorrect(data.isCorrect)
      setScore(data.score)
      setFeedback(data.feedback)
    } catch (error) {
      console.error('Erreur évaluation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'évaluation'
      setFeedback(`Erreur: ${errorMessage}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Chargement du mot...</div>
      </div>
    )
  }

  if (!word) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-600">
          {feedback || 'Erreur lors du chargement du mot'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        {/* En-tête avec niveau */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Vocabulaire - Niveau {config.levelNumber}
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {level}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            {config.levelNumber === 1 && 'Glissez sur le mot français pour voir la traduction. Audio disponible.'}
            {config.levelNumber === 2 && 'Glissez sur le mot français pour voir la traduction.'}
            {config.levelNumber === 3 && 'Aucune aide disponible. Dites le mot en anglais.'}
          </p>
        </div>

        {/* Image */}
        {word.imageUrl && (
          <div className="mb-6 relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={word.imageUrl}
              alt={word.englishWord}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        {/* Mot français avec swipe reveal */}
        <div className="mb-6">
          <SwipeReveal
            frenchWord={word.frenchWord}
            englishWord={word.englishWord}
            enabled={config.swipeEnabled}
          />
        </div>

        {/* Bouton audio (niveau 1 uniquement) */}
        {config.audioEnabled && (
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className="mb-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {isPlaying ? 'Lecture en cours...' : 'Écouter la prononciation'}
          </button>
        )}

        {/* Bouton réponse orale */}
        <button
          onClick={handleOralAnswer}
          disabled={isRecording}
          className="w-full mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isRecording ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enregistrement...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Dire le mot en anglais
            </>
          )}
        </button>

        {/* Affichage de la réponse de l'utilisateur */}
        {userAnswer && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Votre réponse :</p>
            <p className="text-lg font-semibold text-gray-900">{userAnswer}</p>
          </div>
        )}

        {/* Feedback avec score */}
        {feedback && (
          <div
            className={`p-4 rounded-lg mb-4 ${
              isCorrect === true
                ? 'bg-green-50 border border-green-200'
                : isCorrect === false
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            {score !== null && (
              <div className="mb-2">
                <span className={`text-2xl font-bold ${
                  isCorrect === true ? 'text-green-700' : 'text-red-700'
                }`}>
                  Score : {score}/10
                </span>
              </div>
            )}
            <p className="text-gray-700">{feedback}</p>
          </div>
        )}
      </div>

      {/* Bouton mot suivant */}
      <button
        onClick={loadWord}
        className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium shadow-md hover:shadow-lg transition-all"
      >
        Mot suivant
      </button>
    </div>
  )
}
