import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { ImageUploader } from './ImageUploader';
import { useThrowBottle } from '../../hooks/useThrowBottle';
import { uploadImageToFilebase, uploadMetadataToFilebase } from '../../utils/filebase';
import { useBottleStore } from '../../stores/useBottleStore';
import { BottleMetadata } from '../../types/contract';
import { useAccount } from 'wagmi';
import { Base64 } from 'js-base64';

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ThrowForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isConnected } = useAccount();

  const { filebaseConfig } = useBottleStore();
  const { throwBottle, isLoading } = useThrowBottle();

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('ウォレットを接続してください');
      return;
    }

    if (!message.trim()) {
      toast.error('メッセージを入力してください');
      return;
    }
    if (message.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`メッセージは${MAX_DESCRIPTION_LENGTH}文字以内で入力してください`);
      return;
    }
    if (image) {
      if (!image.type.startsWith('image/')) {
        toast.error('画像ファイルを選択してください');
        return;
      }
      if (image.size > MAX_IMAGE_SIZE) {
        toast.error('画像は5MB以下にしてください');
        return;
      }
    }

    if (!filebaseConfig && image) {
      toast.error('画像をアップロードするにはFilebaseの設定が必要です');
      return;
    }

    try {
      setIsUploading(true);
      let uri: string;
      const metadata: BottleMetadata = {
        name: 'Echoes in the Tide',
        description: message,
        image: '',
      };

      if (filebaseConfig) {
        if (image) {
          const imageCID = await uploadImageToFilebase(image, filebaseConfig);
          metadata.image = imageCID ?? '';
        }
        uri = await uploadMetadataToFilebase(metadata, filebaseConfig);
      } else {
        const metadataJson = JSON.stringify(metadata);
        const utf8Bytes = new TextEncoder().encode(metadataJson);
        const base64String = Base64.fromUint8Array(utf8Bytes);
        uri = `data:application/json;base64,${base64String}`;
      }

      await throwBottle(uri);
      setMessage('');
      setImage(null);
      setPreviewUrl(null);
      router.push('/');
    } catch (error) {
      console.error('[ThrowForm] 送信エラー:', error);
      if (error instanceof Error && error.message.includes('Chain not configured')) {
        toast.error('ウォレットに Polygon Amoy ネットワークを追加してから接続し直してください（チェーンID: 80002）');
      } else if (error instanceof Error && error.message.toLowerCase().includes('user rejected')) {
        toast.error('トランザクションがキャンセルされました');
      } else {
        toast.error('送信に失敗しました');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          メッセージ
        </label>
        <textarea
          id="message"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="海に流すメッセージを入力してください..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isLoading || isUploading}
        />
        <p className="text-right text-sm text-gray-400">{message.length} / {MAX_DESCRIPTION_LENGTH}</p>
      </div>

      <ImageUploader
        image={image}
        previewUrl={previewUrl}
        filebaseConfig={filebaseConfig}
        isLoading={isLoading || isUploading}
        onImageChange={handleImageChange}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading || isUploading}
        >
          送信
        </button>
      </div>
    </form>
  );
};
