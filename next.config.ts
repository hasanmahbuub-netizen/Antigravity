import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Remove console logs in production for performance and security
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // TODO: Fix TypeScript errors and remove this setting
  // Current issues: Heavy use of 'any' type, needs proper interface definitions
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;


