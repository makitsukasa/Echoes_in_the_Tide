'use server'

import { ObjectManager } from '@filebase/sdk'

const S3_KEY = process.env.NEXT_PUBLIC_S3_KEY;
const S3_SECRET = process.env.NEXT_PUBLIC_S3_SECRET;

if (!S3_KEY || !S3_SECRET) {
  throw new Error('S3_KEYとS3_SECRETの環境変数が設定されていません');
}

interface FormDataWithImage {
  name: string;
  description: string;
  image: File;
};

interface FormDataWithoutImage {
  name: string;
  description: string;
};

type FormData = FormDataWithImage | FormDataWithoutImage;

export async function uploadToIPFS(data: FormData): Promise<string> {
  try {
    // メタデータを準備
    var metadata = {
      name: data.name,
      description: data.description
    };

    // ObjectManagerの初期化
    const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
      bucket: "echoes-in-the-tide"
    });

    // 画像がある場合は先にアップロード
    // if ('image' in data && data.image) {
    //   const imageBuffer = await data.image.arrayBuffer();
    //   const uploadedImage = await objectManager.upload(
    //     `bottle_${Date.now()}/${data.image.name}`,
    //     Buffer.from(imageBuffer),
    //     {},
    //     {}
    //   );
    //   Object.assign(metadata, { image: `ipfs://${uploadedImage.cid}` });
    // }

    // メタデータをJSONとしてアップロード
    const uploadedMetadata = await objectManager.upload(
      `bottle_${Date.now()}/0.json`,
      Buffer.from(JSON.stringify(metadata, null, 2)),
      {},
      {}
    );

    return `ipfs://${uploadedMetadata.cid}`;

  } catch (error) {
    console.error('Filebaseアップロードエラー:', error);
    throw error;
  }
}
