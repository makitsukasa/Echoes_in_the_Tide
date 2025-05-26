import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageUploader } from '../../bottle/components/ImageUploader';
import { useThrowBottle } from '../../../utils/contract';
import { uploadToFilebase, uploadMetadataToFilebase } from '../../../utils/filebase';
import { useBottleStore } from '../../bottle/stores/useBottleStore';
import { BottleMetadata } from '../../../types/contract';
import { useAccount, useConnect } from 'wagmi';

export const ThrowForm = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const filebaseConfig = useBottleStore((state) => state.filebaseConfig);
  const { throwBottle, isLoading } = useThrowBottle({ message, imageHash: null });

  // ウォレット接続状態の変更を監視
  useEffect(() => {
    if (isConnected && shouldSubmit) {
      handleSubmit(new Event('submit') as unknown as FormEvent);
      setShouldSubmit(false);
    }
  }, [isConnected, shouldSubmit]);

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
      if (connectors[0]) {
        setShouldSubmit(true);
        connect({ connector: connectors[0] });
      }
      return;
    }

    if (image && !filebaseConfig) {
      toast.error('画像をアップロードするにはFilebaseの設定が必要です');
      return;
    }

    try {
      setIsUploading(true);
      let imageHash = null;
      let metadataHash = null;

      if (filebaseConfig) {
        // Filebaseが設定されている場合、メタデータと画像をFilebaseに保存
        const metadata: BottleMetadata = {
          message,
          imageHash: null,
          timestamp: Date.now(),
        };

        if (image) {
          imageHash = await uploadToFilebase(image, filebaseConfig);
          metadata.imageHash = imageHash;
        }

        metadataHash = await uploadMetadataToFilebase(metadata, filebaseConfig);
      }

      if (throwBottle) {
        // Filebaseが設定されている場合はメタデータのハッシュを、そうでない場合はメッセージを直接送信
        await throwBottle();
        setMessage('');
        setImage(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error(error);
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
          disabled={isLoading || isUploading}
        />
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
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || isUploading || !message.trim()}
        >
          {isLoading || isUploading ? '送信中...' : '小瓶を流す'}
        </button>
      </div>
    </form>
  );
};
