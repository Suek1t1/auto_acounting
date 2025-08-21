# train_and_save_model.py
import os
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Activation
from keras.utils import to_categorical

# -----------------------------
# 設定
# -----------------------------
IMG_SIZE = 64
INPUT_CHANNELS = 1       # 画像がグレースケールなら1、カラーなら3
classes = ['cat', 'dog'] # 分類したいクラス

# モデル保存先
model_save_path = os.path.join(os.path.dirname(__file__), "product_classifier.h5")

# -----------------------------
# モデル構築関数
# -----------------------------
def create_model(input_shape=(IMG_SIZE, IMG_SIZE, INPUT_CHANNELS), num_classes=len(classes)):
    model = Sequential([
        Conv2D(32, (3,3), input_shape=input_shape),
        Activation('relu'),
        MaxPooling2D((2,2)),

        Conv2D(64, (3,3)),
        Activation('relu'),
        MaxPooling2D((2,2)),

        Flatten(),
        Dense(64),
        Activation('relu'),
        Dense(num_classes),
        Activation('softmax')
    ])
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

# -----------------------------
# 学習関数
# -----------------------------
def train_and_save_model(x_train, y_train, x_val, y_val):
    model = create_model()
    model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_val, y_val))
    model.save(model_save_path)
    print(f"学習済みモデルを保存しました: {model_save_path}")

# -----------------------------
# このファイル単体で実行するときの例（デバッグ用）
# -----------------------------
if __name__ == "__main__":
    # デバッグ用に空のダミーデータ
    import numpy as np
    x_train = np.random.rand(10, IMG_SIZE, IMG_SIZE, INPUT_CHANNELS).astype('float32')
    y_train = to_categorical(np.random.randint(0, len(classes), 10))
    x_val = np.random.rand(2, IMG_SIZE, IMG_SIZE, INPUT_CHANNELS).astype('float32')
    y_val = to_categorical(np.random.randint(0, len(classes), 2))

    train_and_save_model(x_train, y_train, x_val, y_val)