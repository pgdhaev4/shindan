window.QUIZ_DATA = {
  "title": "含み損耐性診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "buddha"],
    [9,  10, "ninshiki"],
    [11, 12, "fuan"],
    [13, 15, "toutatu"],
    [16, 17, "sleep"],
    [18, 19, "spiral"],
    [20, 21, "panic"],
    [22, 24, "hakai"]
  ],
  "questions": [
    {
      "text": "持ち株が10%下がった。あなたの状態は？",
      "choices": [
        {"text": "「よくあること」と思って相場を閉じる。", "score": 1},
        {"text": "少し気になるが、長期保有なので問題ない。", "score": 2},
        {"text": "含み損の金額を何度も計算してしまう。", "score": 3},
        {"text": "夜眠れなくなる。翌朝一番に確認する。", "score": 4}
      ]
    },
    {
      "text": "含み損が出ているとき、何を考えがち？",
      "choices": [
        {"text": "企業の業績は変わっていないから問題ない。", "score": 1},
        {"text": "いつか戻るだろうと思う。", "score": 2},
        {"text": "「なんで買ったんだ」と過去の自分を責める。", "score": 3},
        {"text": "「もう投資なんてやめる」と毎回思う。", "score": 4}
      ]
    },
    {
      "text": "職場や食事中に含み損のことを考える頻度は？",
      "choices": [
        {"text": "ほとんど考えない。生活と切り離している。", "score": 1},
        {"text": "たまに頭によぎる程度。", "score": 2},
        {"text": "1日に何度も頭をよぎる。", "score": 3},
        {"text": "常に頭の中に数字がちらつく。", "score": 4}
      ]
    },
    {
      "text": "含み損-30%。この銘柄をどうする？",
      "choices": [
        {"text": "投資論理が変わっていなければホールド。", "score": 1},
        {"text": "一旦様子見して再評価する。", "score": 2},
        {"text": "追加購入を検討する（ナンピン）。", "score": 3},
        {"text": "耐えきれず損切り。精神的に限界。", "score": 4}
      ]
    },
    {
      "text": "株仲間に「今どれくらい含み損？」と聞かれたら？",
      "choices": [
        {"text": "正直に答えられる。損益は気にしていない。", "score": 1},
        {"text": "多少は気になるが正直に話せる。", "score": 2},
        {"text": "金額は言いたくないが話題には乗る。", "score": 3},
        {"text": "聞かれると気分が悪くなる。話したくない。", "score": 4}
      ]
    },
    {
      "text": "投資を始める前の自分に一言アドバイスするとしたら？",
      "choices": [
        {"text": "「長期積立なら怖くないよ」と伝える。", "score": 1},
        {"text": "「分散投資をしっかりするように」と伝える。", "score": 2},
        {"text": "「含み損に慣れろ」と伝える。", "score": 3},
        {"text": "「やめとけ」と伝える。", "score": 4}
      ]
    }
  ],
  "results": {
    "buddha": {
      "name": "冷静ブッダ",
      "emoji": "🧘",
      "image": "images/fukumi_buddha.png",
      "catchphrase": "誤差だね",
      "description": "含み損でも平常心。資産が100万減ってもラーメンを食べる。\n投資を忘れられる唯一の存在。",
      "ecology": ["含み損でも普通に昼飯", "ニュースを見ても動じない", "投資を忘れる日がある"],
      "quotes": ["「誤差だね」"],
      "sighting": [{"scene": "資産が100万減ってもラーメン食べてた"}],
      "weakness": ["話がつまらない"],
      "oneliner": "メンタルが最強すぎて逆に怖い。",
      "params": [
        {"label": "含み損耐性", "value": "悟り", "level": 100},
        {"label": "狼狽売り", "value": "皆無", "level": 0},
        {"label": "睡眠品質", "value": "快眠", "level": 100},
        {"label": "暴落恐怖", "value": "無敵", "level": 0},
        {"label": "長期視点", "value": "達観", "level": 100}
      ],
      "tsukkomi": "そのメンタルを売ってほしい。需要は無限にあります。",
      "share_text": "含み損でも平常心。資産が100万減ってもラーメンを食べる。\n投資を忘れられる唯一の存在。"
    },
    "ninshiki": {
      "name": "気絶投資家",
      "emoji": "😴",
      "image": "images/fukumi_reiseibun.png",
      "catchphrase": "今は見ない",
      "description": "下がった瞬間にアプリを削除する現実逃避の達人。\n見なければ損していないという哲学で生きる。",
      "ecology": ["下がるとアプリ削除", "見なければ損していない", "数か月後に復活"],
      "quotes": ["「今は見ない」"],
      "sighting": [{"scene": "半年後に口座を開いて絶叫した"}],
      "weakness": ["問題解決能力ゼロ"],
      "oneliner": "見ない選択が唯一の耐性。",
      "params": [
        {"label": "現実逃避", "value": "達人", "level": 100},
        {"label": "チャート確認", "value": "封印", "level": 0},
        {"label": "精神防御", "value": "鉄壁", "level": 100},
        {"label": "損失認識", "value": "拒否", "level": 0},
        {"label": "放置力", "value": "無双", "level": 100}
      ],
      "tsukkomi": "半年ぶりにログインした時の絶叫が聞こえます。",
      "share_text": "下がった瞬間にアプリを削除する現実逃避の達人。\n見なければ損していないという哲学で生きる。"
    },
    "fuan": {
      "name": "鋼鉄メンタル",
      "emoji": "🔩",
      "image": "images/fukumi_fuan.png",
      "catchphrase": "まだ下がる？",
      "description": "何が起きても平常心。暴落中も普通に仕事。\nリーマン級でも笑顔で眺めていた伝説の存在。",
      "ecology": ["何が起きても平常心", "暴落中も普通に仕事", "むしろ楽しそう"],
      "quotes": ["「まだ下がる？」"],
      "sighting": [{"scene": "リーマン級下落を笑顔で眺めていた"}],
      "weakness": ["人間味がない"],
      "oneliner": "人間の振りをしているが感情がない疑惑あり。",
      "params": [
        {"label": "精神力", "value": "鋼鉄", "level": 100},
        {"label": "含み損耐性", "value": "最強", "level": 100},
        {"label": "損切り恐怖", "value": "皆無", "level": 0},
        {"label": "睡眠品質", "value": "快眠", "level": 100},
        {"label": "胃痛指数", "value": "無傷", "level": 0}
      ],
      "tsukkomi": "その笑顔、周りの投資家が引いています。少しだけ動揺を見せてください。",
      "share_text": "何が起きても平常心。暴落中も普通に仕事。\nリーマン級でも笑顔で眺めていた伝説の存在。"
    },
    "toutatu": {
      "name": "ナンピン将軍",
      "emoji": "📉",
      "image": "images/fukumi_nanpin.png",
      "catchphrase": "平均単価下がった",
      "description": "下がるほど部隊を投入する突撃型の将軍。\n15回ナンピンした記録を持つ。最後は祈る。",
      "ecology": ["下がるたび買う", "さらに下がってまた買う", "最後は祈る"],
      "quotes": ["「平均単価下がった」"],
      "sighting": [{"scene": "15回ナンピンしていた"}],
      "weakness": ["資金が尽きる"],
      "oneliner": "兵糧が尽きるまで突撃する将軍。",
      "params": [
        {"label": "買い増し欲", "value": "本能", "level": 100},
        {"label": "平均単価愛", "value": "執念", "level": 100},
        {"label": "反省力", "value": "欠如", "level": 0},
        {"label": "現金消費", "value": "豪快", "level": 100},
        {"label": "撤退判断", "value": "不在", "level": 0}
      ],
      "tsukkomi": "15回ナンピンの後に何が起きたか、聞きたくないです。",
      "share_text": "下がるほど部隊を投入する突撃型の将軍。\n15回ナンピンした記録を持つ。最後は祈る。"
    },
    "sleep": {
      "name": "お祈り僧侶",
      "emoji": "🙏",
      "image": "images/fukumi_nemurenaiyoru.png",
      "catchphrase": "戻るはず",
      "description": "分析より祈祷を選ぶ。根拠はない。奇跡待ち。\n決算前に手を合わせるスタイルを確立している。",
      "ecology": ["毎日神社レベルで祈る", "根拠はない", "奇跡待ち"],
      "quotes": ["「戻るはず」"],
      "sighting": [{"scene": "決算前に手を合わせていた"}],
      "weakness": ["祈っても下がる"],
      "oneliner": "神頼みが唯一の投資戦略。",
      "params": [
        {"label": "祈祷力", "value": "神域", "level": 100},
        {"label": "分析力", "value": "皆無", "level": 0},
        {"label": "神頼み", "value": "全振", "level": 100},
        {"label": "損切り力", "value": "消失", "level": 0},
        {"label": "希望観測", "value": "無限", "level": 100}
      ],
      "tsukkomi": "神社のお守りより損切りルールの方が効果があります。",
      "share_text": "分析より祈祷を選ぶ。根拠はない。奇跡待ち。\n決算前に手を合わせるスタイルを確立している。"
    },
    "spiral": {
      "name": "損切りアレルギー",
      "emoji": "🌀",
      "image": "images/fukumi_spiral.png",
      "catchphrase": "売らなければ負けじゃない",
      "description": "損切りボタンを見ると体が拒否する。\nマイナス90%でも保有。上場廃止まで握った実績あり。",
      "ecology": ["売ったら負けと思っている", "マイナス90%でも保有", "取得単価を毎日見る"],
      "quotes": ["「売らなければ負けじゃない」"],
      "sighting": [{"scene": "上場廃止まで握っていた"}],
      "weakness": ["売れない"],
      "oneliner": "上場廃止でも握り続けた伝説の保有者。",
      "params": [
        {"label": "損切り拒否", "value": "重症", "level": 100},
        {"label": "現実逃避", "value": "達人", "level": 100},
        {"label": "希望観測", "value": "無限", "level": 100},
        {"label": "決断力", "value": "皆無", "level": 0},
        {"label": "塩漬け率", "value": "伝説", "level": 100}
      ],
      "tsukkomi": "上場廃止は損切りの機会すら与えてくれません。それでも後悔しませんか？",
      "share_text": "損切りボタンを見ると体が拒否する。\nマイナス90%でも保有。上場廃止まで握った実績あり。"
    },
    "panic": {
      "name": "含み損ゾンビ",
      "emoji": "🧟",
      "image": "images/fukumi_panic.png",
      "catchphrase": "慣れた",
      "description": "資産画面が真っ赤。感情はとっくに消えた。\nマイナス500万でも無表情で市場に残り続ける存在。",
      "ecology": ["資産画面が真っ赤", "感情を失っている", "なぜか退場しない"],
      "quotes": ["「慣れた」"],
      "sighting": [{"scene": "マイナス500万でも無表情"}],
      "weakness": ["感覚が麻痺している"],
      "oneliner": "痛覚が消えるまで市場で戦い続けた者。",
      "params": [
        {"label": "含み損額", "value": "伝説", "level": 100},
        {"label": "生存力", "value": "不死", "level": 100},
        {"label": "表情変化", "value": "無反応", "level": 0},
        {"label": "希望残量", "value": "微量", "level": 100},
        {"label": "投資継続", "value": "執念", "level": 100}
      ],
      "tsukkomi": "「慣れた」は警戒ワードです。本当に大丈夫ですか？",
      "share_text": "資産画面が真っ赤。感情はとっくに消えた。\nマイナス500万でも無表情で市場に残り続ける存在。"
    },
    "hakai": {
      "name": "塩漬け博物館館長",
      "emoji": "🏛️",
      "image": "images/fukumi_hakai.png",
      "catchphrase": "昔はすごかった",
      "description": "口座が歴史資料館になっている。\n10年前の人気株を今も「文化財」として展示中。",
      "ecology": ["昔の人気株を大量保有", "口座が歴史資料館", "全部復活を信じている"],
      "quotes": ["「昔はすごかった」"],
      "sighting": [{"scene": "10年前の塩漬け株を自慢していた"}],
      "weakness": ["売る理由も買う理由も忘れた"],
      "oneliner": "口座が博物館になっている。入館無料。",
      "params": [
        {"label": "塩漬け銘柄数", "value": "収集", "level": 100},
        {"label": "損切り拒否", "value": "信念", "level": 100},
        {"label": "保有年数", "value": "化石", "level": 100},
        {"label": "思い出補正", "value": "美化", "level": 100},
        {"label": "現金比率", "value": "絶滅", "level": 0}
      ],
      "tsukkomi": "展示品を売却すると現金が復活します。展示解除を検討してください。",
      "share_text": "口座が歴史資料館になっている。\n10年前の人気株を今も「文化財」として展示中。"
    }
  }
};
