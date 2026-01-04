-- ============================================
-- Politiques de sécurité pour le bucket practice-media
-- ============================================
-- Exécutez ce SQL dans l'éditeur SQL de Supabase Dashboard
-- Allez dans: SQL Editor → New Query → Collez ce code → Run

-- Supprimer les politiques existantes si elles existent (pour éviter les doublons)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- 1. Politique de lecture publique (pour que les images soient accessibles)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'practice-media');

-- 2. Politique d'upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'practice-media' 
  AND auth.role() = 'authenticated'
);

-- 3. Politique de mise à jour pour le propriétaire
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'practice-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Politique de suppression pour le propriétaire
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'practice-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- Vérification
-- ============================================
-- Pour vérifier que les politiques sont créées, exécutez:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

