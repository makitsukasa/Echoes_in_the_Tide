import axios from 'axios';
import { BottleData, BottleGraphData, BottleMetadata, Bottle } from '../types/BottleType';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? 'https://api.studio.thegraph.com/query/109981/ocean/version/latest';

const GET_BOTTLES_QUERY = `{
  driftingBottles {
    id
    tokenURI
    sender
  }
}`;

function ipfsToHttp(url: string | undefined | null): string | undefined {
  return url?.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

async function fetchBottleMetadata(tokenURI: string): Promise<BottleMetadata> {
  const metadataUrl = ipfsToHttp(tokenURI);
  if (!metadataUrl) return {};
  try {
    const res = await axios.get(metadataUrl);
    const { name, description, message, image, animation_url } = res.data;
    return {
      name, description, message,
      image: ipfsToHttp(image),
      html: ipfsToHttp(animation_url),
    };
  } catch {
    return {};
  }
}

export async function fetchDriftingBottles(excludedSender?: string): Promise<BottleData[]> {
  const res = await axios.post(SUBGRAPH_URL, { query: GET_BOTTLES_QUERY });
  let bottles = (res.data?.data?.driftingBottles ?? []) as BottleGraphData[];

  if (excludedSender) {
    bottles = bottles.filter(b => b.sender?.toLowerCase() !== excludedSender.toLowerCase());
  }

  const shuffled = bottles.sort(() => 0.5 - Math.random()).slice(0, 3);
  return Promise.all(shuffled.map(async (bottle) => ({
    ...bottle,
    metadata_url: ipfsToHttp(bottle.tokenURI),
    ...(await fetchBottleMetadata(bottle.tokenURI ?? '')),
  })));
}

export async function fetchUserClaimedBottles(userAddress: string): Promise<Bottle[]> {
  const query = `
    query {
      bottleClaimeds(where: { claimer: "${userAddress.toLowerCase()}" }) {
        tokenId
        blockTimestamp
      }
      bottleMinteds {
        tokenId
        tokenURI
      }
    }`;

  const res = await axios.post(SUBGRAPH_URL, { query });
  const { bottleClaimeds, bottleMinteds } = res.data?.data ?? { bottleClaimeds: [], bottleMinteds: [] };

  return Promise.all(bottleClaimeds.map(async (claimed: any) => {
    const minted = bottleMinteds.find((m: any) => m.tokenId === claimed.tokenId);
    if (!minted) return null;

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
  })).then(bottles => bottles.filter((b): b is Bottle => !!b));
}
