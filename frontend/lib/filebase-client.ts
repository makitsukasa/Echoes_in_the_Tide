import { Buffer } from 'buffer';

interface FormDataWithImage {
  name: string;
  description: string;
  image: File;
}

interface FormDataWithoutImage {
  name: string;
  description: string;
}

type FormData = FormDataWithImage | FormDataWithoutImage;

interface FilebaseResponse {
  cid: string;
  [key: string]: unknown;
}

export async function uploadToIPFS(
  data: FormData,
  key: string,
  secret: string
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('この関数はクライアントサイドでのみ実行できます');
  }

  if (!key || !secret) {
    throw new Error('Filebaseの認証情報が設定されていません');
  }

  try {
    const metadata: Record<string, string> = {
      name: data.name,
      description: data.description,
    };

    // 画像がある場合
    if ('image' in data && data.image) {
      try {
        const imageBuffer = Buffer.from(await data.image.arrayBuffer());
        const imagePath = `images/${Date.now()}-${data.image.name}`;

        // FilebaseのREST APIを使用して画像をアップロード
        const credentials = btoa(`${key}:${secret}`);
        const imageResponse = await fetch(`https://api.filebase.io/v1/ipfs/pins`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: imagePath,
            data: imageBuffer.toString('base64'),
            contentType: data.image.type || 'image/png'
          })
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          console.error('Filebase API Error:', errorData);
          throw new Error('画像のアップロードに失敗しました');
        }

        const imageResult = await imageResponse.json() as FilebaseResponse;
        metadata.image = `ipfs://${imageResult.cid}`;
      } catch (error) {
        console.error('画像の処理中にエラーが発生:', error);
        throw new Error('画像の処理に失敗しました');
      }
    }

    // メタデータをアップロード
    try {
      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
      const metadataPath = `metadata/${Date.now()}-metadata.json`;

      const credentials = btoa(`${key}:${secret}`);
      const metadataResponse = await fetch(`https://api.filebase.io/v1/ipfs/pins`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: metadataPath,
          data: metadataBuffer.toString('base64'),
          contentType: 'application/json'
        })
      });

      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        console.error('Filebase API Error:', errorData);
        throw new Error('メタデータのアップロードに失敗しました');
      }

      const metadataResult = await metadataResponse.json() as FilebaseResponse;
      return `ipfs://${metadataResult.cid}`;
    } catch (error) {
      console.error('メタデータの処理中にエラーが発生:', error);
      throw new Error('メタデータの処理に失敗しました');
    }

  } catch (error) {
    console.error('Filebaseアップロードエラー:', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }
}
