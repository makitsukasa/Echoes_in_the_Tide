'use server'

import { ObjectManager } from '@filebase/sdk'

const S3_KEY = process.env.NEXT_PUBLIC_S3_KEY;
const S3_SECRET = process.env.NEXT_PUBLIC_S3_SECRET;

if (!S3_KEY || !S3_SECRET) {
  throw new Error('S3_KEYとS3_SECRETの環境変数が設定されていません');
}

interface FormData {
  name: string;
  description: string;
  image?: File;
}

export async function uploadToIPFS(data: FormData): Promise<string> {
  try {
    // メタデータを準備
    const metadata = {
      name: data.name,
      description: data.description,
      image: ""
    };

    // ObjectManagerの初期化
    const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
      bucket: "echoes-in-the-tide"
    });

    // 画像がある場合は先にアップロード
    let imageUrl = null;
    if (data.image) {
      const imageBuffer = await data.image.arrayBuffer();
      const imageName = `images/${Date.now()}-${data.image.name}`;
      const uploadedImage = await objectManager.upload(
        imageName,
        Buffer.from(imageBuffer),
        {},
        {}
      );
      imageUrl = `ipfs://${uploadedImage.cid}`;
      metadata.image = imageUrl;
    }

    // メタデータをJSONとしてアップロード
    const jsonString = JSON.stringify(metadata, null, 2);
    const metadataName = `metadata/0.json`;
    const uploadedMetadata = await objectManager.upload(
      metadataName,
      Buffer.from(jsonString),
      {},
      {}
    );

    return `ipfs://${uploadedMetadata.cid}`;
  } catch (error) {
    console.error('Filebaseアップロードエラー:', error);
    throw error;
  }
}
