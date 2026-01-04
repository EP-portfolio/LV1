export interface VocabularyCategory {
  name: string
  description: string
  targetCount: number
  examples: string[]
}

export const VOCABULARY_CATEGORIES: VocabularyCategory[] = [
  {
    name: 'produits_consommation',
    description: 'Produits de consommation courante (aliments, boissons non alcoolisées, produits ménagers, etc.)',
    targetCount: 100,
    examples: ['pain', 'lait', 'fromage', 'yaourt', 'café', 'thé', 'shampooing', 'dentifrice', 'savon', 'lessive']
  },
  {
    name: 'verbes_courants',
    description: 'Verbes de la vie courante à l\'infinitif',
    targetCount: 60,
    examples: ['manger', 'boire', 'dormir', 'travailler', 'marcher', 'parler', 'écouter', 'regarder', 'lire', 'écrire']
  },
  {
    name: 'legumes',
    description: 'Légumes',
    targetCount: 40,
    examples: ['carotte', 'tomate', 'courgette', 'poivron', 'salade', 'brocoli', 'chou', 'haricot', 'pois', 'épinard']
  },
  {
    name: 'fruits',
    description: 'Fruits',
    targetCount: 40,
    examples: ['pomme', 'banane', 'orange', 'fraise', 'raisin', 'cerise', 'pêche', 'abricot', 'poire', 'citron']
  },
  {
    name: 'animaux_domestiques',
    description: 'Animaux domestiques et animaux de compagnie',
    targetCount: 20,
    examples: ['chien', 'chat', 'oiseau', 'lapin', 'hamster', 'poisson', 'cochon d\'inde', 'perroquet', 'canari', 'tortue']
  },
  {
    name: 'pays',
    description: 'Noms de pays',
    targetCount: 20,
    examples: ['France', 'Angleterre', 'Espagne', 'Italie', 'Allemagne', 'États-Unis', 'Canada', 'Belgique', 'Suisse', 'Portugal']
  },
  {
    name: 'objets_quotidiens',
    description: 'Objets de la vie quotidienne',
    targetCount: 20,
    examples: ['téléphone', 'ordinateur', 'clé', 'porte', 'fenêtre', 'chaise', 'table', 'lit', 'lampe', 'miroir']
  }
]

// Total : 300 mots

