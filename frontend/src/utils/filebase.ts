import { toast } from 'sonner';
import { BottleMetadata } from '../types/contract';

interface FilebaseConfig {
  apiKey: string;
}

const FILEBASE_IPFS_ENDPOINT = 'https://rpc.filebase.io/api/v0';

const getAuthHeader = (config: FilebaseConfig): string => {
  return `Bearer ${config.apiKey}`;
};

export const uploadImageToFilebase = async (file: File, config: FilebaseConfig): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${FILEBASE_IPFS_ENDPOINT}/add`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Filebaseへのアップロードに失敗しました');
    }

    const data = await response.json();
    return `ipfs://${data.Hash}`;
  } catch (error) {
    toast.error('画像のアップロードに失敗しました');
    throw error;
  }
};

export const uploadMetadataToFilebase = async (metadata: BottleMetadata, config: FilebaseConfig): Promise<string> => {
  try {
    // メタデータをBlobに変換
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], '0.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', metadataFile);

    const response = await fetch(`${FILEBASE_IPFS_ENDPOINT}/add`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('メタデータのアップロードに失敗しました');
    }

    const data = await response.json();
    console.log('メタデータのアップロードに成功しました', data);
    return `ipfs://${data.Hash}`;
  } catch (error) {
    toast.error('メタデータのアップロードに失敗しました');
    throw error;
  }
};
