import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // ローカル開発用の設定
  images: {
    unoptimized: true,
  },
  output: 'export',
  ...(isGithubActions && {
    basePath: '/Echoes_in_the_Tide',
    assetPrefix: '/Echoes_in_the_Tide',
    env: {
      NEXT_PUBLIC_BASE_PATH: '/Echoes_in_the_Tide',
    },
  }),
};

export default nextConfig;
