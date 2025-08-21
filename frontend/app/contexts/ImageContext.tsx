/**
 * 画像状態管理コンテキスト
 * 
 * このコンテキストは、トップ画面で選択された画像を結果画面で表示するために
 * アプリケーション全体で画像データを共有します。
 * 
 * @author Auto Accounting System
 * @version 1.0.0
 */

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * 画像データの型定義
 */
interface ImageData {
  /** 画像ファイル */
  file: File;
  /** 画像のプレビューURL */
  previewUrl: string;
  /** 画像名 */
  fileName: string;
}

/**
 * 画像コンテキストの型定義
 */
interface ImageContextType {
  /** 現在の画像データ */
  currentImage: ImageData | null;
  /** 画像を設定する関数 */
  setImage: (image: File) => void;
  /** 画像をクリアする関数 */
  clearImage: () => void;
}

/**
 * 画像コンテキストのデフォルト値
 */
const defaultImageContext: ImageContextType = {
  currentImage: null,
  setImage: () => {},
  clearImage: () => {},
};

/**
 * 画像コンテキスト
 */
const ImageContext = createContext<ImageContextType>(defaultImageContext);

/**
 * 画像コンテキストプロバイダーのプロパティ
 */
interface ImageProviderProps {
  /** 子コンポーネント */
  children: ReactNode;
}

/**
 * 画像コンテキストプロバイダー
 * 
 * @param props - プロバイダーのプロパティ
 * @returns 画像コンテキストプロバイダーのJSX要素
 */
export function ImageProvider({ children }: ImageProviderProps): React.JSX.Element {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);

  /**
   * 画像を設定する
   * 
   * @param file - 設定する画像ファイル
   */
  const setImage = (file: File): void => {
    const previewUrl = URL.createObjectURL(file);
    setCurrentImage({
      file,
      previewUrl,
      fileName: file.name,
    });
  };

  /**
   * 画像をクリアする
   */
  const clearImage = (): void => {
    if (currentImage?.previewUrl) {
      URL.revokeObjectURL(currentImage.previewUrl);
    }
    setCurrentImage(null);
  };

  return (
    <ImageContext.Provider value={{ currentImage, setImage, clearImage }}>
      {children}
    </ImageContext.Provider>
  );
}

/**
 * 画像コンテキストフック
 * 
 * @returns 画像コンテキストの値
 * @throws コンテキストがプロバイダー外で使用された場合
 */
export function useImageContext(): ImageContextType {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContextはImageProvider内で使用する必要があります');
  }
  return context;
}
