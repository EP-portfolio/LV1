// Alternative: Utiliser Web Speech API côté client (gratuit mais limité)
export class WebSpeechSynthesis {
  private synth: SpeechSynthesis

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('Web Speech API nécessite un navigateur')
    }
    this.synth = window.speechSynthesis
  }

  speak(text: string, language: 'fr-FR' | 'en-US' = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = 0.8 // Ralenti pour l'apprentissage
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synth.speak(utterance)
    })
  }

  stop() {
    this.synth.cancel()
  }

  isSpeaking(): boolean {
    return this.synth.speaking
  }
}

