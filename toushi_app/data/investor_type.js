window.QUIZ_DATA = {
  "title": "投資家タイプ診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "buddha"],
    [9,  10, "haitou"],
    [11, 12, "akuryo"],
    [13, 15, "gambler"],
    [16, 17, "fomo"],
    [18, 19, "lever"],
    [20, 21, "gorilla"],
    [22, 24, "god"]
  ],
  "questions": [
    {
      "text": "新しい銘柄を見つけた。あなたは？",
      "choices": [
        {"text": "まず3年分の決算書を読む。話はそれから。", "score": 1},
        {"text": "配当利回りと財務だけ確認して判断。", "score": 2},
        {"text": "チャートを眺めてから少額で試す。", "score": 3},
        {"text": "名前が好きだから買う。直感は裏切らない。", "score": 4}
      ]
    },
    {
      "text": "SNSで「〇〇が来週10倍になる！」という投稿を見た。",
      "choices": [
        {"text": "スクロールして終わり。これは罠。", "score": 1},
        {"text": "一応調べるが、基本信じない。", "score": 2},
        {"text": "少しだけ買ってみる。もしかしたら…", "score": 3},
        {"text": "全力買い。乗り遅れたくない。", "score": 4}
      ]
    },
    {
      "text": "持ち株が30%上がった。あなたは？",
      "choices": [
        {"text": "長期保有。20年後に売る予定。", "score": 1},
        {"text": "一部利確して残りはホールド。", "score": 2},
        {"text": "まだ上がると思って全部持ち続ける。", "score": 3},
        {"text": "売らずに追加購入。もっと上がる。", "score": 4}
      ]
    },
    {
      "text": "暴落が来た。あなたの行動は？",
      "choices": [
        {"text": "予定通り積立継続。むしろ喜ぶ。", "score": 1},
        {"text": "慌てず、状況を冷静に分析する。", "score": 2},
        {"text": "少し不安だが、とりあえず様子見。", "score": 3},
        {"text": "パニック売り。もう株なんてやめた。", "score": 4}
      ]
    },
    {
      "text": "あなたのポートフォリオは？",
      "choices": [
        {"text": "インデックス一択。S&P500だけで十分。", "score": 1},
        {"text": "高配当株を中心に分散投資。", "score": 2},
        {"text": "成長株・テーマ株を積極的に組み入れ。", "score": 3},
        {"text": "フルポジ。現金ゼロが正義。", "score": 4}
      ]
    },
    {
      "text": "NISA枠が余っている。どうする？",
      "choices": [
        {"text": "毎月コツコツ積立。ルール通りに。", "score": 1},
        {"text": "優良株を選んでじっくり埋める。", "score": 2},
        {"text": "話題の銘柄を買って枠を使い切る。", "score": 3},
        {"text": "年末に全力一括。枠を残すのは罪。", "score": 4}
      ]
    }
  ],
  "results": {
    "buddha": {
      "name": "積立ブッダ",
      "emoji": "🧘",
      "image": "images/toushi_buddha.png",
      "catchphrase": "20年後に会おう",
      "description": "感情ゼロ、ルールだけで生きる積立の神。\n暴落も急騰も関係ない。積立設定だけが仕事。",
      "ecology": ["毎月同じ日に積立", "暴落すると少し嬉しい", "チャートをほぼ見ない"],
      "quotes": ["「20年後に会おう」"],
      "sighting": [{"scene": "暴落日に積立設定だけ確認して寝た"}],
      "weakness": ["投資トークについていけない"],
      "oneliner": "地味だが老後に一番笑う存在。",
      "params": [
        {"label": "積立継続力", "value": "悟り", "level": 100},
        {"label": "暴落耐性", "value": "無敵", "level": 100},
        {"label": "SNS影響耐性", "value": "無視", "level": 100},
        {"label": "売買回数", "value": "冬眠", "level": 0},
        {"label": "FOMO度", "value": "仙人", "level": 0}
      ],
      "tsukkomi": "老後に笑うのはあなたです。このまま正解。",
      "share_text": "投資家タイプ診断の結果は【積立ブッダ】でした！「20年後に会おう」 #投資家クズ診断"
    },
    "haitou": {
      "name": "配当貴族",
      "emoji": "👑",
      "image": "images/toushi_haitou_kizoku.png",
      "catchphrase": "働かせるのは金",
      "description": "配当通知音で生きている。\n株価より配当金。権利日が誕生日より楽しみ。",
      "ecology": ["毎月の配当通知で幸せ", "株価より配当金を見る", "優待も大好き"],
      "quotes": ["「働かせるのは金」"],
      "sighting": [{"scene": "配当通知メールを家族に見せていた"}],
      "weakness": ["爆上げ相場で置いていかれる"],
      "oneliner": "配当で飯を食う貴族。株価は見ない。",
      "params": [
        {"label": "配当愛", "value": "王族", "level": 100},
        {"label": "権利日執着", "value": "執念", "level": 100},
        {"label": "キャピタル欲", "value": "無欲", "level": 0},
        {"label": "配当確認", "value": "日課", "level": 100},
        {"label": "売買回数", "value": "盆栽", "level": 0}
      ],
      "tsukkomi": "配当通知を家族に見せるのは正しい投資教育です。",
      "share_text": "投資家タイプ診断の結果は【配当貴族】でした！「働かせるのは金」 #投資家クズ診断"
    },
    "akuryo": {
      "name": "握力キング",
      "emoji": "💪",
      "image": "images/toushi_akuryo_king.png",
      "catchphrase": "まだ始まり",
      "description": "売るという概念が存在しない鋼の男。\n含み損でも含み益でも、握力だけが上昇し続ける。",
      "ecology": ["10年放置は当たり前", "含み損でも平常運転", "利確タイミングを失う"],
      "quotes": ["「まだ始まり」"],
      "sighting": [{"scene": "テンバガーを元の株価まで戻した"}],
      "weakness": ["利確ができない"],
      "oneliner": "損切りも利確も知らない孤高の戦士。",
      "params": [
        {"label": "握力", "value": "鋼鉄", "level": 100},
        {"label": "狼狽売り", "value": "皆無", "level": 0},
        {"label": "長期保有", "value": "化石", "level": 100},
        {"label": "含み損耐性", "value": "狂人", "level": 100},
        {"label": "利確欲", "value": "無欲", "level": 0}
      ],
      "tsukkomi": "テンバガーを元値に戻したのは伝説です。利確ルールを作りましょう。",
      "share_text": "投資家タイプ診断の結果は【握力キング】でした！「まだ始まり」 #投資家クズ診断"
    },
    "gambler": {
      "name": "決算ギャンブラー",
      "emoji": "🎲",
      "image": "images/toushi_gambler.png",
      "catchphrase": "今回は読めた",
      "description": "決算前夜は飯も酒も喉を通らない。\n3連続爆損でも翌週には戦線復帰する。",
      "ecology": ["毎週どこかで決算勝負", "PTSが大好物", "朝起きて絶望する"],
      "quotes": ["「今回は読めた」"],
      "sighting": [{"scene": "3連続爆損後も挑戦していた"}],
      "weakness": ["学習しない"],
      "oneliner": "決算は宝くじ。でも毎週買い続ける。",
      "params": [
        {"label": "決算期待", "value": "賭神", "level": 100},
        {"label": "分析量", "value": "勘頼", "level": 0},
        {"label": "勝負欲", "value": "狂熱", "level": 100},
        {"label": "睡眠品質", "value": "崩壊", "level": 0},
        {"label": "運頼み", "value": "全振", "level": 100}
      ],
      "tsukkomi": "3連続爆損は学習のサインです。でも来週もやるんですよね。",
      "share_text": "投資家タイプ診断の結果は【決算ギャンブラー】でした！「今回は読めた」 #投資家クズ診断"
    },
    "fomo": {
      "name": "FOMO猿",
      "emoji": "🐒",
      "image": "images/toushi_fomo_saru.png",
      "catchphrase": "今買わないと遅い",
      "description": "急騰銘柄を見ると手が震える。\n乗った瞬間に下落が始まる才能を持つ。",
      "ecology": ["急騰銘柄しか見えない", "毎日トレンド巡回", "乗った瞬間に下がる"],
      "quotes": ["「今買わないと遅い」"],
      "sighting": [{"scene": "上昇率ランキングだけで購入"}],
      "weakness": ["全部高値"],
      "oneliner": "高値掴み精度が天才級。それが唯一の才能。",
      "params": [
        {"label": "流行追跡", "value": "本能", "level": 100},
        {"label": "SNS信仰", "value": "依存", "level": 100},
        {"label": "飛び乗り", "value": "達人", "level": 100},
        {"label": "忍耐力", "value": "欠如", "level": 0},
        {"label": "高値掴み", "value": "天才", "level": 100}
      ],
      "tsukkomi": "「急騰後24時間待つ」ルール一つで高値掴みが激減します。",
      "share_text": "投資家タイプ診断の結果は【FOMO猿】でした！「今買わないと遅い」 #投資家クズ診断"
    },
    "lever": {
      "name": "レバレッジ狂戦士",
      "emoji": "⚔️",
      "image": "images/toushi_leverage.png",
      "catchphrase": "倍率が足りん",
      "description": "2倍では満足しない。3倍でも物足りない。\n刺激がなければ投資ではない。",
      "ecology": ["2倍では満足しない", "毎日資産が激変", "刺激がないと退屈"],
      "quotes": ["「倍率が足りん」"],
      "sighting": [{"scene": "含み益100万でも不満顔"}],
      "weakness": ["退場率が高い"],
      "oneliner": "退場するために入金し続ける男。",
      "params": [
        {"label": "レバ欲", "value": "狂気", "level": 100},
        {"label": "借金耐性", "value": "覚悟", "level": 100},
        {"label": "睡眠品質", "value": "崩壊", "level": 0},
        {"label": "値動き依存", "value": "中毒", "level": 100},
        {"label": "リスク感覚", "value": "消失", "level": 0}
      ],
      "tsukkomi": "退場率が高いということは、生存率が低いということです。",
      "share_text": "投資家タイプ診断の結果は【レバレッジ狂戦士】でした！「倍率が足りん」 #投資家クズ診断"
    },
    "gorilla": {
      "name": "暴落買いゴリラ",
      "emoji": "🦍",
      "image": "images/toushi_gorilla.png",
      "catchphrase": "まだ安い",
      "description": "赤いチャートで元気になる逆張りの獣。\n暴落待ちが趣味で、サーキットブレーカーが好物。",
      "ecology": ["赤いチャートで興奮", "現金を常備", "暴落待ちが趣味"],
      "quotes": ["「まだ安い」"],
      "sighting": [{"scene": "サーキットブレーカーで笑顔"}],
      "weakness": ["暴落が来ない"],
      "oneliner": "市場が恐怖に包まれると本番モード開始。",
      "params": [
        {"label": "暴落歓迎", "value": "歓喜", "level": 100},
        {"label": "買付速度", "value": "瞬足", "level": 100},
        {"label": "恐怖心", "value": "欠如", "level": 0},
        {"label": "余力管理", "value": "準備", "level": 100},
        {"label": "逆張り力", "value": "本能", "level": 100}
      ],
      "tsukkomi": "サーキットブレーカーで笑顔になれる人間は稀です。あなたは逆張りの才能がある。",
      "share_text": "投資家タイプ診断の結果は【暴落買いゴリラ】でした！「まだ安い」 #投資家クズ診断"
    },
    "god": {
      "name": "フルポジ神",
      "emoji": "⚡",
      "image": "images/toushi_fullposi_god.png",
      "catchphrase": "余力は甘え",
      "description": "常に全力投球。現金比率ゼロが信仰。\n暴落日に買えず絶叫するのは毎年恒例行事。",
      "ecology": ["常に全力投球", "暴落で現金不足", "反省はする"],
      "quotes": ["「余力は甘え」"],
      "sighting": [{"scene": "暴落日に買えず絶叫"}],
      "weakness": ["いつも現金がない"],
      "oneliner": "現金ゼロ。信仰はMAX。反省はする。",
      "params": [
        {"label": "フル投入", "value": "神域", "level": 100},
        {"label": "現金比率", "value": "ゼロ", "level": 0},
        {"label": "余力管理", "value": "崩壊", "level": 0},
        {"label": "楽観度", "value": "最強", "level": 100},
        {"label": "後悔力", "value": "達人", "level": 100}
      ],
      "tsukkomi": "暴落で買えないのは現金がないからです。5%だけ現金を持ちましょう。",
      "share_text": "投資家タイプ診断の結果は【フルポジ神】でした！「余力は甘え」 #投資家クズ診断"
    }
  }
};
