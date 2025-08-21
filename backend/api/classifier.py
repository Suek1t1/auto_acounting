# classifier.py
import os
import sys
import numpy as np
import cv2
import tempfile
from keras.models import load_model
from keras.utils import to_categorical

# backend をモジュール検索パスに追加
sys.path.append(os.path.join(os.path.dirname(__file__), "../"))

# train_and_save_model から関数と設定をインポート
from models.train_and_save_model import train_and_save_model, create_model, IMG_SIZE, INPUT_CHANNELS, classes

# -----------------------------
# 推論用関数
# -----------------------------
def predict_array(image_array, model_path):
    """
    推論用関数。画像配列を受け取り、クラスと確率を返す。
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"モデルが存在しません: {model_path}")
    
    model = load_model(model_path)
    # モデル入力に合わせて前処理
    image = np.expand_dims(image_array.astype('float32') / 255.0, axis=0)
    prediction = model.predict(image, verbose=0)
    
    class_idx = np.argmax(prediction)
    return classes[class_idx], float(np.max(prediction))

# -----------------------------
# ユニットテスト
# -----------------------------
if __name__ == "__main__":
    # --- 画像データ読み込み ---
    data, labels = [], []
    INPUT_CHANNELS = 3

    print("ユニットテスト用画像をロードしています...")
    base_path = os.path.join(os.path.dirname(__file__), "../models/unittest_pictures")

    for class_idx, c in enumerate(classes):
        class_dir = os.path.join(base_path, c)
        if not os.path.exists(class_dir):
            print(f"警告: ディレクトリ '{class_dir}' が見つかりません。")
            continue

        for img_file in os.listdir(class_dir):
            img_path = os.path.join(class_dir, img_file)
            image = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE if INPUT_CHANNELS == 1 else cv2.IMREAD_COLOR)
            if image is None:
                continue
            image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
            if INPUT_CHANNELS == 3 and image.ndim == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
            data.append(image)
            labels.append(class_idx)
            print(f"ロード中: {img_path}")

    if not data:
        print("画像が見つかりませんでした。ダミーデータでテストします。")
        num_train, num_val = 10, 2
        data = np.random.rand(num_train + num_val, IMG_SIZE, IMG_SIZE, INPUT_CHANNELS).astype('float32')
        labels = np.random.randint(0, len(classes), num_train + num_val)

    data = np.array(data)
    labels = np.array(labels)

    # データをシャッフル・分割
    idx = np.arange(len(data))
    np.random.shuffle(idx)
    data, labels = data[idx], labels[idx]

    num_train = int(len(data) * 0.8)
    x_train, y_train_raw = data[:num_train], labels[:num_train]
    x_val, y_val_raw = data[num_train:], labels[num_train:]

    y_train = to_categorical(y_train_raw, num_classes=len(classes))
    y_val = to_categorical(y_val_raw, num_classes=len(classes))

    # --- モデル作成・学習 ---
    print("モデルの訓練を開始します...")
    temp_dir = tempfile.gettempdir()
    test_model_path = os.path.join(temp_dir, "test_cat_dog_classifier.h5")

    model = create_model(input_shape=(IMG_SIZE, IMG_SIZE, INPUT_CHANNELS), num_classes=len(classes))
    model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_val, y_val), verbose=1)
    model.save(test_model_path)
    print(f"学習済みモデルを保存しました: {test_model_path}")

    # --- 推論テスト ---
    if len(x_val) > 0:
        test_image = x_val[0]
        true_label = classes[y_val_raw[0]]
        predicted_label, confidence = predict_array(test_image, model_path=test_model_path)

        print(f"テスト画像の真ラベル: {true_label}")
        print(f"推論結果: {predicted_label}, 確率: {confidence:.3f}")
        if predicted_label == true_label:
            print("結果: ✅ 推論成功")
        else:
            print("結果: ❌ 推論失敗")
    else:
        print("警告: 検証データがないため、推論テストをスキップします。")