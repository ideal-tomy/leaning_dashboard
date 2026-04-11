import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Monorepo/parent lockfile の誤検出を避け、現在プロジェクトをルートとして固定する
    root: process.cwd(),
  },
  /**
   * `/story` 単独セグメントが Next.js 16 + Turbopack の開発ルータで 404 になる事象への回避。
   * 営業デモの実体は `/sales-demo`（旧リンクはリダイレクトで維持）。
   */
  async redirects() {
    return [
      { source: "/story", destination: "/sales-demo", permanent: false },
    ];
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
