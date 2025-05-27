import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useBottleStore } from '../features/bottle/stores/useBottleStore';
import { toast } from 'sonner';
import { useAccount, useWalletClient } from 'wagmi';

export default function Setting() {
  const { filebaseConfig, loadConfig, saveConfig, clearConfig } = useBottleStore();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const loadStoredConfig = async () => {
      if (isConnected && walletClient && walletClient.account) {
        try {
          await loadConfig(walletClient, walletClient.account);
        } catch (error) {
          console.error('設定の読み込みに失敗しました:', error);
          toast.error('設定の読み込みに失敗しました');
        }
      }
      setIsLoading(false);
    };
    loadStoredConfig();
  }, [isConnected, walletClient, loadConfig]);

  useEffect(() => {
    if (filebaseConfig?.apiKey) {
      setApiKey(filebaseConfig.apiKey);
    }
  }, [filebaseConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient || !walletClient.account) {
      toast.error('ウォレットを接続してください');
      return;
    }
    if (!apiKey.trim()) {
      toast.error('APIキーを入力してください');
      return;
    }
    setIsSaving(true);
    try {
      const config = { apiKey: apiKey.trim() };
      await saveConfig(walletClient, walletClient.account, config);
      toast.success('設定を保存しました');
    } catch (error) {
      console.error(error);
      toast.error('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!isConnected || !walletClient || !walletClient.account) {
      toast.error('ウォレットを接続してください');
      return;
    }
    try {
      clearConfig();
      setApiKey('');
      toast.success('設定を削除しました');
    } catch (error) {
      console.error(error);
      toast.error('設定の削除に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">設定</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">設定を保存するにはウォレットを接続してください</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="filebaseApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Filebase IPFS RPC API Key
                  </label>
                  <input
                    type="password"
                    id="filebaseApiKey"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Filebase IPFS RPC API Keyを入力してください"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isSaving}
                    autoComplete="off"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    FilebaseのIPFS RPC API Keyを設定することで、画像のアップロードが可能になります。
                    設定はMetamaskの署名で暗号化されてブラウザに保存されます。
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isSaving}
                    className="px-6 py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    設定を削除
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">アプリケーション情報</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">バージョン</dt>
                <dd className="mt-1 text-sm text-gray-900">1.0.0</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ネットワーク</dt>
                <dd className="mt-1 text-sm text-gray-900">Polygon Amoy Testnet</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
