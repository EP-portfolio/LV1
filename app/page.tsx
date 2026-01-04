'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    fetch('/api/auth/user')
      .then(res => {
        if (res.ok) {
          router.push('/dashboard')
        }
      })
      .catch(() => {
        // Non connecté, rester sur la page d'accueil
      })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur LV1
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Votre application d'apprentissage de l'anglais personnalisée
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Commencer maintenant
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Exercices personnalisés
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pratiquez la traduction français-anglais avec des exercices adaptés à votre niveau et générés par intelligence artificielle
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-green-600">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Pratique orale et écrite
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Développez vos compétences à l'oral et à l'écrit avec des exercices variés et un feedback détaillé
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-purple-600">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Suivi de progression
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Visualisez vos progrès avec des statistiques détaillées, des graphiques et un historique complet de vos sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
