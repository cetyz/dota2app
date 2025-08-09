import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
        port: '',
        pathname: '/apps/dota2/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.steamstatic.com',
        port: '',
        pathname: '/apps/dota2/images/**',
      },
    ],
  },
};

export default nextConfig;
