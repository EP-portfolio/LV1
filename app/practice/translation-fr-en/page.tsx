import TranslationExercise from '@/components/practice/TranslationExercise'

export default function TranslationFrEnPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Traduction Français vers Anglais
          </h1>
          <p className="text-gray-600">
            Traduisez des phrases françaises en anglais. Recevez un feedback détaillé pour améliorer votre niveau.
          </p>
        </div>
        <TranslationExercise direction="fr_to_en" />
      </div>
    </div>
  )
}

