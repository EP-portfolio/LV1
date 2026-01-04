'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface VocabularyWord {
  id: string
  frenchWord: string
  englishWord: string
  category: string
  imageUrl: string | null
}

export default function TestVocabPage() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch('/api/vocabulary/test')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement des mots')
        }
        
        setWords(data.words || [])
        
        // Afficher les stats dans la console
        if (data.stats) {
          console.log('📊 Statistiques:', data.stats)
        }
      } catch (err: any) {
        console.error('Erreur:', err)
        setError(err.message || 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Test Vocabulaire</h1>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Test Vocabulaire</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">Erreur:</p>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Grouper par catégorie
  const wordsByCategory: Record<string, VocabularyWord[]> = {}
  words.forEach(word => {
    if (!wordsByCategory[word.category]) {
      wordsByCategory[word.category] = []
    }
    wordsByCategory[word.category].push(word)
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Test Vocabulaire</h1>
        <p className="text-gray-600 mb-8">
          Affichage de {words.length} mots avec leurs images
        </p>

        {Object.entries(wordsByCategory).map(([category, categoryWords]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {category.replace(/_/g, ' ')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categoryWords.map(word => (
                <div
                  key={word.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {word.imageUrl ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={word.imageUrl}
                        alt={word.frenchWord}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Pas d'image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-lg text-gray-800">
                      {word.frenchWord}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {word.englishWord}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

