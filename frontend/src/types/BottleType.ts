/**
 * ボトルの基本情報
 */
export interface BottleType {
  id: string;
  description: string;
  image?: string;
}

/**
 * The Graphから取得するボトルの生データ
 */
export interface BottleGraphData {
  id: string;
  tokenURI?: string;
  sender?: string;
}

/**
 * IPFSから取得するボトルのメタデータ
 */
export interface BottleMetadata {
  name?: string;
  description?: string;
  message?: string;
  image?: string;
  html?: string;
}

/**
 * 完全なボトルデータ（Graph + メタデータ）
 */
export interface BottleData extends BottleGraphData {
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
 * ユーザーが所有するボトルの型
 */
export interface Bottle {
  id: string;
  tokenId: string;
  tokenURI: string;
  name?: string;
  description?: string;
  message?: string;
  image?: string;
  html?: string;
  date: string;
  status: string;
}
