"""
キャラクター切り取りスクリプト（y_offset対応版）
各セルの上部に前行テキストが混入する問題を修正
"""
from PIL import Image
import os

img = Image.open(r"app/psychology_app/images/26e1cecb-2615-4ae1-82ce-b00e359c7ba5.png")
out = r"app/psychology_app/images/chars"
os.makedirs(out, exist_ok=True)

def crop_grid(box, cols, rows, names, prefix,
              y_start_ratio=0.0, y_end_ratio=0.80, char_w_ratio=1.0):
    """
    y_start_ratio: 各セル内でスキップする上部の割合（数字ラベルや前行テキスト除去）
    y_end_ratio  : 各セル内でキャプチャする高さの割合（0.0から)
    """
    x0, y0, x1, y1 = box
    cell_w = (x1 - x0) / cols
    cell_h = (y1 - y0) / rows
    idx = 0
    for row in range(rows):
        for col in range(cols):
            if idx >= len(names):
                break
            cx0 = int(x0 + col * cell_w)
            cx1 = int(cx0 + cell_w * char_w_ratio)
            cy0 = int(y0 + row * cell_h + cell_h * y_start_ratio)
            cy1 = int(y0 + row * cell_h + cell_h * y_end_ratio)
            cropped = img.crop((cx0, cy0, cx1, cy1))
            # 正方形にリサイズして統一感を出す
            size = max(cropped.width, cropped.height)
            square = Image.new("RGBA", (size, size), (255, 255, 255, 0))
            offset_x = (size - cropped.width) // 2
            offset_y = (size - cropped.height) // 2
            square.paste(cropped.convert("RGBA"), (offset_x, offset_y))
            final = square.resize((300, 300), Image.LANCZOS)
            final.save(os.path.join(out, f"{prefix}_{names[idx]}.png"))
            idx += 1
    print(f"[{prefix}] {idx}枚保存")

# ① MBTI 16タイプ (x=10..533, y=29..670, 4×4)
# 各セル160px: 上5%=数字ラベル, 中65%=イラスト+名前, 下30%=タグライン
# → y_start=0.05(上スキップ), y_end=0.75(タグライン除外)
crop_grid(
    (10, 29, 533, 670), 4, 4,
    ["ENTJ","INTP","ESTJ","INFP",
     "ESFJ","ENFP","INFJ","ENFJ",
     "ISTJ","ESFP","ISFP","ENTP",
     "ESTP","ISFJ","INTJ","ISTP"],
    "mbti",
    y_start_ratio=0.10, y_end_ratio=0.80
)

# ② 恋愛タイプ (x=533..923, y=64..670, 4×2)
# 各セル303px: キャラは上45%程度
crop_grid(
    (533, 64, 923, 670), 4, 2,
    ["PDW","PIW","CIW","PIE","CIE","PDE","CDW","CDE"],
    "love_type",
    y_start_ratio=0.07, y_end_ratio=0.55
)

# ③ 相性 (x=923..1356, y=29..670, 2列×4行, 左50%のみ)
# 各セル160px高 216px幅: キャラは左50%・上80%
crop_grid(
    (923, 29, 1356, 670), 2, 4,
    ["AHO","ATO","FHO","ATU","FHU","FTO","AHU","FTU"],
    "compatibility",
    y_start_ratio=0.08, y_end_ratio=0.88, char_w_ratio=0.50
)

# ④ 束縛度 (x=5..435, y=785..1145, 4×2)
crop_grid(
    (5, 785, 435, 1145), 4, 2,
    ["TRL","TRS","TEL","TES","CRL","CRS","CEL","CES"],
    "jealousy",
    y_start_ratio=0.08, y_end_ratio=0.70
)

# ⑤ 依存度 (x=436..857, y=785..1145, 4×2)
crop_grid(
    (436, 785, 857, 1145), 4, 2,
    ["BCP","BCA","BRP","BRA","MCP","MCA","MRP","MRA"],
    "love_dependency",
    y_start_ratio=0.08, y_end_ratio=0.70
)

# ⑥ デート (x=858..1360, y=785..1145, 4×2)
crop_grid(
    (858, 785, 1360, 1145), 4, 2,
    ["AFP","AFO","MEP","MFP","AEO","AEP","MFO","MEO"],
    "ideal_date",
    y_start_ratio=0.08, y_end_ratio=0.70
)

print("\n完了! 全画像300×300pxに統一")
