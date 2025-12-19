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
  // Preserve console logs in production for debugging
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
