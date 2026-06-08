from PIL import Image
import os

img_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(img_dir, "images")
src_dir = r"C:\Users\有田稔\Desktop\youtube_auto\子育て診断（仮置き）"

os.makedirs(images_dir, exist_ok=True)

# (source_file, [TL, TR, BL, BR])
SPLITS = [
    # ③ 夫婦育児バランス診断 1-4
    ("ChatGPT Image 2026年6月6日 22_29_56.png", [
        "couple_1_tag.png",
        "couple_2_share.png",
        "couple_3_penguin.png",
        "couple_4_director.png",
    ]),
    # ③ 夫婦育児バランス診断 5-8
    ("ChatGPT Image 2026年6月6日 22_30_20.png", [
        "couple_5_wanope.png",
        "couple_6_commentator.png",
        "couple_7_legend.png",
        "couple_8_missing.png",
    ]),
    # ④ 子供への期待度診断 1-4
    ("ChatGPT Image 2026年6月6日 22_31_02.png", [
        "exp_1_jiyuu.png",
        "exp_2_penguin.png",
        "exp_3_oendan.png",
        "exp_4_naraigoto.png",
    ]),
    # ⑤ 将来の親子関係診断 1-4
    ("ChatGPT Image 2026年6月6日 22_31_11.png", [
        "future_1_family.png",
        "future_2_soudan.png",
        "future_3_jikka.png",
        "future_4_kaesei.png",
    ]),
    # ⑤ 将来の親子関係診断 5-8
    ("ChatGPT Image 2026年6月6日 22_31_14.png", [
        "future_5_line.png",
        "future_6_bonshogatsu.png",
        "future_7_tamani.png",
        "future_8_mago.png",
    ]),
    # ⑥ 育児中の本性診断 1-4
    ("ChatGPT Image 2026年6月6日 22_31_18.png", [
        "nature_1_buddha.png",
        "nature_2_zombie.png",
        "nature_3_hunter.png",
        "nature_4_gunsou.png",
    ]),
    # ④ 子供への期待度診断 5-8
    ("ChatGPT Image 2026年6月6日 22_31_20.png", [
        "exp_5_mirai.png",
        "exp_6_dragon.png",
        "exp_7_todai.png",
        "exp_8_producer.png",
    ]),
    # ⑥ 育児中の本性診断 5-8
    ("ChatGPT Image 2026年6月6日 22_31_24.png", [
        "nature_5_gohobi.png",
        "nature_6_phoenix.png",
        "nature_7_gorilla.png",
        "nature_8_survivor.png",
    ]),
    # ① 親タイプ診断 1-4
    ("ChatGPT Image 2026年6月6日 22_33_32.png", [
        "parent_1_oyatsu.png",
        "parent_2_dakko.png",
        "parent_3_mimamori.png",
        "parent_4_gunsou.png",
    ]),
    # ① 親タイプ診断 5-8
    ("ChatGPT Image 2026年6月6日 22_33_36.png", [
        "parent_5_bokuboku.png",
        "parent_6_oudan.png",
        "parent_7_dragon.png",
        "parent_8_buddha.png",
    ]),
    # ② 子供から見た親診断 1-4
    ("ChatGPT Image 2026年6月6日 22_33_40.png", [
        "child_1_oyatsu_god.png",
        "child_2_dakko_golem.png",
        "child_3_issho_yusha.png",
        "child_4_sumaho.png",
    ]),
    # ② 子供から見た親診断 5-8
    ("ChatGPT Image 2026年6月6日 22_38_03.png", [
        "child_5_hakase.png",
        "child_6_naze_daijin.png",
        "child_7_demon.png",
        "child_8_last_boss.png",
    ]),
]

for src_name, names in SPLITS:
    src_path = os.path.join(src_dir, src_name)
    img = Image.open(src_path)
    w, h = img.size
    hw, hh = w // 2, h // 2
    quads = [
        (0,  0,  hw, hh),   # TL
        (hw, 0,  w,  hh),   # TR
        (0,  hh, hw, h),    # BL
        (hw, hh, w,  h),    # BR
    ]
    for box, name in zip(quads, names):
        out = img.crop(box)
        out.save(os.path.join(images_dir, name))
        print(f"  -> {name}")
    print(f"Done: {src_name}")

print("All images split.")
