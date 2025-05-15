import axios from 'axios';

export interface Bottle {
  id: string;
  tokenId?: string;
  tokenURI?: string;
  sender?: string;
  name?: string;
  description?: string;
  message?: string;
  image?: string;
  html?: string;
  date?: string;
  status?: string;
  interactions?: number;
  owner?: string;
  metadata_url?: string;
}

/**
 * ipfs:// 形式のURLを https://ipfs.io/ipfs/ 形式に変換する
 */
export function ipfsToHttp(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

/**
 * tokenURIからメタデータを取得し、Bottle情報を返す
 */
export async function fetchBottleMetadata(tokenURI: string): Promise<{
  name?: string;
  description?: string;
  message?: string;
  image?: string;
  html?: string;
}> {
  const metadataUrl = ipfsToHttp(tokenURI);
  if (!metadataUrl) return {};
  try {
    const res = await axios.get(metadataUrl);
    const data = res.data;
    return {
      name: data.name,
      description: data.description,
      message: data.message,
      image: data.image ? ipfsToHttp(data.image) : undefined,
      html: data.animation_url ? ipfsToHttp(data.animation_url) : undefined,
    };
  } catch (e) {
    console.error('メタデータ取得失敗:', e);
    return {};
  }
}
