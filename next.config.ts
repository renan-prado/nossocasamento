import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560, 3840],
    imageSizes: [256, 384, 512, 768, 1024],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
