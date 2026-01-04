/**
 * Script pour créer le bucket Supabase Storage nécessaire
 */

// Charger les variables d'environnement
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  console.error('\n📝 Ajoutez ces variables dans .env.local')
  process.exit(1)
}

// Créer un client Supabase avec la clé service (pour les opérations admin)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'practice-media'

async function setupStorage() {
  console.log('🪣 Configuration du bucket Supabase Storage...\n')
  console.log(`📦 Nom du bucket: ${BUCKET_NAME}\n`)

  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      throw new Error(`Erreur lors de la liste des buckets: ${listError.message}`)
    }

    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)

    if (bucketExists) {
      console.log(`✅ Le bucket "${BUCKET_NAME}" existe déjà\n`)
    } else {
      console.log(`📝 Création du bucket "${BUCKET_NAME}"...`)
      
      // Créer le bucket
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Rendre le bucket public pour les images
        fileSizeLimit: 52428800, // 50 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav'],
      })

      if (error) {
        throw new Error(`Erreur lors de la création du bucket: ${error.message}`)
      }

      console.log(`✅ Bucket "${BUCKET_NAME}" créé avec succès\n`)
    }

    // Vérifier les politiques (on ne peut pas les créer via l'API, juste informer)
    console.log('📋 Politiques de sécurité:')
    console.log('   ⚠️  Les politiques doivent être créées manuellement dans Supabase Dashboard')
    console.log('   📝 Allez dans: Storage → practice-media → Policies')
    console.log('   📝 Ou exécutez le SQL suivant dans l\'éditeur SQL:\n')
    
    console.log(`
-- Politique de lecture publique
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = '${BUCKET_NAME}');

-- Politique d'upload pour utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = '${BUCKET_NAME}' 
  AND auth.role() = 'authenticated'
);

-- Politique de mise à jour pour le propriétaire
CREATE POLICY IF NOT EXISTS "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = '${BUCKET_NAME}' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique de suppression pour le propriétaire
CREATE POLICY IF NOT EXISTS "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = '${BUCKET_NAME}' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
`)

    console.log('\n✅ Configuration terminée!')
    console.log('   💡 Si vous voyez des erreurs de permissions, exécutez le SQL ci-dessus\n')

  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message)
    console.error('\n💡 Solutions:')
    console.error('   1. Vérifiez que SUPABASE_SERVICE_ROLE_KEY est correcte')
    console.error('   2. Créez le bucket manuellement dans Supabase Dashboard:')
    console.error('      - Allez dans Storage')
    console.error(`      - Créez un bucket nommé "${BUCKET_NAME}"`)
    console.error('      - Rendez-le public')
    console.error('   3. Exécutez le SQL ci-dessus pour les politiques\n')
    process.exit(1)
  }
}

setupStorage()

