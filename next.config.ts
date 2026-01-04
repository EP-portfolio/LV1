import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuration pour Turbopack (Next.js 16+)
  turbopack: {},

  // Configuration webpack (utilisée si --webpack est spécifié)
  webpack: (config, { isServer }) => {
    // Externaliser les modules optionnels pour éviter les erreurs de build
    // Ces modules seront chargés uniquement au runtime si nécessaire
    if (isServer) {
      config.externals = config.externals || []

      // Fonction pour externaliser un module optionnel
      const externalizeOptional = (moduleName: string) => {
        return {
          [moduleName]: `commonjs ${moduleName}`,
        }
      }

      // Externaliser les modules optionnels
      const optionalModules = {
        ...externalizeOptional('@anthropic-ai/sdk'),
        ...externalizeOptional('@mistralai/mistralai'),
      }

      if (Array.isArray(config.externals)) {
        config.externals.push(optionalModules)
      } else if (typeof config.externals === 'object') {
        config.externals = { ...config.externals, ...optionalModules }
      } else {
        config.externals = [config.externals, optionalModules]
      }
    }
    return config
  },
};

export default nextConfig;
