'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Progress {
  level: string
  totalSessions: number
  averageScore: number
  streak: number
  lastPractice: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const userResponse = await fetch('/api/auth/user')
      if (!userResponse.ok) {
        router.push('/login')
        return
      }

      const progressResponse = await fetch('/api/progress')
      if (progressResponse.ok) {
        const data = await progressResponse.json()
        setProgress(data)
      }
    } catch (error) {
      console.error('Erreur récupération progression:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Accueil
        </h1>

        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Niveau</h3>
              <p className="text-3xl font-bold text-blue-600 capitalize">
                {progress.level}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Sessions totales</h3>
              <p className="text-3xl font-bold text-green-600">
                {progress.totalSessions}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Score moyen</h3>
              <p className="text-3xl font-bold text-purple-600">
                {progress.averageScore.toFixed(1)}/10
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Série</h3>
              <p className="text-3xl font-bold text-orange-600">
                {progress.streak} jour{progress.streak > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Commencer un exercice
          </h2>
          <div className="flex justify-center">
            <Link
              href="/practice/multimedia"
              className="bg-white border-2 border-purple-600 text-purple-700 p-6 rounded-lg hover:bg-purple-50 transition-all shadow-sm hover:shadow-md max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-2">Exercices multimédias</h3>
              <p className="text-gray-600 text-sm">Apprenez avec des images et des exercices audio pour une expérience immersive.</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/progress"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voir ma progression
            </Link>
            <Link
              href="/history"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Historique des sessions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

