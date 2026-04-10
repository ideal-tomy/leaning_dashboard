import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo/parent lockfile の誤検出を避け、現在プロジェクトをルートとして固定する
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
