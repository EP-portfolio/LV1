/**
 * Script pour importer directement 300 mots de vocabulaire
 * Générés directement ici, sans API externe
 * Pas d'alcool, pas de répétitions inutiles
 */

import { prisma } from '../lib/db'

interface WordData {
  frenchWord: string
  englishWord: string
  category: string
}

// 300 mots complets organisés par catégories
const ALL_WORDS: WordData[] = [
  // ============================================
  // PRODUITS DE CONSOMMATION (100 mots)
  // ============================================
  { frenchWord: 'pain', englishWord: 'bread', category: 'produits_consommation' },
  { frenchWord: 'lait', englishWord: 'milk', category: 'produits_consommation' },
  { frenchWord: 'fromage', englishWord: 'cheese', category: 'produits_consommation' },
  { frenchWord: 'yaourt', englishWord: 'yogurt', category: 'produits_consommation' },
  { frenchWord: 'café', englishWord: 'coffee', category: 'produits_consommation' },
  { frenchWord: 'thé', englishWord: 'tea', category: 'produits_consommation' },
  { frenchWord: 'sucre', englishWord: 'sugar', category: 'produits_consommation' },
  { frenchWord: 'sel', englishWord: 'salt', category: 'produits_consommation' },
  { frenchWord: 'beurre', englishWord: 'butter', category: 'produits_consommation' },
  { frenchWord: 'huile', englishWord: 'oil', category: 'produits_consommation' },
  { frenchWord: 'vinaigre', englishWord: 'vinegar', category: 'produits_consommation' },
  { frenchWord: 'moutarde', englishWord: 'mustard', category: 'produits_consommation' },
  { frenchWord: 'mayonnaise', englishWord: 'mayonnaise', category: 'produits_consommation' },
  { frenchWord: 'confiture', englishWord: 'jam', category: 'produits_consommation' },
  { frenchWord: 'miel', englishWord: 'honey', category: 'produits_consommation' },
  { frenchWord: 'chocolat', englishWord: 'chocolate', category: 'produits_consommation' },
  { frenchWord: 'biscuit', englishWord: 'cookie', category: 'produits_consommation' },
  { frenchWord: 'gâteau', englishWord: 'cake', category: 'produits_consommation' },
  { frenchWord: 'bonbon', englishWord: 'candy', category: 'produits_consommation' },
  { frenchWord: 'glace', englishWord: 'ice cream', category: 'produits_consommation' },
  { frenchWord: 'eau', englishWord: 'water', category: 'produits_consommation' },
  { frenchWord: 'jus', englishWord: 'juice', category: 'produits_consommation' },
  { frenchWord: 'soda', englishWord: 'soda', category: 'produits_consommation' },
  { frenchWord: 'limonade', englishWord: 'lemonade', category: 'produits_consommation' },
  { frenchWord: 'shampooing', englishWord: 'shampoo', category: 'produits_consommation' },
  { frenchWord: 'dentifrice', englishWord: 'toothpaste', category: 'produits_consommation' },
  { frenchWord: 'savon', englishWord: 'soap', category: 'produits_consommation' },
  { frenchWord: 'lessive', englishWord: 'laundry detergent', category: 'produits_consommation' },
  { frenchWord: 'adoucissant', englishWord: 'fabric softener', category: 'produits_consommation' },
  { frenchWord: 'papier toilette', englishWord: 'toilet paper', category: 'produits_consommation' },
  { frenchWord: 'serviette', englishWord: 'towel', category: 'produits_consommation' },
  { frenchWord: 'éponge', englishWord: 'sponge', category: 'produits_consommation' },
  { frenchWord: 'produit vaisselle', englishWord: 'dish soap', category: 'produits_consommation' },
  { frenchWord: 'sac poubelle', englishWord: 'trash bag', category: 'produits_consommation' },
  { frenchWord: 'ampoule', englishWord: 'light bulb', category: 'produits_consommation' },
  { frenchWord: 'pile', englishWord: 'battery', category: 'produits_consommation' },
  { frenchWord: 'bougie', englishWord: 'candle', category: 'produits_consommation' },
  { frenchWord: 'allumette', englishWord: 'match', category: 'produits_consommation' },
  { frenchWord: 'briquet', englishWord: 'lighter', category: 'produits_consommation' },
  { frenchWord: 'riz', englishWord: 'rice', category: 'produits_consommation' },
  { frenchWord: 'pâtes', englishWord: 'pasta', category: 'produits_consommation' },
  { frenchWord: 'farine', englishWord: 'flour', category: 'produits_consommation' },
  { frenchWord: 'œuf', englishWord: 'egg', category: 'produits_consommation' },
  { frenchWord: 'jambon', englishWord: 'ham', category: 'produits_consommation' },
  { frenchWord: 'saucisson', englishWord: 'salami', category: 'produits_consommation' },
  { frenchWord: 'poulet', englishWord: 'chicken', category: 'produits_consommation' },
  { frenchWord: 'poisson', englishWord: 'fish', category: 'produits_consommation' },
  { frenchWord: 'viande', englishWord: 'meat', category: 'produits_consommation' },
  { frenchWord: 'soupe', englishWord: 'soup', category: 'produits_consommation' },
  { frenchWord: 'salade', englishWord: 'salad', category: 'produits_consommation' },
  { frenchWord: 'sandwich', englishWord: 'sandwich', category: 'produits_consommation' },
  { frenchWord: 'pizza', englishWord: 'pizza', category: 'produits_consommation' },
  { frenchWord: 'frites', englishWord: 'fries', category: 'produits_consommation' },
  { frenchWord: 'hamburger', englishWord: 'hamburger', category: 'produits_consommation' },
  { frenchWord: 'crème', englishWord: 'cream', category: 'produits_consommation' },
  { frenchWord: 'noix', englishWord: 'nut', category: 'produits_consommation' },
  { frenchWord: 'cacahuète', englishWord: 'peanut', category: 'produits_consommation' },
  { frenchWord: 'amande', englishWord: 'almond', category: 'produits_consommation' },
  { frenchWord: 'céréale', englishWord: 'cereal', category: 'produits_consommation' },
  { frenchWord: 'avoine', englishWord: 'oats', category: 'produits_consommation' },
  { frenchWord: 'muesli', englishWord: 'muesli', category: 'produits_consommation' },
  { frenchWord: 'cornflakes', englishWord: 'cornflakes', category: 'produits_consommation' },
  { frenchWord: 'lentille', englishWord: 'lentil', category: 'produits_consommation' },
  { frenchWord: 'haricot', englishWord: 'bean', category: 'produits_consommation' },
  { frenchWord: 'pois chiche', englishWord: 'chickpea', category: 'produits_consommation' },
  { frenchWord: 'couscous', englishWord: 'couscous', category: 'produits_consommation' },
  { frenchWord: 'quinoa', englishWord: 'quinoa', category: 'produits_consommation' },
  { frenchWord: 'spaghetti', englishWord: 'spaghetti', category: 'produits_consommation' },
  { frenchWord: 'macaroni', englishWord: 'macaroni', category: 'produits_consommation' },
  { frenchWord: 'ravioli', englishWord: 'ravioli', category: 'produits_consommation' },
  { frenchWord: 'lasagne', englishWord: 'lasagna', category: 'produits_consommation' },
  { frenchWord: 'baguette', englishWord: 'baguette', category: 'produits_consommation' },
  { frenchWord: 'croissant', englishWord: 'croissant', category: 'produits_consommation' },
  { frenchWord: 'brioche', englishWord: 'brioche', category: 'produits_consommation' },
  { frenchWord: 'pain de mie', englishWord: 'sliced bread', category: 'produits_consommation' },
  { frenchWord: 'tartine', englishWord: 'slice of bread', category: 'produits_consommation' },
  { frenchWord: 'tarte', englishWord: 'tart', category: 'produits_consommation' },
  { frenchWord: 'flan', englishWord: 'flan', category: 'produits_consommation' },
  { frenchWord: 'crème brûlée', englishWord: 'crème brûlée', category: 'produits_consommation' },
  { frenchWord: 'mousse', englishWord: 'mousse', category: 'produits_consommation' },
  { frenchWord: 'tiramisu', englishWord: 'tiramisu', category: 'produits_consommation' },
  { frenchWord: 'cheesecake', englishWord: 'cheesecake', category: 'produits_consommation' },
  { frenchWord: 'brownie', englishWord: 'brownie', category: 'produits_consommation' },
  { frenchWord: 'muffin', englishWord: 'muffin', category: 'produits_consommation' },
  { frenchWord: 'waffle', englishWord: 'waffle', category: 'produits_consommation' },
  { frenchWord: 'pancake', englishWord: 'pancake', category: 'produits_consommation' },
  { frenchWord: 'crêpe', englishWord: 'crepe', category: 'produits_consommation' },
  { frenchWord: 'gaufre', englishWord: 'waffle', category: 'produits_consommation' },
  { frenchWord: 'madeleine', englishWord: 'madeleine', category: 'produits_consommation' },
  { frenchWord: 'macaron', englishWord: 'macaron', category: 'produits_consommation' },
  { frenchWord: 'caramel', englishWord: 'caramel', category: 'produits_consommation' },
  { frenchWord: 'nougat', englishWord: 'nougat', category: 'produits_consommation' },
  { frenchWord: 'guimauve', englishWord: 'marshmallow', category: 'produits_consommation' },
  { frenchWord: 'gelée', englishWord: 'jelly', category: 'produits_consommation' },
  { frenchWord: 'compote', englishWord: 'compote', category: 'produits_consommation' },
  { frenchWord: 'purée', englishWord: 'mashed potatoes', category: 'produits_consommation' },
  { frenchWord: 'sauce', englishWord: 'sauce', category: 'produits_consommation' },
  { frenchWord: 'ketchup', englishWord: 'ketchup', category: 'produits_consommation' },
  { frenchWord: 'sauce tomate', englishWord: 'tomato sauce', category: 'produits_consommation' },
  { frenchWord: 'sauce soja', englishWord: 'soy sauce', category: 'produits_consommation' },
  { frenchWord: 'vinaigrette', englishWord: 'vinaigrette', category: 'produits_consommation' },
  { frenchWord: 'quiche', englishWord: 'quiche', category: 'produits_consommation' },
  { frenchWord: 'gratin', englishWord: 'gratin', category: 'produits_consommation' },
  { frenchWord: 'ratatouille', englishWord: 'ratatouille', category: 'produits_consommation' },
  { frenchWord: 'cassoulet', englishWord: 'cassoulet', category: 'produits_consommation' },
  { frenchWord: 'bouillabaisse', englishWord: 'bouillabaisse', category: 'produits_consommation' },
  { frenchWord: 'choucroute', englishWord: 'sauerkraut', category: 'produits_consommation' },
  { frenchWord: 'tartiflette', englishWord: 'tartiflette', category: 'produits_consommation' },
  { frenchWord: 'fondue', englishWord: 'fondue', category: 'produits_consommation' },
  { frenchWord: 'raclette', englishWord: 'raclette', category: 'produits_consommation' },
  
  // ============================================
  // VERBES COURANTS (60 mots)
  // ============================================
  { frenchWord: 'manger', englishWord: 'to eat', category: 'verbes_courants' },
  { frenchWord: 'boire', englishWord: 'to drink', category: 'verbes_courants' },
  { frenchWord: 'dormir', englishWord: 'to sleep', category: 'verbes_courants' },
  { frenchWord: 'travailler', englishWord: 'to work', category: 'verbes_courants' },
  { frenchWord: 'marcher', englishWord: 'to walk', category: 'verbes_courants' },
  { frenchWord: 'parler', englishWord: 'to speak', category: 'verbes_courants' },
  { frenchWord: 'écouter', englishWord: 'to listen', category: 'verbes_courants' },
  { frenchWord: 'regarder', englishWord: 'to watch', category: 'verbes_courants' },
  { frenchWord: 'lire', englishWord: 'to read', category: 'verbes_courants' },
  { frenchWord: 'écrire', englishWord: 'to write', category: 'verbes_courants' },
  { frenchWord: 'apprendre', englishWord: 'to learn', category: 'verbes_courants' },
  { frenchWord: 'enseigner', englishWord: 'to teach', category: 'verbes_courants' },
  { frenchWord: 'comprendre', englishWord: 'to understand', category: 'verbes_courants' },
  { frenchWord: 'penser', englishWord: 'to think', category: 'verbes_courants' },
  { frenchWord: 'savoir', englishWord: 'to know', category: 'verbes_courants' },
  { frenchWord: 'connaître', englishWord: 'to know', category: 'verbes_courants' },
  { frenchWord: 'voir', englishWord: 'to see', category: 'verbes_courants' },
  { frenchWord: 'entendre', englishWord: 'to hear', category: 'verbes_courants' },
  { frenchWord: 'sentir', englishWord: 'to smell', category: 'verbes_courants' },
  { frenchWord: 'toucher', englishWord: 'to touch', category: 'verbes_courants' },
  { frenchWord: 'goûter', englishWord: 'to taste', category: 'verbes_courants' },
  { frenchWord: 'acheter', englishWord: 'to buy', category: 'verbes_courants' },
  { frenchWord: 'vendre', englishWord: 'to sell', category: 'verbes_courants' },
  { frenchWord: 'payer', englishWord: 'to pay', category: 'verbes_courants' },
  { frenchWord: 'donner', englishWord: 'to give', category: 'verbes_courants' },
  { frenchWord: 'recevoir', englishWord: 'to receive', category: 'verbes_courants' },
  { frenchWord: 'prendre', englishWord: 'to take', category: 'verbes_courants' },
  { frenchWord: 'mettre', englishWord: 'to put', category: 'verbes_courants' },
  { frenchWord: 'porter', englishWord: 'to wear', category: 'verbes_courants' },
  { frenchWord: 'ouvrir', englishWord: 'to open', category: 'verbes_courants' },
  { frenchWord: 'fermer', englishWord: 'to close', category: 'verbes_courants' },
  { frenchWord: 'allumer', englishWord: 'to turn on', category: 'verbes_courants' },
  { frenchWord: 'éteindre', englishWord: 'to turn off', category: 'verbes_courants' },
  { frenchWord: 'cuisiner', englishWord: 'to cook', category: 'verbes_courants' },
  { frenchWord: 'nettoyer', englishWord: 'to clean', category: 'verbes_courants' },
  { frenchWord: 'laver', englishWord: 'to wash', category: 'verbes_courants' },
  { frenchWord: 'ranger', englishWord: 'to tidy up', category: 'verbes_courants' },
  { frenchWord: 'chercher', englishWord: 'to search', category: 'verbes_courants' },
  { frenchWord: 'trouver', englishWord: 'to find', category: 'verbes_courants' },
  { frenchWord: 'perdre', englishWord: 'to lose', category: 'verbes_courants' },
  { frenchWord: 'gagner', englishWord: 'to win', category: 'verbes_courants' },
  { frenchWord: 'jouer', englishWord: 'to play', category: 'verbes_courants' },
  { frenchWord: 'chanter', englishWord: 'to sing', category: 'verbes_courants' },
  { frenchWord: 'danser', englishWord: 'to dance', category: 'verbes_courants' },
  { frenchWord: 'courir', englishWord: 'to run', category: 'verbes_courants' },
  { frenchWord: 'sauter', englishWord: 'to jump', category: 'verbes_courants' },
  { frenchWord: 'nager', englishWord: 'to swim', category: 'verbes_courants' },
  { frenchWord: 'conduire', englishWord: 'to drive', category: 'verbes_courants' },
  { frenchWord: 'voyager', englishWord: 'to travel', category: 'verbes_courants' },
  { frenchWord: 'visiter', englishWord: 'to visit', category: 'verbes_courants' },
  { frenchWord: 'rencontrer', englishWord: 'to meet', category: 'verbes_courants' },
  { frenchWord: 'appeler', englishWord: 'to call', category: 'verbes_courants' },
  { frenchWord: 'téléphoner', englishWord: 'to phone', category: 'verbes_courants' },
  { frenchWord: 'envoyer', englishWord: 'to send', category: 'verbes_courants' },
  { frenchWord: 'recevoir', englishWord: 'to receive', category: 'verbes_courants' },
  { frenchWord: 'demander', englishWord: 'to ask', category: 'verbes_courants' },
  { frenchWord: 'répondre', englishWord: 'to answer', category: 'verbes_courants' },
  { frenchWord: 'dire', englishWord: 'to say', category: 'verbes_courants' },
  { frenchWord: 'aimer', englishWord: 'to love', category: 'verbes_courants' },
  { frenchWord: 'adorer', englishWord: 'to adore', category: 'verbes_courants' },
  { frenchWord: 'préférer', englishWord: 'to prefer', category: 'verbes_courants' },
  
  // ============================================
  // LÉGUMES (40 mots)
  // ============================================
  { frenchWord: 'carotte', englishWord: 'carrot', category: 'legumes' },
  { frenchWord: 'tomate', englishWord: 'tomato', category: 'legumes' },
  { frenchWord: 'courgette', englishWord: 'zucchini', category: 'legumes' },
  { frenchWord: 'poivron', englishWord: 'bell pepper', category: 'legumes' },
  { frenchWord: 'salade', englishWord: 'lettuce', category: 'legumes' },
  { frenchWord: 'brocoli', englishWord: 'broccoli', category: 'legumes' },
  { frenchWord: 'chou', englishWord: 'cabbage', category: 'legumes' },
  { frenchWord: 'chou-fleur', englishWord: 'cauliflower', category: 'legumes' },
  { frenchWord: 'haricot vert', englishWord: 'green bean', category: 'legumes' },
  { frenchWord: 'pois', englishWord: 'pea', category: 'legumes' },
  { frenchWord: 'épinard', englishWord: 'spinach', category: 'legumes' },
  { frenchWord: 'oignon', englishWord: 'onion', category: 'legumes' },
  { frenchWord: 'ail', englishWord: 'garlic', category: 'legumes' },
  { frenchWord: 'échalote', englishWord: 'shallot', category: 'legumes' },
  { frenchWord: 'poireau', englishWord: 'leek', category: 'legumes' },
  { frenchWord: 'céleri', englishWord: 'celery', category: 'legumes' },
  { frenchWord: 'fenouil', englishWord: 'fennel', category: 'legumes' },
  { frenchWord: 'asperge', englishWord: 'asparagus', category: 'legumes' },
  { frenchWord: 'artichaut', englishWord: 'artichoke', category: 'legumes' },
  { frenchWord: 'aubergine', englishWord: 'eggplant', category: 'legumes' },
  { frenchWord: 'betterave', englishWord: 'beetroot', category: 'legumes' },
  { frenchWord: 'navet', englishWord: 'turnip', category: 'legumes' },
  { frenchWord: 'radis', englishWord: 'radish', category: 'legumes' },
  { frenchWord: 'concombre', englishWord: 'cucumber', category: 'legumes' },
  { frenchWord: 'courge', englishWord: 'squash', category: 'legumes' },
  { frenchWord: 'citrouille', englishWord: 'pumpkin', category: 'legumes' },
  { frenchWord: 'potiron', englishWord: 'pumpkin', category: 'legumes' },
  { frenchWord: 'patate', englishWord: 'potato', category: 'legumes' },
  { frenchWord: 'pomme de terre', englishWord: 'potato', category: 'legumes' },
  { frenchWord: 'patate douce', englishWord: 'sweet potato', category: 'legumes' },
  { frenchWord: 'maïs', englishWord: 'corn', category: 'legumes' },
  { frenchWord: 'champignon', englishWord: 'mushroom', category: 'legumes' },
  { frenchWord: 'lentille', englishWord: 'lentil', category: 'legumes' },
  { frenchWord: 'haricot rouge', englishWord: 'kidney bean', category: 'legumes' },
  { frenchWord: 'haricot blanc', englishWord: 'white bean', category: 'legumes' },
  { frenchWord: 'pois chiche', englishWord: 'chickpea', category: 'legumes' },
  { frenchWord: 'fève', englishWord: 'broad bean', category: 'legumes' },
  { frenchWord: 'petit pois', englishWord: 'pea', category: 'legumes' },
  { frenchWord: 'roquette', englishWord: 'arugula', category: 'legumes' },
  { frenchWord: 'mâche', englishWord: 'corn salad', category: 'legumes' },
  
  // ============================================
  // FRUITS (40 mots)
  // ============================================
  { frenchWord: 'pomme', englishWord: 'apple', category: 'fruits' },
  { frenchWord: 'banane', englishWord: 'banana', category: 'fruits' },
  { frenchWord: 'orange', englishWord: 'orange', category: 'fruits' },
  { frenchWord: 'fraise', englishWord: 'strawberry', category: 'fruits' },
  { frenchWord: 'raisin', englishWord: 'grape', category: 'fruits' },
  { frenchWord: 'cerise', englishWord: 'cherry', category: 'fruits' },
  { frenchWord: 'pêche', englishWord: 'peach', category: 'fruits' },
  { frenchWord: 'abricot', englishWord: 'apricot', category: 'fruits' },
  { frenchWord: 'poire', englishWord: 'pear', category: 'fruits' },
  { frenchWord: 'citron', englishWord: 'lemon', category: 'fruits' },
  { frenchWord: 'citron vert', englishWord: 'lime', category: 'fruits' },
  { frenchWord: 'mandarine', englishWord: 'mandarin', category: 'fruits' },
  { frenchWord: 'clémentine', englishWord: 'clementine', category: 'fruits' },
  { frenchWord: 'pamplemousse', englishWord: 'grapefruit', category: 'fruits' },
  { frenchWord: 'kiwi', englishWord: 'kiwi', category: 'fruits' },
  { frenchWord: 'ananas', englishWord: 'pineapple', category: 'fruits' },
  { frenchWord: 'mangue', englishWord: 'mango', category: 'fruits' },
  { frenchWord: 'papaye', englishWord: 'papaya', category: 'fruits' },
  { frenchWord: 'coco', englishWord: 'coconut', category: 'fruits' },
  { frenchWord: 'noix de coco', englishWord: 'coconut', category: 'fruits' },
  { frenchWord: 'pastèque', englishWord: 'watermelon', category: 'fruits' },
  { frenchWord: 'melon', englishWord: 'melon', category: 'fruits' },
  { frenchWord: 'framboise', englishWord: 'raspberry', category: 'fruits' },
  { frenchWord: 'mûre', englishWord: 'blackberry', category: 'fruits' },
  { frenchWord: 'myrtille', englishWord: 'blueberry', category: 'fruits' },
  { frenchWord: 'cassis', englishWord: 'blackcurrant', category: 'fruits' },
  { frenchWord: 'groseille', englishWord: 'redcurrant', category: 'fruits' },
  { frenchWord: 'prune', englishWord: 'plum', category: 'fruits' },
  { frenchWord: 'reine-claude', englishWord: 'greengage', category: 'fruits' },
  { frenchWord: 'mirabelle', englishWord: 'mirabelle plum', category: 'fruits' },
  { frenchWord: 'nectarine', englishWord: 'nectarine', category: 'fruits' },
  { frenchWord: 'figue', englishWord: 'fig', category: 'fruits' },
  { frenchWord: 'datte', englishWord: 'date', category: 'fruits' },
  { frenchWord: 'grenade', englishWord: 'pomegranate', category: 'fruits' },
  { frenchWord: 'litchi', englishWord: 'lychee', category: 'fruits' },
  { frenchWord: 'ramboutan', englishWord: 'rambutan', category: 'fruits' },
  { frenchWord: 'longane', englishWord: 'longan', category: 'fruits' },
  { frenchWord: 'maracuja', englishWord: 'passion fruit', category: 'fruits' },
  { frenchWord: 'fruit de la passion', englishWord: 'passion fruit', category: 'fruits' },
  { frenchWord: 'goyave', englishWord: 'guava', category: 'fruits' },
  
  // ============================================
  // ANIMAUX DOMESTIQUES (20 mots)
  // ============================================
  { frenchWord: 'chien', englishWord: 'dog', category: 'animaux_domestiques' },
  { frenchWord: 'chat', englishWord: 'cat', category: 'animaux_domestiques' },
  { frenchWord: 'oiseau', englishWord: 'bird', category: 'animaux_domestiques' },
  { frenchWord: 'lapin', englishWord: 'rabbit', category: 'animaux_domestiques' },
  { frenchWord: 'hamster', englishWord: 'hamster', category: 'animaux_domestiques' },
  { frenchWord: 'cochon d\'inde', englishWord: 'guinea pig', category: 'animaux_domestiques' },
  { frenchWord: 'souris', englishWord: 'mouse', category: 'animaux_domestiques' },
  { frenchWord: 'rat', englishWord: 'rat', category: 'animaux_domestiques' },
  { frenchWord: 'perroquet', englishWord: 'parrot', category: 'animaux_domestiques' },
  { frenchWord: 'canari', englishWord: 'canary', category: 'animaux_domestiques' },
  { frenchWord: 'tortue', englishWord: 'turtle', category: 'animaux_domestiques' },
  { frenchWord: 'poisson rouge', englishWord: 'goldfish', category: 'animaux_domestiques' },
  { frenchWord: 'poisson', englishWord: 'fish', category: 'animaux_domestiques' },
  { frenchWord: 'serpent', englishWord: 'snake', category: 'animaux_domestiques' },
  { frenchWord: 'lézard', englishWord: 'lizard', category: 'animaux_domestiques' },
  { frenchWord: 'gerbille', englishWord: 'gerbil', category: 'animaux_domestiques' },
  { frenchWord: 'furet', englishWord: 'ferret', category: 'animaux_domestiques' },
  { frenchWord: 'chinchilla', englishWord: 'chinchilla', category: 'animaux_domestiques' },
  { frenchWord: 'poule', englishWord: 'chicken', category: 'animaux_domestiques' },
  { frenchWord: 'coq', englishWord: 'rooster', category: 'animaux_domestiques' },
  
  // ============================================
  // PAYS (20 mots)
  // ============================================
  { frenchWord: 'France', englishWord: 'France', category: 'pays' },
  { frenchWord: 'Angleterre', englishWord: 'England', category: 'pays' },
  { frenchWord: 'Royaume-Uni', englishWord: 'United Kingdom', category: 'pays' },
  { frenchWord: 'Espagne', englishWord: 'Spain', category: 'pays' },
  { frenchWord: 'Italie', englishWord: 'Italy', category: 'pays' },
  { frenchWord: 'Allemagne', englishWord: 'Germany', category: 'pays' },
  { frenchWord: 'États-Unis', englishWord: 'United States', category: 'pays' },
  { frenchWord: 'Canada', englishWord: 'Canada', category: 'pays' },
  { frenchWord: 'Belgique', englishWord: 'Belgium', category: 'pays' },
  { frenchWord: 'Suisse', englishWord: 'Switzerland', category: 'pays' },
  { frenchWord: 'Portugal', englishWord: 'Portugal', category: 'pays' },
  { frenchWord: 'Pays-Bas', englishWord: 'Netherlands', category: 'pays' },
  { frenchWord: 'Grèce', englishWord: 'Greece', category: 'pays' },
  { frenchWord: 'Turquie', englishWord: 'Turkey', category: 'pays' },
  { frenchWord: 'Japon', englishWord: 'Japan', category: 'pays' },
  { frenchWord: 'Chine', englishWord: 'China', category: 'pays' },
  { frenchWord: 'Inde', englishWord: 'India', category: 'pays' },
  { frenchWord: 'Brésil', englishWord: 'Brazil', category: 'pays' },
  { frenchWord: 'Mexique', englishWord: 'Mexico', category: 'pays' },
  { frenchWord: 'Australie', englishWord: 'Australia', category: 'pays' },
  
  // ============================================
  // OBJETS QUOTIDIENS (20 mots)
  // ============================================
  { frenchWord: 'téléphone', englishWord: 'phone', category: 'objets_quotidiens' },
  { frenchWord: 'ordinateur', englishWord: 'computer', category: 'objets_quotidiens' },
  { frenchWord: 'clé', englishWord: 'key', category: 'objets_quotidiens' },
  { frenchWord: 'porte', englishWord: 'door', category: 'objets_quotidiens' },
  { frenchWord: 'fenêtre', englishWord: 'window', category: 'objets_quotidiens' },
  { frenchWord: 'chaise', englishWord: 'chair', category: 'objets_quotidiens' },
  { frenchWord: 'table', englishWord: 'table', category: 'objets_quotidiens' },
  { frenchWord: 'lit', englishWord: 'bed', category: 'objets_quotidiens' },
  { frenchWord: 'lampe', englishWord: 'lamp', category: 'objets_quotidiens' },
  { frenchWord: 'miroir', englishWord: 'mirror', category: 'objets_quotidiens' },
  { frenchWord: 'horloge', englishWord: 'clock', category: 'objets_quotidiens' },
  { frenchWord: 'montre', englishWord: 'watch', category: 'objets_quotidiens' },
  { frenchWord: 'télévision', englishWord: 'television', category: 'objets_quotidiens' },
  { frenchWord: 'radio', englishWord: 'radio', category: 'objets_quotidiens' },
  { frenchWord: 'réfrigérateur', englishWord: 'refrigerator', category: 'objets_quotidiens' },
  { frenchWord: 'four', englishWord: 'oven', category: 'objets_quotidiens' },
  { frenchWord: 'micro-ondes', englishWord: 'microwave', category: 'objets_quotidiens' },
  { frenchWord: 'lave-linge', englishWord: 'washing machine', category: 'objets_quotidiens' },
  { frenchWord: 'sèche-linge', englishWord: 'dryer', category: 'objets_quotidiens' },
  { frenchWord: 'aspirateur', englishWord: 'vacuum cleaner', category: 'objets_quotidiens' },
]

async function importWords() {
  console.log('🚀 Import de 300 mots de vocabulaire...\n')
  console.log('💡 Générés directement, sans API externe\n')
  console.log('🚫 Pas d\'alcool, pas de répétitions inutiles\n')
  
  let total = 0
  let errors = 0
  let skipped = 0
  
  // Vérifier les mots existants
  const existing = await prisma.vocabularyWord.findMany({
    select: { frenchWord: true }
  })
  const existingSet = new Set(existing.map(w => w.frenchWord.toLowerCase()))
  
  console.log(`📊 Mots existants: ${existing.length}\n`)
  
  // Grouper par catégorie pour affichage
  const byCategory: Record<string, WordData[]> = {}
  for (const word of ALL_WORDS) {
    if (!byCategory[word.category]) {
      byCategory[word.category] = []
    }
    byCategory[word.category].push(word)
  }
  
  // Importer chaque mot
  for (const [category, words] of Object.entries(byCategory)) {
    console.log(`📂 Catégorie: ${category} (${words.length} mots)`)
    
    for (const word of words) {
      try {
        // Vérifier si le mot existe déjà
        if (existingSet.has(word.frenchWord.toLowerCase())) {
          skipped++
          continue
        }
        
        await prisma.vocabularyWord.create({
          data: {
            frenchWord: word.frenchWord,
            englishWord: word.englishWord,
            category: word.category,
            imageUrl: null, // Vide pour l'instant
            audioUrl: null, // Vide pour l'instant
          }
        })
        
        total++
        existingSet.add(word.frenchWord.toLowerCase())
        
        if (total % 50 === 0) {
          console.log(`   ✅ ${total} mots importés...`)
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          skipped++
        } else {
          console.error(`   ❌ Erreur pour ${word.frenchWord}:`, error.message)
          errors++
        }
      }
    }
    
    console.log(`   ✅ ${category} terminée\n`)
  }
  
  const finalCount = await prisma.vocabularyWord.count()
  
  console.log(`\n🎉 Import terminé !`)
  console.log(`   Total dans la base: ${finalCount} mots`)
  console.log(`   Nouveaux mots ajoutés: ${total}`)
  console.log(`   Erreurs: ${errors}`)
  console.log(`   Doublons ignorés: ${skipped}`)
  
  await prisma.$disconnect()
}

importWords().catch((error) => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

