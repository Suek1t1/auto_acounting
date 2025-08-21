def calculate_total_price(prices, items):
    """
    価格と商品の数量から合計金額を計算する。

    Args:
        prices (dict): 商品名と価格のペアを格納する辞書。
        items (dict): 商品名と数量のペアを格納する辞書。

    Returns:
        int: 合計金額。
    """
    total_sum = 0
    for item_name, quantity in items.items():
        if item_name in prices:
            total_sum += prices[item_name] * quantity
        else:
            # 価格が定義されていない商品に対する処理
            # ここでは0として計算を進める
            print(f"警告: '{item_name}' の価格がprices辞書にありません。この商品の金額は0として計算されます。")
    print(prices)
    print(items)
    print("合計金額：" + str(total_sum))
    return total_sum

#以下ユニットテスト
import unittest

class TestCalculateTotalPrice(unittest.TestCase):
    """
    calculate_total_price関数のテストケース
    """
    def test_basic_calculation(self):
        """
        基本的な計算が正しいかテスト
        """
        prices = {"ANPAN": 200, "PEN": 100}
        items = {"ANPAN": 2, "PEN": 1}
        expected_total = 500
        result = calculate_total_price(prices, items)
        print("予測金額：" + str(expected_total) + "\n")
        self.assertEqual(result, expected_total)

    def test_empty_items(self):
        """
        items辞書が空の場合のテスト
        """
        prices = {"ANPAN": 200, "PEN": 100}
        items = {}
        expected_total = 0
        result = calculate_total_price(prices, items)
        print("予測金額：" + str(expected_total) + "\n")
        self.assertEqual(result, expected_total)

    def test_missing_price(self):
        """
        prices辞書に存在しないアイテムが含まれる場合のテスト
        """
        prices = {"PEN": 100}
        items = {"ANPAN": 2, "PEN": 1}
        # ANPANの価格がないため、PENの分のみ計算される (100 * 1 = 100)
        expected_total = 100
        result = calculate_total_price(prices, items)
        print("予測金額：" + str(expected_total) + "\n")
        self.assertEqual(result, expected_total)

    def test_zero_quantity(self):
        """
        数量がゼロの場合のテスト
        """
        prices = {"ANPAN": 200, "PEN": 100}
        items = {"ANPAN": 2, "PEN": 0}
        expected_total = 400
        result = calculate_total_price(prices, items)
        print("予測金額：" + str(expected_total) + "\n")
        self.assertEqual(result, expected_total)

# このスクリプトを直接実行した場合にテストを実行する
if __name__ == '__main__':
    unittest.main()