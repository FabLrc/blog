import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation pour Docker avec standalone output
  output: "standalone",
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "*.railway.app", // Pour Railway
      },
      {
        protocol: "https",
        hostname: "*.fly.dev", // Pour Fly.io
      },
    ],
  },
};

export default nextConfig;
