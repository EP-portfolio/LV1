'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Array<{
    id: string
    type: string
    direction: string
    score: number
    correctAnswers: number
    totalQuestions: number
    createdAt: string
    questions?: Array<{
      originalText: string
      userAnswer: string
      feedback?: string
    }>
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const userResponse = await fetch('/api/auth/user')
      if (!userResponse.ok) {
        router.push('/login')
        return
      }

      const statsResponse = await fetch('/api/progress/stats')
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setSessions(data.recentSessions || [])
      }
    } catch (error) {
      console.error('Erreur récupération historique:', error)
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
          Historique des sessions
        </h1>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              Aucune session pour le moment. Commencez par faire des exercices !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {session.type} - {session.direction}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {session.score.toFixed(1)}/10
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.correctAnswers}/{session.totalQuestions} correctes
                    </p>
                  </div>
                </div>

                {session.questions && session.questions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Questions :</h4>
                    {session.questions.map((question, idx: number) => (
                      <div key={idx} className="mb-2 p-3 bg-gray-50 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Original :</span> {question.originalText}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Votre réponse :</span> {question.userAnswer}
                        </p>
                        {question.feedback && (
                          <p className="text-sm mt-1 text-gray-600">
                            {question.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

