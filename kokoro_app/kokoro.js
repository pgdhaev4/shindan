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

  function KokoroQuiz(mountSelector) {
    this.mount = document.querySelector(mountSelector || '#quiz-app');
    this.data = null;
    this.index = 0;
    this.picked = [];        // 各問で選んだ軸
    this.locked = false;
  }

  KokoroQuiz.prototype.init = function () {
    if (!this.mount) return;
    if (typeof window.KOKORO_DATA === 'undefined') {
      this.mount.innerHTML = '<p class="err">診断データを読み込めませんでした。ページを再読み込みしてください。</p>';
      return;
    }
    this.data = window.KOKORO_DATA;
    this.renderQuestion();
    // 計測: 診断開始（匿名・数だけ。measure.js が無いページでは何もしない）
    try { if (window.KMES) window.KMES.start(); } catch (e) {}
  };

  // ---------------- 設問 ----------------
  KokoroQuiz.prototype.renderQuestion = function () {
    var self = this;
    var q = this.data.questions[this.index];
    var total = this.data.questions.length;
    var pct = Math.round((this.index / total) * 100);

    this.mount.innerHTML =
      '<div class="quiz-container">' +
        '<div class="quiz-head"><p class="qname">' + esc(this.data.title) + '</p></div>' +
        '<div class="progress-area">' +
          '<div class="progress-label"><span>' + (this.index + 1) + ' / ' + total + '</span></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>' +
        (this.index > 0 ? '<div class="back-btn-wrap"><button class="back-btn" type="button">← ひとつ前に戻る</button></div>' : '') +
        '<div class="question-card">' +
          '<p class="question-number">Q' + (this.index + 1) + '</p>' +
          '<p class="question-text">' + esc(q.text) + '</p>' +
          '<div class="choices-list">' +
            q.choices.map(function (c, i) {
              return '<button class="choice-btn" type="button" data-axis="' + esc(c.axis) + '" data-i="' + i + '">' +
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
      btn.addEventListener('click', function () { self.choose(btn); });
    });
    this.scrollToTop();
  };

  KokoroQuiz.prototype.scrollToTop = function () {
    var self = this;
    setTimeout(function () {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      var top = self.mount.getBoundingClientRect().top + window.scrollY - 14;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 40);
  };

  KokoroQuiz.prototype.goBack = function () {
    if (this.index <= 0 || this.locked) return;
    this.picked.pop();
    this.index--;
    this.renderQuestion();
  };

  KokoroQuiz.prototype.choose = function (btn) {
    var self = this;
    if (this.locked) return;
    this.locked = true;
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (b) { b.disabled = true; });
    btn.classList.add('selected');
    this.picked.push(btn.dataset.axis);
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

  // ---------------- 結果 ----------------
  KokoroQuiz.prototype.renderResult = function () {
    var d = this.decide();
    var key = d.key;
    var r = this.data.results[key];
    if (!r) {
      this.mount.innerHTML = '<p class="err">結果の読み込みに失敗しました。もう一度お試しください。</p>';
      return;
    }
    this.save(key, r);

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

    var retry = document.getElementById('retry');
    if (retry) retry.addEventListener('click', function () {
      self.index = 0; self.picked = []; self.renderQuestion();
    });
    this.scrollToTop();
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
