window.QUIZ_DATA = {
  "title": "投資中の本性診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "philosopher"],
    [9,  10, "analyst"],
    [11, 12, "strategist"],
    [13, 15, "survivor"],
    [16, 17, "healer"],
    [18, 19, "addict"],
    [20, 21, "villain"],
    [22, 24, "chaos"]
  ],
  "questions": [
    {
      "text": "投資の目的は何ですか？",
      "choices": [
        {"text": "老後資産の形成と経済的自由。明確な目標値がある。", "score": 1},
        {"text": "資産を増やしつつリスク管理もする。バランス重視。", "score": 2},
        {"text": "儲けたい。正直それだけ。", "score": 3},
        {"text": "勝つことへの興奮。お金より勝負が好き。", "score": 4}
      ]
    },
    {
      "text": "投資で大きく儲かったとき、あなたは？",
      "choices": [
        {"text": "計画通りに利確して、次の目標へ。", "score": 1},
        {"text": "少し嬉しいが、次の分析を始める。", "score": 2},
        {"text": "SNSで自慢したくなる。", "score": 3},
        {"text": "全額再投資して「次はもっと稼ぐ」と思う。", "score": 4}
      ]
    },
    {
      "text": "投資の話を家族や友人にするとき？",
      "choices": [
        {"text": "必要なことしか話さない。投資は個人の話。", "score": 1},
        {"text": "聞かれたら話す程度。", "score": 2},
        {"text": "ついついマウントを取ってしまうことがある。", "score": 3},
        {"text": "人の話を聞かず自分の相場観を延々と話す。", "score": 4}
      ]
    },
    {
      "text": "暴落時、あなたの本音は？",
      "choices": [
        {"text": "予定の資金で淡々と買い増す機会だと思う。", "score": 1},
        {"text": "少し不安だが、計画を信じてホールド。", "score": 2},
        {"text": "内心かなりドキドキする。", "score": 3},
        {"text": "楽しくなってくる。嵐の中が好き。", "score": 4}
      ]
    },
    {
      "text": "投資仲間と話すとき、あなたは？",
      "choices": [
        {"text": "お互いの視点から学ぶ姿勢がある。", "score": 1},
        {"text": "自分の知識も共有するが、学ぶことも多い。", "score": 2},
        {"text": "自分の方が知識があると思いがち。", "score": 3},
        {"text": "話を聞くより自分の相場観を伝えたい。", "score": 4}
      ]
    },
    {
      "text": "投資で失敗したとき、本音は？",
      "choices": [
        {"text": "原因を分析して次に活かす。感情は最小限。", "score": 1},
        {"text": "落ち込むが、学びを探す。", "score": 2},
        {"text": "「運が悪かった」と思いがち。", "score": 3},
        {"text": "「次は絶対勝つ」と逆に燃える。", "score": 4}
      ]
    }
  ],
  "results": {
    "philosopher": {
      "name": "冷静ブッダ",
      "emoji": "🦉",
      "image": "images/honsei_philosopher.png",
      "catchphrase": "長期なら誤差",
      "description": "感情ゼロ・計画100%・暴落でも昼寝できる存在。\n投資トークが盛り上がらないのが唯一の欠点。",
      "ecology": ["資産が100万円減っても昼寝する", "相場より積立日を気にする", "証券アプリを月1回しか開かない"],
      "quotes": ["「長期なら誤差」"],
      "sighting": [{"scene": "暴落日にラーメンの感想しか投稿しなかった"}],
      "weakness": ["投資トークが盛り上がらない"],
      "oneliner": "投資本に書いてある理想像を体現している人。",
      "params": [
        {"label": "感情制御力", "value": "悟り", "level": 100},
        {"label": "暴落耐性", "value": "無敵", "level": 100},
        {"label": "利確衝動", "value": "皆無", "level": 0},
        {"label": "SNS影響", "value": "無風", "level": 0},
        {"label": "睡眠品質", "value": "爆睡", "level": 100}
      ],
      "tsukkomi": "あなたが投資の教科書を書けば売れます。そのまま続けてください。",
      "share_text": "投資中の本性診断の結果は【冷静ブッダ】でした！「長期なら誤差」 #投資家クズ診断"
    },
    "analyst": {
      "name": "分析マシーン",
      "emoji": "📊",
      "image": "images/honsei_analyst.png",
      "catchphrase": "数字が全て",
      "description": "PER、PBR、決算資料を全部読む分析の鬼。\n分析が多すぎて動けない状態に陥ることがある。",
      "ecology": ["PER、PBR、決算を全部読む", "買う前にExcelが限界突破", "分析が多すぎて動けない"],
      "quotes": ["「数字が全て」"],
      "sighting": [{"scene": "分析だけして結局買わなかった"}],
      "weakness": ["想定外"],
      "oneliner": "分析力は完璧。あとは買うだけ。",
      "params": [
        {"label": "分析量", "value": "過剰", "level": 100},
        {"label": "感情", "value": "機械", "level": 0},
        {"label": "決断速度", "value": "重い", "level": 40},
        {"label": "データ収集", "value": "病的", "level": 100},
        {"label": "行動力", "value": "停滞", "level": 20}
      ],
      "tsukkomi": "分析が終わった後に買うルールを作ってみてください。",
      "share_text": "投資中の本性診断の結果は【分析マシーン】でした！「数字が全て」 #投資家クズ診断"
    },
    "strategist": {
      "name": "未来予想士",
      "emoji": "♟️",
      "image": "images/honsei_strategist.png",
      "catchphrase": "これは絶対来る",
      "description": "半年後の株価を自信満々に語る。\n外れても「想定外のことが起きた」で終わる。",
      "ecology": ["半年後の株価を語りたがる", "外れても理由は相場のせい", "去年も同じことを言っていた"],
      "quotes": ["「これは絶対来る」"],
      "sighting": [{"scene": "予想は全外れだが語り続けている"}],
      "weakness": ["現実"],
      "oneliner": "予言は外れるが、自信は揺るがない。",
      "params": [
        {"label": "予言力", "value": "自信", "level": 100},
        {"label": "的中率", "value": "微妙", "level": 40},
        {"label": "語り力", "value": "長文", "level": 100},
        {"label": "謙虚さ", "value": "皆無", "level": 0},
        {"label": "反省力", "value": "欠如", "level": 0}
      ],
      "tsukkomi": "去年も同じことを言っていた、という事実に気づいてください。",
      "share_text": "投資中の本性診断の結果は【未来予想士】でした！「これは絶対来る」 #投資家クズ診断"
    },
    "survivor": {
      "name": "慎重ウサギ",
      "emoji": "🐰",
      "image": "images/honsei_survivor.png",
      "catchphrase": "怖いから半分だけ",
      "description": "少し下がると即売り。強気相場でも半額しか入れない。\n保有中も不安で頭がいっぱいの繊細な存在。",
      "ecology": ["少し下がると即売り", "強気相場でも半額しか入れない", "保有中も不安で頭がいっぱい"],
      "quotes": ["「怖いから半分だけ」"],
      "sighting": [{"scene": "買う前に半分を売った"}],
      "weakness": ["強気相場"],
      "oneliner": "慎重すぎて機会損失が半端ない。",
      "params": [
        {"label": "警戒心", "value": "耳長", "level": 100},
        {"label": "行動力", "value": "逃走", "level": 20},
        {"label": "損失回避", "value": "本能", "level": 80},
        {"label": "利益機会", "value": "見逃し", "level": 80},
        {"label": "安心感", "value": "最優先", "level": 100}
      ],
      "tsukkomi": "半分だけでも入れているのは偉いです。少しずつ増やしてみてください。",
      "share_text": "投資中の本性診断の結果は【慎重ウサギ】でした！「怖いから半分だけ」 #投資家クズ診断"
    },
    "healer": {
      "name": "欲張りタヌキ",
      "emoji": "🦝",
      "image": "images/honsei_healer.png",
      "catchphrase": "あと少しだけ待つ",
      "description": "+50%を見て待ち続けた結果マイナスで終わる。\n「もっと上がる」という欲望に毎回負ける。",
      "ecology": ["もっと上がると思って売れない", "含み益を最後まで溶かす", "利確後の上昇が怖い"],
      "quotes": ["「あと少しだけ待つ」"],
      "sighting": [{"scene": "+50%を+20%になるまで待った結果マイナス"}],
      "weakness": ["利確ボタン"],
      "oneliner": "欲望が利確を永遠に遅らせる。",
      "params": [
        {"label": "欲望", "value": "腹黒", "level": 100},
        {"label": "利確タイミング", "value": "壊滅", "level": 0},
        {"label": "満足度", "value": "ゼロ", "level": 0},
        {"label": "含み益消滅力", "value": "達人", "level": 100},
        {"label": "あと少し発動率", "value": "常時", "level": 100}
      ],
      "tsukkomi": "+50%で利確したら良かったんです。本当に。",
      "share_text": "投資中の本性診断の結果は【欲張りタヌキ】でした！「あと少しだけ待つ」 #投資家クズ診断"
    },
    "addict": {
      "name": "暴落ゴリラ",
      "emoji": "🦍",
      "image": "images/honsei_addict.png",
      "catchphrase": "買い場来た！",
      "description": "赤いチャートで元気になる逆張りの獣。\n暴落ニュースで買い注文を準備し始める。",
      "ecology": ["赤いチャートで元気になる", "暴落ニュースで買い注文準備", "一番楽しそうにしている"],
      "quotes": ["「買い場来た！」"],
      "sighting": [{"scene": "暴落日に一番声が大きかった"}],
      "weakness": ["二番底"],
      "oneliner": "暴落を愛する逆張りゴリラ。",
      "params": [
        {"label": "暴落歓喜", "value": "野生", "level": 100},
        {"label": "買い圧", "value": "本能", "level": 100},
        {"label": "恐怖心", "value": "欠如", "level": 0},
        {"label": "現金準備", "value": "万全", "level": 100},
        {"label": "ニュース耐性", "value": "鋼鉄", "level": 100}
      ],
      "tsukkomi": "暴落日に笑顔でいられるあなたは相当変わっています（褒め言葉）。",
      "share_text": "投資中の本性診断の結果は【暴落ゴリラ】でした！「買い場来た！」 #投資家クズ診断"
    },
    "villain": {
      "name": "発狂チンパンジー",
      "emoji": "🐒",
      "image": "images/honsei_villain.png",
      "catchphrase": "終わったあああ！",
      "description": "1分足で人生を判断する感情爆発型。\n5分後には新しい銘柄を買い直している。",
      "ecology": ["1分足で人生を判断する", "損したら即売り、得したら即買い", "5分で投資方針が変わる"],
      "quotes": ["「終わったあああ！」"],
      "sighting": [{"scene": "5分後には新しい銘柄を買っていた"}],
      "weakness": ["通知音"],
      "oneliner": "感情スピードが光速。判断が追いつかない。",
      "params": [
        {"label": "感情爆発", "value": "奇声", "level": 100},
        {"label": "売買回数", "value": "連打", "level": 100},
        {"label": "冷静さ", "value": "絶滅", "level": 0},
        {"label": "方針変更", "value": "毎分", "level": 100},
        {"label": "睡眠品質", "value": "崩壊", "level": 0}
      ],
      "tsukkomi": "「終わったあああ！」の後に新しい銘柄を買うのをやめましょう。",
      "share_text": "投資中の本性診断の結果は【発狂チンパンジー】でした！「終わったあああ！」 #投資家クズ診断"
    },
    "chaos": {
      "name": "証券口座破壊神",
      "emoji": "💥",
      "image": "images/honsei_chaos.png",
      "catchphrase": "もう投資やめる！",
      "description": "1日で投資方針が3回変わる究極の感情型。\n「もう投資やめる」の発言を今年17回確認されている。",
      "ecology": ["1日で投資方針が3回変わる", "寝る前に口座確認を20回行う", "暴落すると世界の終わりを感じる"],
      "quotes": ["「もう投資やめる！」"],
      "sighting": [{"scene": "その発言を今年17回確認されている"}],
      "weakness": ["翌日には新しい銘柄を買う"],
      "oneliner": "口座を破壊し続けながらやめられない存在。",
      "params": [
        {"label": "感情爆発力", "value": "覚醒", "level": 100},
        {"label": "売買回数", "value": "狂気", "level": 100},
        {"label": "暴落耐性", "value": "崩壊", "level": 0},
        {"label": "睡眠品質", "value": "失踪", "level": 0},
        {"label": "SNS巡回率", "value": "中毒", "level": 100}
      ],
      "tsukkomi": "まず5分間スマホを置いてみてください。それだけで売買回数が激減します。",
      "share_text": "投資中の本性診断の結果は【証券口座破壊神】でした！「もう投資やめる！」 #投資家クズ診断"
    }
  }
};
