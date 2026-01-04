'use client'

import { useState, useRef, useEffect } from 'react'

interface SwipeRevealProps {
  frenchWord: string
  englishWord: string
  enabled: boolean // Si false, le swipe ne révèle rien (niveau 3)
  onReveal?: () => void
}

export default function SwipeReveal({
  frenchWord,
  englishWord,
  enabled,
  onReveal
}: SwipeRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef<number>(0)
  const currentX = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled) {
      setRevealed(false)
      setSwipeProgress(0)
    }
  }, [enabled])

  const handleStart = (clientX: number) => {
    if (!enabled) return
    
    isDragging.current = true
    startX.current = clientX
    currentX.current = clientX
  }

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !enabled || !containerRef.current) return

    currentX.current = clientX
    const deltaX = currentX.current - startX.current
    const containerWidth = containerRef.current.offsetWidth
    const progress = Math.min(Math.max((deltaX / containerWidth) * 100, 0), 100)
    
    setSwipeProgress(progress)
    
    if (progress >= 50 && !revealed) {
      setRevealed(true)
      if (onReveal) {
        onReveal()
      }
    } else if (progress < 50 && revealed) {
      setRevealed(false)
    }
  }

  const handleEnd = () => {
    if (!isDragging.current) return
    
    isDragging.current = false
    
    // Si on a swipé à plus de 50%, garder révélé, sinon revenir
    if (swipeProgress >= 50) {
      setSwipeProgress(100)
      setRevealed(true)
    } else {
      setSwipeProgress(0)
      setRevealed(false)
    }
  }

  // Gestionnaires d'événements pour souris
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (isDragging.current) {
      handleEnd()
    }
  }

  // Gestionnaires d'événements pour tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    if (isDragging.current) {
      handleEnd()
    }
  }

  // Ajouter les listeners globaux pour le drag
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleEnd()
      }
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length > 0) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleGlobalTouchEnd = () => {
      if (isDragging.current) {
        handleEnd()
      }
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    window.addEventListener('touchend', handleGlobalTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white rounded-lg shadow-md overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: enabled ? 'grab' : 'default' }}
    >
      {/* Mot français (toujours visible) */}
      <div className="p-6 text-center">
        <p className="text-3xl font-bold text-gray-900">{frenchWord}</p>
        {enabled && swipeProgress === 0 && (
          <p className="text-sm text-gray-500 mt-2">Glissez de gauche à droite pour révéler la traduction</p>
        )}
        {!enabled && (
          <p className="text-sm text-gray-500 mt-2">Aucune aide disponible - Dites le mot en anglais</p>
        )}
      </div>

      {/* Traduction anglaise (révélée par swipe) */}
      {enabled && (
        <div
          className="absolute inset-0 bg-blue-600 text-white flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `translateX(${swipeProgress - 100}%)`,
            opacity: revealed ? 1 : Math.max(0, swipeProgress / 50)
          }}
        >
          <p className="text-3xl font-bold">{englishWord}</p>
        </div>
      )}

      {/* Indicateur de swipe */}
      {enabled && swipeProgress > 0 && swipeProgress < 100 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-100"
              style={{ width: `${swipeProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

