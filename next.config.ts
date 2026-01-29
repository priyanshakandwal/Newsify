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
  devIndicators: {
    //@ts-ignore
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;

