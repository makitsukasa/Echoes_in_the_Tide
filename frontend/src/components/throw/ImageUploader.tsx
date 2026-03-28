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
      {filebaseConfig ? (
        <p className="text-green-600 mb-2 text-sm">画像を添付した投稿が可能です。</p>
      ) : (
        <p className="text-gray-500 mb-2 text-sm">テキストのみ投稿可能です。画像を添付するには設定画面で Filebase API キーを登録してください。</p>
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
