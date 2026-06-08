"""
全診断JSONの名前を更新し、画像パスを追加するスクリプト
"""
import json, os, re

BASE = r"app/psychology_app/tests"

# ===== 新しい名前マッピング =====

MBTI_NAMES = {
    "ENTJ": "沼らせ魔王",
    "INTP": "LINE既読放置神",
    "ESTJ": "恋愛マウントゴリラ",
    "INFP": "ガラスメンタルうさぎ",
    "ESFJ": "寂しがりコアラ",
    "ENFP": "天然人たらし犬",
    "INFJ": "メンヘラ錬金術師",
    "ENFJ": "恋愛プロデューサー",
    "ISTJ": "ツンデレ黒猫",
    "ESFP": "愛情ダダ漏れパンダ",
    "ISFP": "恋愛不信フクロウ",
    "ENTP": "自由人ペガサス",
    "ESTP": "追われたいクジャク",
    "ISFJ": "尽くしすぎラブラドール",
    "INTJ": "理想高杉くん",
    "ISTP": "恋愛仙人",
}

LOVE_TYPE_NAMES = {
    "PDW": "一途ラブラドール",
    "PIW": "沼らせ黒猫",
    "CIW": "自由人ペガサス",
    "PIE": "ツンデレ柴犬",
    "CIE": "恋愛戦略家キツネ",
    "PDE": "愛情モンスター",
    "CDW": "恋愛観察員フクロウ",
    "CDE": "運命信者ユニコーン",
}

COMPAT_NAMES = {
    "AHO": "ソウルメイト",
    "ATO": "戦友カップル",
    "FHO": "ラブラブ依存型",
    "ATU": "ケンカップル",
    "FHU": "追う追われる型",
    "FTO": "親友カップル",
    "AHU": "ジェットコースター型",
    "FTU": "別れそうで別れない型",
}

JEALOUSY_NAMES = {
    "TRL": "野生のオオカミ",
    "TRS": "放牧ライオン",
    "TEL": "見守りパンダ",
    "TES": "GPSコアラ",
    "CRL": "LINE監査官",
    "CRS": "SNS刑事",
    "CEL": "束縛キング",
    "CES": "恋愛監獄長",
}

DEP_NAMES = {
    "BCP": "恋愛仙人",
    "BCA": "自立ペンギン",
    "BRP": "普通の人",
    "BRA": "寂しがりうさぎ",
    "MCP": "恋愛ジャンキー",
    "MCA": "沼落ち名人",
    "MRP": "恋人最優先マン",
    "MRA": "恋愛中毒ドラゴン",
}

DATE_NAMES = {
    "AFP": "食べ歩きハムスター",
    "AFO": "テーマパークゴリラ",
    "MEP": "映画館フクロウ",
    "MFP": "家デートナマケモノ",
    "AEO": "旅行ペガサス",
    "AEP": "ドライブウルフ",
    "MFO": "カフェ黒猫",
    "MEO": "サプライズ魔王",
}

CONFIGS = [
    ("mbti.json",           "mbti",           MBTI_NAMES),
    ("love_type.json",      "love_type",      LOVE_TYPE_NAMES),
    ("compatibility.json",  "compatibility",  COMPAT_NAMES),
    ("jealousy.json",       "jealousy",       JEALOUSY_NAMES),
    ("love_dependency.json","love_dependency", DEP_NAMES),
    ("ideal_date.json",     "ideal_date",     DATE_NAMES),
]

def update_json(fname, img_prefix, names_map):
    path = os.path.join(BASE, fname)
    with open(path, "r", encoding="utf-8-sig") as f:
        data = json.load(f)

    updated = 0
    for code, result in data["results"].items():
        if code in names_map:
            result["name"] = names_map[code]
            result["image"] = f"images/chars/{img_prefix}_{code}.png"
            updated += 1

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{fname}] {updated}タイプ更新")

def regen_data_js(fname, prefix):
    json_path = os.path.join(BASE, fname)
    js_path   = os.path.join(BASE, fname.replace(".json", "_data.js"))
    with open(json_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
    varname = prefix.upper().replace("-","_")
    js = f"// Auto-generated from {fname}\nwindow.QUIZ_DATA = {content};\n"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"  → {js_path.split('/')[-1]} 再生成")

for fname, prefix, names in CONFIGS:
    update_json(fname, prefix, names)
    regen_data_js(fname, prefix)

print("\n全JSON・data.js 更新完了!")
