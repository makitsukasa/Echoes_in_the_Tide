import React, { useState } from 'react';
import { useMintBottle } from '../../../utils/contract';
import { useWalletStore } from '../../../stores/useWalletStore';

export const MintView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { isConnected } = useWalletStore();
  const { write: mintBottle, isLoading } = useMintBottle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    try {
      // TODO: 画像がある場合はIPFSにアップロード
      // TODO: メタデータを作成してIPFSにアップロード
      // TODO: mintBottleを呼び出す
      console.log('Minting bottle with message:', message);
    } catch (error) {
      console.error('Error minting bottle:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">小瓶を流す</h1>
        <p className="text-gray-600">ウォレットを接続してください</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">小瓶を流す</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            メッセージ
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            画像（任意）
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !message}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? '流しています...' : '小瓶を流す'}
        </button>
      </form>
    </div>
  );
};
