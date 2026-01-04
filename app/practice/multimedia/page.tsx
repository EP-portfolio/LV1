'use client'

import { useState } from 'react'
import ImageTranslationExercise from '@/components/practice/ImageTranslationExercise'
import AudioTranslationExercise from '@/components/practice/AudioTranslationExercise'

export default function MultimediaPracticePage() {
  const [exerciseType, setExerciseType] = useState<'image' | 'audio'>('image')
  const [direction, setDirection] = useState<'fr_to_en' | 'en_to_fr'>('fr_to_en')
  const [level, setLevel] = useState('intermédiaire')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Exercices Multimédia
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Type d'exercice
              </label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as 'image' | 'audio')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="image">Avec image</option>
                <option value="audio">Écoute</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'fr_to_en' | 'en_to_fr')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="fr_to_en">Français vers Anglais</option>
                <option value="en_to_fr">Anglais vers Français</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Niveau
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="débutant">Niveau 1 - Débutant (Swipe + Audio)</option>
                <option value="intermédiaire">Niveau 2 - Intermédiaire (Swipe uniquement)</option>
                <option value="avancé">Niveau 3 - Avancé (Aucune aide)</option>
              </select>
            </div>
          </div>
        </div>

        {exerciseType === 'image' ? (
          <ImageTranslationExercise direction={direction} level={level} />
        ) : (
          <AudioTranslationExercise direction={direction} level={level} />
        )}
      </div>
    </div>
  )
}

