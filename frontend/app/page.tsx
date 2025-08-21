/**
 * 画像アップロード画面
 * 
 * この画面では、ユーザーが画像を参照するか会計処理を開始するかを選択できます。
 * ワイヤーフレームに従って、2つのボタンを中央に配置し、画像プレビューも表示します。
 * 
 * @author Auto Accounting System
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useImageContext } from './contexts/ImageContext';

/**
 * トップ画面のメインコンポーネント
 * 
 * @returns {React.JSX.Element} トップ画面のJSX要素
 */
export default function TopPage(): React.JSX.Element {
  const router = useRouter();
  const { currentImage, setImage, clearImage } = useImageContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 画像参照ボタンのクリックハンドラー
   * ファイル選択ダイアログを開き、選択された画像を処理します
   */
  const handleImageReference = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setImage(file);
        console.log('選択された画像:', file.name);
      }
    };
    input.click();
  };

  /**
   * 会計処理ボタンのクリックハンドラー
   * 画像が選択されている場合のみ会計処理を開始し、結果画面に遷移します
   */
  const handleAccounting = async (): Promise<void> => {
    if (!currentImage) {
      alert('先に画像を選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
      const formData = new FormData();
      formData.append('file', currentImage.file, currentImage.fileName);

      const response = await fetch(`${backendUrl}/process/binarize`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`handleAccounting: APIエラー status=${response.status} body=${text}`);
      }

      const result = await response.json();
      console.log('二値化結果:', result);

      router.push('/result');
    } catch (error) {
      console.error('会計処理中にエラーが発生しました:', error);
      alert(`会計処理でエラーが発生しました。詳細: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 選択された画像をクリアする
   */
  const handleClearImage = (): void => {
    clearImage();
  };

  return (
    <div className="min-h-screen bg-white border border-blue-300 flex flex-col items-center justify-center p-8">
      <div className="space-y-6 w-full max-w-md">
        {/* 画像プレビューエリア */}
        {currentImage && (
          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <img
                  src={currentImage.previewUrl}
                  alt="選択された画像"
                  className="max-w-full h-48 object-contain mx-auto rounded-lg mb-3"
                />
                <p className="text-sm text-gray-600 mb-2">{currentImage.fileName}</p>
                <button
                  onClick={handleClearImage}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors duration-200"
                >
                  画像を削除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 画像参照ボタン */}
        <button
          onClick={handleImageReference}
          className="w-full h-16 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {currentImage ? '画像を変更' : '画像を参照'}
        </button>

        {/* 会計処理ボタン */}
        <button
          onClick={handleAccounting}
          disabled={isLoading || !currentImage}
          className={`w-full h-16 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            (isLoading || !currentImage) ? 'cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? '処理中...' : '会計をする'}
        </button>

        {/* 画像選択の案内 */}
        {!currentImage && (
          <p className="text-center text-gray-500 text-sm">
            会計処理を行うには、先に画像を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
