import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pagesでのデプロイに対応するための設定
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Echoes_in_the_Tide/frontend',
  assetPrefix: '/Echoes_in_the_Tide/frontend/',
};

export default nextConfig;
