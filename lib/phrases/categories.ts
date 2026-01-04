export interface SocialPhraseCategory {
  name: string
  description: string
  targetCount: number
  examples: string[]
}

export const SOCIAL_PHRASE_CATEGORIES: SocialPhraseCategory[] = [
  {
    name: 'présentation',
    description: 'Phrases pour se présenter',
    targetCount: 20,
    examples: [
      'Bonjour, je m\'appelle Marie.',
      'Enchanté de vous rencontrer.',
      'Je viens de Paris.'
    ]
  },
  {
    name: 'météo',
    description: 'Phrases sur la météo',
    targetCount: 20,
    examples: [
      'Il fait beau aujourd\'hui.',
      'Il pleut beaucoup.',
      'Quel temps fait-il ?'
    ]
  },
  {
    name: 'demande_info',
    description: 'Demander des informations',
    targetCount: 20,
    examples: [
      'Où se trouve la gare ?',
      'Quelle heure est-il ?',
      'Comment allez-vous ?'
    ]
  },
  {
    name: 'directions',
    description: 'Demander son chemin',
    targetCount: 20,
    examples: [
      'Comment aller à la gare ?',
      'Où est la banque ?',
      'C\'est loin d\'ici ?'
    ]
  },
  {
    name: 'restaurant',
    description: 'Commander au restaurant',
    targetCount: 20,
    examples: [
      'Je voudrais une table pour deux.',
      'Qu\'est-ce que vous recommandez ?',
      'L\'addition, s\'il vous plaît.'
    ]
  },
  {
    name: 'shopping',
    description: 'Faire des courses',
    targetCount: 20,
    examples: [
      'Combien ça coûte ?',
      'Avez-vous ce modèle en bleu ?',
      'Je cherche un cadeau.'
    ]
  },
  {
    name: 'transport',
    description: 'Prendre les transports',
    targetCount: 20,
    examples: [
      'Un billet pour Paris, s\'il vous plaît.',
      'Quel est le prochain train ?',
      'Où est l\'arrêt de bus ?'
    ]
  },
  {
    name: 'travail',
    description: 'Parler du travail',
    targetCount: 20,
    examples: [
      'Je travaille dans une entreprise.',
      'Quel est votre métier ?',
      'J\'ai une réunion cet après-midi.'
    ]
  },
  {
    name: 'famille',
    description: 'Parler de la famille',
    targetCount: 20,
    examples: [
      'J\'ai deux enfants.',
      'Ma sœur habite à Lyon.',
      'Comment va votre famille ?'
    ]
  },
  {
    name: 'loisirs',
    description: 'Parler des loisirs',
    targetCount: 20,
    examples: [
      'J\'aime lire et voyager.',
      'Que faites-vous le week-end ?',
      'Je fais du sport régulièrement.'
    ]
  },
  {
    name: 'santé',
    description: 'Parler de la santé',
    targetCount: 20,
    examples: [
      'Je ne me sens pas bien.',
      'Où est la pharmacie ?',
      'J\'ai mal à la tête.'
    ]
  },
  {
    name: 'voyage',
    description: 'Parler de voyage',
    targetCount: 20,
    examples: [
      'Je vais en vacances en Espagne.',
      'Avez-vous déjà visité Londres ?',
      'Quel est votre pays préféré ?'
    ]
  },
  {
    name: 'invitation',
    description: 'Inviter quelqu\'un',
    targetCount: 20,
    examples: [
      'Voulez-vous venir dîner ?',
      'On se voit demain ?',
      'Je vous invite à mon anniversaire.'
    ]
  },
  {
    name: 'remerciement',
    description: 'Remercier',
    targetCount: 20,
    examples: [
      'Merci beaucoup !',
      'Je vous remercie de votre aide.',
      'C\'est très gentil de votre part.'
    ]
  },
  {
    name: 'excuse',
    description: 'S\'excuser',
    targetCount: 20,
    examples: [
      'Je suis désolé pour le retard.',
      'Excusez-moi, je ne comprends pas.',
      'Pardon, pouvez-vous répéter ?'
    ]
  },
  {
    name: 'opinion',
    description: 'Donner son opinion',
    targetCount: 20,
    examples: [
      'Je pense que c\'est une bonne idée.',
      'À mon avis, c\'est intéressant.',
      'Je crois que vous avez raison.'
    ]
  },
  {
    name: 'accord_désaccord',
    description: 'Exprimer accord ou désaccord',
    targetCount: 20,
    examples: [
      'Je suis d\'accord avec vous.',
      'Je ne suis pas sûr de cela.',
      'C\'est une bonne question.'
    ]
  }
]

// Total : 17 catégories × 20 phrases = 340 phrases minimum

