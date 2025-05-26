import { ChangeEvent, DragEvent } from 'react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  image: File | null;
  previewUrl: string | null;
  filebaseConfig: { apiKey: string } | null;
  isLoading: boolean;
  onImageChange: (file: File | null) => void;
}

export const ImageUploader = ({
  image,
  previewUrl,
  filebaseConfig,
  isLoading,
  onImageChange,
}: ImageUploaderProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!filebaseConfig) {
        toast.error('画像をアップロードするにはFilebaseの設定が必要です');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('ファイルサイズは10MB以下にしてください');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('画像ファイルのみアップロード可能です');
        return;
      }
      onImageChange(file);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!filebaseConfig) {
      e.preventDefault();
      toast.error('画像をアップロードするにはFilebaseの設定が必要です');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!filebaseConfig) {
      toast.error('画像をアップロードするにはFilebaseの設定が必要です');
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('ファイルサイズは10MB以下にしてください');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('画像ファイルのみアップロード可能です');
        return;
      }
      onImageChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        画像（任意）
        {!filebaseConfig && (
          <span className="ml-2 text-sm text-gray-500">
            ※画像をアップロードするにはFilebaseの設定が必要です
          </span>
        )}
      </label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="プレビュー"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onImageChange(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
                disabled={isLoading}
              >
                画像を削除
              </button>
            </div>
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              onClick={handleClick}
            >
              <span>画像をアップロード</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </label>
            <p className="pl-1">またはドラッグ＆ドロップ</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};
