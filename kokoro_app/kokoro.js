/**
 * kokoro.js — 「心が少し軽くなる診断」エンジン
 *
 * 既存の quiz.js（会社モンスター診断など）とは別物として作っている。理由は2つ。
 *  1) 既存エンジンは「合計点 → 点数レンジ」で判定する1軸式で、つらさを点数化してしまう。
 *     疲れている人に「あなたのつらさは◯点」を出すのは逆効果なので使わない。
 *  2) このエンジンは「どの方向の疲れか」を数える多軸式。選択肢ごとに axis を持たせ、
 *     いちばん多く選ばれた軸を結果にする。重い/軽いの上下がつかない。
 *
 * 結果は必ず7つの節で構成する（今のあなた／なぜ疲れやすいのか／良いところ／
 * 別の角度／今日できる小さなこと／森からあなたへ／関連記事）。
 * 「あなたは◯◯です」で終わらせないための構造上の縛り。
 */

(function () {
  'use strict';

  var SECTIONS = [
    { key: 'now',      icon: '🌿', title: '今のあなた' },
    { key: 'why',      icon: '🔎', title: 'なぜ疲れやすいのか' },
    { key: 'strength', icon: '✨', title: '実は、こんな良いところがあります', cls: 'rs-strength' },
    { key: 'angle',    icon: '🔄', title: '別の角度から見ると',              cls: 'rs-angle' }
  ];

  // ---- 誤操作を防ぐ「不感帯」（2026-08-31 実ブラウザ監査で追加） -------------
  // 症状: 選択肢を押す → 330ms後に設問がDOMごと差し替わる → 同じ座標に次の設問の
  //       選択肢が「即」生きるため、押し直し・2度押しが《読んでいない設問》の
  //       回答になり、別のタイプが表示されていた（実測: 320ms以降ならいつでも発生・上限なし）。
  // 対策は2段構え。
  //   ① 描画のたび GUARD_MS の間、診断の枠ごと入力を受け付けない（リンクも含めて塞ぐ）
  // ★ロック時間を延ばす対処は採らない。待たされるほど「効かない→押し直す」を誘発し、
  //   このバグを踏む動作そのものを増やすため。
  // ★座標で弾く案（前のタップの近くを一定時間捨てる）は採用しない。設問が変わったあとに
  //   たまたま同じ位置へ来た選択肢を正当に選んだ操作まで無言で捨ててしまうため
  //   （既存の機械検査 _browser_test.py が実際に落ちた）。時間だけで判定する。
  var GUARD_MS = 400;   // 差し替え直後に入力を受け付けない時間（回答から数えると約730ms）

  function now() {
    return (window.performance && performance.now) ? performance.now() : +new Date();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function paras(text) {
    return String(text || '').split('\n').filter(function (t) { return t.trim(); })
      .map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
  }

  // 広告スクリプトは結果画面になってから読み込む。
  // 設問・選択肢・戻るボタンといった操作UIの近くに広告が入らないようにするため
  // （質問ページは広告より診断操作を優先する＝オーナー方針 2026-08-26）。
  function loadAds() {
    if (window.__kokoroAdsLoaded) return;
    window.__kokoroAdsLoaded = true;
    try {
      var el = document.createElement('script');
      el.async = true;
      el.crossOrigin = 'anonymous';
      el.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3934206444145241';
      document.head.appendChild(el);
    } catch (e) { /* 広告が出せなくても診断は動く */ }
  }

  // 結果を出すときは、ページ上部の見出しと説明（.page-hero）を隠す。
  // 結果を早く見せるため（オーナー指示 2026-09-07）。もう一度やるときに戻す。
  function hero(show) {
    try {
      var b = document.body;
      if (!b) return;
      if (show) b.classList.remove('is-result');
      else b.classList.add('is-result');
    } catch (e) { /* 表示の調整なので失敗しても診断は動かす */ }
  }

  function KokoroQuiz(mountSelector) {
    this.mount = document.querySelector(mountSelector || '#quiz-app');
    this.data = null;
    this.index = 0;
    this.picked = [];        // 各問で選んだ軸（v1）／極（v2）
    this.tags = [];          // 各問で選んだ選択肢の tag（v2の可変文用）
    this.locked = false;
    this.readyAt = 0;        // この時刻まで入力を受け付けない（不感帯）
  }

  KokoroQuiz.prototype.init = function () {
    if (!this.mount) return;
    if (typeof window.KOKORO_DATA === 'undefined') {
      this.mount.innerHTML = '<p class="err">診断データを読み込めませんでした。ページを再読み込みしてください。</p>';
      return;
    }
    this.data = window.KOKORO_DATA;
    this.renderQuestion(true);   // 初回はスクロールしない（H1と説明を飛ばさない）
    // 計測: 診断開始（匿名・数だけ。measure.js が無いページでは何もしない）
    try { if (window.KMES) window.KMES.start(); } catch (e) {}
  };

  // ---------------- 設問 ----------------
  KokoroQuiz.prototype.renderQuestion = function (first) {
    var self = this;
    var q = this.data.questions[this.index];
    var total = this.data.questions.length;
    // 進捗バーはラベル（例「8 / 8」）と同じ基準にそろえる。
    // 以前は index/total だったので、最後の設問でラベルが8/8なのにバーは88%で止まっていた。
    var pct = Math.round(((this.index + 1) / total) * 100);

    this.mount.innerHTML =
      '<div class="quiz-container">' +
        '<div class="quiz-head"><p class="qname">' + esc(this.data.title) + '</p></div>' +
        '<div class="progress-area">' +
          '<div class="progress-label"><span>' + (this.index + 1) + ' / ' + total + '</span></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>' +
        (this.index > 0 ? '<div class="back-btn-wrap"><button class="back-btn" type="button">← ひとつ前に戻る</button></div>' : '') +
        '<div class="question-card" tabindex="-1" role="group" aria-label="質問 ' + (this.index + 1) + ' / ' + total + '">' +
          '<p class="question-number">Q' + (this.index + 1) + '</p>' +
          '<p class="question-text">' + esc(q.text) + '</p>' +
          '<div class="choices-list">' +
            q.choices.map(function (c, i) {
              // v1は選択肢ごとに軸を持つ。v2は設問が軸を持ち、選択肢は極(pole)と可変文用のtagを持つ。
              return '<button class="choice-btn" type="button" data-axis="' + esc(c.axis || q.axis) + '"' +
                       (c.pole ? ' data-pole="' + esc(c.pole) + '"' : '') +
                       (c.tag ? ' data-tag="' + esc(c.tag) + '"' : '') +
                       ' data-i="' + i + '">' +
                       '<span class="choice-mark"></span>' +
                       '<span class="choice-text">' + esc(c.text) + '</span>' +
                     '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<p class="quiz-note">近いものがなければ、いちばん「まだマシ」なものでかまいません。<br>正解はありません。</p>' +
      '</div>';

    var back = this.mount.querySelector('.back-btn');
    if (back) back.addEventListener('click', function () { self.goBack(); });
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (btn) {
      btn.addEventListener('click', function (ev) { self.choose(btn, ev); });
    });
    // 回答直後は選択肢が全部 disabled になりフォーカスが body に落ちるため、
    // そのままだとTabが診断の外（フッターのリンク等）へ抜けて回答が消える。
    // 新しい設問カードへフォーカスを移して、Tabの続きが選択肢に入るようにする。
    // 画面は動かさない（preventScroll）。
    if (!first) {
      var card = this.mount.querySelector('.question-card');
      if (card) { try { card.focus({ preventScroll: true }); } catch (e) { card.focus(); } }
      this.scrollToTop();
    } else {
      this.scrollIntoViewMinimal();
    }
    this.arm();
  };

  // 描画のたびに不感帯を張る。
  // ★止めるのは「選択肢の並び」だけにする。診断の枠ごと止めると、
  //   戻るボタンや結果画面のリンクが《押せる見た目のまま無反応》になり、
  //   戻るの連打も無言で捨てられる（2026-08-31 再テストで実際に出た）。
  KokoroQuiz.prototype.arm = function () {
    var list = this.mount ? this.mount.querySelector('.choices-list') : null;
    if (!list) return;
    this.readyAt = now() + GUARD_MS;
    list.style.pointerEvents = 'none';
    setTimeout(function () { list.style.pointerEvents = ''; }, GUARD_MS);
  };

  // この入力を受け付けてよいか。
  // ★キーボード（Enter/Space）は対象外。誤操作は「同じ場所を指でもう一度触る」ことで起きるので、
  //   自分でフォーカスを移してから押すキーボード操作には当てはまらない。
  //   キーボード由来の click は detail が 0 になるので、それで見分ける。
  KokoroQuiz.prototype.accepts = function (ev) {
    if (ev && ev.detail === 0) return true;
    return now() >= this.readyAt;
  };

  // 初回だけの控えめなスクロール。
  // 何も動かさないとQ1の選択肢が4個中2個しか画面に入らず（390x844で実測）、
  // 見えている上2つが選ばれやすくなって結果の分布が偏る。
  // かといって従来のように診断の先頭まで飛ばすと、診断名(H1)と
  // 「会員登録・個人情報入力なし」の一行を読む前に流してしまう。
  // そこで「選択肢の最後が画面に入るのに足りない分」だけを動かす。
  KokoroQuiz.prototype.scrollIntoViewMinimal = function () {
    var self = this;
    setTimeout(function () {
      var box = self.mount.querySelector('.quiz-container');
      if (!box) return;
      var r = box.getBoundingClientRect();
      var need = r.bottom - window.innerHeight + 16;   // はみ出している分
      if (need <= 8) return;                            // 全部入っているなら動かさない
      var top = Math.min(window.scrollY + need, r.top + window.scrollY - 14);
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 60);
  };

  KokoroQuiz.prototype.scrollToTop = function () {
    var self = this;
    setTimeout(function () {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      var top = Math.max(0, self.mount.getBoundingClientRect().top + window.scrollY - 14);
      // すでにほぼ目的の位置なら動かさない。スクロール中は当たり判定も動くので、
      // 意味なく動かすほど誤タップの機会が増える。
      if (Math.abs(window.scrollY - top) < 8) return;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 40);
  };

  // 戻るには不感帯をかけない。誤爆が起きるのは「選択肢の同じ座標」であって戻るボタンではないし、
  // かけると「3回戻ったのに1回しか戻っていない」が起きる（2026-08-31 再テストで実際に出た）。
  KokoroQuiz.prototype.goBack = function () {
    if (this.index <= 0 || this.locked) return;
    this.picked.pop();
    this.tags.pop();
    this.index--;
    this.renderQuestion();
  };

  KokoroQuiz.prototype.choose = function (btn, ev) {
    var self = this;
    if (this.locked) return;
    if (!this.accepts(ev)) return;   // 差し替え直後＝読んでいない設問への回答なので捨てる
    this.locked = true;
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (b) { b.disabled = true; });
    // 戻るボタンも止める。ここを止めないと「押せる見た目のまま無言で捨てられる」ことになる。
    var backBtn = this.mount.querySelector('.back-btn');
    if (backBtn) backBtn.disabled = true;
    btn.classList.add('selected');
    // v2は極(pole)を、v1は軸(axis)を積む。tagは可変文の材料（v1では空）。
    this.picked.push(btn.dataset.pole || btn.dataset.axis);
    this.tags.push(btn.dataset.tag || '');
    setTimeout(function () {
      self.locked = false;
      if (document.activeElement) document.activeElement.blur();
      self.index++;
      if (self.index < self.data.questions.length) self.renderQuestion();
      else self.renderResult();
    }, 330);
  };

  // ---------------- 判定 ----------------
  // いちばん多く選ばれた軸を結果にする。
  // ★同点のときに data.axes の並び順で決めない。それだと「同じ回答なのに、
  //   コードの書き順だけで結果が変わる」ことになるため。
  //   同点のときは ①選択率（選んだ回数÷選べた回数）が高いほう
  //                ②それも同じなら、その軸を最後に選んだのが遅いほう（＝後半の回答を重く見る）
  //   の順で決める。どちらも回答そのものから取る。
  //   全65,536通りの検証で、結果の出現率の偏りは最大/最小 4.19倍 → 1.54倍 に縮んだ。
  KokoroQuiz.prototype.decide = function () {
    var axes = this.data.axes;
    var picked = this.picked;
    var count = {};
    axes.forEach(function (a) { count[a] = 0; });
    picked.forEach(function (a) { if (count[a] !== undefined) count[a]++; });

    var max = 0;
    axes.forEach(function (a) { if (count[a] > max) max = count[a]; });
    var tied = axes.filter(function (a) { return count[a] === max; });

    var key = tied[0];
    if (tied.length > 1) {
      // ①選択率＝その軸を選んだ回数 ÷ その軸を選べた回数。
      //   軸によって選べる回数（枠）が6と5で違うので、そこをそろえてから比べる。
      var slot = {};
      axes.forEach(function (a) { slot[a] = 0; });
      this.data.questions.forEach(function (q) {
        q.choices.forEach(function (c) { if (slot[c.axis] !== undefined) slot[c.axis]++; });
      });
      var best = -1;
      tied.forEach(function (a) {
        var rate = slot[a] ? count[a] / slot[a] : 0;
        if (rate > best) best = rate;
      });
      var top = tied.filter(function (a) {
        return Math.abs((slot[a] ? count[a] / slot[a] : 0) - best) < 1e-9;
      });
      // ②それも同じなら、その軸を最後に選んだのが遅いほう＝後半の回答を重く見る
      key = top[0];
      var latest = -1;
      top.forEach(function (a) {
        var pos = picked.lastIndexOf(a);
        if (pos > latest) { latest = pos; key = a; }
      });
    }

    // 副傾向：同点だったとき【だけ】もう一方を出す（案C）。
    // 1つ差まで拾うと8割以上の回答で出てしまい、言葉が軽くなるので同点に限定した。
    var sub = null;
    if (tied.length > 1) {
      var others = tied.filter(function (a) { return a !== key; });
      var latest2 = -1;
      others.forEach(function (a) {
        var pos = picked.lastIndexOf(a);
        if (pos > latest2) { latest2 = pos; sub = a; }
      });
    }

    return { key: key, sub: sub, count: count, tied: tied.length > 1 };
  };

  // ---------------- 判定（v2＝3つの二値軸） ----------------
  // 各軸で、その軸の設問の回答を数えて多いほうの極を採る。
  // 同数（設問が偶数の軸でだけ起こる）は「その軸で最後に選んだ側」＝後半の回答を重く見る。
  // ★書き順や軸の並びでは決めない。同じ回答なら必ず同じタイプになる。
  KokoroQuiz.prototype.decideV2 = function () {
    var self = this;
    var parts = this.data.axes.map(function (ax) {
      var ca = 0, cb = 0, last = null;
      self.data.questions.forEach(function (q, i) {
        if (q.axis !== ax.key) return;
        var p = self.picked[i];
        if (p === ax.a) { ca++; last = ax.a; }
        else if (p === ax.b) { cb++; last = ax.b; }
      });
      if (ca > cb) return ax.a;
      if (cb > ca) return ax.b;
      return last || ax.a;
    });
    return { key: parts.join('-') };
  };

  // 回答から可変の褒め文を選ぶ。tagの多い順（同数なら後から選んだほう）。
  // ★avoid（タイプ固有の褒め文）と言い回しがかぶるものは飛ばす。
  //   同じことを2回言われると、褒められた感じが薄れるため（実測で重複が出た・2026-09-07）。
  KokoroQuiz.prototype.pickVariants = function (max, avoid) {
    var V = this.data.variants || {};
    var count = {}, lastAt = {};
    this.tags.forEach(function (t, i) {
      if (!t || !V[t]) return;
      count[t] = (count[t] || 0) + 1;
      lastAt[t] = i;
    });
    // 比べるのは《中身の語》だけ。「あなた」「ところ」「です」などの共通語で
    // 偶然かぶって候補が消えないように、先に取り除いてから見る。
    var STOP = /(あなた|ところ|ています|ていません|でしょう|ですが|です|ます|ました|こと|もの|ここ|その|この|いい|良さ|選ん|選べ|選ぶ|答え|回答|10問|人で|という|そこ|自分の)/g;
    var norm = function (s) {
      return String(s || '').replace(/[、。「」（）——…・\s]/g, '').replace(STOP, '');
    };
    var pool = (avoid || []).map(norm);
    // 同じ長所の言い換えを避ける：中身の4文字が2つ以上かぶったら使わない。
    var overlaps = function (text) {
      var t = norm(text);
      for (var j = 0; j < pool.length; j++) {
        var hits = 0, seen = {};
        for (var i = 0; i + 4 <= t.length; i++) {
          var frag = t.substr(i, 4);
          if (seen[frag]) continue;
          if (pool[j].indexOf(frag) >= 0) { seen[frag] = 1; hits++; }
          if (hits >= 2) return true;
        }
      }
      return false;
    };
    var out = [], rest = [];
    var order = Object.keys(count)
      .sort(function (a, b) { return (count[b] - count[a]) || (lastAt[b] - lastAt[a]); });
    order.forEach(function (t) {
      if (out.length >= (max || 2)) return;
      if (overlaps(V[t])) { rest.push(t); return; }
      out.push(V[t]);
      pool.push(norm(V[t]));       // 可変文どうしの重複も防ぐ
    });
    // ★重複を避けた結果、件数が足りなくなったら残りから補う（表示件数は必ず保つ）。
    for (var r = 0; r < rest.length && out.length < (max || 2); r++) out.push(V[rest[r]]);
    // それでも足りなければ、使っていない候補から順に足す
    if (out.length < (max || 2)) {
      Object.keys(V).forEach(function (t) {
        if (out.length >= (max || 2)) return;
        if (out.indexOf(V[t]) < 0) out.push(V[t]);
      });
    }
    return out;
  };

  // ---------------- 結果 ----------------
  KokoroQuiz.prototype.renderResult = function () {
    if ((this.data.schema || 1) >= 2) return this.renderResultV2();
    var d = this.decide();
    var key = d.key;
    var r = this.data.results[key];
    if (!r) {
      this.mount.innerHTML = '<p class="err">結果の読み込みに失敗しました。もう一度お試しください。</p>';
      return;
    }
    this.save(key, r);
    hero(false);   // ページ上部の見出し・説明を隠して、結果を先に見せる

    // 計測: 結果表示（診断×タイプ別・表示IDで二重計測を防ぐ。CTA実装時にこのIDを使う）
    this.viewId = null;
    try { if (window.KMES) this.viewId = window.KMES.result(key); } catch (e) {}
    loadAds();

    var html = '<div class="result-container">';

    html +=
      '<div class="result-hero">' +
        '<p class="result-kicker">' + esc(this.data.result_kicker || '今日のあなたに、いちばん近いのは') + '</p>' +
        '<span class="result-emoji">' + esc(r.emoji || '🌿') + '</span>' +
        '<h2 class="result-name">' + esc(r.name) + '</h2>' +
        (r.lead ? '<p class="result-lead">' + esc(r.lead) + '</p>' : '') +
        (d.sub && this.data.results[d.sub]
          ? '<p class="result-sub">' + esc(this.data.results[d.sub].name) +
            ' の傾向も、少し重なっているようです</p>'
          : '') +
      '</div>';

    SECTIONS.forEach(function (s) {
      if (!r[s.key]) return;
      html += '<div class="rs ' + (s.cls || '') + '">' +
                '<h3>' + s.icon + ' ' + esc(s.title) + '</h3>' + paras(r[s.key]) +
              '</div>';
    });

    if (r.today && r.today.length) {
      html += '<div class="rs"><h3>🌱 今日できる、小さなこと</h3>' +
              '<ul class="today-list">' +
                r.today.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
              '</ul>' +
              '<p style="font-size:.8rem;color:#8a988f;margin-top:11px;line-height:1.8;">できそうなものが一つもなければ、今日は何もしなくて大丈夫です。</p>' +
              '</div>';
    }

    if (r.message) {
      html += '<div class="rs rs-message"><h3 style="justify-content:center">🌲 森から、あなたへ</h3>' + paras(r.message) + '</div>';
    }

    // 「あなたの詳細分析」CTA（cta.js設定・noteのURLが入っている診断だけ表示）
    var ctaHtml = '';
    try {
      var C = window.KOKORO_CTA;
      var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/, '');
      if (C && C.noteUrls && C.noteUrls[slug]) {
        ctaHtml =
          '<div class="rs cta-card" id="cta-card">' +
            '<p class="cta-lead">' + esc(C.lead) + '</p>' +
            '<h3 class="cta-head">' + esc(C.headline(slug, r.name)) + '</h3>' +
            '<p class="cta-sub">' + esc(C.sub) + '</p>' +
            '<ul class="cta-points">' +
              (C.points[slug] || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
            '</ul>' +
            '<p class="cta-sub">' + esc(C.tail) + '</p>' +
            '<a class="cta-btn" id="cta-btn" href="' + esc(C.noteUrls[slug]) + '" target="_blank" rel="noopener">' +
              esc(C.button) + '</a>' +
            '<p class="cta-note">' + esc(C.note) + '</p>' +
          '</div>';
      }
    } catch (e) { ctaHtml = ''; }
    html += ctaHtml;

    if (r.articles && r.articles.length) {
      html += '<div class="rs"><h3>📖 明日を少しラクにする読みもの</h3><div class="rel-list">' +
              r.articles.map(function (a) {
                return '<a href="' + esc(a.href) + '">' + esc(a.title) + '<span class="arrow">›</span></a>';
              }).join('') + '</div></div>';
    }

    html +=
      '<div class="result-actions">' +
        '<button class="btn btn-sub" type="button" id="retry">もう一度やってみる</button>' +
        '<a class="btn btn-main" href="index.html">ほかの診断を見てみる</a>' +
      '</div>' +
      '<p style="text-align:center;font-size:.78rem;color:#8a988f;line-height:1.9;margin-top:6px;">' +
        'ここで終わりにして大丈夫です。<br>ひとつ受けるだけで、十分です。' +
      '</p>' +
      '</div>';

    this.mount.innerHTML = html;

    var self = this;
    // CTA計測（measure.jsがあるときだけ・診断の動作には影響させない）
    try {
      var card = document.getElementById('cta-card');
      if (card && window.KMES && this.viewId) {
        var meta = { viewId: this.viewId, type: key,
                     variant: (window.KOKORO_CTA && window.KOKORO_CTA.variant) || '' };
        window.KMES.observeCTA(card, meta);
        var btn = document.getElementById('cta-btn');
        if (btn) btn.addEventListener('click', function () { window.KMES.ctaClick(meta); });
      }
    } catch (e) { /* 計測は失敗しても無視 */ }

    this.bindRetry();
    this.scrollToTop();
  };

  // 「もう一度やってみる」。隠していたページ上部も戻す。
  KokoroQuiz.prototype.bindRetry = function () {
    var self = this;
    var retry = document.getElementById('retry');
    if (retry) retry.addEventListener('click', function () {
      self.index = 0; self.picked = []; self.tags = [];
      hero(true);
      self.unfoldStatic();
      self.renderQuestion();
    });
  };

  // 結果を出したら、下の長い説明（診断とは／8つの結果／よくある質問）を折りたたむ。
  // ★消さない。SEOのために本文はDOMに残したまま、開いて読める形にする（オーナー指示 2026-09-07）。
  //   診断直後の主役は説明ではなく、本人を褒めることなので、視覚的にも弱くする。
  KokoroQuiz.prototype.foldStatic = function () {
    try {
      if (document.querySelector('.seo-fold')) return;
      var wrap = document.querySelector('.page-wrapper > .wrap');
      if (!wrap) return;
      var secs = wrap.querySelectorAll('section.static-sec');
      if (!secs.length) return;
      var d = document.createElement('details');
      d.className = 'seo-fold';
      var sm = document.createElement('summary');
      sm.textContent = 'この診断について（説明・よくある質問）';
      d.appendChild(sm);
      Array.prototype.forEach.call(secs, function (sec) { d.appendChild(sec); });
      wrap.appendChild(d);
    } catch (e) { /* 折りたためなくても診断は動く */ }
  };

  KokoroQuiz.prototype.unfoldStatic = function () {
    try {
      var d = document.querySelector('.seo-fold');
      if (!d) return;
      var wrap = d.parentNode;
      Array.prototype.forEach.call(d.querySelectorAll('section.static-sec'), function (sec) {
        wrap.insertBefore(sec, d);
      });
      wrap.removeChild(d);
    } catch (e) {}
  };

  // ---------------- 結果（v2＝10問8タイプ・無料/有料の切り分けあり） ----------------
  KokoroQuiz.prototype.renderResultV2 = function () {
    var self = this;
    var d = this.decideV2();
    var t = this.data.types[d.key];
    if (!t) {
      this.mount.innerHTML = '<p class="err">結果の読み込みに失敗しました。もう一度お試しください。</p>';
      return;
    }
    this.save(d.key, t);
    hero(false);

    this.viewId = null;
    try { if (window.KMES) this.viewId = window.KMES.result(d.key); } catch (e) {}
    loadAds();

    var html = '<div class="result-container">';

    // 1) 結果（できるだけ早く見せる）
    html +=
      '<div class="result-hero">' +
        '<p class="result-kicker">' + esc(this.data.result_kicker || 'あなたの回答から見えたのは') + '</p>' +
        '<span class="result-emoji">' + esc(t.emoji || '🌿') + '</span>' +
        '<h2 class="result-name">' + esc(t.name) + '</h2>' +
        (t.lead ? '<p class="result-lead">' + esc(t.lead) + '</p>' : '') +
      '</div>';

    // 2) 回答から拾った「良いところ」を先に見せる（タイプ固有3つ＋回答で変わる2つ）
    //    ★ここが無料結果の主役。分析ではなく、褒める根拠を並べる場所（オーナー指示 2026-09-07）。
    var vs = this.pickVariants(5, t.points || []);
    var pts = (t.points || []).concat(vs.slice(0, 2));
    var H = this.data.headings || {};
    html += '<div class="rs rs-strength"><h3>' + esc(H.good || '✨ あなたの回答から見えた、あなたの良さ') + '</h3>' +
              '<ul class="good-list">' +
                pts.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') +
              '</ul>' +
            '</div>';

    // 3) もう少し褒める（本文）
    html += '<div class="rs"><h3>' + esc(H.body || '🌿 もう少しだけ、ちゃんと褒めさせてください') + '</h3>' +
            paras(t.body) + '</div>';

    // 4) 「当たり前ではない」の再評価
    if (t.atarimae) {
      html += '<div class="rs rs-atarimae"><h3>' + esc(H.atarimae || '🍀 それ、当たり前じゃありません') + '</h3>' +
              paras(t.atarimae) + '</div>';
    }

    // 5) 今日はこれだけ覚えて帰ってください
    if (t.keep) {
      html += '<div class="rs rs-keep">' + paras(t.keep) + '</div>';
    }

    // 6) 有料の続き（タイプ別noteのURLが入っているときだけ）
    html += this.ctaHtmlV2(t);

    // 7) 回遊（別の角度の診断を2つ）★褒め切ってから／CTAのあとに置く
    html += this.relatedHtml();

    // 8) 読みもの
    var arts = this.data.articles || [];
    if (arts.length) {
      html += '<div class="rs"><h3>📖 明日を少しラクにする読みもの</h3><div class="rel-list">' +
              arts.map(function (a) {
                return '<a href="' + esc(a.href) + '">' + esc(a.title) + '<span class="arrow">›</span></a>';
              }).join('') + '</div></div>';
    }

    html +=
      '<div class="result-actions">' +
        '<button class="btn btn-sub" type="button" id="retry">もう一度やってみる</button>' +
        '<a class="btn btn-main" href="index.html">ほかの診断を見てみる</a>' +
      '</div>' +
      '<p style="text-align:center;font-size:.78rem;color:#8a988f;line-height:1.9;margin-top:6px;">' +
        'ここで終わりにして大丈夫です。<br>ひとつ受けるだけで、十分です。' +
      '</p>' +
      '</div>';

    this.mount.innerHTML = html;

    try {
      var card = document.getElementById('cta-card');
      if (card && window.KMES && this.viewId) {
        var meta = { viewId: this.viewId, type: d.key,
                     variant: (window.KOKORO_CTA && window.KOKORO_CTA.variant) || '' };
        window.KMES.observeCTA(card, meta);
        var btn = document.getElementById('cta-btn');
        if (btn) btn.addEventListener('click', function () { window.KMES.ctaClick(meta); });
      }
    } catch (e) { /* 計測は失敗しても無視 */ }

    this.bindRetry();
    this.foldStatic();
    this.scrollToTop();
  };

  // 有料導線（v2）。タイプ別のnote URLが未設定なら何も出さない＝note未作成でも安全。
  KokoroQuiz.prototype.ctaHtmlV2 = function (t) {
    try {
      var C = window.KOKORO_CTA;
      if (!C || !C.v2) return '';
      var urls = (C.noteUrls || {})[this.data.slug];
      var key = this.decideV2().key;
      var url = (urls && typeof urls === 'object') ? urls[key] : '';
      // 確認用：?ctapreview=1 を付けたときだけ、URL未設定でも見た目を確認できる。
      // note公開前に文言と位置をオーナーが見るためのもの（リンク先はこのページ内）。
      if (!url && /[?&]ctapreview=1/.test(location.search)) url = '#';
      if (!url) return '';
      return '<div class="rs cta-card" id="cta-card">' +
               (C.v2.lead ? '<p class="cta-lead">' + esc(C.v2.lead) + '</p>' : '') +
               '<h3 class="cta-head">' + esc(C.v2.headline(t.name)) + '</h3>' +
               C.v2.body.map(function (b) { return '<p class="cta-sub">' + esc(b) + '</p>'; }).join('') +
               '<a class="cta-btn" id="cta-btn" href="' + esc(url) + '" target="_blank" rel="noopener">' +
                 esc(C.v2.button) + '</a>' +
               '<p class="cta-note">' + esc(C.v2.note) + '</p>' +
             '</div>';
    } catch (e) { return ''; }
  };

  // 回遊。カタログで live の診断だけを出す（作りかけの診断へ人を送らない）。
  KokoroQuiz.prototype.relatedHtml = function () {
    try {
      var C = window.KOKORO_CATALOG;
      var self = this;
      if (!C) return '';
      var list = (this.data.related || []).filter(function (s) { return !!C.live(s); });
      // 本来の回遊先がまだ公開前のときは、公開済みの診断で2つまで埋める。
      // 空の見出しだけが残るのを避けるため（移行中の期間だけ効く）。
      if (list.length < 2 && C && C.order) {
        C.order.forEach(function (s) {
          if (list.length >= 2) return;
          if (s === self.data.slug || list.indexOf(s) >= 0) return;
          if (C.live(s)) list.push(s);
        });
      }
      if (!list.length) return '';
      var cards = list.map(function (s) {
        var it = C.live(s);
        if (!it) return '';
        return '<a class="go-card" href="' + esc(it.file) + '">' +
                 '<span class="go-emoji">' + esc(it.emoji) + '</span>' +
                 '<span><span class="go-title">' + esc(it.title) + '</span>' +
                 '<span class="go-sub">' + esc(it.sub) + '</span></span>' +
               '</a>';
      }).filter(Boolean).join('');
      if (!cards) return '';
      var HH = this.data.headings || {};
      return '<div class="rs"><h3>' + esc(HH.related || '🧭 今のあなたには、こちらの診断も') + '</h3>' +
               '<p class="go-note">' +
                 esc(HH.relatedNote || '同じ悩みをもう一度たどるのではなく、別の角度から見るための2つです。') +
               '</p>' +
               '<div class="go-list">' + cards + '</div></div>';
    } catch (e) { return ''; }
  };

  // 診断の結果そのもの（どのタイプだったか）は端末内だけに残す。
  // 外部に送るのは measure.js の匿名カウント（イベント種別と件数）だけで、回答内容は送らない。
  KokoroQuiz.prototype.save = function (key, r) {
    try {
      var slug = (location.pathname.split('/').pop() || '').replace(/\.html?$/, '');
      if (!slug) return;
      localStorage.setItem('kokoro_' + slug, key);
      localStorage.setItem('kokoro_' + slug + '_name', r.name || '');
    } catch (e) { /* プライベートモード等では保存しない */ }
  };

  window.KokoroQuiz = KokoroQuiz;

  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('#quiz-app')) new KokoroQuiz('#quiz-app').init();
  });
})();
