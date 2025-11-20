import type { NextConfig } from "next";

const getWordPressPattern = () => {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    return [];
  }
  
  try {
    const url = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'https' | 'http',
        hostname: url.hostname,
      },
    ];
  } catch {
    return [];
  }
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
      ...getWordPressPattern(),
    ],
  },
  output: "standalone",
};

export default nextConfig;
