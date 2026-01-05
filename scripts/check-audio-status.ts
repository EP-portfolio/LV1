/**
 * Script rapide pour vérifier le statut des fichiers audio
 */

import { prisma } from '../lib/db'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkAudioStatus() {
  console.log('🔍 Vérification du statut des fichiers audio...\n')

  const total = await prisma.socialPhrase.count()
  const withAudioFr = await prisma.socialPhrase.count({
    where: { audioUrlFr: { not: null } }
  })
  const withAudioEn = await prisma.socialPhrase.count({
    where: { audioUrlEn: { not: null } }
  })
  const complete = await prisma.socialPhrase.count({
    where: {
      audioUrlFr: { not: null },
      audioUrlEn: { not: null }
    }
  })

  const missingFr = total - withAudioFr
  const missingEn = total - withAudioEn
  const totalFiles = withAudioFr + withAudioEn
  const expectedFiles = total * 2

  console.log('='.repeat(60))
  console.log('📊 STATUT DES FICHIERS AUDIO')
  console.log('='.repeat(60))
  console.log(`📝 Total de phrases: ${total}`)
  console.log(`\n🇫🇷 Audio Français:`)
  console.log(`   ✅ Présents: ${withAudioFr}`)
  console.log(`   ❌ Manquants: ${missingFr}`)
  console.log(`\n🇬🇧 Audio Anglais:`)
  console.log(`   ✅ Présents: ${withAudioEn}`)
  console.log(`   ❌ Manquants: ${missingEn}`)
  console.log(`\n📈 Statistiques globales:`)
  console.log(`   ✅ Phrases complètes (FR + EN): ${complete}`)
  console.log(`   📦 Fichiers audio totaux: ${totalFiles} / ${expectedFiles}`)
  console.log(`   📊 Taux de complétion: ${((totalFiles / expectedFiles) * 100).toFixed(1)}%`)
  console.log('='.repeat(60) + '\n')

  if (missingFr === 0 && missingEn === 0) {
    console.log('🎉 Tous les fichiers audio sont présents !')
  } else {
    console.log(`⚠️  Il manque encore ${missingFr + missingEn} fichiers audio`)
  }
}

checkAudioStatus()
  .catch(console.error)
  .finally(() => process.exit(0))

