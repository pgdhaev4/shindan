"""
axis3 診断JSONに scoreSummary（総合評価%）と derivedAxis（4軸目）を追加
"""
import json, os

BASE = r"app/psychology_app/tests"

AXIS_CONFIGS = {
    "love_type.json": {
        "scoreSummary": {
            "label": "情熱度",
            "hi": ["P", "E"],
            "lo": ["C", "W"]
        },
        "derivedAxis": {
            "label": "積極的アプローチ",
            "labelRight": "穏やか受け身",
            "hi": ["P", "E"],
            "lo": ["C", "W"]
        }
    },
    "compatibility.json": {
        "scoreSummary": {
            "label": "恋愛積極性",
            "hi": ["A", "H", "O"],
            "lo": ["F", "T", "U"]
        },
        "derivedAxis": {
            "label": "恋愛への熱量",
            "labelRight": "冷静・自由志向",
            "hi": ["A", "H", "O"],
            "lo": ["F", "T", "U"]
        }
    },
    "jealousy.json": {
        "scoreSummary": {
            "label": "束縛度",
            "hi": ["C", "E", "S"],
            "lo": ["T", "R", "L"]
        },
        "derivedAxis": {
            "label": "独占欲・管理欲",
            "labelRight": "信頼・自由尊重",
            "hi": ["C", "E", "S"],
            "lo": ["T", "R", "L"]
        }
    },
    "love_dependency.json": {
        "scoreSummary": {
            "label": "依存度",
            "hi": ["M", "R", "A"],
            "lo": ["B", "C", "P"]
        },
        "derivedAxis": {
            "label": "感情的没入度",
            "labelRight": "精神的自立度",
            "hi": ["M", "R", "A"],
            "lo": ["B", "C", "P"]
        }
    },
    "ideal_date.json": {
        "scoreSummary": {
            "label": "アクティブ度",
            "hi": ["A", "E"],
            "lo": ["M", "F"]
        },
        "derivedAxis": {
            "label": "特別感・感動重視",
            "labelRight": "気軽さ・楽しさ重視",
            "hi": ["E", "P"],
            "lo": ["F", "O"]
        }
    }
}

def update_json(fname, config):
    path = os.path.join(BASE, fname)
    with open(path, "r", encoding="utf-8-sig") as f:
        data = json.load(f)
    data["scoreSummary"] = config["scoreSummary"]
    data["derivedAxis"]  = config["derivedAxis"]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{fname}] scoreSummary + derivedAxis 追加")

def regen_data_js(fname):
    json_path = os.path.join(BASE, fname)
    js_path   = os.path.join(BASE, fname.replace(".json", "_data.js"))
    with open(json_path, "r", encoding="utf-8-sig") as f:
        content = f.read()
    js = f"// Auto-generated from {fname}\nwindow.QUIZ_DATA = {content};\n"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"  → {js_path.split('/')[-1]} 再生成")

for fname, config in AXIS_CONFIGS.items():
    update_json(fname, config)
    regen_data_js(fname)

print("\n完了!")
