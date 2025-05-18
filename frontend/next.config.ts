import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pagesでのデプロイに対応するための設定
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
