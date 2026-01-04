/**
 * Script pour lister les modèles Gemini disponibles via l'API
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.error('❌ GOOGLE_API_KEY n\'est pas configurée')
  process.exit(1)
}

async function listModels() {
  console.log('🔍 Liste des modèles Gemini disponibles...\n')
  
  try {
    // Utiliser l'API REST directement pour lister les modèles
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Erreur API: ${response.status} ${response.statusText}`)
      console.error(`   Détails: ${errorText.substring(0, 500)}`)
      
      // Essayer avec v1 au lieu de v1beta
      console.log('\n🔄 Essai avec l\'API v1...')
      const responseV1 = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!responseV1.ok) {
        const errorTextV1 = await responseV1.text()
        console.error(`❌ Erreur API v1: ${responseV1.status} ${responseV1.statusText}`)
        console.error(`   Détails: ${errorTextV1.substring(0, 500)}`)
        process.exit(1)
      }
      
      const dataV1 = await responseV1.json()
      console.log('✅ API v1 fonctionne!\n')
      console.log('📋 Modèles disponibles:')
      
      if (dataV1.models && dataV1.models.length > 0) {
        dataV1.models.forEach((model: any) => {
          const supportsGenerate = model.supportedGenerationMethods?.includes('generateContent')
          const marker = supportsGenerate ? '✅' : '⚠️'
          console.log(`   ${marker} ${model.name}`)
          if (model.displayName) {
            console.log(`      Display: ${model.displayName}`)
          }
          if (model.supportedGenerationMethods) {
            console.log(`      Méthodes: ${model.supportedGenerationMethods.join(', ')}`)
          }
        })
      } else {
        console.log('   Aucun modèle trouvé')
      }
      
      return
    }

    const data = await response.json()
    
    console.log('✅ API v1beta fonctionne!\n')
    console.log('📋 Modèles disponibles:')
    
    if (data.models && data.models.length > 0) {
      data.models.forEach((model: any) => {
        const supportsGenerate = model.supportedGenerationMethods?.includes('generateContent')
        const marker = supportsGenerate ? '✅' : '⚠️'
        const modelName = model.name.replace('models/', '')
        console.log(`   ${marker} ${modelName}`)
        if (model.displayName) {
          console.log(`      Display: ${model.displayName}`)
        }
        if (model.supportedGenerationMethods) {
          console.log(`      Méthodes: ${model.supportedGenerationMethods.join(', ')}`)
        }
      })
      
      // Trouver les modèles qui supportent generateContent
      const workingModels = data.models
        .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m: any) => m.name.replace('models/', ''))
      
      if (workingModels.length > 0) {
        console.log(`\n💡 Modèles recommandés (supportent generateContent):`)
        workingModels.forEach((model: string) => {
          console.log(`   - ${model}`)
        })
        console.log(`\n📝 Ajoutez dans .env.local:`)
        console.log(`   GOOGLE_MODEL="${workingModels[0]}"`)
      }
    } else {
      console.log('   Aucun modèle trouvé')
    }
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    console.error('   Stack:', error.stack?.substring(0, 300))
    process.exit(1)
  }
}

listModels()

