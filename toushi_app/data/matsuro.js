window.QUIZ_DATA = {
  "title": "投資家の末路診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "legend"],
    [9,  10, "seiri"],
    [11, 12, "restart"],
    [13, 15, "kaifuku"],
    [16, 17, "mushoku"],
    [18, 19, "saikin"],
    [20, 21, "debt"],
    [22, 24, "haisan"]
  ],
  "questions": [
    {
      "text": "あなたの投資履歴を振り返ると？",
      "choices": [
        {"text": "コツコツ積み上げ。今も順調。", "score": 1},
        {"text": "失敗もあったが、トータルはプラス。", "score": 2},
        {"text": "プラスマイナスが激しい。", "score": 3},
        {"text": "ほぼマイナス。明確な利益は記憶にない。", "score": 4}
      ]
    },
    {
      "text": "投資に使った最大の一撃は？",
      "choices": [
        {"text": "月収の10〜20%以内の余裕資金だけ。", "score": 1},
        {"text": "余裕資金の範囲内だが、少し多めに入れたことがある。", "score": 2},
        {"text": "生活費の一部も入れたことがある。", "score": 3},
        {"text": "貯金の大部分・借金・カードローンを使ったことがある。", "score": 4}
      ]
    },
    {
      "text": "「損を取り返そう」と思ったとき、どうした？",
      "choices": [
        {"text": "損切りして冷静に振り返った。焦りで動かなかった。", "score": 1},
        {"text": "少し気持ちが揺れたが、冷静に戻った。", "score": 2},
        {"text": "「一発で取り返す」と思って大きなポジションを取ったことがある。", "score": 3},
        {"text": "「取り返す」ために何度も大きな賭けをして、さらに損を広げた。", "score": 4}
      ]
    },
    {
      "text": "投資の損失を家族に話せている？",
      "choices": [
        {"text": "話せている。家族も投資を理解している。", "score": 1},
        {"text": "概ね話しているが、詳細は伏せている部分もある。", "score": 2},
        {"text": "損失はほとんど話せていない。", "score": 3},
        {"text": "全く話せていない。知られたくない。", "score": 4}
      ]
    },
    {
      "text": "「投資をやめる」と決意したことは？",
      "choices": [
        {"text": "ない。コントロールできている。", "score": 1},
        {"text": "一度くらいある。でも今は落ち着いている。", "score": 2},
        {"text": "何度もあるが、結局やめられない。", "score": 3},
        {"text": "毎月のように決意して毎月破っている。", "score": 4}
      ]
    },
    {
      "text": "今の投資スタイルを5年続けたら？",
      "choices": [
        {"text": "資産が増えているイメージがある。", "score": 1},
        {"text": "少しずつ増えている気がする。", "score": 2},
        {"text": "正直よくわからない。", "score": 3},
        {"text": "続けたら破産しそうで怖い。", "score": 4}
      ]
    }
  ],
  "results": {
    "legend": {
      "name": "配当貴族",
      "emoji": "🏆",
      "image": "images/matsuro_legend.png",
      "catchphrase": "今月も入金ありがとう",
      "description": "配当金だけで旅行代を払う不労所得の完成形。\n株価より配当通知が楽しみな生き方。",
      "ecology": ["毎月の配当通知で幸せになる", "株価より配当金を見る", "資産形成が趣味になる"],
      "quotes": ["「今月も入金ありがとう」"],
      "sighting": [{"scene": "配当金だけで旅行代を払った"}],
      "weakness": ["値上がり自慢についていけない"],
      "oneliner": "投資の末路として最も羨ましい結末。",
      "params": [
        {"label": "配当愛", "value": "崇拝", "level": 100},
        {"label": "売買回数", "value": "冬眠", "level": 0},
        {"label": "不労所得力", "value": "完成", "level": 100},
        {"label": "浪費欲", "value": "節約", "level": 0},
        {"label": "老後安心度", "value": "安泰", "level": 100}
      ],
      "tsukkomi": "あなたの末路は明るい。このまま続けてください。本当に。",
      "share_text": "投資家の末路診断の結果は【配当貴族】でした！「今月も入金ありがとう」 #投資家クズ診断"
    },
    "seiri": {
      "name": "FIRE仙人",
      "emoji": "🏔️",
      "image": "images/matsuro_seiri.png",
      "catchphrase": "自由こそ資産",
      "description": "労働を卒業し、利回りで生きる仙人。\n退職後も毎日株価を見ている。",
      "ecology": ["会社より配当を信じる", "毎日資産運用だけする", "退職後も毎日相場を見る"],
      "quotes": ["「自由こそ資産」"],
      "sighting": [{"scene": "退職後の方が働いていた"}],
      "weakness": ["暇"],
      "oneliner": "FIRE達成後も相場から離れられない。",
      "params": [
        {"label": "労働拒否", "value": "悟り", "level": 100},
        {"label": "節約力", "value": "修行", "level": 100},
        {"label": "物欲", "value": "枯渇", "level": 0},
        {"label": "資産所得", "value": "完成", "level": 100},
        {"label": "時間の豊かさ", "value": "最強", "level": 100}
      ],
      "tsukkomi": "退職後も毎日株価を見るのは、FIREではなくFOREXです。",
      "share_text": "投資家の末路診断の結果は【FIRE仙人】でした！「自由こそ資産」 #投資家クズ診断"
    },
    "restart": {
      "name": "億り人",
      "emoji": "💰",
      "image": "images/matsuro_restart.png",
      "catchphrase": "昔は失敗もしたよ",
      "description": "資産額は言わないが匂わせる存在。\nスクショの端に評価額が写り込んでいる。",
      "ecology": ["資産額は言わないが匂わせる", "昔の失敗話を好んでする", "スクショの端に評価額が写る"],
      "quotes": ["「昔は失敗もしたよ」"],
      "sighting": [{"scene": "スクショの端に評価額が写り込んでいた"}],
      "weakness": ["税金"],
      "oneliner": "億り人の末路は匂わせと税金。",
      "params": [
        {"label": "資産力", "value": "億", "level": 100},
        {"label": "匂わせ度", "value": "本能", "level": 70},
        {"label": "慎重さ", "value": "余裕", "level": 60},
        {"label": "承認欲求", "value": "旺盛", "level": 70},
        {"label": "税金", "value": "天敵", "level": 100}
      ],
      "tsukkomi": "「昔は失敗もした」の話は毎回同じです。新しいエピソードを用意してください。",
      "share_text": "投資家の末路診断の結果は【億り人】でした！「昔は失敗もしたよ」 #投資家クズ診断"
    },
    "kaifuku": {
      "name": "普通のおじさん",
      "emoji": "😊",
      "image": "images/matsuro_kaifuku.png",
      "catchphrase": "まあ銀行よりはマシか",
      "description": "一番多い末路。特に目立った成功も失敗もない。\nNISAと定期預金を併用する正しい投資家。",
      "ecology": ["結局一番多い末路", "銀行より少しだけマシ", "NISAと定期預金を併用"],
      "quotes": ["「まあ銀行よりはマシか」"],
      "sighting": [{"scene": "NISAと定期預金を両方使っていた"}],
      "weakness": ["夢が小さい"],
      "oneliner": "一番現実的で一番多い末路。",
      "params": [
        {"label": "現実感", "value": "生活", "level": 100},
        {"label": "爆益度", "value": "平凡", "level": 0},
        {"label": "安定感", "value": "堅実", "level": 60},
        {"label": "夢の大きさ", "value": "控えめ", "level": 30},
        {"label": "継続力", "value": "普通", "level": 60}
      ],
      "tsukkomi": "「銀行よりはマシ」は実は偉大な成果です。続けてください。",
      "share_text": "投資家の末路診断の結果は【普通のおじさん】でした！「まあ銀行よりはマシか」 #投資家クズ診断"
    },
    "mushoku": {
      "name": "投資ジャンキー",
      "emoji": "🎰",
      "image": "images/matsuro_mushoku.png",
      "catchphrase": "月曜まだ？",
      "description": "土日が嫌いで月曜を待ち続ける相場中毒者。\n祝日に仮想通貨市場を発見して問題を解決した。",
      "ecology": ["土日が嫌い", "祝日に仮想通貨を見始める", "相場が閉まると手持ち無沙汰"],
      "quotes": ["「月曜まだ？」"],
      "sighting": [{"scene": "祝日に仮想通貨市場を発見した"}],
      "weakness": ["三連休"],
      "oneliner": "24時間365日開いている市場を探し続ける。",
      "params": [
        {"label": "市場依存", "value": "中毒", "level": 100},
        {"label": "休場耐性", "value": "禁断症状", "level": 0},
        {"label": "情報摂取", "value": "過食", "level": 100},
        {"label": "土日の幸福度", "value": "最低", "level": 0},
        {"label": "月曜への渇望", "value": "執念", "level": 100}
      ],
      "tsukkomi": "仮想通貨市場は24時間365日開いています。もう土日も不要です（危険な情報）。",
      "share_text": "投資家の末路診断の結果は【投資ジャンキー】でした！「月曜まだ？」 #投資家クズ診断"
    },
    "saikin": {
      "name": "含み損仙人",
      "emoji": "🧘",
      "image": "images/matsuro_saikin.png",
      "catchphrase": "これも修行",
      "description": "含み損を人生哲学に昇華した境地の人。\n損しているのに説法する謎の説得力がある。",
      "ecology": ["含み損を人生哲学に昇華する", "後輩に説法する", "損してるのに満足げ"],
      "quotes": ["「これも修行」"],
      "sighting": [{"scene": "含み損の状態で投資哲学を語っていた"}],
      "weakness": ["決算短信"],
      "oneliner": "含み損で悟りを開いた稀有な存在。",
      "params": [
        {"label": "含み損歴", "value": "古代", "level": 100},
        {"label": "悟り感", "value": "枯山水", "level": 80},
        {"label": "損切り力", "value": "封印", "level": 0},
        {"label": "諦め度", "value": "達観", "level": 80},
        {"label": "説法欲", "value": "旺盛", "level": 100}
      ],
      "tsukkomi": "修行も大切ですが、損切りという手段もあります。",
      "share_text": "投資家の末路診断の結果は【含み損仙人】でした！「これも修行」 #投資家クズ診断"
    },
    "debt": {
      "name": "損失繰越職人",
      "emoji": "📋",
      "image": "images/matsuro_debt.png",
      "catchphrase": "3年繰り越せるから",
      "description": "確定申告だけ妙に詳しい節税の職人。\n税務知識だけプロ級になったが利益がない。",
      "ecology": ["確定申告だけ妙に詳しい", "3年繰越が口癖", "税務知識だけプロ級"],
      "quotes": ["「3年繰り越せるから」"],
      "sighting": [{"scene": "損失の計算だけが毎年正確"}],
      "weakness": ["そもそも利益がない"],
      "oneliner": "節税技術だけが磨かれ続けている職人。",
      "params": [
        {"label": "節税知識", "value": "職人", "level": 100},
        {"label": "損失額", "value": "年季", "level": 100},
        {"label": "利益", "value": "不在", "level": 0},
        {"label": "確定申告力", "value": "達人", "level": 100},
        {"label": "損失活用力", "value": "プロ", "level": 100}
      ],
      "tsukkomi": "繰り越す前に利益を出す方法も考えてみてください。",
      "share_text": "投資家の末路診断の結果は【損失繰越職人】でした！「3年繰り越せるから」 #投資家クズ診断"
    },
    "haisan": {
      "name": "税金だけ払う人",
      "emoji": "💸",
      "image": "images/matsuro_haisan.png",
      "catchphrase": "去年は儲かったんだけどね",
      "description": "利益確定だけは上手い。その後の取引で利益を消す。\n利益100万円・最終資産マイナスを達成した伝説の存在。",
      "ecology": ["利益確定だけは上手い", "その後の取引で利益を消す", "なぜか税金だけ残る"],
      "quotes": ["「去年は儲かったんだけどね」"],
      "sighting": [{"scene": "利益100万円、最終資産マイナスを達成"}],
      "weakness": ["年間損益を見ない"],
      "oneliner": "税金だけが着実に増えていく謎の人。",
      "params": [
        {"label": "利確衝動", "value": "暴走", "level": 100},
        {"label": "税金支払力", "value": "最強", "level": 100},
        {"label": "資産残存率", "value": "消滅", "level": 0},
        {"label": "回転売買", "value": "狂乱", "level": 100},
        {"label": "長期保有力", "value": "皆無", "level": 0}
      ],
      "tsukkomi": "利益100万円・最終資産マイナスは笑えない実話です。年間損益を必ず確認しましょう。",
      "share_text": "投資家の末路診断の結果は【税金だけ払う人】でした！「去年は儲かったんだけどね」 #投資家クズ診断"
    }
  }
};
