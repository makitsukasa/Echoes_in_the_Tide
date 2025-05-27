import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  image: File | null;
  previewUrl: string | null;
  filebaseConfig: { apiKey: string } | null;
  isLoading: boolean;
  onImageChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  previewUrl,
  filebaseConfig,
  isLoading,
  onImageChange,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!filebaseConfig) {
      alert('画像アップロードにはFilebaseの設定が必要です。');
      e.target.value = ''; // inputクリア
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      onImageChange(e.target.files[0]);
    } else {
      onImageChange(null);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">画像アップロード（任意）</label>
      {!filebaseConfig && (
        <p className="text-red-600 mb-2 text-sm">
          Filebase設定がありません。画像アップロードはできません。
        </p>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={isLoading || !filebaseConfig}
        onChange={handleFileChange}
        className="mb-2"
      />
      {previewUrl && (
        <div className="relative inline-block">
          <img src={previewUrl} alt="preview" className="w-32 h-32 object-cover rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            disabled={isLoading}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
