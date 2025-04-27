import axios from 'axios';

// PinataのAPIキーを設定
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export async function uploadToIPFS(data) {
  try {
    // メタデータをJSONとしてアップロード
    const metadata = {
      name: data.name,
      description: data.description
    };

    // 画像がある場合は先にアップロード
    let imageUrl = null;
    if (data.image) {
      const formData = new FormData();
      formData.append('file', data.image);

      const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      });

      imageUrl = `ipfs://${imageResponse.data.IpfsHash}`;
      metadata.image = imageUrl;
    }

    // メタデータをJSONとしてアップロード
    const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    return `ipfs://${metadataResponse.data.IpfsHash}`;
  } catch (error) {
    console.error('Pinataアップロードエラー:', error);
    throw error;
  }
}
