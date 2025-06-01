import { useSettingForm } from '../../hooks/useSettingForm';

export default function SettingForm() {
  const {
    isLoading,
    isConnected,
    apiKey,
    isSaving,
    handleChange,
    handleSubmit,
    handleClear,
  } = useSettingForm();

  if (isLoading) return <p className="text-center py-4 text-gray-600">読み込み中...</p>;
  if (!isConnected)
    return (
      <p className="text-center py-4 text-gray-600">
        設定を保存するにはウォレットを接続してください
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <label htmlFor="filebaseApiKey" className="block text-sm font-medium text-gray-700 mb-2">
          Filebase IPFS RPC API Key
        </label>
        <input
          type="password"
          id="filebaseApiKey"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="API Keyを入力してください"
          value={apiKey}
          onChange={handleChange}
          disabled={isSaving}
        />
        <p className="mt-2 text-sm text-gray-500">
          FilebaseのAPI Keyを設定すると、画像アップロードが可能になります。設定は暗号化されて保存されます。
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={handleClear} disabled={isSaving} className="btn-red">
          設定を削除
        </button>
        <button type="submit" disabled={isSaving} className="btn-blue">
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
