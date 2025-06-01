export default function AppInfo() {
  return (
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
  );
}
