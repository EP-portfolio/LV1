/**
 * Script pour tester les modèles Gemini disponibles
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.error('❌ GOOGLE_API_KEY n\'est pas configurée dans .env.local')
  process.exit(1)
}

const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(apiKey)

// Liste des modèles à tester
const modelsToTest = [
  'gemini-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'models/gemini-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
]

console.log('🔍 Test des modèles Gemini disponibles...\n')
console.log(`📡 Clé API: ${apiKey.substring(0, 8)}...\n`)

async function testModel(modelName: string) {
  try {
    console.log(`🧪 Test du modèle: ${modelName}`)
    const model = genAI.getGenerativeModel({ model: modelName })
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
      generationConfig: {
        maxOutputTokens: 10,
      },
    })
    
    const response = await result.response
    const text = response.text()
    
    console.log(`   ✅ ${modelName} fonctionne!`)
    console.log(`   Réponse: ${text.substring(0, 50)}...\n`)
    return true
  } catch (error: any) {
    console.log(`   ❌ ${modelName} - Erreur: ${error.message.substring(0, 100)}\n`)
    return false
  }
}

async function main() {
  console.log('📋 Test de tous les modèles...\n')
  
  const workingModels: string[] = []
  
  for (const modelName of modelsToTest) {
    const works = await testModel(modelName)
    if (works) {
      workingModels.push(modelName)
    }
    // Petite pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Résultats:')
  console.log('='.repeat(50))
  
  if (workingModels.length > 0) {
    console.log('\n✅ Modèles qui fonctionnent:')
    workingModels.forEach(model => {
      console.log(`   - ${model}`)
    })
    console.log(`\n💡 Utilisez l'un de ces modèles dans votre .env.local:`)
    console.log(`   GOOGLE_MODEL="${workingModels[0]}"`)
  } else {
    console.log('\n❌ Aucun modèle ne fonctionne avec votre clé API')
    console.log('   Vérifiez que votre clé API est valide et a les bonnes permissions')
  }
  
  process.exit(workingModels.length > 0 ? 0 : 1)
}

main().catch(console.error)
