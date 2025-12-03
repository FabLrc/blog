import type { NextConfig } from "next";

/**
 * Génère les patterns d'images autorisées depuis les variables d'environnement.
 * Utilise NEXT_PUBLIC_WORDPRESS_API_URL pour autoriser les images WordPress.
 */
const getWordPressImagePatterns = () => {
  const patterns: { protocol: 'https' | 'http'; hostname: string }[] = [];
  
  // Extraire le hostname depuis NEXT_PUBLIC_WORDPRESS_API_URL
  if (process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
      patterns.push({
        protocol: url.protocol.replace(':', '') as 'https' | 'http',
        hostname: url.hostname,
      });
    } catch {
      console.warn('Invalid NEXT_PUBLIC_WORDPRESS_API_URL format');
    }
  }
  
  return patterns;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      ...getWordPressImagePatterns(),
    ],
  },
  output: "standalone",
};

export default nextConfig;
