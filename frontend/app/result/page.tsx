/**
 * 結果表示画面
 * 
 * この画面では、会計処理の結果として商品画像、商品リスト、合計金額を表示します。
 * ワイヤーフレームに従って、左側に商品画像、右側に商品リストと合計を配置しています。
 * トップ画面で選択された画像が表示されます。
 * 
 * @author Auto Accounting System
 * @version 1.0.0
 */

'use client';

import { useRouter } from 'next/navigation';
import { useImageContext } from '../contexts/ImageContext';

/**
 * 商品アイテムの型定義
 */
interface ProductItem {
  /** 商品名 */
  name: string;
  /** 数量 */
  quantity: number;
  /** 単価（円） */
  unitPrice: number;
  /** 商品の形状を表すアイコン */
  icon: string;
}

/**
 * 結果表示画面のメインコンポーネント
 * 
 * @returns {React.JSX.Element} 結果表示画面のJSX要素
 */
export default function ResultPage(): React.JSX.Element {
  const router = useRouter();
  const { currentImage } = useImageContext();

  /**
   * サンプル商品データ
   * 実際の実装では、APIから取得したデータを使用します
   */
  const productItems: ProductItem[] = [
    { name: '商品A', quantity: 1, unitPrice: 1500, icon: '●●●●●' },
    { name: '商品B', quantity: 1, unitPrice: 2000, icon: '■■■■■' },
    { name: '商品C', quantity: 1, unitPrice: 1200, icon: '△△△△△' },
    { name: '商品D', quantity: 1, unitPrice: 1800, icon: '★★★★★' }
  ];

  /**
   * 合計金額を計算
   * 
   * @returns {number} 合計金額（円）
   */
  const calculateTotal = (): number => {
    return productItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  /**
   * トップ画面に戻るハンドラー
   */
  const handleBackToTop = (): void => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white border border-blue-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">会計結果</h1>
          <button
            onClick={handleBackToTop}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            トップに戻る
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="flex gap-8">
          {/* 左側：商品画像エリア */}
          <div className="flex-1">
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400 overflow-hidden">
              {currentImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={currentImage.previewUrl}
                    alt="会計対象の画像"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-600 text-lg font-medium">商品画像</p>
                  <p className="text-gray-500 text-sm mt-2">画像が選択されていません</p>
                </div>
              )}
            </div>
            {/* 画像情報 */}
            {currentImage && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">{currentImage.fileName}</p>
              </div>
            )}
          </div>

          {/* 右側：商品リストと合計 */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">商品リスト</h2>
              
              {/* 商品アイテム */}
              <div className="space-y-4 mb-6">
                {productItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-gray-700">× {item.quantity}個</span>
                    </div>
                    <span className="text-gray-800 font-medium">
                      = {item.unitPrice.toLocaleString()}円
                    </span>
                  </div>
                ))}
              </div>

              {/* 合計金額 */}
              <div className="text-center pt-4 border-t-2 border-gray-300">
                <p className="text-2xl font-bold text-gray-800">
                  合計: {calculateTotal().toLocaleString()}円
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
