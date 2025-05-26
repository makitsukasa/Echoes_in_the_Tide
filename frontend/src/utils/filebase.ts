import { toast } from 'sonner';
import { BottleMetadata } from '../types/contract';

interface FilebaseConfig {
  apiKey: string;
  apiSecret: string;
}

export const uploadToFilebase = async (file: File, config: FilebaseConfig): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.filebase.io/v1/ipfs/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}:${config.apiSecret}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Filebaseへのアップロードに失敗しました');
    }

    const data = await response.json();
    return data.ipfsHash;
  } catch (error) {
    toast.error('画像のアップロードに失敗しました');
    throw error;
  }
};

export const uploadMetadataToFilebase = async (metadata: BottleMetadata, config: FilebaseConfig): Promise<string> => {
  try {
    const response = await fetch('https://api.filebase.io/v1/ipfs/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}:${config.apiSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('メタデータのアップロードに失敗しました');
    }

    const data = await response.json();
    return data.ipfsHash;
  } catch (error) {
    toast.error('メタデータのアップロードに失敗しました');
    throw error;
  }
};
