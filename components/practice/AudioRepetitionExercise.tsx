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
  const [error, setError] = useState<string | null>(null)
  const [nouvellePhraseUrl, setNouvellePhraseUrl] = useState<string | null>(null)
  const audioRefFr = useRef<HTMLAudioElement | null>(null)
  const audioRefEn = useRef<HTMLAudioElement | null>(null)
  const audioRefNouvellePhrase = useRef<HTMLAudioElement | null>(null)
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
      if (audioRefNouvellePhrase.current) {
        audioRefNouvellePhrase.current.pause()
      }
    }
  }, [])

  const loadPhrase = async (): Promise<SocialPhrase | null> => {
    try {
      setPhase('loading')
      const response = await fetch('/api/phrases/random', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return null
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        const errorMessage = errorData.error || `Erreur ${response.status}`
        
        if (response.status === 404 && errorMessage.includes('Aucune phrase')) {
          throw new Error('Aucune phrase disponible. Veuillez exécuter: npm run import-phrases')
        }
        
        throw new Error(errorMessage)
      }

      const data: SocialPhrase = await response.json()
      setPhrase(data)
      setError(null)
      setPhase('idle')
      return data
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      setError(errorMessage)
      setPhase('idle')
      return null
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
      if (!url) {
        reject(new Error('URL audio manquante'))
        return
      }

      const audio = new Audio(url)
      
      // Précharger le fichier
      audio.preload = 'auto'
      
      if (language === 'fr') {
        audioRefFr.current = audio
      } else {
        audioRefEn.current = audio
      }

      let hasResolved = false
      let hasRejected = false

      // Gestion de la fin de lecture
      audio.onended = () => {
        if (!hasResolved) {
          hasResolved = true
          console.log(`✅ Audio ${language} terminé`)
          resolve()
        }
      }
      
      // Gestion des erreurs
      audio.onerror = (error) => {
        if (!hasRejected && !hasResolved) {
          hasRejected = true
          console.error(`❌ Erreur lecture audio ${language}:`, error, url)
          reject(new Error(`Impossible de lire le fichier audio ${language}. Vérifiez que le fichier est accessible.`))
        }
      }
      
      // Fonction pour démarrer la lecture
      const startPlayback = async () => {
        if (hasResolved || hasRejected) return
        
        try {
          console.log(`▶️ Démarrage lecture audio ${language}...`)
          await audio.play()
          console.log(`✅ Lecture audio ${language} démarrée`)
        } catch (error: any) {
          if (!hasRejected && !hasResolved) {
            hasRejected = true
            console.error(`❌ Erreur démarrage lecture ${language}:`, error)
            reject(new Error(`Impossible de démarrer la lecture audio ${language}. ${error.message || 'Assurez-vous d\'avoir cliqué sur "Commencer".'}`))
          }
        }
      }

      // Si le fichier est déjà suffisamment chargé, jouer immédiatement
      if (audio.readyState >= 2) {
        startPlayback()
      } else {
        // Attendre que le fichier soit chargé
        audio.oncanplay = () => {
          if (!hasResolved && !hasRejected) {
            startPlayback()
          }
        }
        
        audio.oncanplaythrough = () => {
          if (!hasResolved && !hasRejected && audio.paused) {
            startPlayback()
          }
        }
        
        // Timeout de sécurité (5 secondes)
        setTimeout(() => {
          if (!hasResolved && !hasRejected) {
            if (audio.readyState >= 2) {
              startPlayback()
            } else {
              hasRejected = true
              reject(new Error(`Timeout: Le fichier audio ${language} n'a pas pu être chargé à temps.`))
            }
          }
        }, 5000)
      }
    })
  }

  const playNouvellePhrase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Utiliser le fichier audio pré-généré si disponible
      if (nouvellePhraseUrl) {
        const audio = new Audio(nouvellePhraseUrl)
        audioRefNouvellePhrase.current = audio
        audio.preload = 'auto'
        
        let hasResolved = false
        
        audio.onended = () => {
          if (!hasResolved) {
            hasResolved = true
            resolve()
          }
        }
        
        audio.onerror = () => {
          if (!hasResolved) {
            // Fallback sur Web Speech API si erreur
            playNouvellePhraseFallback(resolve)
          }
        }
        
        // Attendre que le fichier soit prêt
        const tryPlay = () => {
          if (hasResolved) return
          
          audio.play().catch(() => {
            // Fallback sur Web Speech API si erreur de lecture
            if (!hasResolved) {
              playNouvellePhraseFallback(resolve)
            }
          })
        }
        
        if (audio.readyState >= 3) {
          tryPlay()
        } else {
          audio.oncanplaythrough = () => {
            tryPlay()
          }
          // Timeout de sécurité
          setTimeout(() => {
            if (!hasResolved && audio.readyState >= 2) {
              tryPlay()
            }
          }, 5000)
        }
      } else {
        // Fallback sur Web Speech API si URL non disponible
        playNouvellePhraseFallback(resolve)
      }
    })
  }

  const playNouvellePhraseFallback = (resolve: () => void) => {
    // Générer l'audio "nouvelle phrase" avec Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('nouvelle phrase')
      utterance.lang = 'fr-FR'
      utterance.rate = 0.8
      utterance.onend = () => resolve()
      window.speechSynthesis.speak(utterance)
    } else {
      // Fallback final : attendre 1 seconde
      setTimeout(() => resolve(), 1000)
    }
  }

  const startCycle = async (phraseToUse?: SocialPhrase | null) => {
    // Utiliser la phrase passée en paramètre ou celle de l'état
    const phraseToProcess = phraseToUse || phrase
    if (!phraseToProcess) return

    setIsActive(true)

    // Vérifier que les fichiers audio sont disponibles (pré-générés)
    let currentPhrase = phraseToProcess
    if (!currentPhrase.audioUrlFr || !currentPhrase.audioUrlEn) {
      // Si les fichiers ne sont pas présents, essayer de les générer (fallback)
      console.warn('⚠️ Fichiers audio manquants, tentative de génération...')
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

    // Vérifier à nouveau après tentative de génération
    if (!currentPhrase || !currentPhrase.audioUrlFr || !currentPhrase.audioUrlEn) {
      setError('Les fichiers audio ne sont pas disponibles. Veuillez exécuter: npm run generate-audios')
      setIsActive(false)
      setPhase('idle')
      return
    }

    try {
      // 1. Lecture audio français
      setPhase('playing_fr')
      console.log('🎵 Début cycle - Lecture audio FR')
      await playAudio(currentPhrase.audioUrlFr, 'fr')
      console.log('✅ Audio FR terminé, passage à pause 2s')

      // 2. Pause 2 secondes
      setPhase('pause_2s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 2000)
      })

      // 3. Lecture audio anglais (première fois)
      setPhase('playing_en_1')
      await playAudio(currentPhrase.audioUrlEn, 'en')

      // 4. Pause 5 secondes (utilisateur répète après première lecture)
      setPhase('pause_10s_1')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 5000)
      })

      // 5. Lecture audio anglais (deuxième fois)
      setPhase('playing_en_2')
      console.log('🎵 Lecture audio EN (2ème fois)')
      await playAudio(currentPhrase.audioUrlEn, 'en')
      console.log('✅ Audio EN (2ème) terminé')

      // 6. Pause 10 secondes (utilisateur répète après deuxième lecture)
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

      // 8b. Pause 2 secondes après "nouvelle phrase"
      setPhase('pause_2s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 2000)
      })

      // 9. Charger une nouvelle phrase et recommencer
      if (isActive) {
        const newPhrase = await loadPhrase()
        
        // Vérifier à nouveau si toujours actif et si nouvelle phrase chargée
        if (isActive && newPhrase && newPhrase.audioUrlFr && newPhrase.audioUrlEn) {
          // Attendre un peu pour permettre la mise à jour de l'état React
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Relancer le cycle avec la nouvelle phrase directement
          if (isActive) {
            startCycle(newPhrase)
          }
        } else if (isActive && newPhrase) {
          // Phrase chargée mais fichiers audio manquants
          setError('Les fichiers audio ne sont pas disponibles pour cette phrase.')
          setIsActive(false)
          setPhase('idle')
        }
      }
    } catch (error) {
      console.error('Erreur dans le cycle:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la lecture audio')
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
    if (audioRefNouvellePhrase.current) {
      audioRefNouvellePhrase.current.pause()
      audioRefNouvellePhrase.current = null
    }
  }

  useEffect(() => {
    loadPhrase()
    // Charger l'URL de "nouvelle phrase"
    fetch('/api/audio/nouvelle-phrase')
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setNouvellePhraseUrl(data.url)
        }
      })
      .catch(err => console.error('Erreur chargement audio nouvelle phrase:', err))
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
        return '🎤 Répétez la phrase en anglais (5 secondes)'
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
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl">
          <h3 className="text-xl font-bold text-red-800 mb-2">Erreur lors du chargement</h3>
          <p className="text-red-700 mb-4">
            {error || 'Erreur lors du chargement de la phrase'}
          </p>
          {error?.includes('Aucune phrase disponible') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Solution :</strong> Exécutez la commande suivante dans votre terminal :
              </p>
              <code className="block mt-2 p-2 bg-yellow-100 rounded text-sm">
                npm run import-phrases
              </code>
            </div>
          )}
          <button
            onClick={loadPhrase}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
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

