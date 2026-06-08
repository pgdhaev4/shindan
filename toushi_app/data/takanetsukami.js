window.QUIZ_DATA = {
  "title": "高値掴み診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "hunter"],
    [9,  10, "kunren"],
    [11, 12, "timing"],
    [13, 15, "fomo"],
    [16, 17, "kansei"],
    [18, 19, "sns"],
    [20, 21, "topbuyer"],
    [22, 24, "god"]
  ],
  "questions": [
    {
      "text": "株を買うタイミングを決めるのは？",
      "choices": [
        {"text": "52週安値付近・バリュエーション基準で機械的に判断。", "score": 1},
        {"text": "チャートの移動平均や節目を参考に入る。", "score": 2},
        {"text": "なんとなく「今が安い気がする」でエントリー。", "score": 3},
        {"text": "急騰しているから「まだ上がる」と思って買う。", "score": 4}
      ]
    },
    {
      "text": "テレビや雑誌で特集された銘柄を見た。どうする？",
      "choices": [
        {"text": "メディア露出後は高値になりがちなので見送る。", "score": 1},
        {"text": "一応調べてから判断する。", "score": 2},
        {"text": "有名だから安心かも、と少し気になる。", "score": 3},
        {"text": "すぐに買う。メディアが取り上げるなら本物だ。", "score": 4}
      ]
    },
    {
      "text": "急騰中の銘柄のチャートを見た。",
      "choices": [
        {"text": "「乗り遅れた」と思いスルーする。", "score": 1},
        {"text": "理由を調べて判断材料にする。", "score": 2},
        {"text": "少し気になって少額で買ってみる。", "score": 3},
        {"text": "「今が旬！」と思って全力で飛び込む。", "score": 4}
      ]
    },
    {
      "text": "「〇〇は今後10倍になる」という情報を見た。",
      "choices": [
        {"text": "10倍予想は基本疑う。ソースを確認して終わり。", "score": 1},
        {"text": "面白いと思いつつ、自分で検証する。", "score": 2},
        {"text": "可能性を信じて少し買ってしまう。", "score": 3},
        {"text": "全力買い。10倍の機会を逃したくない。", "score": 4}
      ]
    },
    {
      "text": "買った銘柄が即日-5%になった。",
      "choices": [
        {"text": "投資論理が正しければ気にしない。ホールド。", "score": 1},
        {"text": "少し確認するが、基本ホールド。", "score": 2},
        {"text": "「高値で買ったかも」と若干後悔する。", "score": 3},
        {"text": "「やっぱりまた高値掴みか…」と確信する。", "score": 4}
      ]
    },
    {
      "text": "あなたの過去の買値を振り返ると？",
      "choices": [
        {"text": "概ね安値圏で仕込んでいる。", "score": 1},
        {"text": "ほどほど。外した場合の理由も分析している。", "score": 2},
        {"text": "気づくと高めのことが多い。", "score": 3},
        {"text": "ほぼ毎回天井付近で買っている（なぜか）。", "score": 4}
      ]
    }
  ],
  "results": {
    "hunter": {
      "name": "逆張り仙人",
      "emoji": "🎯",
      "image": "images/taka_hunter.png",
      "catchphrase": "今さら買うの？",
      "description": "みんなが騒ぐ頃には興味を失っている孤高の存在。\n暴騰銘柄より暴落銘柄が好きで、天井より底値が住処。",
      "ecology": ["みんなが買う頃には興味を失う", "暴騰銘柄を見ると売りたくなる", "暴落時だけテンションが上がる"],
      "quotes": ["「今さら買うの？」"],
      "sighting": [{"scene": "NVDAが爆上げ中に黙って高配当株を買っていた"}],
      "weakness": ["上がり続ける相場だけは苦手"],
      "oneliner": "急騰には一切乗らない孤高の逆張り師。",
      "params": [
        {"label": "高値警戒力", "value": "悟道", "level": 100},
        {"label": "安値拾い力", "value": "神業", "level": 100},
        {"label": "SNS耐性", "value": "無視", "level": 100},
        {"label": "飛び乗り率", "value": "皆無", "level": 0},
        {"label": "FOMO度", "value": "達観", "level": 0}
      ],
      "tsukkomi": "バリュートラップだけ気をつければ、理想的な投資家です。",
      "share_text": "高値掴み診断の結果は【逆張り仙人】でした！「今さら買うの？」 #投資家クズ診断"
    },
    "kunren": {
      "name": "慎重カメ",
      "emoji": "🐢",
      "image": "images/taka_kunren.png",
      "catchphrase": "もう少し様子見してから",
      "description": "調べすぎて買えない慎重派の亀。\n検討中に株価が3倍になっても「もう少し」と言う。",
      "ecology": ["調べすぎて買えない", "検討中のまま株価が3倍", "「もう少し」が口癖"],
      "quotes": ["「もう少し様子見してから」"],
      "sighting": [{"scene": "1年間検討した銘柄が10倍になった"}],
      "weakness": ["決断日が来ない"],
      "oneliner": "調べ上げて買わない。それがスタイル。",
      "params": [
        {"label": "調査力", "value": "徹底", "level": 100},
        {"label": "購入速度", "value": "停止", "level": 0},
        {"label": "機会損失", "value": "常連", "level": 100},
        {"label": "慎重度", "value": "過剰", "level": 100},
        {"label": "決断力", "value": "欠如", "level": 0}
      ],
      "tsukkomi": "調べることと買うことは別物です。買う日も決めましょう。",
      "share_text": "高値掴み診断の結果は【慎重カメ】でした！「もう少し様子見してから」 #投資家クズ診断"
    },
    "timing": {
      "name": "様子見職人",
      "emoji": "🗺️",
      "image": "images/taka_timing.png",
      "catchphrase": "押し目を待つ",
      "description": "押し目を待つ間に株価が宇宙へ行く。\n観察力だけは職人級だが、行動が伴わない。",
      "ecology": ["チャートを眺めるだけで満足", "押し目を待って上昇を見送る", "入れずに終わる銘柄が多い"],
      "quotes": ["「押し目を待つ」"],
      "sighting": [{"scene": "押し目を待つ間に株価が2倍になった"}],
      "weakness": ["押し目が来ない相場"],
      "oneliner": "待機力だけは世界一。でも買わない。",
      "params": [
        {"label": "観察力", "value": "職人", "level": 100},
        {"label": "行動力", "value": "不動", "level": 0},
        {"label": "後悔量", "value": "職人芸", "level": 100},
        {"label": "チャート観察", "value": "達人", "level": 100},
        {"label": "エントリー数", "value": "幻", "level": 0}
      ],
      "tsukkomi": "「押し目が来ない相場もある」という事実を受け入れましょう。",
      "share_text": "高値掴み診断の結果は【様子見職人】でした！「押し目を待つ」 #投資家クズ診断"
    },
    "fomo": {
      "name": "普通のトレーダー",
      "emoji": "😐",
      "image": "images/taka_fomo.png",
      "catchphrase": "まあこんなもんか",
      "description": "勝ったり負けたりの普通のトレーダー。\nネタにならないが、一番リアルな存在。",
      "ecology": ["勝ったり負けたりを繰り返す", "特に目立った失敗もない", "一番コメントしにくい"],
      "quotes": ["「まあこんなもんか」"],
      "sighting": [{"scene": "損益が毎月ほぼゼロに近い"}],
      "weakness": ["ネタにならない"],
      "oneliner": "普通というのは最も難しい才能だ。",
      "params": [
        {"label": "高値掴み度", "value": "平均", "level": 50},
        {"label": "安値拾い率", "value": "普通", "level": 50},
        {"label": "反省力", "value": "並", "level": 50},
        {"label": "相場感", "value": "平均", "level": 50},
        {"label": "ネタ性", "value": "皆無", "level": 0}
      ],
      "tsukkomi": "普通に投資できるのは才能です。あなたが一番健全かもしれません。",
      "share_text": "高値掴み診断の結果は【普通のトレーダー】でした！「まあこんなもんか」 #投資家クズ診断"
    },
    "kansei": {
      "name": "イナゴライダー",
      "emoji": "🦗",
      "image": "images/taka_kansei.png",
      "catchphrase": "乗るしかない、このビッグウェーブに",
      "description": "急騰ランキングに乗り込む瞬発力の化身。\n乗った瞬間に群れが解散するのは毎度のこと。",
      "ecology": ["急騰ランキングだけ見る", "乗ったと同時に群れが解散", "次のトレンドを探す"],
      "quotes": ["「乗るしかない、このビッグウェーブに」"],
      "sighting": [{"scene": "飛び乗った瞬間に出来高が消えた"}],
      "weakness": ["出来高減少"],
      "oneliner": "乗った瞬間が高値。毎回。",
      "params": [
        {"label": "急騰反応", "value": "爆速", "level": 100},
        {"label": "SNS依存", "value": "本能", "level": 100},
        {"label": "着地能力", "value": "墜落", "level": 0},
        {"label": "群れ行動", "value": "習性", "level": 100},
        {"label": "出口戦略", "value": "不在", "level": 0}
      ],
      "tsukkomi": "出来高が減り始めたら群れが逃げ始めたサインです。",
      "share_text": "高値掴み診断の結果は【イナゴライダー】でした！「乗るしかない」 #投資家クズ診断"
    },
    "sns": {
      "name": "FOMOキング",
      "emoji": "😱",
      "image": "images/taka_sns.png",
      "catchphrase": "置いていかれる！",
      "description": "乗り遅れる恐怖が王冠になった存在。\n最高値更新後に入り、翌日の寄り付きで絶望する。",
      "ecology": ["急騰を見るたびに焦る", "最高値更新後に飛びつく", "翌日の寄り付きで絶望"],
      "quotes": ["「置いていかれる！」"],
      "sighting": [{"scene": "最高値更新のニュースでエントリー"}],
      "weakness": ["翌日の寄り付き"],
      "oneliner": "乗り遅れ恐怖が王位に就いた。",
      "params": [
        {"label": "焦り", "value": "王冠", "level": 100},
        {"label": "冷静さ", "value": "不在", "level": 0},
        {"label": "天井接近力", "value": "名人", "level": 100},
        {"label": "乗り遅れ恐怖", "value": "常在", "level": 100},
        {"label": "待機耐性", "value": "崩壊", "level": 0}
      ],
      "tsukkomi": "最高値更新ニュースはすでに高値のサインです。",
      "share_text": "高値掴み診断の結果は【FOMOキング】でした！「置いていかれる！」 #投資家クズ診断"
    },
    "topbuyer": {
      "name": "天井スナイパー",
      "emoji": "🏔️",
      "image": "images/taka_tenjou.png",
      "catchphrase": "ここからまだ上がる気がする",
      "description": "狙ったように天井を撃ち抜く特殊能力の持ち主。\n購入記録が年初来高値の翌日と重なり続けている。",
      "ecology": ["狙ったように天井を撃ち抜く", "購入後チャートが下落する", "「今回は違う」を信じ続ける"],
      "quotes": ["「ここからまだ上がる気がする」"],
      "sighting": [{"scene": "購入記録が年初来高値の翌日と重なっていた"}],
      "weakness": ["自分の直感"],
      "oneliner": "逆指標として市場に貢献している天才。",
      "params": [
        {"label": "天井命中率", "value": "必中", "level": 100},
        {"label": "底値売却力", "value": "職人", "level": 80},
        {"label": "逆神度", "value": "神業", "level": 100},
        {"label": "購入タイミング", "value": "最悪", "level": 100},
        {"label": "直感への信頼", "value": "盲信", "level": 100}
      ],
      "tsukkomi": "あなたが「上がる」と思ったら売り時です。その直感を逆用してください。",
      "share_text": "高値掴み診断の結果は【天井スナイパー】でした！「ここからまだ上がる気がする」 #投資家クズ診断"
    },
    "god": {
      "name": "高値掴み神",
      "emoji": "👑",
      "image": "images/taka_god.png",
      "catchphrase": "まだ上がる気がする",
      "description": "2021年以降だけで7回天井を命中させた伝説。\n安値で買うという概念が脳に存在しない。",
      "ecology": ["トレンド入りしたら即購入", "ニュースを見てから買う", "買った翌日から暴落する"],
      "quotes": ["「まだ上がる気がする」"],
      "sighting": [{"scene": "2021年以降だけで7回天井を当てている"}],
      "weakness": ["安値で買うという概念がない"],
      "oneliner": "高値掴みの頂点に立つ真の王者。",
      "params": [
        {"label": "飛び乗り速度", "value": "瞬速", "level": 100},
        {"label": "SNS信仰度", "value": "洗脳", "level": 100},
        {"label": "FOMO耐性", "value": "崩壊", "level": 0},
        {"label": "天井命中率", "value": "必中", "level": 100},
        {"label": "待機能力", "value": "発作", "level": 0}
      ],
      "tsukkomi": "その才能、本当に逆指標として使えます。「俺が買いたくなった銘柄を売れ」と言えば需要があります。",
      "share_text": "高値掴み診断の結果は【高値掴み神】でした！「まだ上がる気がする」 #投資家クズ診断"
    }
  }
};
