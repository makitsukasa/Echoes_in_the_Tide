import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageUploader } from '../../bottle/components/ImageUploader';
import { useThrowBottle } from '../../../utils/contract';
import { uploadImageToFilebase, uploadMetadataToFilebase } from '../../../utils/filebase';
import { useBottleStore } from '../../bottle/stores/useBottleStore';
import { BottleMetadata } from '../../../types/contract';
import { useAccount, useConnect } from 'wagmi';
import type { WalletClient, Account } from 'viem';

export const ThrowForm = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { isConnected, address, connector } = useAccount();
  const { connect, connectors } = useConnect();

  const walletClient = connector?.walletClient as WalletClient | undefined;
  const account = address ? { address } as Account : undefined;

  const {
    filebaseConfig,
    loadConfig,
  } = useBottleStore();

  const { throwBottle, isLoading } = useThrowBottle({ description: message, image: null });

  // ウォレット接続状態の変更を監視し、復号も行ってからsubmitする
  useEffect(() => {
    if (isConnected && shouldSubmit && walletClient && account) {
      (async () => {
        await loadConfig(walletClient, account);
        handleSubmitInternal();
        setShouldSubmit(false);
      })();
    }
  }, [isConnected, shouldSubmit, walletClient, account, loadConfig]);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmitInternal = async () => {
    if (!filebaseConfig && image) {
      toast.error('画像をアップロードするにはFilebaseの設定が必要です');
      return;
    }

    try {
      setIsUploading(true);
      let uri = null;
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
        const base64Metadata = btoa(metadataJson);
        uri = `data:application/json;base64,${base64Metadata}`;
      }

      if (throwBottle) {
        await throwBottle(uri ?? '');
        setMessage('');
        setImage(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('送信に失敗しました');
    } finally {
      setIsUploading(false);
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

    await loadConfig(walletClient!, account!);
    await handleSubmitInternal();
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
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading || isUploading}
        >
          送信
        </button>
      </div>
    </form>
  );
};
