'use server'

import { ObjectManager } from '@filebase/sdk'

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

export async function uploadToIPFS(
  data: FormData,
  key: string,
  secret: string
): Promise<string> {
  try {
    // メタデータを準備
    var metadata = {
      name: data.name,
      description: data.description
    };

    // ObjectManagerの初期化
    const objectManager = new ObjectManager(key, secret, {
      bucket: "echoes-in-the-tide"
    });

    const bottleName = `bottle_${Date.now()}`;

    // 画像がある場合は先にアップロード
    if ('image' in data && data.image) {
      const imageBuffer = await data.image.arrayBuffer();
      const uploadedImage = await objectManager.upload(
        `${bottleName}/${data.image.name}`,
        Buffer.from(imageBuffer),
        {},
        {}
      );
      Object.assign(metadata, { image: `ipfs://${uploadedImage.cid}` });
    }

    // メタデータをJSONとしてアップロード
    const uploadedMetadata = await objectManager.upload(
      `${bottleName}/0.json`,
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
