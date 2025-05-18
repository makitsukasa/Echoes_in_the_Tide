import axios from 'axios';
import { Bottle, fetchBottleMetadata } from './bottleUtil';

export async function fetchUserBottles(address: string): Promise<Bottle[]> {
  try {
    // The GraphのエンドポイントURLを確認
    const graphEndpoint = 'https://api.studio.thegraph.com/query/109981/ocean/version/latest';
    console.log('Fetching from Graph endpoint:', graphEndpoint);

    const response = await axios.post(
      graphEndpoint,
      {
        query: `
          {
            bottleClaimeds(where: { claimer: "${address.toLowerCase()}" }) {
              tokenId
              blockTimestamp
            }
            bottleMinteds {
              tokenId
              tokenURI
            }
          }
        `
      }
    );

    console.log('GraphQL Response:', response.data);

    if (!response.data?.data) {
      console.error('Invalid response structure:', response.data);
      return [];
    }

    const { bottleClaimeds, bottleMinteds }: {
      bottleClaimeds: { tokenId: string; blockTimestamp: string }[];
      bottleMinteds: { tokenId: string; tokenURI: string }[];
    } = response.data.data;

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
          };
        } catch (error) {
          console.error(`Error fetching metadata for tokenId ${claimed.tokenId}:`, error);
          return null;
        }
      })
    );

    return bottles.filter((bottle): bottle is Bottle => bottle !== null);
  } catch (error) {
    console.error('Error fetching user bottles:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    return [];
  }
}
