'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SocialPhrase {
  id: string
  frenchPhrase: string
  englishPhrase: string
  category: string
  audioUrlFr: string | null
  audioUrlEn: string | null
}

type Phase = 
  | 'idle'
  | 'loading'
  | 'playing_fr'
  | 'pause_2s'
  | 'playing_en_1'
  | 'pause_10s_1'
  | 'playing_en_2'
  | 'pause_10s_2'
  | 'pause_5s'
  | 'playing_nouvelle_phrase'

export default function AudioRepetitionExercise() {
  const [phrase, setPhrase] = useState<SocialPhrase | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [isActive, setIsActive] = useState(false)
  const audioRefFr = useRef<HTMLAudioElement | null>(null)
  const audioRefEn = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      // Nettoyer les timeouts et arrêter les audios à la sortie
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (audioRefFr.current) {
        audioRefFr.current.pause()
      }
      if (audioRefEn.current) {
        audioRefEn.current.pause()
      }
    }
  }, [])

  const loadPhrase = async () => {
    try {
      setPhase('loading')
      const response = await fetch('/api/phrases/random', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Erreur lors du chargement')
      }

      const data: SocialPhrase = await response.json()
      setPhrase(data)
      setPhase('idle')
    } catch (error) {
      console.error('Erreur:', error)
      setPhase('idle')
    }
  }

  const generateAudios = async () => {
    if (!phrase) return

    try {
      const response = await fetch('/api/phrases/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phraseId: phrase.id,
          frenchPhrase: phrase.frenchPhrase,
          englishPhrase: phrase.englishPhrase
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPhrase({
          ...phrase,
          audioUrlFr: data.audioUrlFr || phrase.audioUrlFr,
          audioUrlEn: data.audioUrlEn || phrase.audioUrlEn
        })
      }
    } catch (error) {
      console.error('Erreur génération audio:', error)
    }
  }

  const playAudio = (url: string, language: 'fr' | 'en'): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url)
      
      if (language === 'fr') {
        audioRefFr.current = audio
      } else {
        audioRefEn.current = audio
      }

      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error('Erreur lecture audio'))
      audio.play()
    })
  }

  const playNouvellePhrase = (): Promise<void> => {
    return new Promise((resolve) => {
      // Générer l'audio "nouvelle phrase" avec Web Speech API
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('nouvelle phrase')
        utterance.lang = 'fr-FR'
        utterance.rate = 0.8
        utterance.onend = () => resolve()
        window.speechSynthesis.speak(utterance)
      } else {
        // Fallback : attendre 1 seconde
        setTimeout(() => resolve(), 1000)
      }
    })
  }

  const startCycle = async () => {
    if (!phrase) return

    setIsActive(true)

    // Générer les audios si nécessaire
    let currentPhrase = phrase
    if (!currentPhrase.audioUrlFr || !currentPhrase.audioUrlEn) {
      await generateAudios()
      // Recharger la phrase pour avoir les URLs
      const response = await fetch('/api/phrases/random', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data: SocialPhrase = await response.json()
        currentPhrase = data
        setPhrase(data)
      }
    }

    if (!currentPhrase) return

    try {
      // 1. Lecture audio français
      setPhase('playing_fr')
      if (currentPhrase.audioUrlFr) {
        await playAudio(currentPhrase.audioUrlFr, 'fr')
      }

      // 2. Pause 2 secondes
      setPhase('pause_2s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 2000)
      })

      // 3. Lecture audio anglais (première fois)
      setPhase('playing_en_1')
      if (currentPhrase.audioUrlEn) {
        await playAudio(currentPhrase.audioUrlEn, 'en')
      }

      // 4. Pause 10 secondes (utilisateur répète)
      setPhase('pause_10s_1')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 10000)
      })

      // 5. Lecture audio anglais (deuxième fois)
      setPhase('playing_en_2')
      if (currentPhrase.audioUrlEn) {
        await playAudio(currentPhrase.audioUrlEn, 'en')
      }

      // 6. Pause 10 secondes (utilisateur répète)
      setPhase('pause_10s_2')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 10000)
      })

      // 7. Pause 5 secondes
      setPhase('pause_5s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 5000)
      })

      // 8. Audio "nouvelle phrase"
      setPhase('playing_nouvelle_phrase')
      await playNouvellePhrase()

      // 9. Charger une nouvelle phrase et recommencer
      if (isActive) {
        await loadPhrase()
        // Attendre un peu avant de recommencer
        await new Promise(resolve => setTimeout(resolve, 500))
        // Vérifier à nouveau si toujours actif et si phrase chargée
        if (isActive) {
          // Utiliser setTimeout pour permettre à React de mettre à jour l'état
          setTimeout(() => {
            if (isActive && phrase) {
              startCycle()
            }
          }, 100)
        }
      }
    } catch (error) {
      console.error('Erreur dans le cycle:', error)
      setPhase('idle')
      setIsActive(false)
    }
  }

  const stopCycle = () => {
    setIsActive(false)
    setPhase('idle')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (audioRefFr.current) {
      audioRefFr.current.pause()
      audioRefFr.current = null
    }
    if (audioRefEn.current) {
      audioRefEn.current.pause()
      audioRefEn.current = null
    }
  }

  useEffect(() => {
    loadPhrase()
  }, [])

  const getPhaseText = (): string => {
    switch (phase) {
      case 'loading':
        return 'Chargement de la phrase...'
      case 'playing_fr':
        return '🎧 Écoutez la phrase en français'
      case 'pause_2s':
        return '⏸️ Pause...'
      case 'playing_en_1':
        return '🎧 Écoutez la phrase en anglais'
      case 'pause_10s_1':
        return '🎤 Répétez la phrase en anglais (10 secondes)'
      case 'playing_en_2':
        return '🎧 Écoutez à nouveau la phrase en anglais'
      case 'pause_10s_2':
        return '🎤 Répétez à nouveau la phrase en anglais (10 secondes)'
      case 'pause_5s':
        return '⏸️ Pause...'
      case 'playing_nouvelle_phrase':
        return '🔄 Nouvelle phrase...'
      default:
        return 'Prêt à commencer'
    }
  }

  if (!phrase && phase !== 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-600">Erreur lors du chargement de la phrase</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Répétition Audio
        </h2>
        <p className="text-gray-600 mb-6">
          Écoutez la phrase en français, puis répétez-la en anglais après chaque écoute.
        </p>

        {phrase && (
          <div className="mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {phrase.frenchPhrase}
              </p>
              <p className="text-lg text-gray-700 italic">
                {phrase.englishPhrase}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-center text-lg font-medium text-gray-700">
                {getPhaseText()}
              </p>
            </div>

            {(phase === 'pause_10s_1' || phase === 'pause_10s_2') && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          {!isActive ? (
            <button
              onClick={startCycle}
              disabled={!phrase || phase === 'loading'}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all"
            >
              {phase === 'loading' ? 'Chargement...' : 'Commencer'}
            </button>
          ) : (
            <button
              onClick={stopCycle}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Arrêter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

