import { Bottle, ipfsToHttp, fetchBottleMetadata } from './bottleUtil';
import axios from 'axios';

function getRandomBottles(bottles: Bottle[], count = 1): Bottle[] {
  if (!bottles || bottles.length === 0) return [];
  if (bottles.length <= count) return bottles;
  const shuffled = [...bottles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function filterBottlesBySender(bottles: Bottle[], excludedSender: string): Bottle[] {
  if (!bottles || bottles.length === 0) return [];
  return bottles.filter(bottle => bottle.sender?.toLowerCase() !== excludedSender.toLowerCase());
}

export async function fetchBottles(excludedSender?: string): Promise<Bottle[]> {
  try {
    const response = await axios.post('https://api.studio.thegraph.com/query/109981/ocean/version/latest', {
      query: `{
        driftingBottles {
          id
          tokenURI
          sender
        }
      }`
    });
    if (!response.data.data.driftingBottles || response.data.data.driftingBottles.length === 0) {
      return [];
    }
    let res: Bottle[] = response.data.data.driftingBottles;
    if (excludedSender) {
      res = filterBottlesBySender(res, excludedSender);
    }
    res = getRandomBottles(res, 3);
    const bottles: Bottle[] = await Promise.all(res.map(async (bottle) => {
      const metadata_url = ipfsToHttp(bottle.tokenURI);
      const metadata = await fetchBottleMetadata(bottle.tokenURI ?? '');
      return {
        ...bottle,
        metadata_url,
        ...metadata,
      };
    }));
    return bottles;
  } catch (error) {
    console.error("APIの取得に失敗しました:", error);
    return [];
  }
}
