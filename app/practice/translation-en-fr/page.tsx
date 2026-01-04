import TranslationExercise from '@/components/practice/TranslationExercise'

export default function TranslationEnFrPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Traduction Anglais vers Français
          </h1>
          <p className="text-gray-600">
            Traduisez des phrases anglaises en français. Renforcez votre compréhension et votre expression.
          </p>
        </div>
        <TranslationExercise direction="en_to_fr" />
      </div>
    </div>
  )
}

