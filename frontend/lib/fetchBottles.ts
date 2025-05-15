import axios from 'axios';

interface Bottle {
  id: string;
  tokenURI: string;
  sender: string;
  metadata_url?: string;
  name?: string;
  description?: string;
  image?: string;
  html?: string;
}

function getRandomBottles(bottles: Bottle[], count = 1): Bottle[] {
  if (!bottles || bottles.length === 0) return [];
  if (bottles.length <= count) return bottles;

  const shuffled = [...bottles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function filterBottlesBySender(bottles: Bottle[], excludedSender: string): Bottle[] {
  if (!bottles || bottles.length === 0) return [];
  return bottles.filter(bottle => bottle.sender.toLowerCase() !== excludedSender.toLowerCase());
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
    console.log(response);
    if (!response.data.data.driftingBottles || response.data.data.driftingBottles.length === 0) {
      return [];
    }
    let res = response.data.data.driftingBottles;
    if (excludedSender) {
      res = filterBottlesBySender(res, excludedSender);
    }
    res = getRandomBottles(res, 3);
    for (let i = 0; i < res.length; i++) {
      if (Object.keys(res[i]).includes("tokenURI")) {
        res[i].metadata_url = res[i].tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      }
      let metadata = await axios.get(res[i].metadata_url);
      if (metadata.status !== 200) {
        continue;
      }
      metadata = metadata.data;
      if (Object.keys(metadata).includes("name")) {
        res[i].name = metadata.name;
      }
      if (Object.keys(metadata).includes("description")) {
        res[i].description = metadata.description;
      }
      if (Object.keys(metadata).includes("image")) {
        res[i].image = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      }
      if (Object.keys(metadata).includes("animation_url")) {
        res[i].html = metadata.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/")
      }
    }
    console.log(res);
    return res;
  } catch (error) {
    console.error("APIの取得に失敗しました:", error);
    return [];
  }
}
