# -*- coding: utf-8 -*-
"""
PNG画像の白い縁を確認し、trimする
"""
from PIL import Image
import os, shutil

IMG_DIR = os.path.join(os.path.dirname(__file__), "images")
BACKUP_DIR = os.path.join(os.path.dirname(__file__), "images_backup")

WHITE_THRESHOLD = 240  # この値以上は白とみなす

def has_white_edge(img):
    """画像の端に白いピクセルがあるか確認"""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    issues = []
    # 上端・左端・右端・下端をチェック
    for x in range(w):
        r, g, b, a = pixels[x, 0]
        if r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD and a > 200:
            issues.append("top")
            break
    for y in range(h):
        r, g, b, a = pixels[0, y]
        if r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD and a > 200:
            issues.append("left")
            break
    for x in range(w):
        r, g, b, a = pixels[x, h-1]
        if r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD and a > 200:
            issues.append("bottom")
            break
    for y in range(h):
        r, g, b, a = pixels[w-1, y]
        if r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD and a > 200:
            issues.append("right")
            break
    return issues

def trim_white_border(img):
    """白い縁をtrimする"""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    top = 0
    while top < h:
        has_content = False
        for x in range(w):
            r, g, b, a = pixels[x, top]
            if not (r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD) or a < 200:
                has_content = True
                break
        if has_content:
            break
        top += 1

    bottom = h - 1
    while bottom > top:
        has_content = False
        for x in range(w):
            r, g, b, a = pixels[x, bottom]
            if not (r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD) or a < 200:
                has_content = True
                break
        if has_content:
            break
        bottom -= 1

    left = 0
    while left < w:
        has_content = False
        for y in range(h):
            r, g, b, a = pixels[left, y]
            if not (r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD) or a < 200:
                has_content = True
                break
        if has_content:
            break
        left += 1

    right = w - 1
    while right > left:
        has_content = False
        for y in range(h):
            r, g, b, a = pixels[right, y]
            if not (r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD) or a < 200:
                has_content = True
                break
        if has_content:
            break
        right -= 1

    if top == 0 and bottom == h-1 and left == 0 and right == w-1:
        return img, False  # トリム不要

    cropped = img.crop((left, top, right+1, bottom+1))
    return cropped, True

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)

    png_files = [f for f in os.listdir(IMG_DIR) if f.endswith('.png')]
    print(f"PNG画像: {len(png_files)}件\n")

    trimmed = []
    no_issue = []

    for fname in sorted(png_files):
        path = os.path.join(IMG_DIR, fname)
        try:
            img = Image.open(path)
            w, h = img.size
            issues = has_white_edge(img)

            if issues:
                print(f"【白縁あり】{fname} ({w}x{h}) - {', '.join(issues)}")
                # バックアップ
                shutil.copy2(path, os.path.join(BACKUP_DIR, fname))
                # trim実行
                trimmed_img, changed = trim_white_border(img)
                if changed:
                    new_w, new_h = trimmed_img.size
                    trimmed_img.save(path)
                    print(f"  → trim済み: {w}x{h} → {new_w}x{new_h}")
                    trimmed.append(fname)
                else:
                    print(f"  → trim不要（白縁だが境界なし）")
            else:
                no_issue.append(fname)
        except Exception as e:
            print(f"ERROR: {fname}: {e}")

    print(f"\n=== 結果 ===")
    print(f"白縁なし: {len(no_issue)}件")
    print(f"trim済み: {len(trimmed)}件")
    if trimmed:
        for f in trimmed:
            print(f"  - {f}")

if __name__ == "__main__":
    main()
