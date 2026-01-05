/**
 * Script de diagnostic pour l'API Google Text-to-Speech
 * Teste la configuration et identifie les problèmes
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

const results: TestResult[] = []

function addResult(name: string, status: 'success' | 'error' | 'warning', message: string, details?: any) {
  results.push({ name, status, message, details })
  const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️'
  console.log(`${icon} ${name}: ${message}`)
  if (details) {
    console.log(`   Détails:`, details)
  }
}

async function testTTSAPI() {
  console.log('🔍 Diagnostic de l\'API Google Text-to-Speech\n')
  console.log('='.repeat(60) + '\n')

  // Test 1: Vérifier la présence de la clé API
  console.log('📋 Test 1: Vérification de la clé API...')
  const apiKey = process.env.GOOGLE_API_KEY
  
  if (!apiKey) {
    addResult(
      'Clé API',
      'error',
      'GOOGLE_API_KEY non trouvée dans .env.local'
    )
    console.log('\n' + '='.repeat(60))
    console.log('📊 BILAN FINAL')
    console.log('='.repeat(60))
    results.forEach(r => {
      const icon = r.status === 'success' ? '✅' : r.status === 'error' ? '❌' : '⚠️'
      console.log(`${icon} ${r.name}: ${r.message}`)
    })
    return
  }

  if (apiKey.length < 30) {
    addResult(
      'Clé API',
      'warning',
      `Clé API semble trop courte (${apiKey.length} caractères)`,
      'Une clé API Google valide fait généralement 39 caractères'
    )
  } else {
    addResult(
      'Clé API',
      'success',
      `Clé API trouvée (${apiKey.length} caractères)`,
      `Début: ${apiKey.substring(0, 10)}...`
    )
  }

  // Test 2: Tester la connexion à l'API avec une requête simple
  console.log('\n📋 Test 2: Test de connexion à l\'API...')
  try {
    const testResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: 'Test' },
          voice: {
            languageCode: 'fr-FR',
            name: 'fr-FR-Wavenet-C',
            ssmlGender: 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
          },
        }),
      }
    )

    const responseData = await testResponse.json().catch(() => ({}))
    
    if (testResponse.ok) {
      if (responseData.audioContent) {
        addResult(
          'Connexion API',
          'success',
          'API accessible et fonctionnelle',
          `Taille audio généré: ${responseData.audioContent.length} caractères (base64)`
        )
      } else {
        addResult(
          'Connexion API',
          'warning',
          'API répond mais pas de contenu audio',
          responseData
        )
      }
    } else {
      // Analyser l'erreur spécifique
      const error = responseData.error || {}
      const errorMessage = error.message || 'Erreur inconnue'
      const errorCode = error.code || testResponse.status
      
      if (errorMessage.includes('blocked')) {
        addResult(
          'Connexion API',
          'error',
          'API bloquée - Requêtes refusées',
          {
            code: errorCode,
            message: errorMessage,
            raison: 'L\'API Text-to-Speech est bloquée. Vérifiez:',
            solutions: [
              '1. Activez l\'API dans Google Cloud Console (APIs & Services > Library)',
              '2. Vérifiez les restrictions de la clé API (APIs & Services > Credentials)',
              '3. Assurez-vous que "Cloud Text-to-Speech API" est autorisée',
              '4. Vérifiez que la facturation est activée (requis pour cette API)'
            ]
          }
        )
      } else if (errorMessage.includes('API key not valid') || errorMessage.includes('invalid')) {
        addResult(
          'Connexion API',
          'error',
          'Clé API invalide',
          {
            code: errorCode,
            message: errorMessage,
            solutions: [
              '1. Vérifiez que la clé API est correcte dans .env.local',
              '2. Régénérez une nouvelle clé API dans Google Cloud Console',
              '3. Vérifiez que la clé n\'a pas été supprimée ou désactivée'
            ]
          }
        )
      } else if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
        addResult(
          'Connexion API',
          'error',
          'Permissions insuffisantes',
          {
            code: errorCode,
            message: errorMessage,
            solutions: [
              '1. Vérifiez les restrictions de la clé API',
              '2. Assurez-vous que "Cloud Text-to-Speech API" est dans les APIs autorisées',
              '3. Vérifiez les quotas et limites dans Google Cloud Console'
            ]
          }
        )
      } else if (errorMessage.includes('billing') || errorMessage.includes('quota')) {
        addResult(
          'Connexion API',
          'error',
          'Problème de facturation ou quota',
          {
            code: errorCode,
            message: errorMessage,
            solutions: [
              '1. Activez la facturation dans Google Cloud Console',
              '2. Vérifiez les quotas dans APIs & Services > Dashboard',
              '3. Assurez-vous d\'avoir des crédits disponibles'
            ]
          }
        )
      } else {
        addResult(
          'Connexion API',
          'error',
          `Erreur API: ${errorMessage}`,
          {
            code: errorCode,
            fullError: responseData
          }
        )
      }
    }
  } catch (error: any) {
    addResult(
      'Connexion API',
      'error',
      'Erreur de connexion',
      {
        message: error.message,
        type: error.name,
        solutions: [
          '1. Vérifiez votre connexion internet',
          '2. Vérifiez que l\'URL de l\'API est correcte',
          '3. Vérifiez les paramètres de proxy/firewall'
        ]
      }
    )
  }

  // Test 3: Tester avec différentes voix
  console.log('\n📋 Test 3: Test des voix Wavenet...')
  const voices = [
    { name: 'fr-FR-Wavenet-C', lang: 'fr-FR', gender: 'FEMALE' },
    { name: 'en-US-Wavenet-D', lang: 'en-US', gender: 'MALE' },
  ]

  for (const voice of voices) {
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: 'Test' },
            voice: {
              languageCode: voice.lang,
              name: voice.name,
              ssmlGender: voice.gender,
            },
            audioConfig: { audioEncoding: 'MP3' },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.audioContent) {
          addResult(
            `Voix ${voice.name}`,
            'success',
            'Disponible et fonctionnelle'
          )
        } else {
          addResult(
            `Voix ${voice.name}`,
            'warning',
            'Répond mais pas de contenu'
          )
        }
      } else {
        const error = await response.json().catch(() => ({}))
        addResult(
          `Voix ${voice.name}`,
          'error',
          `Erreur: ${error.error?.message || response.status}`
        )
      }
    } catch (error: any) {
      addResult(
        `Voix ${voice.name}`,
        'error',
        `Erreur: ${error.message}`
      )
    }
  }

  // Test 4: Vérifier les variables d'environnement Supabase (pour le stockage)
  console.log('\n📋 Test 4: Vérification Supabase (pour stockage)...')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && supabaseKey) {
    addResult(
      'Configuration Supabase',
      'success',
      'Variables d\'environnement présentes'
    )
  } else {
    addResult(
      'Configuration Supabase',
      'warning',
      'Variables Supabase manquantes (nécessaires pour le stockage)',
      {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? '✅' : '❌',
        SUPABASE_SERVICE_ROLE_KEY: supabaseKey ? '✅' : '❌'
      }
    )
  }

  // Bilan final
  console.log('\n' + '='.repeat(60))
  console.log('📊 BILAN FINAL')
  console.log('='.repeat(60))

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const warningCount = results.filter(r => r.status === 'warning').length

  console.log(`\n✅ Tests réussis: ${successCount}`)
  console.log(`⚠️  Avertissements: ${warningCount}`)
  console.log(`❌ Erreurs: ${errorCount}\n`)

  if (errorCount === 0 && successCount > 0) {
    console.log('🎉 Tous les tests critiques sont passés !')
    console.log('✅ L\'API devrait fonctionner correctement.\n')
  } else if (errorCount > 0) {
    console.log('⚠️  PROBLÈMES DÉTECTÉS:\n')
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`\n❌ ${r.name}:`)
        console.log(`   ${r.message}`)
        if (r.details?.solutions) {
          console.log(`   Solutions:`)
          r.details.solutions.forEach((sol: string) => console.log(`   ${sol}`))
        }
      })
    console.log('\n')
  }

  // Résumé des solutions
  const hasBlockedError = results.some(r => 
    r.status === 'error' && r.message.includes('bloquée')
  )

  if (hasBlockedError) {
    console.log('💡 ACTIONS RECOMMANDÉES:\n')
    console.log('1. Allez dans Google Cloud Console:')
    console.log('   https://console.cloud.google.com/apis/library/texttospeech.googleapis.com')
    console.log('2. Cliquez sur "ENABLE" pour activer l\'API')
    console.log('3. Allez dans APIs & Services > Credentials')
    console.log('4. Cliquez sur votre clé API')
    console.log('5. Dans "API restrictions", assurez-vous que:')
    console.log('   - "Cloud Text-to-Speech API" est cochée')
    console.log('   - Ou sélectionnez "Don\'t restrict key" temporairement')
    console.log('6. Vérifiez que la facturation est activée (Billing)')
    console.log('\n')
  }

  console.log('='.repeat(60) + '\n')
}

// Exécuter les tests
testTTSAPI()
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors des tests:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

