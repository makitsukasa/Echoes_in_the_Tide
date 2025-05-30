import axios from 'axios';
import { BottleData, BottleGraphData, BottleMetadata, Bottle } from '../types/BottleType';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/109981/ocean/version/latest';

const GET_BOTTLES_QUERY = `{
  driftingBottles {
    id
    tokenURI
    sender
  }
}`;

function ipfsToHttp(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

async function fetchBottleMetadata(tokenURI: string): Promise<BottleMetadata> {
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

function getRandomBottles(bottles: BottleData[], count = 3): BottleData[] {
  if (!bottles || bottles.length === 0) return [];
  if (bottles.length <= count) return bottles;
  const shuffled = [...bottles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function filterBottlesBySender(bottles: BottleData[], excludedSender: string): BottleData[] {
  if (!bottles || bottles.length === 0) return [];
  return bottles.filter(bottle => bottle.sender?.toLowerCase() !== excludedSender.toLowerCase());
}

export async function fetchBottles(excludedSender?: string): Promise<BottleData[]> {
  try {
    const response = await axios.post(SUBGRAPH_URL, {
      query: GET_BOTTLES_QUERY
    });

    if (!response.data.data.driftingBottles || response.data.data.driftingBottles.length === 0) {
      return [];
    }

    let bottles = response.data.data.driftingBottles as BottleGraphData[];
    if (excludedSender) {
      bottles = filterBottlesBySender(bottles, excludedSender);
    }
    bottles = getRandomBottles(bottles, 3);

    const bottlesWithMetadata = await Promise.all(bottles.map(async (bottle) => {
      const metadata_url = ipfsToHttp(bottle.tokenURI);
      const metadata = await fetchBottleMetadata(bottle.tokenURI ?? '');
      return {
        ...bottle,
        metadata_url,
        ...metadata,
      };
    }));

    return bottlesWithMetadata;
  } catch (error) {
    console.error('Error fetching bottles:', error);
    throw error;
  }
}

export const fetchUserBottles = async (userAddress: string) => {
  const query = `
    query GetUserBottles($userAddress: String!) {
      bottleClaimeds(where: { claimer: "${userAddress.toLowerCase()}" }) {
        tokenId
        blockTimestamp
      }
      bottleMinteds {
        tokenId
        tokenURI
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { userAddress: userAddress.toLowerCase() },
    }),
  });

  const responseData = await response.json();
  console.log('GraphQL Response:', responseData);

  if (!responseData || !responseData?.data) {
    console.error('Invalid response structure:', responseData);
    return [];
  }

  const { bottleClaimeds, bottleMinteds }: {
    bottleClaimeds: { tokenId: string; blockTimestamp: string }[];
    bottleMinteds: { tokenId: string; tokenURI: string }[];
  } = responseData.data;

  if (!bottleClaimeds || !bottleMinteds) {
    console.error('Missing required data:', { bottleClaimeds, bottleMinteds });
    return [];
  }

  const bottles: (Bottle | null)[] = await Promise.all(
    bottleClaimeds.map(async (claimed): Promise<Bottle | null> => {
      const minted = bottleMinteds.find(
        (minted) => minted.tokenId === claimed.tokenId
      );
      if (!minted) {
        console.warn(`No minted bottle found for tokenId: ${claimed.tokenId}`);
        return null;
      }
      try {
        const metadata = await fetchBottleMetadata(minted.tokenURI);
        return {
          id: claimed.tokenId,
          tokenId: claimed.tokenId,
          tokenURI: minted.tokenURI,
          ...metadata,
          date: new Date(parseInt(claimed.blockTimestamp) * 1000).toLocaleDateString('ja-JP'),
          status: '所有中',
          timestamp: new Date(parseInt(claimed.blockTimestamp) * 1000).toLocaleString('ja-JP'),
        };
      } catch (error) {
        console.error(`Error fetching metadata for tokenId ${claimed.tokenId}:`, error);
        return null;
      }
    })
  );

  return bottles.filter((bottle): bottle is Bottle => bottle !== null);
};
