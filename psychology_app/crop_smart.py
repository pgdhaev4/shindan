"""
スマートクロップ: 白背景を自動検出しキャラクターにぴったり合わせてトリミング
出力先: app/psychology_app/images/chars_new/ （既存 chars/ は変更しない・確認用）

改善点:
  - セルを切り取った後、白背景を numpy で自動検出
  - コンテンツ周囲に 5% のパディングを付けて正方形に整形
  - 300×300 にリサイズ
"""
import os
import numpy as np
from PIL import Image

SRC_DIR = "app/psychology_app/images/chars/love_quiz_52_new_individual_jpgs"
DST_DIR = "app/psychology_app/images/chars_new"

# ── シート定義 ───────────────────────────────────────────────────────────────
# y_start_ratio: セル内で上からスキップする割合（数字ラベル除去用）
# y_end_ratio  : セル内でキャプチャする高さの割合（下部テキスト除去用）
SHEETS = [
    {
        "file": "ChatGPT Image 2026年6月5日 21_10_37.png",
        "rows": 1, "cols": 2, "chars": [1, 2],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_15.png",
        "rows": 2, "cols": 4, "chars": [3, 4, 5, 6, 7, 8, 9, 10],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_20.png",
        "rows": 2, "cols": 4, "chars": [11, 12, 13, 14, 15, 16, 17, 18],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_23.png",
        "rows": 2, "cols": 4, "chars": [19, 20, 21, 22, 23, 24, 25, 26],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_26.png",
        "rows": 2, "cols": 4, "chars": [27, 28, 29, 30, 31, 32, 33, 34],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_30.png",
        "rows": 2, "cols": 4, "chars": [35, 36, 37, 38, 39, 40, 41, 42],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_34.png",
        "rows": 2, "cols": 4, "chars": [43, 44, 45, 46, 47, 48, 49, 50],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_39.png",
        "rows": 1, "cols": 2, "chars": [51, 52],
        "y_start_ratio": 0.0, "y_end_ratio": 0.92,
    },
    {
        # このシートは各セルに「01/02…」数字ラベル(上)＋説明テキスト(下)がある
        # → 上10%と下30%をスキップしてキャラクター部分だけ切り取る
        "file": "恋愛回復タイプ診断.png",
        "rows": 2, "cols": 4,
        "chars": [101, 102, 103, 104, 105, 106, 107, 108],
        "y_start_ratio": 0.10, "y_end_ratio": 0.68,
    },
]

# ── キャラ番号 → 保存ファイル名 ─────────────────────────────────────────────
CHAR_TO_FILE = {
    # love_type
    10: "love_type_PDE.png",
    14: "love_type_PDW.png",
     9: "love_type_PIE.png",
     1: "love_type_PIW.png",
    40: "love_type_CDE.png",
    11: "love_type_CDW.png",
    18: "love_type_CIE.png",
    12: "love_type_CIW.png",
    # compatibility
    24: "compatibility_AHO.png",
    46: "compatibility_AHU.png",
    47: "compatibility_ATO.png",
     3: "compatibility_ATU.png",
    38: "compatibility_FHO.png",
    37: "compatibility_FHU.png",
    50: "compatibility_FTO.png",
    42: "compatibility_FTU.png",
    # jealousy
    21: "jealousy_CES.png",
    34: "jealousy_CEL.png",
    36: "jealousy_CRS.png",
     2: "jealousy_CRL.png",
     5: "jealousy_TES.png",
    49: "jealousy_TEL.png",
    43: "jealousy_TRS.png",
    22: "jealousy_TRL.png",
    # love_dependency
    23: "love_dependency_MRP.png",
     7: "love_dependency_MRA.png",
    31: "love_dependency_MCP.png",
     8: "love_dependency_MCA.png",
    20: "love_dependency_BRP.png",
     4: "love_dependency_BRA.png",
    16: "love_dependency_BCP.png",
    30: "love_dependency_BCA.png",
    # ideal_date
    35: "ideal_date_AEP.png",
    32: "ideal_date_AEO.png",
    28: "ideal_date_AFP.png",
    19: "ideal_date_AFO.png",
    15: "ideal_date_MEP.png",
    29: "ideal_date_MEO.png",
    44: "ideal_date_MFP.png",
    27: "ideal_date_MFO.png",
    # heartbreak
    101: "heartbreak_DNC.png",
    102: "heartbreak_DME.png",
    103: "heartbreak_DMC.png",
    104: "heartbreak_DNE.png",
    105: "heartbreak_RME.png",
    106: "heartbreak_RMC.png",
    107: "heartbreak_RNE.png",
    108: "heartbreak_RNC.png",
    # 未割当キャラ（diagnostic未設定・将来用）
     6: "char_06.png",   # 天然人たらし犬
    13: "char_13.png",   # 迫られたいクジャク
    17: "char_17.png",   # 駆け引きハリネズミ
    25: "char_25.png",   # 泣き虫ひつじ
    26: "char_26.png",   # 八方美人カメレオン
    33: "char_33.png",   # 察してちゃんハリネズミ
    39: "char_39.png",   # 俺様至上パンダ
    41: "char_41.png",   # 執念の復讐ハリネズミ
    45: "char_45.png",   # インスタ映え女王猫
    48: "char_48.png",   # 冷めた目のカメ
    51: "char_51.png",   # 承認欲求モンスター猫
    52: "char_52.png",   # いいねゼロパンダ
}


def smart_crop_to_square(cell_img, white_threshold=245, padding_ratio=0.06,
                          output_size=300, label_gap_threshold=10):
    """
    ① 白ギャップ（キャラクターとラベルテキストの間）を検出してラベルを排除
    ② 残った領域の白背景をトリミングしてコンテンツにぴったり合わせる
    ③ パディング付きの正方形にして output_size にリサイズして返す
    """
    arr = np.array(cell_img.convert("RGB"))
    h, w = arr.shape[:2]

    # 各行に「コンテンツあり」かどうかを判定（非白ピクセルが1つでもあれば True）
    row_has_content = np.any(np.any(arr < white_threshold, axis=2), axis=1)
    content_rows = np.where(row_has_content)[0]

    if len(content_rows) == 0:
        return cell_img.resize((output_size, output_size), Image.LANCZOS)

    # ──ラベル除去: 最後の大きなギャップを探してキャラクター下端を特定──
    # 「キャラクター本体」と「ラベルテキスト」の間には白い隙間がある
    char_bottom = int(content_rows[-1]) + 1  # デフォルト: ラベルなし
    for i in range(len(content_rows) - 2, -1, -1):
        gap = int(content_rows[i + 1]) - int(content_rows[i]) - 1
        if gap >= label_gap_threshold:
            char_bottom = int(content_rows[i]) + 1
            break

    # ラベル除去後の画像で再度スマートクロップ
    trimmed = cell_img.crop((0, 0, w, char_bottom))
    arr2 = np.array(trimmed.convert("RGB"))
    mask = np.any(arr2 < white_threshold, axis=2)
    rows_c = np.where(mask.any(axis=1))[0]
    cols_c = np.where(mask.any(axis=0))[0]

    if len(rows_c) == 0 or len(cols_c) == 0:
        return trimmed.resize((output_size, output_size), Image.LANCZOS)

    cy0, cy1 = int(rows_c[0]), int(rows_c[-1]) + 1
    cx0, cx1 = int(cols_c[0]), int(cols_c[-1]) + 1
    content_h = cy1 - cy0
    content_w = cx1 - cx0

    base = max(content_h, content_w)
    pad = int(base * padding_ratio)
    size = base + pad * 2

    square = Image.new("RGB", (size, size), (255, 255, 255))
    off_x = (size - content_w) // 2
    off_y = (size - content_h) // 2
    content = trimmed.crop((cx0, cy0, cx1, cy1))
    square.paste(content, (off_x, off_y))
    return square.resize((output_size, output_size), Image.LANCZOS)


def main():
    os.makedirs(DST_DIR, exist_ok=True)
    char_images = {}

    for sheet in SHEETS:
        path = os.path.join(SRC_DIR, sheet["file"])
        if not os.path.exists(path):
            print(f"  [スキップ] ファイルなし: {path}")
            continue

        img = Image.open(path).convert("RGB")
        W, H = img.size
        rows, cols = sheet["rows"], sheet["cols"]
        cell_w = W // cols
        cell_h = H // rows
        y_start = sheet["y_start_ratio"]
        y_end   = sheet["y_end_ratio"]
        pad_x   = int(cell_w * 0.02)

        print(f"[{sheet['file'][:30]}]  {W}×{H}  cell={cell_w}×{cell_h}")

        for i, char_num in enumerate(sheet["chars"]):
            row = i // cols
            col = i % cols
            x0 = col * cell_w + pad_x
            x1 = (col + 1) * cell_w - pad_x
            y0 = int(row * cell_h + cell_h * y_start)
            y1 = int(row * cell_h + cell_h * y_end)
            cell = img.crop((x0, y0, x1, y1))
            char_images[char_num] = cell

    saved = 0
    for char_num, dst_name in CHAR_TO_FILE.items():
        if char_num not in char_images:
            print(f"  警告: キャラ{char_num}の画像が見つかりません")
            continue
        cell = char_images[char_num]
        final = smart_crop_to_square(cell)
        dst_path = os.path.join(DST_DIR, dst_name)
        final.save(dst_path)
        print(f"  保存: {dst_name}  (キャラ{char_num:02d})")
        saved += 1

    print(f"\n完了: {saved}枚 → {DST_DIR}/")
    print("確認後、問題なければ chars/ にコピーしてください。")


if __name__ == "__main__":
    main()
