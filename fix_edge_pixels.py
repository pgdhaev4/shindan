# -*- coding: utf-8 -*-
"""
画像の端にある白いピクセルを、隣の内側ピクセルの色で置き換える
社畜診断・子育て診断両アプリ対応
"""
from PIL import Image
import os, shutil

APPS = [
    r"C:\Users\有田稔\Desktop\youtube_auto\app\workplace_app\images",
    r"C:\Users\有田稔\Desktop\youtube_auto\app\kosodate_app\images",
]

WHITE = 230  # この値以上を白とみなす
EDGE_DEPTH = 3  # 端から何ピクセルを修正するか

def is_white(r, g, b):
    return r >= WHITE and g >= WHITE and b >= WHITE

def fix_edges(img_path):
    img = Image.open(img_path).convert("RGBA")
    px = img.load()
    w, h = img.size
    changed = 0

    for depth in range(EDGE_DEPTH):
        # 上端
        y = depth
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_white(r, g, b) and a > 200:
                # 下側のピクセルで置き換え
                for dy in range(1, EDGE_DEPTH + 5):
                    nr, ng, nb, na = px[x, min(y + dy, h - 1)]
                    if not is_white(nr, ng, nb):
                        px[x, y] = (nr, ng, nb, a)
                        changed += 1
                        break

        # 下端
        y = h - 1 - depth
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_white(r, g, b) and a > 200:
                for dy in range(1, EDGE_DEPTH + 5):
                    nr, ng, nb, na = px[x, max(y - dy, 0)]
                    if not is_white(nr, ng, nb):
                        px[x, y] = (nr, ng, nb, a)
                        changed += 1
                        break

        # 左端
        x = depth
        for y in range(h):
            r, g, b, a = px[x, y]
            if is_white(r, g, b) and a > 200:
                for dx in range(1, EDGE_DEPTH + 5):
                    nr, ng, nb, na = px[min(x + dx, w - 1), y]
                    if not is_white(nr, ng, nb):
                        px[x, y] = (nr, ng, nb, a)
                        changed += 1
                        break

        # 右端
        x = w - 1 - depth
        for y in range(h):
            r, g, b, a = px[x, y]
            if is_white(r, g, b) and a > 200:
                for dx in range(1, EDGE_DEPTH + 5):
                    nr, ng, nb, na = px[max(x - dx, 0), y]
                    if not is_white(nr, ng, nb):
                        px[x, y] = (nr, ng, nb, a)
                        changed += 1
                        break

    return img, changed

total_fixed = 0
for img_dir in APPS:
    app_name = img_dir.split("\\")[-2]
    print(f"\n=== {app_name} ===")
    backup_dir = os.path.join(os.path.dirname(img_dir), "images_backup2")
    os.makedirs(backup_dir, exist_ok=True)

    pngs = [f for f in os.listdir(img_dir) if f.endswith('.png')]
    for fname in sorted(pngs):
        path = os.path.join(img_dir, fname)
        try:
            fixed_img, changed = fix_edges(path)
            if changed > 0:
                shutil.copy2(path, os.path.join(backup_dir, fname))
                fixed_img.save(path)
                print(f"  修正: {fname} ({changed}px)")
                total_fixed += 1
        except Exception as e:
            print(f"  ERROR {fname}: {e}")

print(f"\n合計 {total_fixed} 枚の画像を修正しました。")
