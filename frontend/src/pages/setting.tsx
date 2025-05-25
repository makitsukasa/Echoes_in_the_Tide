import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Setting() {
  const [filebaseApiKey, setFilebaseApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: 実際の保存処理を実装
      await new Promise(resolve => setTimeout(resolve, 1000)); // 仮の遅延
      console.log('保存:', { filebaseApiKey });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">設定</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="filebaseApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Filebase API Key
                </label>
                <input
                  type="password"
                  id="filebaseApiKey"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Filebase API Keyを入力してください"
                  value={filebaseApiKey}
                  onChange={(e) => setFilebaseApiKey(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  FilebaseのAPI Keyを設定することで、画像のアップロードが可能になります。
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
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
