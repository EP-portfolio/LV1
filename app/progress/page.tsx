'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Progress {
  level: string
  totalSessions: number
  averageScore: number
  streak: number
  lastPractice: string | null
}

interface Session {
  id: string
  score: number
  createdAt: string
  type: string
  direction: string
}

export default function ProgressPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Progress | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userResponse = await fetch('/api/auth/user')
      if (!userResponse.ok) {
        router.push('/login')
        return
      }

      const [progressResponse, statsResponse] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/progress/stats'),
      ])

      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setProgress(progressData)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setSessions(statsData.recentSessions || [])
      }
    } catch (error) {
      console.error('Erreur récupération données:', error)
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

  const chartData = {
    labels: sessions.slice(0, 10).reverse().map((_, i) => `Session ${i + 1}`),
    datasets: [
      {
        label: 'Score',
        data: sessions.slice(0, 10).reverse().map((s) => s.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Ma Progression
        </h1>

        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Niveau actuel</h3>
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
              <h3 className="text-sm font-medium text-gray-500 mb-2">Série actuelle</h3>
              <p className="text-3xl font-bold text-orange-600">
                {progress.streak} jour{progress.streak > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Évolution des scores (10 dernières sessions)
            </h2>
            <Line data={chartData} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dernières sessions
          </h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500">Aucune session pour le moment</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {session.type} - {session.direction}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {session.score.toFixed(1)}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

