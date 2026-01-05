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

interface PreloadedAudio {
  element: HTMLAudioElement
  url: string
  ready: boolean
}

interface PreloadedPhrase extends SocialPhrase {
  audioFr: PreloadedAudio | null
  audioEn: PreloadedAudio | null
}

export default function AudioRepetitionExercise() {
  const [phrase, setPhrase] = useState<SocialPhrase | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nouvellePhraseUrl, setNouvellePhraseUrl] = useState<string | null>(null)
  const [nextPhrase, setNextPhrase] = useState<PreloadedPhrase | null>(null) // Phrase suivante préchargée
  const audioRefFr = useRef<HTMLAudioElement | null>(null)
  const audioRefEn = useRef<HTMLAudioElement | null>(null)
  const audioRefNouvellePhrase = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const preloadedNouvellePhrase = useRef<PreloadedAudio | null>(null)
  const isActiveRef = useRef<boolean>(false) // Ref pour suivre l'état actif sans problèmes de closure
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

  // Précharger un audio
  const preloadAudio = (url: string): Promise<PreloadedAudio> => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('URL audio manquante'))
        return
      }

      const audio = new Audio(url)
      audio.preload = 'auto'
      
      audio.oncanplaythrough = () => {
        resolve({
          element: audio,
          url,
          ready: true
        })
      }
      
      audio.onerror = (error) => {
        console.error('Erreur préchargement audio:', error, url)
        reject(new Error(`Impossible de précharger l'audio: ${url}`))
      }
      
      // Timeout de sécurité
      setTimeout(() => {
        if (audio.readyState >= 2) {
          resolve({
            element: audio,
            url,
            ready: true
          })
        } else {
          reject(new Error(`Timeout préchargement: ${url}`))
        }
      }, 10000)
    })
  }

  // Précharger toutes les phrases et leurs audios
  const preloadSession = async (): Promise<void> => {
    setIsPreloading(true)
    setPreloadProgress(0)
    
    try {
      console.log('🔄 Début préchargement session (5 phrases)...')
      
      // 1. Charger 5 phrases
      const phrases: SocialPhrase[] = []
      for (let i = 0; i < 5; i++) {
        const response = await fetch('/api/phrases/random', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (response.ok) {
          const data: SocialPhrase = await response.json()
          if (data.audioUrlFr && data.audioUrlEn) {
            phrases.push(data)
          }
        }
        setPreloadProgress(Math.round((i + 1) / 5 * 30)) // 0-30%
      }
      
      if (phrases.length === 0) {
        throw new Error('Aucune phrase avec audio disponible')
      }
      
      console.log(`✅ ${phrases.length} phrases chargées, préchargement audios...`)
      
      // 2. Précharger tous les audios
      const preloaded: PreloadedPhrase[] = []
      const totalAudios = phrases.length * 2 + 1 // FR + EN pour chaque phrase + nouvelle phrase
      let loadedCount = 0
      
      // Précharger "nouvelle phrase" en premier (si URL disponible)
      // Note: nouvellePhraseUrl peut ne pas être chargé encore, on essaie quand même
      let nouvelleUrl = nouvellePhraseUrl
      if (!nouvelleUrl) {
        // Essayer de charger l'URL si pas encore disponible
        try {
          const response = await fetch('/api/audio/nouvelle-phrase')
          if (response.ok) {
            const data = await response.json()
            nouvelleUrl = data.url
            setNouvellePhraseUrl(nouvelleUrl)
          }
        } catch (err) {
          console.warn('⚠️ Impossible de charger URL "nouvelle phrase"')
        }
      }
      
      if (nouvelleUrl) {
        try {
          const nouvelleAudio = await preloadAudio(nouvelleUrl)
          preloadedNouvellePhrase.current = nouvelleAudio
          loadedCount++
          setPreloadProgress(30 + Math.round(loadedCount / totalAudios * 70))
          console.log('✅ Audio "nouvelle phrase" préchargé')
        } catch (error) {
          console.warn('⚠️ Erreur préchargement "nouvelle phrase", fallback sera utilisé')
        }
      }
      
      // Précharger les audios de chaque phrase
      for (let i = 0; i < phrases.length; i++) {
        const phrase = phrases[i]
        const preloadedPhrase: PreloadedPhrase = {
          ...phrase,
          audioFr: null,
          audioEn: null
        }
        
        // Précharger audio FR
        if (phrase.audioUrlFr) {
          try {
            const audioFr = await preloadAudio(phrase.audioUrlFr)
            preloadedPhrase.audioFr = audioFr
            loadedCount++
            setPreloadProgress(30 + Math.round(loadedCount / totalAudios * 70))
          } catch (error) {
            console.warn(`⚠️ Erreur préchargement FR pour phrase ${i + 1}`)
          }
        }
        
        // Précharger audio EN
        if (phrase.audioUrlEn) {
          try {
            const audioEn = await preloadAudio(phrase.audioUrlEn)
            preloadedPhrase.audioEn = audioEn
            loadedCount++
            setPreloadProgress(30 + Math.round(loadedCount / totalAudios * 70))
          } catch (error) {
            console.warn(`⚠️ Erreur préchargement EN pour phrase ${i + 1}`)
          }
        }
        
        preloaded.push(preloadedPhrase)
      }
      
      setPreloadedPhrases(preloaded)
      setPreloadProgress(100)
      console.log(`✅ Préchargement terminé: ${preloaded.length} phrases, ${loadedCount} audios`)
      
      // Initialiser la première phrase pour l'affichage
      if (preloaded.length > 0) {
        const firstPhrase = preloaded[0]
        setPhrase({
          id: firstPhrase.id,
          frenchPhrase: firstPhrase.frenchPhrase,
          englishPhrase: firstPhrase.englishPhrase,
          category: firstPhrase.category,
          audioUrlFr: firstPhrase.audioUrlFr,
          audioUrlEn: firstPhrase.audioUrlEn
        })
        setCurrentPhraseIndex(0)
      }
      
    } catch (error) {
      console.error('❌ Erreur préchargement:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors du préchargement')
    } finally {
      setIsPreloading(false)
    }
  }

  // Jouer un audio préchargé
  const playPreloadedAudio = (preloadedAudio: PreloadedAudio | null): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!preloadedAudio || !preloadedAudio.ready) {
        reject(new Error('Audio non préchargé'))
        return
      }

      const audio = preloadedAudio.element
      
      // Réinitialiser la position si nécessaire
      if (audio.currentTime > 0) {
        audio.currentTime = 0
      }
      
      let hasResolved = false
      
      audio.onended = () => {
        if (!hasResolved) {
          hasResolved = true
          resolve()
        }
      }
      
      audio.onerror = () => {
        if (!hasResolved) {
          hasResolved = true
          reject(new Error('Erreur lecture audio préchargé'))
        }
      }
      
      audio.play().catch((error) => {
        if (!hasResolved) {
          hasResolved = true
          reject(error)
        }
      })
    })
  }

  // Ancienne fonction playAudio (fallback si pas de préchargement)
  const playAudio = (url: string, language: 'fr' | 'en'): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('URL audio manquante'))
        return
      }

      const audio = new Audio(url)
      audio.preload = 'auto'
      
      if (language === 'fr') {
        audioRefFr.current = audio
      } else {
        audioRefEn.current = audio
      }

      let hasResolved = false
      let hasRejected = false

      audio.onended = () => {
        if (!hasResolved) {
          hasResolved = true
          console.log(`✅ Audio ${language} terminé`)
          resolve()
        }
      }
      
      audio.onerror = (error) => {
        if (!hasRejected && !hasResolved) {
          hasRejected = true
          console.error(`❌ Erreur lecture audio ${language}:`, error, url)
          reject(new Error(`Impossible de lire le fichier audio ${language}. Vérifiez que le fichier est accessible.`))
        }
      }
      
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

      if (audio.readyState >= 2) {
        startPlayback()
      } else {
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
    return new Promise((resolve) => {
      // Utiliser l'audio préchargé si disponible
      if (preloadedNouvellePhrase.current && preloadedNouvellePhrase.current.ready) {
        console.log('🔄 Lecture "nouvelle phrase" (préchargé)')
        const audio = preloadedNouvellePhrase.current.element
        audioRefNouvellePhrase.current = audio
        
        // Réinitialiser la position
        if (audio.currentTime > 0) {
          audio.currentTime = 0
        }
        
        let hasResolved = false
        
        audio.onended = () => {
          if (!hasResolved) {
            hasResolved = true
            console.log('✅ "Nouvelle phrase" terminée')
            resolve()
          }
        }
        
        audio.onerror = () => {
          if (!hasResolved) {
            console.warn('⚠️ Erreur lecture "nouvelle phrase" préchargé, fallback')
            playNouvellePhraseFallback(resolve)
          }
        }
        
        audio.play().catch(() => {
          if (!hasResolved) {
            playNouvellePhraseFallback(resolve)
          }
        })
      } else if (nouvellePhraseUrl) {
        // Fallback : charger à la volée si pas préchargé
        console.log('🔄 Lecture "nouvelle phrase" (chargement à la volée)')
        const audio = new Audio(nouvellePhraseUrl)
        audioRefNouvellePhrase.current = audio
        audio.preload = 'auto'
        
        let hasResolved = false
        
        audio.onended = () => {
          if (!hasResolved) {
            hasResolved = true
            console.log('✅ "Nouvelle phrase" terminée')
            resolve()
          }
        }
        
        audio.onerror = () => {
          if (!hasResolved) {
            playNouvellePhraseFallback(resolve)
          }
        }
        
        const tryPlay = () => {
          if (hasResolved) return
          audio.play().catch(() => {
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
          setTimeout(() => {
            if (!hasResolved && audio.readyState >= 2) {
              tryPlay()
            } else if (!hasResolved) {
              playNouvellePhraseFallback(resolve)
            }
          }, 5000)
        }
      } else {
        // Fallback final : Web Speech API
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

  // Charger et précharger la phrase suivante
  const loadAndPreloadNextPhrase = async (): Promise<PreloadedPhrase | null> => {
    try {
      console.log('🔄 Chargement nouvelle phrase...')
      const response = await fetch('/api/phrases/random', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        console.error('❌ Erreur chargement phrase:', response.status)
        return null
      }

      const data: SocialPhrase = await response.json()
      
      if (!data.audioUrlFr || !data.audioUrlEn) {
        console.error('❌ Phrase sans audios')
        return null
      }

      console.log('✅ Phrase chargée, préchargement audios...')
      
      // Précharger les audios
      const preloadedPhrase: PreloadedPhrase = {
        ...data,
        audioFr: null,
        audioEn: null
      }

      // Précharger audio FR
      if (data.audioUrlFr) {
        try {
          const audioFr = await preloadAudio(data.audioUrlFr)
          preloadedPhrase.audioFr = audioFr
          console.log('✅ Audio FR préchargé')
        } catch (error) {
          console.warn('⚠️ Erreur préchargement FR')
        }
      }

      // Précharger audio EN
      if (data.audioUrlEn) {
        try {
          const audioEn = await preloadAudio(data.audioUrlEn)
          preloadedPhrase.audioEn = audioEn
          console.log('✅ Audio EN préchargé')
        } catch (error) {
          console.warn('⚠️ Erreur préchargement EN')
        }
      }

      if (preloadedPhrase.audioFr && preloadedPhrase.audioEn) {
        console.log('✅ Phrase suivante prête')
        return preloadedPhrase
      } else {
        console.error('❌ Audios non préchargés')
        return null
      }
    } catch (error) {
      console.error('❌ Erreur chargement phrase suivante:', error)
      return null
    }
  }

  // Cycle avec chargement dynamique
  const startCycle = async (phraseToUse?: PreloadedPhrase | SocialPhrase | null) => {
    // Utiliser la phrase préchargée si disponible, sinon charger
    let currentPhrase: PreloadedPhrase | null = null

    if (phraseToUse && 'audioFr' in phraseToUse && 'audioEn' in phraseToUse) {
      // Phrase déjà préchargée
      currentPhrase = phraseToUse as PreloadedPhrase
    } else if (phraseToUse) {
      // Phrase chargée mais pas préchargée, précharger maintenant
      const socialPhrase = phraseToUse as SocialPhrase
      if (socialPhrase.audioUrlFr && socialPhrase.audioUrlEn) {
        const preloadedPhrase: PreloadedPhrase = {
          ...socialPhrase,
          audioFr: null,
          audioEn: null
        }
        
        try {
          preloadedPhrase.audioFr = await preloadAudio(socialPhrase.audioUrlFr)
          preloadedPhrase.audioEn = await preloadAudio(socialPhrase.audioUrlEn)
          currentPhrase = preloadedPhrase
        } catch (error) {
          console.error('❌ Erreur préchargement phrase initiale')
          setError('Erreur lors du préchargement de la phrase')
          return
        }
      }
    } else {
      // Charger une nouvelle phrase
      currentPhrase = await loadAndPreloadNextPhrase()
    }

    if (!currentPhrase || !currentPhrase.audioFr || !currentPhrase.audioEn) {
      setError('Impossible de charger ou précharger la phrase')
      return
    }

    setIsActive(true)
    isActiveRef.current = true

    // Mettre à jour l'affichage
    setPhrase({
      id: currentPhrase.id,
      frenchPhrase: currentPhrase.frenchPhrase,
      englishPhrase: currentPhrase.englishPhrase,
      category: currentPhrase.category,
      audioUrlFr: currentPhrase.audioUrlFr,
      audioUrlEn: currentPhrase.audioUrlEn
    })

    try {
      // 1. Lecture audio français
      setPhase('playing_fr')
      console.log('🎵 Début cycle - Lecture audio FR')
      await playPreloadedAudio(currentPhrase.audioFr)
      console.log('✅ Audio FR terminé, passage à pause 2s')

      // 2. Pause 2 secondes
      setPhase('pause_2s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 2000)
      })

      // 3. Lecture audio anglais (première fois)
      setPhase('playing_en_1')
      console.log('🎵 Lecture audio EN (1ère fois)')
      await playPreloadedAudio(currentPhrase.audioEn)
      console.log('✅ Audio EN (1ère) terminé')

      // 4. Pause 5 secondes
      setPhase('pause_10s_1')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 5000)
      })

      // 5. Lecture audio anglais (deuxième fois)
      setPhase('playing_en_2')
      console.log('🎵 Lecture audio EN (2ème fois)')
      await playPreloadedAudio(currentPhrase.audioEn)
      console.log('✅ Audio EN (2ème) terminé')

      // 6. Pause 10 secondes - Charger la phrase suivante pendant cette pause
      console.log('⏸️ Début pause 10s (2ème répétition) - Chargement phrase suivante...')
      setPhase('pause_10s_2')
      
      // Charger la phrase suivante en parallèle de la pause
      const nextPhrasePromise = loadAndPreloadNextPhrase()
      
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 10s terminée')
          resolve(undefined)
        }, 10000)
      })

      // 7. Pause 5 secondes - La phrase suivante continue de se charger
      console.log('⏸️ Début pause 5s')
      setPhase('pause_5s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 5s terminée')
          resolve(undefined)
        }, 5000)
      })

      // 8. Audio "nouvelle phrase"
      console.log('🔄 Début lecture "nouvelle phrase"')
      setPhase('playing_nouvelle_phrase')
      await playNouvellePhrase()
      console.log('✅ "Nouvelle phrase" terminée')

      // 8b. Pause 2 secondes après "nouvelle phrase" - Attendre que la phrase suivante soit prête
      console.log('⏸️ Pause 2s après "nouvelle phrase" - Attente phrase suivante...')
      setPhase('pause_2s')
      
      // Attendre que la phrase suivante soit chargée
      const nextPhrase = await nextPhrasePromise
      
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 2s terminée')
          resolve(undefined)
        }, 2000)
      })

      // 9. Utiliser la phrase suivante et relancer le cycle
      if (isActiveRef.current && nextPhrase && nextPhrase.audioFr && nextPhrase.audioEn) {
        console.log('🔄 Relance cycle avec phrase suivante')
        setNextPhrase(null) // Réinitialiser pour le prochain cycle
        setTimeout(() => {
          if (isActiveRef.current) {
            startCycle(nextPhrase)
          }
        }, 100)
      } else {
        console.error('❌ Phrase suivante non disponible ou cycle arrêté')
        setError('Erreur: phrase suivante non disponible')
        setIsActive(false)
        isActiveRef.current = false
        setPhase('idle')
      }
    } catch (error) {
      console.error('Erreur dans le cycle:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la lecture audio')
      setIsActive(false)
      isActiveRef.current = false
      setPhase('idle')
    }
  }

  const startCycleOld = async (phraseToUse?: SocialPhrase | null) => {
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
      isActiveRef.current = false
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
      console.log('⏸️ Début pause 10s (2ème répétition)')
      setPhase('pause_10s_2')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 10s terminée')
          resolve(undefined)
        }, 10000)
      })

      // 7. Pause 5 secondes
      console.log('⏸️ Début pause 5s')
      setPhase('pause_5s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 5s terminée')
          resolve(undefined)
        }, 5000)
      })

      // 8. Audio "nouvelle phrase"
      console.log('🔄 Début lecture "nouvelle phrase"')
      setPhase('playing_nouvelle_phrase')
      await playNouvellePhrase()
      console.log('✅ "Nouvelle phrase" terminée')

      // 8b. Pause 2 secondes après "nouvelle phrase"
      console.log('⏸️ Pause 2s après "nouvelle phrase"')
      setPhase('pause_2s')
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(() => {
          console.log('✅ Pause 2s terminée, chargement nouvelle phrase...')
          resolve(undefined)
        }, 2000)
      })

      // 9. Charger une nouvelle phrase et recommencer
      if (isActive) {
        console.log('🔄 Chargement nouvelle phrase...')
        const newPhrase = await loadPhrase()
        console.log('✅ Nouvelle phrase chargée:', newPhrase ? newPhrase.frenchPhrase : 'null')
        
        // Vérifier à nouveau si toujours actif et si nouvelle phrase chargée
        if (isActive && newPhrase && newPhrase.audioUrlFr && newPhrase.audioUrlEn) {
          console.log('✅ Nouvelle phrase valide, relance du cycle...')
          // Attendre un peu pour permettre la mise à jour de l'état React
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Relancer le cycle avec la nouvelle phrase directement
          if (isActive) {
            console.log('🔄 Relance du cycle avec nouvelle phrase')
            startCycle(newPhrase)
          } else {
            console.log('⚠️ Cycle arrêté, ne pas relancer')
          }
        } else if (isActive && newPhrase) {
          // Phrase chargée mais fichiers audio manquants
          console.error('❌ Fichiers audio manquants pour la nouvelle phrase')
          setError('Les fichiers audio ne sont pas disponibles pour cette phrase.')
          setIsActive(false)
          isActiveRef.current = false
          setPhase('idle')
        } else if (isActive) {
          // Erreur lors du chargement de la phrase
          console.error('❌ Erreur chargement nouvelle phrase')
          setError('Erreur lors du chargement de la nouvelle phrase.')
          setIsActive(false)
          isActiveRef.current = false
          setPhase('idle')
        } else {
          console.log('⚠️ Cycle arrêté (isActive = false)')
        }
      } else {
        console.log('⚠️ Cycle arrêté avant chargement nouvelle phrase')
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
    isActiveRef.current = false
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
    // Charger l'URL de "nouvelle phrase" et précharger l'audio
    fetch('/api/audio/nouvelle-phrase')
      .then(res => {
        if (!res.ok) {
          console.warn(`⚠️ Route /api/audio/nouvelle-phrase retourne ${res.status}`)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data && data.url) {
          setNouvellePhraseUrl(data.url)
          console.log('✅ Audio "nouvelle phrase" chargé:', data.url)
          // Précharger l'audio "nouvelle phrase"
          preloadAudio(data.url)
            .then(audio => {
              preloadedNouvellePhrase.current = audio
              console.log('✅ Audio "nouvelle phrase" préchargé')
            })
            .catch(err => {
              console.warn('⚠️ Erreur préchargement "nouvelle phrase"')
            })
        } else {
          console.warn('⚠️ Pas d\'URL retournée pour "nouvelle phrase", utilisation du fallback Web Speech API')
        }
      })
      .catch(err => {
        console.error('❌ Erreur chargement audio nouvelle phrase:', err)
      })
    
    // Charger une première phrase au démarrage
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

  // Ne pas afficher l'erreur pendant le préchargement
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
              onClick={() => startCycle()}
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

