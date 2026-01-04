import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Vérifier que DATABASE_URL est configurée
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not configured')
  console.error('   Please set DATABASE_URL in your environment variables')
  console.error('   Format: postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres')
}

// Prisma 6 : l'URL est définie dans le schéma Prisma via DATABASE_URL
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
