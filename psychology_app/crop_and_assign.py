"""
新キャラクター画像を各シートから切り取り → 診断結果に割り当て
+ 自虐的キャッチフレーズをJSONに追記
"""
import os, json
from PIL import Image

SRC_DIR = "app/psychology_app/images/chars/love_quiz_52_new_individual_jpgs"
DST_DIR = "app/psychology_app/images/chars"
TESTS_DIR = "app/psychology_app/tests"

# ── シート定義（ファイル名→グリッド→キャラ番号リスト）─────────────────
SHEETS = [
    {
        "file": "ChatGPT Image 2026年6月5日 21_10_37.png",
        "rows": 1, "cols": 2,
        "chars": [1, 2],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_15.png",
        "rows": 2, "cols": 4,
        "chars": [3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_20.png",
        "rows": 2, "cols": 4,
        "chars": [11, 12, 13, 14, 15, 16, 17, 18],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_23.png",
        "rows": 2, "cols": 4,
        "chars": [19, 20, 21, 22, 23, 24, 25, 26],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_26.png",
        "rows": 2, "cols": 4,
        "chars": [27, 28, 29, 30, 31, 32, 33, 34],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_30.png",
        "rows": 2, "cols": 4,
        "chars": [35, 36, 37, 38, 39, 40, 41, 42],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_34.png",
        "rows": 2, "cols": 4,
        "chars": [43, 44, 45, 46, 47, 48, 49, 50],
    },
    {
        "file": "ChatGPT Image 2026年6月5日 21_07_39.png",
        "rows": 1, "cols": 2,
        "chars": [51, 52],
    },
    # 恋愛回復タイプ診断キャラクター（8枚、4×2グリッド）
    {
        "file": "恋愛回復タイプ診断.png",
        "rows": 2, "cols": 4,
        "chars": [101, 102, 103, 104, 105, 106, 107, 108],
    },
]

# ── キャラ番号 → 保存ファイル名のマッピング ───────────────────────────
CHAR_TO_FILE = {
    # love_type（恋愛タイプ診断）
    10: "love_type_PDE.png",   # 愛情ダダ漏れパンダ → 愛情モンスター
    14: "love_type_PDW.png",   # 尽くしすぎラブラドール → 一途ラブラドール
     9: "love_type_PIE.png",   # ツンデレ黒猫 → ツンデレ柴犬
     1: "love_type_PIW.png",   # 沼らせ魔王 → 沼らせ黒猫
    40: "love_type_CDE.png",   # ピュアすぎアルパカ → 運命信者ユニコーン
    11: "love_type_CDW.png",   # 恋愛不信フクロウ → 恋愛観察員フクロウ
    18: "love_type_CIE.png",   # 計算高いたぬき → 恋愛戦略家キツネ
    12: "love_type_CIW.png",   # 自由人ペガサス → 自由人ペガサス

    # compatibility（恋愛相性診断）
    24: "compatibility_AHO.png",  # 裏なしサイン牛 → ソウルメイト
    46: "compatibility_AHU.png",  # 短気で怒りん坊トラ → ジェットコースター型
    47: "compatibility_ATO.png",  # 理屈っぽい論破シカ → 戦友カップル
     3: "compatibility_ATU.png",  # 恋愛マウントゴリラ → ケンカップル
    38: "compatibility_FHO.png",  # 甘やかし依存カワウソ → ラブラブ依存型
    37: "compatibility_FHU.png",  # ぶりっ子小悪魔猫 → 追う追われる型
    50: "compatibility_FTO.png",  # ノリ良すぎバリピ犬 → 親友カップル
    42: "compatibility_FTU.png",  # 口だけプレイボーイ兎 → 別れそうで別れない型

    # jealousy（嫉妬・束縛診断）
    21: "jealousy_CES.png",   # 見張りまめブタ → 恋愛監獄長
    34: "jealousy_CEL.png",   # 俺ルール獅子王 → 束縛キング
    36: "jealousy_CRS.png",   # 真実見抜きシバ犬 → SNS刑事
     2: "jealousy_CRL.png",   # LINE既読放置神 → LINE監査官
     5: "jealousy_TES.png",   # 寂しがりコアラ → GPSコアラ
    49: "jealousy_TEL.png",   # 心配しすぎハリネズミ → 見守りパンダ
    43: "jealousy_TRS.png",   # 俺様至上ライオン → 放牧ライオン
    22: "jealousy_TRL.png",   # 駆け引きマスター狼 → 野生のオオカミ

    # love_dependency（恋愛依存度診断）
    23: "love_dependency_MRP.png",  # スマホ依存カワウソ → 恋人最優先マン
     7: "love_dependency_MRA.png",  # メンヘラ錬金術師 → 恋愛中毒ドラゴン
    31: "love_dependency_MCP.png",  # 闇落ち元カレくん → 恋愛ジャンキー
     8: "love_dependency_MCA.png",  # 恋愛プロデューサー → 沼落ち名人
    20: "love_dependency_BRP.png",  # 返信めんどくさい犬 → 普通の人
     4: "love_dependency_BRA.png",  # ガラスメンタルうさぎ → 寂しがりうさぎ
    16: "love_dependency_BCP.png",  # 恋愛仙人 → 恋愛仙人
    30: "love_dependency_BCA.png",  # 既読スルーペンギン → 自立ペンギン

    # ideal_date（理想のデートスタイル診断）
    35: "ideal_date_AEP.png",  # ミステリアスコアラ → ドライブウルフ
    32: "ideal_date_AEO.png",  # 自意識高いフラミンゴ → 旅行ペガサス
    28: "ideal_date_AFP.png",  # 金遣い荒いワンコ → 食べ歩きハムスター
    19: "ideal_date_AFO.png",  # 自己肯定感キング → テーマパークゴリラ
    15: "ideal_date_MEP.png",  # 理想高杉くん → 映画館フクロウ
    29: "ideal_date_MEO.png",  # 課金させる天才サル → サプライズ魔王
    44: "ideal_date_MFP.png",  # 面倒くさがりなまけ者 → 家デートナマケモノ
    27: "ideal_date_MFO.png",  # 余裕ぶっこき猫 → カフェ黒猫

    # heartbreak（恋愛回復タイプ診断）
    101: "heartbreak_DNC.png",  # 元カレ監視衛星
    102: "heartbreak_DME.png",  # 未練ゾンビ
    103: "heartbreak_DMC.png",  # 復縁ギャンブラー
    104: "heartbreak_DNE.png",  # 病みストーリー女王
    105: "heartbreak_RME.png",  # 強がり黒猫
    106: "heartbreak_RMC.png",  # 自分磨きフェニックス
    107: "heartbreak_RNE.png",  # 次行こペンギン
    108: "heartbreak_RNC.png",  # 失恋仙人
}

# ── 自虐的キャッチフレーズ（result_id → catchphrase）────────────────────
CATCHPHRASES = {
    # love_type
    "PDE": "「愛してる」を1日300回言うのが目標です。引いてる？知ってる。",
    "PDW": "浮気なんて絶対しない。記憶力がありすぎて、相手の全行動を把握してるから。",
    "PIE": "好きじゃないし？べつに。（震える手でLINEの既読を確認しながら）",
    "PIW": "気づいたら沼らせてた。私もなんで沼らせたのか分からない。",
    "CDE": "運命の人がいるはず。まだ会えてないだけ。（37回目の出会いにて）",
    "CDW": "恋愛より鳥の観察の方が得意です。感情もデータで管理してます。",
    "CIE": "計算してないよ？たまたま最高のタイミングで泣いただけ。",
    "CIW": "恋人より自由の方が大事。でも寂しい夜だけLINEする。",

    # compatibility
    "AHO": "相性バッチリと言われ続けて10年。まだ告白してない。",
    "AHU": "ケンカするほど仲がいいって本当？もう8回別れかけてるけど。",
    "ATO": "恋人より戦友。一緒に敵を倒してたら気づいたら付き合ってた。",
    "ATU": "口ゲンカは絶対負けない。でも好きって気持ちも負けない。",
    "FHO": "依存してるわけじゃないよ。ただ1日1000回連絡したいだけ。",
    "FHU": "追えば逃げる。逃げれば追ってくる。疲れた。でも楽しい。",
    "FTO": "友達以上恋人未満で3年。そろそろ白黒つけたい。たぶん。",
    "FTU": "別れる別れると言いながら5年。我ながらすごいと思う。",

    # jealousy
    "CES": "GPSアプリは愛の証拠です。何が悪いんですか（真顔）",
    "CEL": "束縛じゃないよ。ただ24時間一緒にいたいだけ。",
    "CRS": "SNSの足あとは全部チェックする。スクショも保存してる。愛だから。",
    "CRL": "既読から返信まで1分以内。遅れたら理由を聞く。それだけ。",
    "TES": "心配してるだけ。ロケーション共有は安全のためです（白目）",
    "TEL": "信じてるよ。ただちょっと確認したいだけ。毎時間。",
    "TRS": "嫉妬？しないよ。（1人でモヤモヤした翌日に限界が来る）",
    "TRL": "自由にさせてる。その分、戻ってきた時の顔で全部わかる。",

    # love_dependency
    "MRP": "恋人の予定が最優先。友達の結婚式より彼氏の気分が大事（本気）",
    "MRA": "恋愛なしでは生きられない。酸素より大事かもしれない。",
    "MCP": "好きになったら全力。冷めたら即終了。電源のオンオフが得意。",
    "MCA": "沼らせるのは得意。抜け出させないのも得意。悪意はない。",
    "BRP": "普通に好きで普通に付き合って普通に別れる。それでいい。",
    "BRA": "1人は寂しいけど2人は怖い。結局どうすれば…（震え）",
    "BCP": "恋愛は修行。感情に流されない境地に達した気がする。たぶん。",
    "BCA": "別れても泣かない。自分が好きだから。（強がり成分95%）",

    # ideal_date
    "AEP": "夜のドライブが好き。行き先より雰囲気が大事なタイプ。",
    "AEO": "旅行は人を試す。荷物の多さで相手の本性がわかる。",
    "AFP": "食べ歩きは最強のデート。食が合わない人とは付き合えない。",
    "AFO": "テーマパークで大声で叫べない人とは生きていけない。",
    "MEP": "映画の感想が合わないと不安になる。感性の相性が全てです。",
    "MEO": "サプライズが好き。自分がされるより仕掛ける方が100倍楽しい。",
    "MFP": "家デートが最高。外に出る理由が見つからない。快適すぎて。",
    "MFO": "カフェでずっと話せる人が最高。沈黙が苦手なのを隠してる。",
}

# ── メイン処理 ────────────────────────────────────────────────────────

def crop_chars():
    """シート画像からキャラクターを切り出してDST_DIRに保存"""
    # キャラ番号 → PIL Image のマップを構築
    char_images = {}

    for sheet in SHEETS:
        path = os.path.join(SRC_DIR, sheet["file"])
        if not os.path.exists(path):
            print(f"  ファイルなし: {path}")
            continue
        img = Image.open(path)
        W, H = img.size
        rows, cols = sheet["rows"], sheet["cols"]
        cell_w = W // cols
        cell_h = H // rows

        for i, char_num in enumerate(sheet["chars"]):
            row = i // cols
            col = i % cols
            x0 = col * cell_w
            y0 = row * cell_h
            x1 = x0 + cell_w
            # ラベルテキスト部分（下部約23%）を除いてクロップ
            y1 = y0 + int(cell_h * 0.77)
            # 左右にも少し余白を除く
            pad_x = int(cell_w * 0.02)
            pad_y = int(cell_h * 0.02)
            cropped = img.crop((x0 + pad_x, y0 + pad_y, x1 - pad_x, y1))
            char_images[char_num] = cropped

    # 保存先に書き出し
    saved = 0
    for char_num, dst_name in CHAR_TO_FILE.items():
        if char_num not in char_images:
            print(f"  警告: キャラ{char_num}の画像が見つかりません")
            continue
        dst_path = os.path.join(DST_DIR, dst_name)
        img = char_images[char_num]
        # 正方形にリサイズ（300x300）
        img_resized = img.resize((300, 300), Image.LANCZOS)
        img_resized.save(dst_path)
        print(f"  保存: {dst_name}  (キャラ{char_num:02d})")
        saved += 1
    print(f"\n切り取り完了: {saved}枚")
    return char_images


def update_json_with_catchphrases():
    """各診断JSONにcatchphraseフィールドを追加してdata.jsを再生成"""
    files = ["love_type", "compatibility", "jealousy", "love_dependency", "ideal_date"]
    for fname in files:
        json_path = os.path.join(TESTS_DIR, f"{fname}.json")
        js_path   = os.path.join(TESTS_DIR, f"{fname}_data.js")

        with open(json_path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)

        updated = 0
        for rid, result in data["results"].items():
            if rid in CATCHPHRASES:
                result["catchphrase"] = CATCHPHRASES[rid]
                updated += 1

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # data.js 再生成
        with open(json_path, "r", encoding="utf-8") as f:
            content = f.read()
        js = f"// Auto-generated from {fname}.json\nwindow.QUIZ_DATA = {content};\n"
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(js)

        print(f"[{fname}] catchphrase {updated}件追加 → data.js 再生成")


if __name__ == "__main__":
    print("=" * 50)
    print("Step 1: キャラクター画像を切り取り中...")
    print("=" * 50)
    crop_chars()

    print("\n" + "=" * 50)
    print("Step 2: catchphraseをJSONに追加中...")
    print("=" * 50)
    update_json_with_catchphrases()

    print("\n完了！")
