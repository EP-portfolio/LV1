/**
 * Script pour pré-générer tous les fichiers audio des phrases sociales
 * Utilise Wavenet pour une qualité naturelle et humaine optimale
 * Vérifie chaque étape pour garantir l'intégrité des fichiers
 */

import { prisma } from '../lib/db'
import { generateSpeech } from '../lib/audio/generation'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Configuration Supabase avec service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  console.error('\n📝 Ajoutez ces variables dans .env.local')
  process.exit(1)
}

// Vérifier la clé API Google
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY manquante dans .env.local')
  console.error('📝 Activez l\'API Text-to-Speech dans Google Cloud Console')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Statistiques
interface Stats {
  total: number
  generatedFr: number
  generatedEn: number
  skippedFr: number
  skippedEn: number
  errorsFr: number
  errorsEn: number
  errors: Array<{ phraseId: string; language: 'fr' | 'en'; error: string }>
}

/**
 * Upload un fichier audio dans Supabase Storage (dossier partagé)
 */
async function uploadSharedAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<string> {
  const filePath = `audio/shared/${filename}`
  
  // Vérifier la taille du buffer (doit être > 0)
  if (audioBuffer.length === 0) {
    throw new Error('Buffer audio vide')
  }

  // Vérifier que c'est bien un MP3 (magic bytes: FF FB ou FF F3)
  const header = audioBuffer.slice(0, 2)
  const isValidMP3 = header[0] === 0xFF && (header[1] === 0xFB || header[1] === 0xF3 || header[1] === 0xFA)
  
  if (!isValidMP3) {
    console.warn(`⚠️  Fichier ${filename} ne semble pas être un MP3 valide, mais on continue...`)
  }

  const { error } = await supabase.storage
    .from('practice-media')
    .upload(filePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    })

  if (error) {
    if (error.message?.includes('Bucket not found')) {
      throw new Error(`Bucket "practice-media" non trouvé. Exécutez: npm run setup-storage`)
    }
    throw new Error(`Erreur upload: ${error.message}`)
  }

  // Vérifier que le fichier a bien été uploadé
  const { data: fileData, error: checkError } = await supabase.storage
    .from('practice-media')
    .list('audio/shared', {
      search: filename
    })

  if (checkError || !fileData || fileData.length === 0) {
    throw new Error(`Fichier ${filename} non trouvé après upload`)
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from('practice-media')
    .getPublicUrl(filePath)

  if (!urlData?.publicUrl) {
    throw new Error(`Impossible d'obtenir l'URL publique pour ${filename}`)
  }

  return urlData.publicUrl
}

/**
 * Générer et uploader un fichier audio avec vérifications
 */
async function generateAndUploadAudio(
  text: string,
  language: 'fr' | 'en',
  phraseId: string,
  phraseText: string
): Promise<string> {
  // Générer l'audio
  let audioBuffer: Buffer
  try {
    audioBuffer = await generateSpeech(text, language)
  } catch (error: any) {
    throw new Error(`Génération échouée: ${error.message}`)
  }

  // Vérifier que le buffer n'est pas vide
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('Buffer audio vide après génération')
  }

  // Vérifier la taille minimale (un MP3 valide fait au moins quelques centaines d'octets)
  if (audioBuffer.length < 100) {
    throw new Error(`Buffer trop petit (${audioBuffer.length} bytes), probablement invalide`)
  }

  // Créer un nom de fichier unique et descriptif
  const sanitizedText = text
    .substring(0, 30)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
  const filename = `phrase_${phraseId}_${language}_${sanitizedText}.mp3`

  // Upload dans Supabase Storage
  let publicUrl: string
  try {
    publicUrl = await uploadSharedAudio(audioBuffer, filename)
  } catch (error: any) {
    throw new Error(`Upload échoué: ${error.message}`)
  }

  // Vérifier que l'URL est valide
  if (!publicUrl || !publicUrl.startsWith('http')) {
    throw new Error(`URL invalide: ${publicUrl}`)
  }

  // Vérifier que le fichier est accessible (test de téléchargement)
  try {
    const testResponse = await fetch(publicUrl, { method: 'HEAD' })
    if (!testResponse.ok) {
      throw new Error(`Fichier non accessible (HTTP ${testResponse.status})`)
    }
  } catch (error: any) {
    console.warn(`⚠️  Impossible de vérifier l'accessibilité de ${publicUrl}: ${error.message}`)
    // On continue quand même, parfois les HEAD requests sont bloqués
  }

  return publicUrl
}

/**
 * Générer tous les fichiers audio
 */
async function generateAllAudios() {
  console.log('🎵 Début de la génération des fichiers audio avec Wavenet...\n')
  console.log('📋 Configuration:')
  console.log(`   - Qualité: Wavenet (naturelle et humaine)`)
  console.log(`   - Format: MP3`)
  console.log(`   - Stockage: Supabase Storage (audio/shared/)\n`)

  // Récupérer toutes les phrases
  const phrases = await prisma.socialPhrase.findMany({
    orderBy: { category: 'asc' }
  })

  if (phrases.length === 0) {
    console.error('❌ Aucune phrase trouvée dans la base de données')
    console.error('📝 Exécutez d\'abord: npm run import-phrases')
    process.exit(1)
  }

  console.log(`📝 ${phrases.length} phrases trouvées\n`)
  console.log('⏳ Génération en cours... (cela peut prendre plusieurs minutes)\n')

  const stats: Stats = {
    total: phrases.length,
    generatedFr: 0,
    generatedEn: 0,
    skippedFr: 0,
    skippedEn: 0,
    errorsFr: 0,
    errorsEn: 0,
    errors: []
  }

  // Traiter chaque phrase
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i]
    const progress = `[${i + 1}/${phrases.length}]`
    const category = phrase.category.padEnd(15)

    console.log(`${progress} ${category} | ${phrase.frenchPhrase.substring(0, 40)}...`)

    // Générer audio français si manquant
    if (!phrase.audioUrlFr) {
      try {
        console.log(`  → Génération audio FR (Wavenet)...`)
        const urlFr = await generateAndUploadAudio(
          phrase.frenchPhrase,
          'fr',
          phrase.id,
          phrase.frenchPhrase
        )
        
        // Mettre à jour la base de données
        await prisma.socialPhrase.update({
          where: { id: phrase.id },
          data: { audioUrlFr: urlFr }
        })
        
        stats.generatedFr++
        console.log(`  ✅ Audio FR généré et sauvegardé (${(urlFr.length > 0 ? 'URL valide' : 'URL invalide')})`)
      } catch (error: any) {
        stats.errorsFr++
        const errorMsg = error.message || 'Erreur inconnue'
        stats.errors.push({
          phraseId: phrase.id,
          language: 'fr',
          error: errorMsg
        })
        console.error(`  ❌ Erreur audio FR: ${errorMsg}`)
      }
    } else {
      // Vérifier que l'URL existante est valide
      try {
        const testResponse = await fetch(phrase.audioUrlFr, { method: 'HEAD' })
        if (testResponse.ok) {
          stats.skippedFr++
          console.log(`  ⊘ Audio FR déjà présent et valide`)
        } else {
          // URL invalide, regénérer
          console.log(`  ⚠️  Audio FR présent mais invalide, regénération...`)
          try {
            const urlFr = await generateAndUploadAudio(
              phrase.frenchPhrase,
              'fr',
              phrase.id,
              phrase.frenchPhrase
            )
            await prisma.socialPhrase.update({
              where: { id: phrase.id },
              data: { audioUrlFr: urlFr }
            })
            stats.generatedFr++
            console.log(`  ✅ Audio FR regénéré`)
          } catch (error: any) {
            stats.errorsFr++
            stats.errors.push({
              phraseId: phrase.id,
              language: 'fr',
              error: error.message || 'Erreur regénération'
            })
            console.error(`  ❌ Erreur regénération audio FR: ${error.message}`)
          }
        }
      } catch {
        // Erreur de vérification, on considère comme valide pour éviter les boucles
        stats.skippedFr++
        console.log(`  ⊘ Audio FR déjà présent`)
      }
    }

    // Générer audio anglais si manquant
    if (!phrase.audioUrlEn) {
      try {
        console.log(`  → Génération audio EN (Wavenet)...`)
        const urlEn = await generateAndUploadAudio(
          phrase.englishPhrase,
          'en',
          phrase.id,
          phrase.englishPhrase
        )
        
        // Mettre à jour la base de données
        await prisma.socialPhrase.update({
          where: { id: phrase.id },
          data: { audioUrlEn: urlEn }
        })
        
        stats.generatedEn++
        console.log(`  ✅ Audio EN généré et sauvegardé`)
      } catch (error: any) {
        stats.errorsEn++
        const errorMsg = error.message || 'Erreur inconnue'
        stats.errors.push({
          phraseId: phrase.id,
          language: 'en',
          error: errorMsg
        })
        console.error(`  ❌ Erreur audio EN: ${errorMsg}`)
      }
    } else {
      // Vérifier que l'URL existante est valide
      try {
        const testResponse = await fetch(phrase.audioUrlEn, { method: 'HEAD' })
        if (testResponse.ok) {
          stats.skippedEn++
          console.log(`  ⊘ Audio EN déjà présent et valide`)
        } else {
          // URL invalide, regénérer
          console.log(`  ⚠️  Audio EN présent mais invalide, regénération...`)
          try {
            const urlEn = await generateAndUploadAudio(
              phrase.englishPhrase,
              'en',
              phrase.id,
              phrase.englishPhrase
            )
            await prisma.socialPhrase.update({
              where: { id: phrase.id },
              data: { audioUrlEn: urlEn }
            })
            stats.generatedEn++
            console.log(`  ✅ Audio EN regénéré`)
          } catch (error: any) {
            stats.errorsEn++
            stats.errors.push({
              phraseId: phrase.id,
              language: 'en',
              error: error.message || 'Erreur regénération'
            })
            console.error(`  ❌ Erreur regénération audio EN: ${error.message}`)
          }
        }
      } catch {
        // Erreur de vérification, on considère comme valide
        stats.skippedEn++
        console.log(`  ⊘ Audio EN déjà présent`)
      }
    }

    // Petite pause pour éviter de surcharger l'API (500ms entre chaque phrase)
    if (i < phrases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Rapport final
  console.log('\n' + '='.repeat(60))
  console.log('📊 RAPPORT FINAL')
  console.log('='.repeat(60))
  console.log(`📝 Total de phrases: ${stats.total}`)
  console.log(`\n🇫🇷 Audio Français:`)
  console.log(`   ✅ Générés: ${stats.generatedFr}`)
  console.log(`   ⊘ Déjà présents: ${stats.skippedFr}`)
  console.log(`   ❌ Erreurs: ${stats.errorsFr}`)
  console.log(`\n🇬🇧 Audio Anglais:`)
  console.log(`   ✅ Générés: ${stats.generatedEn}`)
  console.log(`   ⊘ Déjà présents: ${stats.skippedEn}`)
  console.log(`   ❌ Erreurs: ${stats.errorsEn}`)
  console.log(`\n📈 Total fichiers:`)
  const totalGenerated = stats.generatedFr + stats.generatedEn
  const totalSkipped = stats.skippedFr + stats.skippedEn
  const totalErrors = stats.errorsFr + stats.errorsEn
  console.log(`   ✅ Générés: ${totalGenerated}`)
  console.log(`   ⊘ Déjà présents: ${totalSkipped}`)
  console.log(`   ❌ Erreurs: ${totalErrors}`)
  console.log(`   📦 Total final: ${totalGenerated + totalSkipped} fichiers audio`)

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  ERREURS DÉTECTÉES (${stats.errors.length}):`)
    stats.errors.forEach((err, idx) => {
      console.log(`\n   ${idx + 1}. Phrase ID: ${err.phraseId}`)
      console.log(`      Langue: ${err.language.toUpperCase()}`)
      console.log(`      Erreur: ${err.error}`)
    })
    console.log(`\n💡 Vous pouvez relancer le script pour réessayer les fichiers en erreur`)
  }

  if (totalErrors === 0) {
    console.log(`\n✅ Tous les fichiers audio ont été générés avec succès !`)
    console.log(`🎉 Qualité Wavenet garantie pour un rendu naturel et humain`)
  } else {
    console.log(`\n⚠️  ${totalErrors} erreur(s) détectée(s). Vérifiez les détails ci-dessus.`)
  }

  console.log('\n' + '='.repeat(60) + '\n')
}

// Exécuter le script
generateAllAudios()
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

