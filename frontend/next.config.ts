import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "1337",
      },
      {
        // Permet d'utiliser l'IP ou le domaine du NAS
        protocol: "http",
        hostname: "*",
        port: "1337",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
