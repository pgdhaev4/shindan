window.QUIZ_DATA = {
  "title": "投資家クズ度診断",
  "mode": "score",
  "score_ranges": [
    [6,  8,  "saint"],
    [9,  10, "good"],
    [11, 12, "grey"],
    [13, 15, "dangerous"],
    [16, 17, "kuzu_level1"],
    [18, 19, "kuzu_level2"],
    [20, 21, "kuzu_level3"],
    [22, 24, "god_kuzu"]
  ],
  "questions": [
    {
      "text": "投資で儲かったとき、周りへの態度は？",
      "choices": [
        {"text": "特に何も変わらない。謙虚に継続するだけ。", "score": 1},
        {"text": "少し嬉しいが、表に出さない。", "score": 2},
        {"text": "ついSNSで自慢投稿してしまう。", "score": 3},
        {"text": "負けている人に「なんで買わなかったの？」と言う。", "score": 4}
      ]
    },
    {
      "text": "投資で損したとき、あなたは？",
      "choices": [
        {"text": "自分の判断ミスとして受け入れる。", "score": 1},
        {"text": "少し外部のせいにするが、最終的には自責。", "score": 2},
        {"text": "「この銘柄を勧めた人が悪い」と思う。", "score": 3},
        {"text": "「政府が悪い」「日銀が悪い」「岸田が悪い」と言う。", "score": 4}
      ]
    },
    {
      "text": "他の人の投資スタイルを見たとき？",
      "choices": [
        {"text": "人それぞれで良いと思う。", "score": 1},
        {"text": "参考にしつつ、自分のスタイルを持つ。", "score": 2},
        {"text": "「そのやり方は微妙じゃないかな」と思う。", "score": 3},
        {"text": "「それで利益出ると思ってるの？」と言ってしまう。", "score": 4}
      ]
    },
    {
      "text": "投資未経験の人に対して？",
      "choices": [
        {"text": "聞かれたら丁寧に話す。強要しない。", "score": 1},
        {"text": "興味があるなら入門を教えてあげる。", "score": 2},
        {"text": "「投資しないと損」と言いたくなる。", "score": 3},
        {"text": "「なんで投資しないの？意味わからない」と言う。", "score": 4}
      ]
    },
    {
      "text": "SNSで自分の「買い煽り投稿」をしたことがある？",
      "choices": [
        {"text": "ない。他人の投資判断に影響を与えたくない。", "score": 1},
        {"text": "分析結果の共有はするが、推奨はしない。", "score": 2},
        {"text": "「〇〇良さそう」くらいのことは書いたことがある。", "score": 3},
        {"text": "「今すぐ買え！」的な投稿を何度もした。", "score": 4}
      ]
    },
    {
      "text": "相場が悪いとき、あなたの行動は？",
      "choices": [
        {"text": "予定通りに積立し、静かに過ごす。", "score": 1},
        {"text": "少し不安だが、長期視点で平静を保つ。", "score": 2},
        {"text": "「こんな相場おかしい」とSNSで愚痴る。", "score": 3},
        {"text": "特定の政治家・日銀・機関投資家を名指しで攻撃する。", "score": 4}
      ]
    }
  ],
  "results": {
    "saint": {
      "name": "堅実ペンギン",
      "emoji": "🐧",
      "image": "images/kuzu_saint.png",
      "catchphrase": "期待値で考えよう",
      "description": "ルールを守り、感情を排し、着実に資産を積み上げる存在。\n一番儲かるのに一番話題にならない。",
      "ecology": ["投資本どおりに動く", "ルールを絶対守る", "資産が着実に増える"],
      "quotes": ["「期待値で考えよう」"],
      "sighting": [{"scene": "一番儲かるのに一番話題にならない"}],
      "weakness": ["ネタにならない"],
      "oneliner": "投資コミュニティの良心。絶滅危惧種。",
      "params": [
        {"label": "計画性", "value": "完璧", "level": 100},
        {"label": "レバ欲", "value": "皆無", "level": 0},
        {"label": "損切り能力", "value": "冷静", "level": 100},
        {"label": "FOMO度", "value": "無風", "level": 0},
        {"label": "再現性", "value": "優秀", "level": 100}
      ],
      "tsukkomi": "クズ要素がなさすぎて診断が成立しません。あなたは良い人です。",
      "share_text": "投資家クズ度診断の結果は【堅実ペンギン】でした！「期待値で考えよう」 #投資家クズ診断"
    },
    "good": {
      "name": "優柔不断ナマケモノ",
      "emoji": "🦥",
      "image": "images/kuzu_good.png",
      "catchphrase": "もう少し考える",
      "description": "買うか迷って一生が終わりそうな存在。\n去年の買い候補をまだ検討中。",
      "ecology": ["買うか迷って一生終わる", "去年の候補をまだ検討中", "入れると決めた翌日に暴落"],
      "quotes": ["「もう少し考える」"],
      "sighting": [{"scene": "去年の買い候補をまだ検討中だった"}],
      "weakness": ["決断の瞬間"],
      "oneliner": "検討力だけが伸び続けている。",
      "params": [
        {"label": "迷い", "value": "停止", "level": 100},
        {"label": "行動力", "value": "冬眠", "level": 0},
        {"label": "検討期間", "value": "永遠", "level": 100},
        {"label": "後悔量", "value": "常連", "level": 80},
        {"label": "FOMO耐性", "value": "高め", "level": 80}
      ],
      "tsukkomi": "「もう少し考える」は永遠に終わりません。今日決めてください。",
      "share_text": "投資家クズ度診断の結果は【優柔不断ナマケモノ】でした！「もう少し考える」 #投資家クズ診断"
    },
    "grey": {
      "name": "利確早漏マン",
      "emoji": "😅",
      "image": "images/kuzu_grey.png",
      "catchphrase": "利益確定に失敗なし",
      "description": "+3%で勝者の顔をする存在。\n売った翌日にストップ高が来るのは毎回のこと。",
      "ecology": ["+3%で勝者の顔をする", "売った翌日にストップ高", "テンバガーを+10%で手放す"],
      "quotes": ["「利益確定に失敗なし」"],
      "sighting": [{"scene": "売った翌日に30%上昇を経験した"}],
      "weakness": ["テンバガー"],
      "oneliner": "売った翌日に上がるのが才能。",
      "params": [
        {"label": "利確速度", "value": "瞬殺", "level": 100},
        {"label": "握力", "value": "紙", "level": 0},
        {"label": "後悔量", "value": "常連", "level": 100},
        {"label": "利益喜び", "value": "過大", "level": 100},
        {"label": "テンバガー経験", "value": "皆無", "level": 0}
      ],
      "tsukkomi": "「利確に失敗なし」は真実ですが、「もっと儲かった」も真実です。",
      "share_text": "投資家クズ度診断の結果は【利確早漏マン】でした！「利益確定に失敗なし」 #投資家クズ診断"
    },
    "dangerous": {
      "name": "損切り不能兵",
      "emoji": "⚔️",
      "image": "images/kuzu_dangerous.png",
      "catchphrase": "まだ負けてない",
      "description": "撤退命令を聞かない孤独な兵士。\n部隊は全滅したが、本人だけ残留している。",
      "ecology": ["撤退命令を聞かない兵士", "含み損が増えるほど強くなる", "ナンピンが戦術"],
      "quotes": ["「まだ負けてない」"],
      "sighting": [{"scene": "部隊は壊滅、本人だけ残留していた"}],
      "weakness": ["退却ボタン"],
      "oneliner": "全滅した戦場で一人佇む最後の兵士。",
      "params": [
        {"label": "耐える力", "value": "塹壕", "level": 100},
        {"label": "撤退力", "value": "不在", "level": 0},
        {"label": "損失拡大", "value": "戦場", "level": 100},
        {"label": "平均単価愛", "value": "信仰", "level": 80},
        {"label": "握力", "value": "鉄壁", "level": 100}
      ],
      "tsukkomi": "「まだ負けてない」は売ったら確定するだけです。損切りも戦略です。",
      "share_text": "投資家クズ度診断の結果は【損切り不能兵】でした！「まだ負けてない」 #投資家クズ診断"
    },
    "kuzu_level1": {
      "name": "ナンピン将軍",
      "emoji": "📣",
      "image": "images/kuzu_lv1.png",
      "catchphrase": "むしろチャンス",
      "description": "下がるほど自信が増す逆説の将軍。\nチャンスが多すぎて資金が追証になった。",
      "ecology": ["下がるほど自信が増す", "チャンスが多すぎて資金が消える", "最後は現金ゼロで祈る"],
      "quotes": ["「むしろチャンス」"],
      "sighting": [{"scene": "チャンスが多すぎて追証になった"}],
      "weakness": ["永遠の下落相場"],
      "oneliner": "兵糧が尽きるまで突撃し続ける将軍。",
      "params": [
        {"label": "突撃力", "value": "増兵", "level": 100},
        {"label": "余力", "value": "兵糧切れ", "level": 0},
        {"label": "平均単価愛", "value": "信仰", "level": 100},
        {"label": "戦略的撤退", "value": "存在しない", "level": 0},
        {"label": "勝利への確信", "value": "無謀", "level": 100}
      ],
      "tsukkomi": "「むしろチャンス」も3回連続は危険信号です。",
      "share_text": "投資家クズ度診断の結果は【ナンピン将軍】でした！「むしろチャンス」 #投資家クズ診断"
    },
    "kuzu_level2": {
      "name": "FOMO猿",
      "emoji": "🐒",
      "image": "images/kuzu_lv2.png",
      "catchphrase": "今しかない！",
      "description": "タイムラインに脳を支配される猿。\n買った瞬間インフルエンサーが利確する。",
      "ecology": ["タイムラインに脳を支配される", "買った瞬間インフルエンサーが利確", "乗った瞬間に下落が始まる"],
      "quotes": ["「今しかない！」"],
      "sighting": [{"scene": "トレンド入りを確認した0.3秒後に購入"}],
      "weakness": ["冷静な5分"],
      "oneliner": "SNSに脳を支配された現代の投資家。",
      "params": [
        {"label": "飛びつき力", "value": "猿速", "level": 100},
        {"label": "SNS耐性", "value": "養分", "level": 0},
        {"label": "後悔量", "value": "日課", "level": 100},
        {"label": "高値掴み率", "value": "天才", "level": 100},
        {"label": "冷静時間", "value": "3秒", "level": 0}
      ],
      "tsukkomi": "「今しかない！」と思ったら5分待ってください。ほぼ確実に気持ちが変わります。",
      "share_text": "投資家クズ度診断の結果は【FOMO猿】でした！「今しかない！」 #投資家クズ診断"
    },
    "kuzu_level3": {
      "name": "レバレッジ特攻隊長",
      "emoji": "🔥",
      "image": "images/kuzu_lv3.png",
      "catchphrase": "人生変える取引がある",
      "description": "普通の投資では脳が反応しない特攻の隊長。\n人生は変わった。悪い方向に。",
      "ecology": ["普通の投資では脳が反応しない", "退場するたびに入金額が増える", "「人生変える」を本気で信じる"],
      "quotes": ["「人生変える取引がある」"],
      "sighting": [{"scene": "人生は変わった（悪い方向に）"}],
      "weakness": ["ロスカット"],
      "oneliner": "退場を繰り返しながら入金し続ける特攻隊長。",
      "params": [
        {"label": "レバ欲", "value": "特攻", "level": 100},
        {"label": "生存率", "value": "紙装甲", "level": 0},
        {"label": "一発逆転欲", "value": "危険", "level": 100},
        {"label": "退場経験", "value": "豊富", "level": 100},
        {"label": "学習能力", "value": "欠如", "level": 0}
      ],
      "tsukkomi": "人生は変わりました。次は良い方向に変えましょう。レバを下げてください。",
      "share_text": "投資家クズ度診断の結果は【レバレッジ特攻隊長】でした！「人生変える取引がある」 #投資家クズ診断"
    },
    "god_kuzu": {
      "name": "爆損の錬金術師",
      "emoji": "👿",
      "image": "images/kuzu_god.png",
      "catchphrase": "ここから逆転ある",
      "description": "3回退場したのに4回復活している不死鳥。\n反省会を開催しても毎回同じことをする。",
      "ecology": ["負けるほど資金投入額が増える", "根拠は勘とXのポスト", "資産曲線がジェットコースター"],
      "quotes": ["「ここから逆転ある」"],
      "sighting": [{"scene": "3回退場したのに4回復活している"}],
      "weakness": ["反省会を開催しても毎回同じことをする"],
      "oneliner": "爆損を錬金術に変えようとしている錬金師。",
      "params": [
        {"label": "レバレッジ欲", "value": "狂気", "level": 100},
        {"label": "損切り能力", "value": "祈祷", "level": 0},
        {"label": "ナンピン衝動", "value": "暴走", "level": 100},
        {"label": "FOMO度", "value": "発作", "level": 100},
        {"label": "爆損生成力", "value": "伝説", "level": 100}
      ],
      "tsukkomi": "ここまで来ると逆に一貫性があります。でも投資コミュニティは疲弊しています。一度休んでみてください。",
      "share_text": "投資家クズ度診断の結果は【爆損の錬金術師】でした！「ここから逆転ある」 #投資家クズ診断"
    }
  }
};
