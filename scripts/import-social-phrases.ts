/**
 * Script pour importer directement 340 phrases sociales
 * Générées directement ici, sans API externe
 * 17 catégories × 20 phrases minimum
 */

import { prisma } from '../lib/db'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

interface PhraseData {
  frenchPhrase: string
  englishPhrase: string
  category: string
}

// 340 phrases complètes organisées par catégories
const ALL_PHRASES: PhraseData[] = [
  // ============================================
  // PRÉSENTATION (20 phrases)
  // ============================================
  { frenchPhrase: 'Bonjour, je m\'appelle Marie.', englishPhrase: 'Hello, my name is Marie.', category: 'présentation' },
  { frenchPhrase: 'Enchanté de vous rencontrer.', englishPhrase: 'Nice to meet you.', category: 'présentation' },
  { frenchPhrase: 'Je viens de Paris.', englishPhrase: 'I come from Paris.', category: 'présentation' },
  { frenchPhrase: 'Comment vous appelez-vous ?', englishPhrase: 'What is your name?', category: 'présentation' },
  { frenchPhrase: 'Je suis français.', englishPhrase: 'I am French.', category: 'présentation' },
  { frenchPhrase: 'J\'habite à Lyon.', englishPhrase: 'I live in Lyon.', category: 'présentation' },
  { frenchPhrase: 'J\'ai trente-cinq ans.', englishPhrase: 'I am thirty-five years old.', category: 'présentation' },
  { frenchPhrase: 'Ravi de faire votre connaissance.', englishPhrase: 'Pleased to meet you.', category: 'présentation' },
  { frenchPhrase: 'Que faites-vous dans la vie ?', englishPhrase: 'What do you do for a living?', category: 'présentation' },
  { frenchPhrase: 'Je suis ingénieur.', englishPhrase: 'I am an engineer.', category: 'présentation' },
  { frenchPhrase: 'Voici ma carte de visite.', englishPhrase: 'Here is my business card.', category: 'présentation' },
  { frenchPhrase: 'Puis-je me présenter ?', englishPhrase: 'May I introduce myself?', category: 'présentation' },
  { frenchPhrase: 'Je travaille dans le marketing.', englishPhrase: 'I work in marketing.', category: 'présentation' },
  { frenchPhrase: 'Je suis à la retraite.', englishPhrase: 'I am retired.', category: 'présentation' },
  { frenchPhrase: 'J\'étudie l\'anglais depuis un an.', englishPhrase: 'I have been studying English for a year.', category: 'présentation' },
  { frenchPhrase: 'Parlez-vous français ?', englishPhrase: 'Do you speak French?', category: 'présentation' },
  { frenchPhrase: 'Je suis marié et j\'ai deux enfants.', englishPhrase: 'I am married and have two children.', category: 'présentation' },
  { frenchPhrase: 'C\'est un plaisir de vous rencontrer.', englishPhrase: 'It\'s a pleasure to meet you.', category: 'présentation' },
  { frenchPhrase: 'Je suis célibataire.', englishPhrase: 'I am single.', category: 'présentation' },
  { frenchPhrase: 'Comment allez-vous ?', englishPhrase: 'How are you?', category: 'présentation' },

  // ============================================
  // MÉTÉO (20 phrases)
  // ============================================
  { frenchPhrase: 'Il fait beau aujourd\'hui.', englishPhrase: 'The weather is nice today.', category: 'météo' },
  { frenchPhrase: 'Il pleut beaucoup.', englishPhrase: 'It is raining a lot.', category: 'météo' },
  { frenchPhrase: 'Quel temps fait-il ?', englishPhrase: 'What is the weather like?', category: 'météo' },
  { frenchPhrase: 'Il fait chaud.', englishPhrase: 'It is hot.', category: 'météo' },
  { frenchPhrase: 'Il fait froid.', englishPhrase: 'It is cold.', category: 'météo' },
  { frenchPhrase: 'Il y a du soleil.', englishPhrase: 'It is sunny.', category: 'météo' },
  { frenchPhrase: 'Il neige.', englishPhrase: 'It is snowing.', category: 'météo' },
  { frenchPhrase: 'Il y a du vent.', englishPhrase: 'It is windy.', category: 'météo' },
  { frenchPhrase: 'Le ciel est nuageux.', englishPhrase: 'The sky is cloudy.', category: 'météo' },
  { frenchPhrase: 'Il fait doux aujourd\'hui.', englishPhrase: 'It is mild today.', category: 'météo' },
  { frenchPhrase: 'Quelle température fait-il ?', englishPhrase: 'What is the temperature?', category: 'météo' },
  { frenchPhrase: 'Il fait vingt degrés.', englishPhrase: 'It is twenty degrees.', category: 'météo' },
  { frenchPhrase: 'Le temps est agréable.', englishPhrase: 'The weather is pleasant.', category: 'météo' },
  { frenchPhrase: 'Il y a un orage.', englishPhrase: 'There is a storm.', category: 'météo' },
  { frenchPhrase: 'Il fait humide.', englishPhrase: 'It is humid.', category: 'météo' },
  { frenchPhrase: 'Le soleil brille.', englishPhrase: 'The sun is shining.', category: 'météo' },
  { frenchPhrase: 'Il fait mauvais temps.', englishPhrase: 'The weather is bad.', category: 'météo' },
  { frenchPhrase: 'Demain il fera beau.', englishPhrase: 'Tomorrow it will be nice.', category: 'météo' },
  { frenchPhrase: 'J\'aime ce temps.', englishPhrase: 'I like this weather.', category: 'météo' },
  { frenchPhrase: 'Il fait un temps magnifique.', englishPhrase: 'The weather is beautiful.', category: 'météo' },

  // ============================================
  // DEMANDE D'INFORMATIONS (20 phrases)
  // ============================================
  { frenchPhrase: 'Où se trouve la gare ?', englishPhrase: 'Where is the train station?', category: 'demande_info' },
  { frenchPhrase: 'Quelle heure est-il ?', englishPhrase: 'What time is it?', category: 'demande_info' },
  { frenchPhrase: 'Comment allez-vous ?', englishPhrase: 'How are you?', category: 'demande_info' },
  { frenchPhrase: 'Pouvez-vous m\'aider ?', englishPhrase: 'Can you help me?', category: 'demande_info' },
  { frenchPhrase: 'Qu\'est-ce que c\'est ?', englishPhrase: 'What is this?', category: 'demande_info' },
  { frenchPhrase: 'Combien ça coûte ?', englishPhrase: 'How much does it cost?', category: 'demande_info' },
  { frenchPhrase: 'Quand part le train ?', englishPhrase: 'When does the train leave?', category: 'demande_info' },
  { frenchPhrase: 'Où puis-je trouver un restaurant ?', englishPhrase: 'Where can I find a restaurant?', category: 'demande_info' },
  { frenchPhrase: 'Avez-vous l\'heure ?', englishPhrase: 'Do you have the time?', category: 'demande_info' },
  { frenchPhrase: 'Comment ça fonctionne ?', englishPhrase: 'How does it work?', category: 'demande_info' },
  { frenchPhrase: 'Quel jour sommes-nous ?', englishPhrase: 'What day is it?', category: 'demande_info' },
  { frenchPhrase: 'Où sont les toilettes ?', englishPhrase: 'Where are the restrooms?', category: 'demande_info' },
  { frenchPhrase: 'Pouvez-vous répéter ?', englishPhrase: 'Can you repeat?', category: 'demande_info' },
  { frenchPhrase: 'Qu\'est-ce que cela signifie ?', englishPhrase: 'What does this mean?', category: 'demande_info' },
  { frenchPhrase: 'Comment dit-on cela en anglais ?', englishPhrase: 'How do you say this in English?', category: 'demande_info' },
  { frenchPhrase: 'Avez-vous un plan ?', englishPhrase: 'Do you have a map?', category: 'demande_info' },
  { frenchPhrase: 'Quelle est votre adresse ?', englishPhrase: 'What is your address?', category: 'demande_info' },
  { frenchPhrase: 'Pouvez-vous me donner des informations ?', englishPhrase: 'Can you give me some information?', category: 'demande_info' },
  { frenchPhrase: 'Où est la sortie ?', englishPhrase: 'Where is the exit?', category: 'demande_info' },
  { frenchPhrase: 'Comment puis-je vous contacter ?', englishPhrase: 'How can I contact you?', category: 'demande_info' },

  // ============================================
  // DIRECTIONS (20 phrases)
  // ============================================
  { frenchPhrase: 'Comment aller à la gare ?', englishPhrase: 'How do I get to the train station?', category: 'directions' },
  { frenchPhrase: 'Où est la banque ?', englishPhrase: 'Where is the bank?', category: 'directions' },
  { frenchPhrase: 'C\'est loin d\'ici ?', englishPhrase: 'Is it far from here?', category: 'directions' },
  { frenchPhrase: 'Tournez à droite.', englishPhrase: 'Turn right.', category: 'directions' },
  { frenchPhrase: 'Tournez à gauche.', englishPhrase: 'Turn left.', category: 'directions' },
  { frenchPhrase: 'Allez tout droit.', englishPhrase: 'Go straight ahead.', category: 'directions' },
  { frenchPhrase: 'C\'est à cinq minutes à pied.', englishPhrase: 'It is a five-minute walk.', category: 'directions' },
  { frenchPhrase: 'Prenez la première rue à droite.', englishPhrase: 'Take the first street on the right.', category: 'directions' },
  { frenchPhrase: 'Traversez la place.', englishPhrase: 'Cross the square.', category: 'directions' },
  { frenchPhrase: 'C\'est juste en face.', englishPhrase: 'It is right across.', category: 'directions' },
  { frenchPhrase: 'Vous êtes sur le bon chemin.', englishPhrase: 'You are on the right path.', category: 'directions' },
  { frenchPhrase: 'Continuez tout droit.', englishPhrase: 'Continue straight ahead.', category: 'directions' },
  { frenchPhrase: 'C\'est à côté de la poste.', englishPhrase: 'It is next to the post office.', category: 'directions' },
  { frenchPhrase: 'Je me suis perdu.', englishPhrase: 'I am lost.', category: 'directions' },
  { frenchPhrase: 'Pouvez-vous me montrer sur la carte ?', englishPhrase: 'Can you show me on the map?', category: 'directions' },
  { frenchPhrase: 'C\'est à dix minutes en voiture.', englishPhrase: 'It is a ten-minute drive.', category: 'directions' },
  { frenchPhrase: 'Prenez le métro ligne deux.', englishPhrase: 'Take metro line two.', category: 'directions' },
  { frenchPhrase: 'Descendez à la prochaine station.', englishPhrase: 'Get off at the next station.', category: 'directions' },
  { frenchPhrase: 'C\'est au coin de la rue.', englishPhrase: 'It is on the corner of the street.', category: 'directions' },
  { frenchPhrase: 'Je ne connais pas le chemin.', englishPhrase: 'I don\'t know the way.', category: 'directions' },

  // ============================================
  // RESTAURANT (20 phrases)
  // ============================================
  { frenchPhrase: 'Je voudrais une table pour deux.', englishPhrase: 'I would like a table for two.', category: 'restaurant' },
  { frenchPhrase: 'Qu\'est-ce que vous recommandez ?', englishPhrase: 'What do you recommend?', category: 'restaurant' },
  { frenchPhrase: 'L\'addition, s\'il vous plaît.', englishPhrase: 'The check, please.', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais commander.', englishPhrase: 'I would like to order.', category: 'restaurant' },
  { frenchPhrase: 'Qu\'est-ce que vous avez comme plat du jour ?', englishPhrase: 'What is today\'s special?', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais un café.', englishPhrase: 'I would like a coffee.', category: 'restaurant' },
  { frenchPhrase: 'L\'eau, s\'il vous plaît.', englishPhrase: 'Water, please.', category: 'restaurant' },
  { frenchPhrase: 'C\'est délicieux !', englishPhrase: 'It is delicious!', category: 'restaurant' },
  { frenchPhrase: 'Je suis végétarien.', englishPhrase: 'I am vegetarian.', category: 'restaurant' },
  { frenchPhrase: 'Avez-vous un menu en anglais ?', englishPhrase: 'Do you have a menu in English?', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais réserver une table.', englishPhrase: 'I would like to reserve a table.', category: 'restaurant' },
  { frenchPhrase: 'Qu\'est-ce que c\'est ?', englishPhrase: 'What is this?', category: 'restaurant' },
  { frenchPhrase: 'Je n\'aime pas ça.', englishPhrase: 'I don\'t like this.', category: 'restaurant' },
  { frenchPhrase: 'C\'est trop épicé.', englishPhrase: 'It is too spicy.', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais un dessert.', englishPhrase: 'I would like a dessert.', category: 'restaurant' },
  { frenchPhrase: 'Pouvez-vous m\'apporter la carte ?', englishPhrase: 'Can you bring me the menu?', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais payer.', englishPhrase: 'I would like to pay.', category: 'restaurant' },
  { frenchPhrase: 'Gardez la monnaie.', englishPhrase: 'Keep the change.', category: 'restaurant' },
  { frenchPhrase: 'C\'était excellent.', englishPhrase: 'It was excellent.', category: 'restaurant' },
  { frenchPhrase: 'Je voudrais un verre de vin.', englishPhrase: 'I would like a glass of wine.', category: 'restaurant' },

  // ============================================
  // SHOPPING (20 phrases)
  // ============================================
  { frenchPhrase: 'Combien ça coûte ?', englishPhrase: 'How much does it cost?', category: 'shopping' },
  { frenchPhrase: 'Avez-vous ce modèle en bleu ?', englishPhrase: 'Do you have this model in blue?', category: 'shopping' },
  { frenchPhrase: 'Je cherche un cadeau.', englishPhrase: 'I am looking for a gift.', category: 'shopping' },
  { frenchPhrase: 'Où sont les cabines d\'essayage ?', englishPhrase: 'Where are the fitting rooms?', category: 'shopping' },
  { frenchPhrase: 'Je voudrais essayer cette taille.', englishPhrase: 'I would like to try this size.', category: 'shopping' },
  { frenchPhrase: 'C\'est trop cher.', englishPhrase: 'It is too expensive.', category: 'shopping' },
  { frenchPhrase: 'Avez-vous une réduction ?', englishPhrase: 'Do you have a discount?', category: 'shopping' },
  { frenchPhrase: 'Je vais le prendre.', englishPhrase: 'I will take it.', category: 'shopping' },
  { frenchPhrase: 'Acceptez-vous les cartes de crédit ?', englishPhrase: 'Do you accept credit cards?', category: 'shopping' },
  { frenchPhrase: 'Je cherche quelque chose de moins cher.', englishPhrase: 'I am looking for something cheaper.', category: 'shopping' },
  { frenchPhrase: 'Avez-vous d\'autres couleurs ?', englishPhrase: 'Do you have other colors?', category: 'shopping' },
  { frenchPhrase: 'Je voudrais un remboursement.', englishPhrase: 'I would like a refund.', category: 'shopping' },
  { frenchPhrase: 'Où puis-je payer ?', englishPhrase: 'Where can I pay?', category: 'shopping' },
  { frenchPhrase: 'C\'est pour un anniversaire.', englishPhrase: 'It is for a birthday.', category: 'shopping' },
  { frenchPhrase: 'Avez-vous une taille plus grande ?', englishPhrase: 'Do you have a larger size?', category: 'shopping' },
  { frenchPhrase: 'Je voudrais voir autre chose.', englishPhrase: 'I would like to see something else.', category: 'shopping' },
  { frenchPhrase: 'C\'est parfait.', englishPhrase: 'It is perfect.', category: 'shopping' },
  { frenchPhrase: 'Je vais réfléchir.', englishPhrase: 'I will think about it.', category: 'shopping' },
  { frenchPhrase: 'Pouvez-vous me faire un paquet cadeau ?', englishPhrase: 'Can you gift wrap it?', category: 'shopping' },
  { frenchPhrase: 'Où est la caisse ?', englishPhrase: 'Where is the checkout?', category: 'shopping' },

  // ============================================
  // TRANSPORT (20 phrases)
  // ============================================
  { frenchPhrase: 'Un billet pour Paris, s\'il vous plaît.', englishPhrase: 'A ticket to Paris, please.', category: 'transport' },
  { frenchPhrase: 'Quel est le prochain train ?', englishPhrase: 'What is the next train?', category: 'transport' },
  { frenchPhrase: 'Où est l\'arrêt de bus ?', englishPhrase: 'Where is the bus stop?', category: 'transport' },
  { frenchPhrase: 'À quelle heure part le train ?', englishPhrase: 'What time does the train leave?', category: 'transport' },
  { frenchPhrase: 'Je voudrais réserver une place.', englishPhrase: 'I would like to reserve a seat.', category: 'transport' },
  { frenchPhrase: 'Où est le quai numéro trois ?', englishPhrase: 'Where is platform number three?', category: 'transport' },
  { frenchPhrase: 'Le train est en retard.', englishPhrase: 'The train is late.', category: 'transport' },
  { frenchPhrase: 'Je voudrais un aller-retour.', englishPhrase: 'I would like a round trip ticket.', category: 'transport' },
  { frenchPhrase: 'Combien coûte un billet ?', englishPhrase: 'How much does a ticket cost?', category: 'transport' },
  { frenchPhrase: 'Où puis-je prendre un taxi ?', englishPhrase: 'Where can I take a taxi?', category: 'transport' },
  { frenchPhrase: 'Je voudrais aller à l\'aéroport.', englishPhrase: 'I would like to go to the airport.', category: 'transport' },
  { frenchPhrase: 'Quelle ligne de métro dois-je prendre ?', englishPhrase: 'Which metro line should I take?', category: 'transport' },
  { frenchPhrase: 'Le bus est plein.', englishPhrase: 'The bus is full.', category: 'transport' },
  { frenchPhrase: 'Je voudrais louer une voiture.', englishPhrase: 'I would like to rent a car.', category: 'transport' },
  { frenchPhrase: 'Où puis-je garer ma voiture ?', englishPhrase: 'Where can I park my car?', category: 'transport' },
  { frenchPhrase: 'Le vol est annulé.', englishPhrase: 'The flight is cancelled.', category: 'transport' },
  { frenchPhrase: 'Je voudrais enregistrer mes bagages.', englishPhrase: 'I would like to check my luggage.', category: 'transport' },
  { frenchPhrase: 'Où est la gare routière ?', englishPhrase: 'Where is the bus station?', category: 'transport' },
  { frenchPhrase: 'Je voudrais un billet première classe.', englishPhrase: 'I would like a first class ticket.', category: 'transport' },
  { frenchPhrase: 'Le métro arrive dans cinq minutes.', englishPhrase: 'The metro arrives in five minutes.', category: 'transport' },

  // ============================================
  // TRAVAIL (20 phrases)
  // ============================================
  { frenchPhrase: 'Je travaille dans une entreprise.', englishPhrase: 'I work in a company.', category: 'travail' },
  { frenchPhrase: 'Quel est votre métier ?', englishPhrase: 'What is your profession?', category: 'travail' },
  { frenchPhrase: 'J\'ai une réunion cet après-midi.', englishPhrase: 'I have a meeting this afternoon.', category: 'travail' },
  { frenchPhrase: 'Je travaille de neuf heures à dix-huit heures.', englishPhrase: 'I work from nine to six.', category: 'travail' },
  { frenchPhrase: 'Mon bureau est au centre-ville.', englishPhrase: 'My office is downtown.', category: 'travail' },
  { frenchPhrase: 'Je suis en congé cette semaine.', englishPhrase: 'I am on vacation this week.', category: 'travail' },
  { frenchPhrase: 'J\'ai beaucoup de travail.', englishPhrase: 'I have a lot of work.', category: 'travail' },
  { frenchPhrase: 'Mon patron est très sympa.', englishPhrase: 'My boss is very nice.', category: 'travail' },
  { frenchPhrase: 'Je travaille dans le marketing.', englishPhrase: 'I work in marketing.', category: 'travail' },
  { frenchPhrase: 'J\'ai un rendez-vous avec un client.', englishPhrase: 'I have an appointment with a client.', category: 'travail' },
  { frenchPhrase: 'Je suis à la recherche d\'un emploi.', englishPhrase: 'I am looking for a job.', category: 'travail' },
  { frenchPhrase: 'Mon travail est intéressant.', englishPhrase: 'My work is interesting.', category: 'travail' },
  { frenchPhrase: 'Je travaille à domicile.', englishPhrase: 'I work from home.', category: 'travail' },
  { frenchPhrase: 'J\'ai fini mon travail.', englishPhrase: 'I finished my work.', category: 'travail' },
  { frenchPhrase: 'Je vais au bureau tous les jours.', englishPhrase: 'I go to the office every day.', category: 'travail' },
  { frenchPhrase: 'Mon collègue est malade.', englishPhrase: 'My colleague is sick.', category: 'travail' },
  { frenchPhrase: 'J\'ai une présentation demain.', englishPhrase: 'I have a presentation tomorrow.', category: 'travail' },
  { frenchPhrase: 'Je travaille dans une équipe.', englishPhrase: 'I work in a team.', category: 'travail' },
  { frenchPhrase: 'Mon salaire est correct.', englishPhrase: 'My salary is decent.', category: 'travail' },
  { frenchPhrase: 'Je suis satisfait de mon travail.', englishPhrase: 'I am satisfied with my work.', category: 'travail' },

  // ============================================
  // FAMILLE (20 phrases)
  // ============================================
  { frenchPhrase: 'J\'ai deux enfants.', englishPhrase: 'I have two children.', category: 'famille' },
  { frenchPhrase: 'Ma sœur habite à Lyon.', englishPhrase: 'My sister lives in Lyon.', category: 'famille' },
  { frenchPhrase: 'Comment va votre famille ?', englishPhrase: 'How is your family?', category: 'famille' },
  { frenchPhrase: 'Je suis marié.', englishPhrase: 'I am married.', category: 'famille' },
  { frenchPhrase: 'Mon fils a dix ans.', englishPhrase: 'My son is ten years old.', category: 'famille' },
  { frenchPhrase: 'Ma fille étudie à l\'université.', englishPhrase: 'My daughter studies at university.', category: 'famille' },
  { frenchPhrase: 'Je vis avec ma famille.', englishPhrase: 'I live with my family.', category: 'famille' },
  { frenchPhrase: 'Mon père est retraité.', englishPhrase: 'My father is retired.', category: 'famille' },
  { frenchPhrase: 'Ma mère est professeur.', englishPhrase: 'My mother is a teacher.', category: 'famille' },
  { frenchPhrase: 'J\'ai un frère et une sœur.', englishPhrase: 'I have a brother and a sister.', category: 'famille' },
  { frenchPhrase: 'Mes parents habitent à la campagne.', englishPhrase: 'My parents live in the countryside.', category: 'famille' },
  { frenchPhrase: 'Je vais voir mes grands-parents ce week-end.', englishPhrase: 'I am going to see my grandparents this weekend.', category: 'famille' },
  { frenchPhrase: 'Mon oncle est médecin.', englishPhrase: 'My uncle is a doctor.', category: 'famille' },
  { frenchPhrase: 'J\'ai trois neveux.', englishPhrase: 'I have three nephews.', category: 'famille' },
  { frenchPhrase: 'Ma tante habite en Espagne.', englishPhrase: 'My aunt lives in Spain.', category: 'famille' },
  { frenchPhrase: 'Je suis célibataire.', englishPhrase: 'I am single.', category: 'famille' },
  { frenchPhrase: 'Mon mari travaille dans la finance.', englishPhrase: 'My husband works in finance.', category: 'famille' },
  { frenchPhrase: 'Ma femme est architecte.', englishPhrase: 'My wife is an architect.', category: 'famille' },
  { frenchPhrase: 'Nous avons un chien et un chat.', englishPhrase: 'We have a dog and a cat.', category: 'famille' },
  { frenchPhrase: 'Ma famille est très importante pour moi.', englishPhrase: 'My family is very important to me.', category: 'famille' },

  // ============================================
  // LOISIRS (20 phrases)
  // ============================================
  { frenchPhrase: 'J\'aime lire et voyager.', englishPhrase: 'I like reading and traveling.', category: 'loisirs' },
  { frenchPhrase: 'Que faites-vous le week-end ?', englishPhrase: 'What do you do on weekends?', category: 'loisirs' },
  { frenchPhrase: 'Je fais du sport régulièrement.', englishPhrase: 'I exercise regularly.', category: 'loisirs' },
  { frenchPhrase: 'J\'aime regarder des films.', englishPhrase: 'I like watching movies.', category: 'loisirs' },
  { frenchPhrase: 'Je joue de la guitare.', englishPhrase: 'I play the guitar.', category: 'loisirs' },
  { frenchPhrase: 'Mon hobby est la photographie.', englishPhrase: 'My hobby is photography.', category: 'loisirs' },
  { frenchPhrase: 'Je vais au cinéma ce soir.', englishPhrase: 'I am going to the cinema tonight.', category: 'loisirs' },
  { frenchPhrase: 'J\'aime faire du jardinage.', englishPhrase: 'I like gardening.', category: 'loisirs' },
  { frenchPhrase: 'Je fais de la randonnée le dimanche.', englishPhrase: 'I go hiking on Sundays.', category: 'loisirs' },
  { frenchPhrase: 'Je collectionne les timbres.', englishPhrase: 'I collect stamps.', category: 'loisirs' },
  { frenchPhrase: 'J\'aime cuisiner.', englishPhrase: 'I like cooking.', category: 'loisirs' },
  { frenchPhrase: 'Je fais du vélo tous les matins.', englishPhrase: 'I ride my bike every morning.', category: 'loisirs' },
  { frenchPhrase: 'Je vais à la piscine deux fois par semaine.', englishPhrase: 'I go to the pool twice a week.', category: 'loisirs' },
  { frenchPhrase: 'J\'aime écouter de la musique.', englishPhrase: 'I like listening to music.', category: 'loisirs' },
  { frenchPhrase: 'Je joue au tennis.', englishPhrase: 'I play tennis.', category: 'loisirs' },
  { frenchPhrase: 'Mon passe-temps favori est la lecture.', englishPhrase: 'My favorite pastime is reading.', category: 'loisirs' },
  { frenchPhrase: 'Je fais du yoga pour me détendre.', englishPhrase: 'I do yoga to relax.', category: 'loisirs' },
  { frenchPhrase: 'J\'aime aller au théâtre.', englishPhrase: 'I like going to the theater.', category: 'loisirs' },
  { frenchPhrase: 'Je fais de la peinture le week-end.', englishPhrase: 'I paint on weekends.', category: 'loisirs' },
  { frenchPhrase: 'Je vais à la plage en été.', englishPhrase: 'I go to the beach in summer.', category: 'loisirs' },

  // ============================================
  // SANTÉ (20 phrases)
  // ============================================
  { frenchPhrase: 'Je ne me sens pas bien.', englishPhrase: 'I don\'t feel well.', category: 'santé' },
  { frenchPhrase: 'Où est la pharmacie ?', englishPhrase: 'Where is the pharmacy?', category: 'santé' },
  { frenchPhrase: 'J\'ai mal à la tête.', englishPhrase: 'I have a headache.', category: 'santé' },
  { frenchPhrase: 'Je dois prendre rendez-vous chez le médecin.', englishPhrase: 'I need to make an appointment with the doctor.', category: 'santé' },
  { frenchPhrase: 'J\'ai de la fièvre.', englishPhrase: 'I have a fever.', category: 'santé' },
  { frenchPhrase: 'Je tousse beaucoup.', englishPhrase: 'I cough a lot.', category: 'santé' },
  { frenchPhrase: 'J\'ai mal au ventre.', englishPhrase: 'I have a stomach ache.', category: 'santé' },
  { frenchPhrase: 'Je suis allergique aux noix.', englishPhrase: 'I am allergic to nuts.', category: 'santé' },
  { frenchPhrase: 'Je dois prendre mes médicaments.', englishPhrase: 'I need to take my medication.', category: 'santé' },
  { frenchPhrase: 'Je me sens mieux maintenant.', englishPhrase: 'I feel better now.', category: 'santé' },
  { frenchPhrase: 'J\'ai besoin d\'un dentiste.', englishPhrase: 'I need a dentist.', category: 'santé' },
  { frenchPhrase: 'J\'ai mal aux dents.', englishPhrase: 'I have a toothache.', category: 'santé' },
  { frenchPhrase: 'Je vais mieux.', englishPhrase: 'I am getting better.', category: 'santé' },
  { frenchPhrase: 'Je suis en bonne santé.', englishPhrase: 'I am in good health.', category: 'santé' },
  { frenchPhrase: 'Je fais attention à mon alimentation.', englishPhrase: 'I watch my diet.', category: 'santé' },
  { frenchPhrase: 'Je fais du sport pour rester en forme.', englishPhrase: 'I exercise to stay in shape.', category: 'santé' },
  { frenchPhrase: 'J\'ai besoin de repos.', englishPhrase: 'I need rest.', category: 'santé' },
  { frenchPhrase: 'Je vais à l\'hôpital.', englishPhrase: 'I am going to the hospital.', category: 'santé' },
  { frenchPhrase: 'Je me suis blessé.', englishPhrase: 'I hurt myself.', category: 'santé' },
  { frenchPhrase: 'Je dois faire un bilan de santé.', englishPhrase: 'I need to have a health check-up.', category: 'santé' },

  // ============================================
  // VOYAGE (20 phrases)
  // ============================================
  { frenchPhrase: 'Je vais en vacances en Espagne.', englishPhrase: 'I am going on vacation to Spain.', category: 'voyage' },
  { frenchPhrase: 'Avez-vous déjà visité Londres ?', englishPhrase: 'Have you ever visited London?', category: 'voyage' },
  { frenchPhrase: 'Quel est votre pays préféré ?', englishPhrase: 'What is your favorite country?', category: 'voyage' },
  { frenchPhrase: 'J\'adore voyager.', englishPhrase: 'I love traveling.', category: 'voyage' },
  { frenchPhrase: 'Je vais à l\'étranger ce mois-ci.', englishPhrase: 'I am going abroad this month.', category: 'voyage' },
  { frenchPhrase: 'Avez-vous votre passeport ?', englishPhrase: 'Do you have your passport?', category: 'voyage' },
  { frenchPhrase: 'Je vais réserver un hôtel.', englishPhrase: 'I am going to book a hotel.', category: 'voyage' },
  { frenchPhrase: 'J\'ai visité beaucoup de pays.', englishPhrase: 'I have visited many countries.', category: 'voyage' },
  { frenchPhrase: 'Je vais faire mes valises.', englishPhrase: 'I am going to pack my bags.', category: 'voyage' },
  { frenchPhrase: 'Quel est le meilleur moment pour visiter ?', englishPhrase: 'What is the best time to visit?', category: 'voyage' },
  { frenchPhrase: 'Je vais prendre l\'avion.', englishPhrase: 'I am going to take the plane.', category: 'voyage' },
  { frenchPhrase: 'J\'aime découvrir de nouvelles cultures.', englishPhrase: 'I like discovering new cultures.', category: 'voyage' },
  { frenchPhrase: 'Je vais faire un voyage organisé.', englishPhrase: 'I am going on a package tour.', category: 'voyage' },
  { frenchPhrase: 'J\'ai besoin d\'un visa.', englishPhrase: 'I need a visa.', category: 'voyage' },
  { frenchPhrase: 'Je vais louer une voiture sur place.', englishPhrase: 'I am going to rent a car there.', category: 'voyage' },
  { frenchPhrase: 'J\'ai réservé une chambre d\'hôtel.', englishPhrase: 'I booked a hotel room.', category: 'voyage' },
  { frenchPhrase: 'Je vais prendre des photos.', englishPhrase: 'I am going to take pictures.', category: 'voyage' },
  { frenchPhrase: 'J\'aime les voyages en train.', englishPhrase: 'I like train trips.', category: 'voyage' },
  { frenchPhrase: 'Je vais visiter les monuments.', englishPhrase: 'I am going to visit the monuments.', category: 'voyage' },
  { frenchPhrase: 'C\'était un voyage magnifique.', englishPhrase: 'It was a wonderful trip.', category: 'voyage' },

  // ============================================
  // INVITATION (20 phrases)
  // ============================================
  { frenchPhrase: 'Voulez-vous venir dîner ?', englishPhrase: 'Would you like to come for dinner?', category: 'invitation' },
  { frenchPhrase: 'On se voit demain ?', englishPhrase: 'Shall we meet tomorrow?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite à mon anniversaire.', englishPhrase: 'I invite you to my birthday.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous prendre un café ?', englishPhrase: 'Would you like to have a coffee?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite au cinéma.', englishPhrase: 'I invite you to the cinema.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous venir chez moi ?', englishPhrase: 'Would you like to come to my place?', category: 'invitation' },
  { frenchPhrase: 'On se retrouve à huit heures ?', englishPhrase: 'Shall we meet at eight o\'clock?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite à une fête.', englishPhrase: 'I invite you to a party.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous venir avec nous ?', englishPhrase: 'Would you like to come with us?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite au restaurant.', englishPhrase: 'I invite you to the restaurant.', category: 'invitation' },
  { frenchPhrase: 'On fait quelque chose ce week-end ?', englishPhrase: 'Shall we do something this weekend?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite à mon mariage.', englishPhrase: 'I invite you to my wedding.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous venir à la plage ?', englishPhrase: 'Would you like to come to the beach?', category: 'invitation' },
  { frenchPhrase: 'On se voit ce soir ?', englishPhrase: 'Shall we meet tonight?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite à un concert.', englishPhrase: 'I invite you to a concert.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous venir faire une promenade ?', englishPhrase: 'Would you like to come for a walk?', category: 'invitation' },
  { frenchPhrase: 'On se retrouve au parc ?', englishPhrase: 'Shall we meet at the park?', category: 'invitation' },
  { frenchPhrase: 'Je vous invite à déjeuner.', englishPhrase: 'I invite you to lunch.', category: 'invitation' },
  { frenchPhrase: 'Voulez-vous venir à la fête ?', englishPhrase: 'Would you like to come to the party?', category: 'invitation' },
  { frenchPhrase: 'On se voit samedi ?', englishPhrase: 'Shall we meet on Saturday?', category: 'invitation' },

  // ============================================
  // REMERCIEMENT (20 phrases)
  // ============================================
  { frenchPhrase: 'Merci beaucoup !', englishPhrase: 'Thank you very much!', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie de votre aide.', englishPhrase: 'Thank you for your help.', category: 'remerciement' },
  { frenchPhrase: 'C\'est très gentil de votre part.', englishPhrase: 'That is very kind of you.', category: 'remerciement' },
  { frenchPhrase: 'Merci pour tout.', englishPhrase: 'Thanks for everything.', category: 'remerciement' },
  { frenchPhrase: 'Je vous suis très reconnaissant.', englishPhrase: 'I am very grateful to you.', category: 'remerciement' },
  { frenchPhrase: 'Merci de votre patience.', englishPhrase: 'Thank you for your patience.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie infiniment.', englishPhrase: 'I thank you infinitely.', category: 'remerciement' },
  { frenchPhrase: 'Merci pour votre temps.', englishPhrase: 'Thank you for your time.', category: 'remerciement' },
  { frenchPhrase: 'C\'est très aimable.', englishPhrase: 'That is very kind.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie de m\'avoir aidé.', englishPhrase: 'Thank you for helping me.', category: 'remerciement' },
  { frenchPhrase: 'Merci pour votre gentillesse.', englishPhrase: 'Thank you for your kindness.', category: 'remerciement' },
  { frenchPhrase: 'Je vous dois beaucoup.', englishPhrase: 'I owe you a lot.', category: 'remerciement' },
  { frenchPhrase: 'Merci de votre compréhension.', englishPhrase: 'Thank you for your understanding.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie chaleureusement.', englishPhrase: 'I thank you warmly.', category: 'remerciement' },
  { frenchPhrase: 'Merci pour ce cadeau.', englishPhrase: 'Thank you for this gift.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie de votre hospitalité.', englishPhrase: 'Thank you for your hospitality.', category: 'remerciement' },
  { frenchPhrase: 'Merci pour votre soutien.', englishPhrase: 'Thank you for your support.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie sincèrement.', englishPhrase: 'I sincerely thank you.', category: 'remerciement' },
  { frenchPhrase: 'Merci de m\'avoir écouté.', englishPhrase: 'Thank you for listening to me.', category: 'remerciement' },
  { frenchPhrase: 'Je vous remercie de tout cœur.', englishPhrase: 'I thank you from the bottom of my heart.', category: 'remerciement' },

  // ============================================
  // EXCUSE (20 phrases)
  // ============================================
  { frenchPhrase: 'Je suis désolé pour le retard.', englishPhrase: 'I am sorry for being late.', category: 'excuse' },
  { frenchPhrase: 'Excusez-moi, je ne comprends pas.', englishPhrase: 'Excuse me, I don\'t understand.', category: 'excuse' },
  { frenchPhrase: 'Pardon, pouvez-vous répéter ?', englishPhrase: 'Sorry, can you repeat?', category: 'excuse' },
  { frenchPhrase: 'Je m\'excuse pour l\'erreur.', englishPhrase: 'I apologize for the mistake.', category: 'excuse' },
  { frenchPhrase: 'Pardon de vous déranger.', englishPhrase: 'Sorry to bother you.', category: 'excuse' },
  { frenchPhrase: 'Je suis désolé, je ne peux pas venir.', englishPhrase: 'I am sorry, I cannot come.', category: 'excuse' },
  { frenchPhrase: 'Excusez-moi pour l\'inconvénient.', englishPhrase: 'Excuse me for the inconvenience.', category: 'excuse' },
  { frenchPhrase: 'Je m\'excuse de vous avoir fait attendre.', englishPhrase: 'I apologize for making you wait.', category: 'excuse' },
  { frenchPhrase: 'Pardon, je me suis trompé.', englishPhrase: 'Sorry, I made a mistake.', category: 'excuse' },
  { frenchPhrase: 'Je suis désolé pour la confusion.', englishPhrase: 'I am sorry for the confusion.', category: 'excuse' },
  { frenchPhrase: 'Excusez-moi, je dois partir.', englishPhrase: 'Excuse me, I have to leave.', category: 'excuse' },
  { frenchPhrase: 'Pardon pour le bruit.', englishPhrase: 'Sorry for the noise.', category: 'excuse' },
  { frenchPhrase: 'Je m\'excuse sincèrement.', englishPhrase: 'I sincerely apologize.', category: 'excuse' },
  { frenchPhrase: 'Pardon, je n\'ai pas entendu.', englishPhrase: 'Sorry, I didn\'t hear.', category: 'excuse' },
  { frenchPhrase: 'Je suis désolé pour ce qui s\'est passé.', englishPhrase: 'I am sorry for what happened.', category: 'excuse' },
  { frenchPhrase: 'Excusez-moi, je suis pressé.', englishPhrase: 'Excuse me, I am in a hurry.', category: 'excuse' },
  { frenchPhrase: 'Pardon, je ne savais pas.', englishPhrase: 'Sorry, I didn\'t know.', category: 'excuse' },
  { frenchPhrase: 'Je m\'excuse pour mon comportement.', englishPhrase: 'I apologize for my behavior.', category: 'excuse' },
  { frenchPhrase: 'Pardon, pouvez-vous m\'excuser ?', englishPhrase: 'Sorry, can you excuse me?', category: 'excuse' },
  { frenchPhrase: 'Je suis vraiment désolé.', englishPhrase: 'I am really sorry.', category: 'excuse' },

  // ============================================
  // OPINION (20 phrases)
  // ============================================
  { frenchPhrase: 'Je pense que c\'est une bonne idée.', englishPhrase: 'I think it is a good idea.', category: 'opinion' },
  { frenchPhrase: 'À mon avis, c\'est intéressant.', englishPhrase: 'In my opinion, it is interesting.', category: 'opinion' },
  { frenchPhrase: 'Je crois que vous avez raison.', englishPhrase: 'I believe you are right.', category: 'opinion' },
  { frenchPhrase: 'Je trouve que c\'est difficile.', englishPhrase: 'I find it difficult.', category: 'opinion' },
  { frenchPhrase: 'Selon moi, c\'est important.', englishPhrase: 'According to me, it is important.', category: 'opinion' },
  { frenchPhrase: 'Je pense que nous devrions essayer.', englishPhrase: 'I think we should try.', category: 'opinion' },
  { frenchPhrase: 'À mon avis, c\'est mieux ainsi.', englishPhrase: 'In my opinion, it is better this way.', category: 'opinion' },
  { frenchPhrase: 'Je crois que c\'est possible.', englishPhrase: 'I believe it is possible.', category: 'opinion' },
  { frenchPhrase: 'Je trouve cela fascinant.', englishPhrase: 'I find this fascinating.', category: 'opinion' },
  { frenchPhrase: 'Selon moi, il faut agir.', englishPhrase: 'According to me, we need to act.', category: 'opinion' },
  { frenchPhrase: 'Je pense que c\'est trop tôt.', englishPhrase: 'I think it is too early.', category: 'opinion' },
  { frenchPhrase: 'À mon avis, c\'est une erreur.', englishPhrase: 'In my opinion, it is a mistake.', category: 'opinion' },
  { frenchPhrase: 'Je crois que nous avons le temps.', englishPhrase: 'I believe we have time.', category: 'opinion' },
  { frenchPhrase: 'Je trouve que c\'est compliqué.', englishPhrase: 'I find it complicated.', category: 'opinion' },
  { frenchPhrase: 'Selon moi, c\'est la meilleure solution.', englishPhrase: 'According to me, it is the best solution.', category: 'opinion' },
  { frenchPhrase: 'Je pense que nous devons réfléchir.', englishPhrase: 'I think we need to think.', category: 'opinion' },
  { frenchPhrase: 'À mon avis, c\'est nécessaire.', englishPhrase: 'In my opinion, it is necessary.', category: 'opinion' },
  { frenchPhrase: 'Je crois que c\'est une bonne chose.', englishPhrase: 'I believe it is a good thing.', category: 'opinion' },
  { frenchPhrase: 'Je trouve cela surprenant.', englishPhrase: 'I find this surprising.', category: 'opinion' },
  { frenchPhrase: 'Selon moi, c\'est évident.', englishPhrase: 'According to me, it is obvious.', category: 'opinion' },

  // ============================================
  // ACCORD/DÉSACCORD (20 phrases)
  // ============================================
  { frenchPhrase: 'Je suis d\'accord avec vous.', englishPhrase: 'I agree with you.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne suis pas sûr de cela.', englishPhrase: 'I am not sure about that.', category: 'accord_désaccord' },
  { frenchPhrase: 'C\'est une bonne question.', englishPhrase: 'That is a good question.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je suis tout à fait d\'accord.', englishPhrase: 'I completely agree.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne suis pas d\'accord.', englishPhrase: 'I don\'t agree.', category: 'accord_désaccord' },
  { frenchPhrase: 'C\'est exactement ça.', englishPhrase: 'That is exactly it.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je pense que oui.', englishPhrase: 'I think so.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je pense que non.', englishPhrase: 'I don\'t think so.', category: 'accord_désaccord' },
  { frenchPhrase: 'C\'est vrai.', englishPhrase: 'That is true.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne pense pas.', englishPhrase: 'I don\'t think so.', category: 'accord_désaccord' },
  { frenchPhrase: 'Absolument !', englishPhrase: 'Absolutely!', category: 'accord_désaccord' },
  { frenchPhrase: 'Pas vraiment.', englishPhrase: 'Not really.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je suis de votre avis.', englishPhrase: 'I share your opinion.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne suis pas convaincu.', englishPhrase: 'I am not convinced.', category: 'accord_désaccord' },
  { frenchPhrase: 'C\'est correct.', englishPhrase: 'That is correct.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne crois pas.', englishPhrase: 'I don\'t believe so.', category: 'accord_désaccord' },
  { frenchPhrase: 'Exactement !', englishPhrase: 'Exactly!', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne suis pas certain.', englishPhrase: 'I am not certain.', category: 'accord_désaccord' },
  { frenchPhrase: 'C\'est bien ça.', englishPhrase: 'That is right.', category: 'accord_désaccord' },
  { frenchPhrase: 'Je ne peux pas dire.', englishPhrase: 'I can\'t say.', category: 'accord_désaccord' }
]

async function importPhrases() {
  console.log('🚀 Import de 340 phrases sociales...\n')
  console.log('💡 Générées directement, sans API externe\n')

  let total = 0
  let errors = 0
  let skipped = 0

  const existing = await prisma.socialPhrase.findMany({
    select: { frenchPhrase: true }
  })
  const existingSet = new Set(existing.map(p => p.frenchPhrase.toLowerCase()))

  console.log(`📊 Phrases existantes: ${existing.length}\n`)

  const byCategory: Record<string, PhraseData[]> = {}
  for (const phrase of ALL_PHRASES) {
    if (!byCategory[phrase.category]) {
      byCategory[phrase.category] = []
    }
    byCategory[phrase.category].push(phrase)
  }

  for (const [category, phrases] of Object.entries(byCategory)) {
    console.log(`📂 Catégorie: ${category} (${phrases.length} phrases)`)
    for (const phrase of phrases) {
      if (existingSet.has(phrase.frenchPhrase.toLowerCase())) {
        skipped++
        continue
      }
      try {
        await prisma.socialPhrase.create({
          data: {
            frenchPhrase: phrase.frenchPhrase,
            englishPhrase: phrase.englishPhrase,
            category: phrase.category,
            audioUrlFr: null,
            audioUrlEn: null,
          }
        })
        total++
      } catch (error: any) {
        if (error.code === 'P2002') {
          skipped++
        } else {
          console.error(`   ❌ Erreur pour ${phrase.frenchPhrase}:`, error.message)
          errors++
        }
      }
    }
    console.log(`   ✅ ${category} terminée`)
  }

  console.log(`\n🎉 Import terminé !`)
  console.log(`   Total dans la base: ${existing.length + total}`)
  console.log(`   Nouvelles phrases ajoutées: ${total}`)
  console.log(`   Erreurs: ${errors}`)
  console.log(`   Doublons ignorés: ${skipped}`)

  await prisma.$disconnect()
}

importPhrases().catch(console.error)

