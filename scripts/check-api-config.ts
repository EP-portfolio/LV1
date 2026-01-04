/**
 * Script pour vérifier la configuration des clés API
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'google'

console.log('🔍 Vérification de la configuration API...\n')
console.log(`📡 Provider configuré: ${LLM_PROVIDER}\n`)

// Vérifier la clé selon le provider
let apiKey: string | undefined
let apiKeyName: string

switch (LLM_PROVIDER) {
  case 'google':
    apiKey = process.env.GOOGLE_API_KEY
    apiKeyName = 'GOOGLE_API_KEY'
    break
  case 'openai':
    apiKey = process.env.OPENAI_API_KEY
    apiKeyName = 'OPENAI_API_KEY'
    break
  case 'anthropic':
    apiKey = process.env.ANTHROPIC_API_KEY
    apiKeyName = 'ANTHROPIC_API_KEY'
    break
  case 'mistral':
    apiKey = process.env.MISTRAL_API_KEY
    apiKeyName = 'MISTRAL_API_KEY'
    break
  case 'together':
    apiKey = process.env.TOGETHER_API_KEY
    apiKeyName = 'TOGETHER_API_KEY'
    break
  default:
    apiKey = undefined
    apiKeyName = 'UNKNOWN'
}

if (apiKey) {
  const maskedKey = apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '***'
  console.log(`✅ ${apiKeyName} est configurée`)
  console.log(`   Valeur: ${maskedKey}\n`)
} else {
  console.log(`❌ ${apiKeyName} n'est PAS configurée\n`)
  console.log(`📝 Pour corriger:`)
  console.log(`   1. Ouvrez le fichier .env.local`)
  console.log(`   2. Ajoutez: ${apiKeyName}="votre-clé-ici"`)
  console.log(`   3. Redémarrez le serveur (npm run dev)\n`)
}

// Vérifier les autres variables importantes
console.log('📋 Autres variables d\'environnement:')
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurée' : '❌ Manquante'}`)
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurée' : '❌ Manquante'}`)
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Manquante'}`)
console.log(`   PEXELS_API_KEY: ${process.env.PEXELS_API_KEY ? '✅ Configurée (optionnel)' : '⚠️  Non configurée (Pexels fonctionne sans clé)'}`)

if (!apiKey) {
  console.log('\n❌ Configuration incomplète. Veuillez configurer les variables manquantes.')
  process.exit(1)
} else {
  console.log('\n✅ Configuration OK!')
  process.exit(0)
}

