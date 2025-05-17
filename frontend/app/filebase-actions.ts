'use server'

import { ObjectManager } from '@filebase/sdk'
import { of as computeCID } from 'ipfs-only-hash'
import { Buffer } from 'buffer'

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
  if (!key || !secret) {
    throw new Error('Filebaseの認証情報が設定されていません');
  }

  try {
    const objectManager = new ObjectManager(key, secret, {
      bucket: "echoes-in-the-tide"
    });

    const metadata: Record<string, any> = {
      name: data.name,
      description: data.description,
    };

    // 画像がある場合
    if ('image' in data && data.image) {
      try {
        const imageBuffer = Buffer.from(await data.image.arrayBuffer());
        const imageCID = await computeCID(imageBuffer, { cidVersion: 1 });
        const imagePath = `images/${imageCID}.png`;

        // 既に存在しているか確認
        try {
          await objectManager.stat(imagePath);
          console.log(`画像はすでに存在: ${imagePath}`);
        } catch (error) {
          console.log(`画像が存在しないためアップロード: ${imagePath}`);
          await objectManager.upload(imagePath, imageBuffer, {
            'Content-Type': 'image/png'
          }, {});
        }

        metadata.image = `ipfs://${imageCID}`;
      } catch (error) {
        console.error('画像の処理中にエラーが発生:', error);
        throw new Error('画像の処理に失敗しました');
      }
    }

    // メタデータをJSON化してCID生成
    try {
      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
      const metadataCID = await computeCID(metadataBuffer, { cidVersion: 1 });
      const metadataPath = `metadata/${metadataCID}.json`;

      // メタデータも同様に存在チェック
      try {
        await objectManager.stat(metadataPath);
        console.log(`メタデータはすでに存在: ${metadataPath}`);
      } catch (error) {
        console.log(`メタデータが存在しないためアップロード: ${metadataPath}`);
        await objectManager.upload(metadataPath, metadataBuffer, {
          'Content-Type': 'application/json'
        }, {});
      }

      return `ipfs://${metadataCID}`;
    } catch (error) {
      console.error('メタデータの処理中にエラーが発生:', error);
      throw new Error('メタデータの処理に失敗しました');
    }

  } catch (error) {
    console.error('Filebaseアップロードエラー:', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }
}
