from PIL import Image
import os

img_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(img_dir, "images")

# (source_file, TL, TR, BL, BR)
SPLITS = [
    ("ChatGPT Image 2026年6月6日 13_52_43.png", [
        "shachiku_teiji_yousei.png",
        "shachiku_yukyu_sniper.png",
        "shachiku_hirashain_slime.png",
        "shachiku_kyujitsu_henshin_machine.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_52_49.png", [
        "shachiku_zangyo_gorilla.png",
        "shachiku_shusse_zombie.png",
        "shachiku_jibakurei.png",
        "shachiku_god.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_57_40.png", [
        "boss_yasei_lion.png",
        "boss_ikusei_pegasus.png",
        "boss_appaku_tyranno.png",
        "boss_kanshi_drone.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_54_16.png", [
        "boss_kibunya_king.png",
        "boss_kamijoshi_unicorn.png",
        "boss_kakusei_buddha.png",
        "boss_legend_kouchou.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_54_25.png", [
        "stress_shonichi_backler.png",
        "stress_glass_heart.png",
        "stress_kinugoshi_mental.png",
        "stress_ippan_shimin.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_54_28.png", [
        "stress_koutetsu_heishi.png",
        "stress_diamond_senshi.png",
        "stress_phoenix.png",
        "stress_ai.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_54_32.png", [
        "ura_copy_yousei.png",
        "ura_kaigishitsu_maou.png",
        "ura_excel_renkin.png",
        "ura_nomikai_daimaou.png",
    ]),
    ("ChatGPT Image 2026年6月6日 13_54_36.png", [
        "ura_shachiku_golem.png",
        "ura_datsugokuou.png",
        "ura_iyashi_panda.png",
        "ura_founder_ghost.png",
    ]),
]

for src_name, names in SPLITS:
    src_path = os.path.join(images_dir, src_name)
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
