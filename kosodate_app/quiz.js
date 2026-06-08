/**
 * quiz.js - 子育て親タイプ診断 エンジン
 * scoreモード対応：選択肢ごとにscoreを持ち、合計点でresultを振り分け
 */

const QUIZ_LIST = [
  { href: 'parent_type.html',    emoji: '👨‍👩‍👧', title: '親タイプ診断',         label: '8問' },
  { href: 'child_view.html',     emoji: '👶', title: '子供から見た親診断',   label: '8問' },
  { href: 'couple_balance.html', emoji: '💑', title: '夫婦育児バランス診断', label: '8問' },
  { href: 'expectation.html',    emoji: '🌟', title: '子供への期待度診断',   label: '8問' },
  { href: 'future_relation.html',emoji: '🏡', title: '将来の親子関係診断',   label: '8問' },
  { href: 'true_nature.html',    emoji: '🔥', title: '育児中の本性診断',     label: '8問' },
];

class QuizEngine {
  constructor(jsonPath, mountSelector = '#quiz-app') {
    this.jsonPath     = jsonPath;
    this.mountEl      = document.querySelector(mountSelector);
    this.data         = null;
    this.currentIndex = 0;
    this.answers      = [];
    this._totalScore  = 0;
    this._transitioning = false;
  }

  async init() {
    if (!this.mountEl) return;
    this._showLoading();
    try {
      let data;
      if (typeof window.QUIZ_DATA !== 'undefined') {
        data = window.QUIZ_DATA;
      } else {
        const res = await fetch(this.jsonPath);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${this.jsonPath}`);
        data = await res.json();
      }
      this.data = data;
      this._renderQuestion();
    } catch (err) {
      this._showError(`読み込みエラー: ${err.message}`);
    }
  }

  _renderQuestion() {
    const q     = this.data.questions[this.currentIndex];
    const total = this.data.questions.length;
    const pct   = Math.round((this.currentIndex / total) * 100);

    this.mountEl.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <h2 class="quiz-title">${this._esc(this.data.title)}</h2>
        </div>
        <div class="progress-area">
          <div class="progress-label">
            <span>質問 ${this.currentIndex + 1} / ${total}</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
        ${this.currentIndex > 0 ? `<div class="back-btn-wrap"><button class="back-btn">← 前の質問に戻る</button></div>` : ''}
        <div class="question-card">
          <p class="question-number">Q${this.currentIndex + 1}</p>
          <p class="question-text">${this._esc(q.text)}</p>
          <div class="choices-list">
            ${q.choices.map((c, i) => `
              <button class="choice-btn" data-score="${c.score}" data-idx="${i}">
                <span class="choice-label">${['A','B','C','D'][i]}</span>
                <span class="choice-text">${this._esc(c.text)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const back = this.mountEl.querySelector('.back-btn');
    if (back) back.addEventListener('click', () => this._goBack());
    this.mountEl.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this._onChoice(btn));
    });
    requestAnimationFrame(() => {
      this.mountEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  _goBack() {
    if (this.currentIndex <= 0 || this._transitioning) return;
    const last = this.answers.pop();
    this._totalScore -= last;
    this.currentIndex--;
    this._renderQuestion();
  }

  _onChoice(btn) {
    if (this._transitioning) return;
    this._transitioning = true;
    this.mountEl.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add('selected');
    const score = parseInt(btn.dataset.score, 10);
    this.answers.push(score);
    this._totalScore += score;
    setTimeout(() => {
      this._transitioning = false;
      if (document.activeElement) document.activeElement.blur();
      this.currentIndex++;
      if (this.currentIndex < this.data.questions.length) {
        this._renderQuestion();
      } else {
        this._renderResult();
      }
    }, 380);
  }

  _calcResultKey() {
    const ranges = this.data.score_ranges;
    for (const [min, max, key] of ranges) {
      if (this._totalScore >= min && this._totalScore <= max) return key;
    }
    return ranges[ranges.length - 1][2];
  }

  _renderResult() {
    const key    = this._calcResultKey();
    const result = this.data.results[key];
    if (!result) { this._showError('結果データが見つかりませんでした。'); return; }
    this._showConfetti();

    const shareBody = result.share_text ||
      `私は【${result.name}】でした👶 あなたは何タイプ？→全員やってみて！`;
    const tweetText = encodeURIComponent(
      `${shareBody}\n#子育て親タイプ診断 #育児あるある #毒親診断`
    );
    const currentURL = encodeURIComponent(window.location.href);
    const twitterURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${currentURL}`;
    const lineURL    = `https://social-plugins.line.me/lineit/share?url=${currentURL}`;

    const statsData = result.stats || result.params || [];
    const heroStatsHtml = statsData.length > 0 ? `
      <div class="hero-stats">
        <p class="hero-stats-title">▸ 特 徴</p>
        ${statsData.map(p => {
          const rawVal = p.value !== undefined ? String(p.value) : this._renderStars(p.stars);
          const val = /^∞$|^9999$/.test(rawVal.trim()) ? 'MAX' : rawVal;
          const pct = this._statToPercent(val);
          return `<div class="hero-stat-row">
            <span class="hero-stat-label">${this._esc(p.label)}</span>
            <div class="hero-stat-bar-wrap">
              <div class="hero-stat-bar"><div class="hero-stat-bar-fill" style="width:${pct}%"></div></div>
              <span class="hero-stat-value">${this._esc(val)}</span>
            </div>
          </div>`;
        }).join('')}
      </div>` : '';

    const imgSrc = result.image || '';
    const imgHtml = imgSrc
      ? `<div class="result-img-wrap"><img src="${imgSrc}" alt="${this._esc(result.name)}" class="result-char-img" onerror="this.parentElement.innerHTML='<span class=result-emoji-fb>${result.emoji||'👶'}</span>'"></div>`
      : `<div class="result-img-wrap"><span class="result-emoji-fb">${result.emoji || '👶'}</span></div>`;

    const ecologyHtml = (result.ecology || []).length > 0 ? `
      <div class="result-section-card ecology-card">
        <h3 class="section-card-title">🌿 生態</h3>
        <ul class="ecology-list">
          ${result.ecology.map(e => `<li>${this._esc(e)}</li>`).join('')}
        </ul>
      </div>` : '';

    const quotesHtml = (result.quotes || []).length > 0 ? `
      <div class="result-section-card quotes-card">
        <h3 class="section-card-title">💬 口癖</h3>
        <div class="quotes-list">
          ${result.quotes.map(q => `<div class="quote-item">${this._esc(q)}</div>`).join('')}
        </div>
      </div>` : '';

    const sightingHtml = (result.sighting || []).length > 0 ? `
      <div class="result-section-card sighting-card">
        <h3 class="section-card-title">👁️ 目撃談</h3>
        <div class="sighting-dialog">
          ${result.sighting.map(s => {
            if (s.scene !== undefined) {
              return `<div class="sighting-scene">${this._esc(s.scene)}</div>`;
            }
            return `<div class="sighting-line">
              <span class="sighting-speaker">${this._esc(s.speaker)}</span>
              <span class="sighting-text">${this._esc(s.text)}</span>
            </div>`;
          }).join('')}
        </div>
      </div>` : '';

    const weaknessHtml = (result.weakness || []).length > 0 ? `
      <div class="result-section-card weakness-card">
        <h3 class="section-card-title">⚡ 弱点</h3>
        <div class="weakness-list">
          ${result.weakness.map(w => `<span class="weakness-tag">${this._esc(w)}</span>`).join('')}
        </div>
      </div>` : '';

    const onelinerHtml = result.oneliner ? `
      <div class="result-oneliner">
        <p class="oneliner-text">📌 ${this._esc(result.oneliner)}</p>
      </div>` : '';

    const adviceHtml = result.advice ? `
      <div class="result-section-card advice-card">
        <h3 class="section-card-title">💡 ひとこと</h3>
        <p class="advice-text">${this._esc(result.advice)}</p>
      </div>` : '';

    this.mountEl.innerHTML = `
      <div class="result-container">

        <div class="result-hero">
          <button class="screenshot-btn" id="screenshot-btn">📸 スクショ</button>
          <p class="result-complete-text">✨ 診断完了！あなたのタイプが判明 ✨</p>
          ${imgHtml}
          <p class="result-type-label">あなたのタイプは...</p>
          <h2 class="result-name">${this._esc(result.name)}</h2>
          ${result.catchphrase ? `<p class="result-catchphrase">"${this._esc(result.catchphrase)}"</p>` : ''}
          ${heroStatsHtml}
        </div>

        <div class="result-body">
          ${ecologyHtml}
          ${quotesHtml}
          ${sightingHtml}
          ${weaknessHtml}
          ${onelinerHtml}
          ${result.description ? `
          <div class="result-desc-card">
            <p class="result-desc">${this._esc(result.description)}</p>
          </div>` : ''}
          ${result.tsukkomi ? `
          <div class="result-tsukkomi-card">
            <span class="tsukkomi-icon">💬</span>
            <p class="tsukkomi-text">${this._esc(result.tsukkomi)}</p>
          </div>` : ''}
          ${adviceHtml}
          <p style="font-size:0.7rem;color:#b08090;text-align:center;padding:4px 0;">※この診断はエンタメ目的です。実際の育児能力や性格を評価するものではありません。</p>
        </div>

        <div class="share-section">
          <p class="share-lead">📣 パパ・ママ友にシェアして比べよう！</p>
          <div class="share-btns">
            <a href="${twitterURL}" class="share-btn twitter" target="_blank" rel="noopener">𝕏 Xでシェア</a>
            <a href="${lineURL}" class="share-btn line" target="_blank" rel="noopener">🟢 LINEで送る</a>
          </div>
        </div>

        <div class="adsense-block">▼ 広告スペース（Google AdSense）▼</div>

        ${this._renderNextQuizzes()}
        ${this._renderCrossAppBanners()}

        <div class="result-action-btns">
          <button class="retry-btn" id="retry-btn">🔄 もう一度診断する</button>
          <a href="index.html" class="back-home-btn">👶 他の診断を見る</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      this.currentIndex = 0;
      this.answers = [];
      this._totalScore = 0;
      this._transitioning = false;
      this._renderQuestion();
    });

    document.getElementById('screenshot-btn').addEventListener('click', () => {
      this._showScreenshotOverlay(result);
    });
  }

  _showScreenshotOverlay(result) {
    const existing = document.getElementById('screenshot-overlay');
    if (existing) existing.remove();

    const statsData = result.stats || result.params || [];
    const statsHtml = statsData.map(p => {
      const rawVal = p.value !== undefined ? String(p.value) : this._renderStars(p.stars);
      const val = /^∞$|^9999$/.test(rawVal.trim()) ? 'MAX' : rawVal;
      const pct = this._statToPercent(val);
      return `<div class="ss-stat-row">
        <span class="ss-stat-label">${this._esc(p.label)}</span>
        <div class="ss-stat-bar"><div class="ss-stat-bar-fill" style="width:${pct}%"></div></div>
        <span class="ss-stat-value">${this._esc(val)}</span>
      </div>`;
    }).join('');

    const ecologyHtml = (result.ecology || []).map(e =>
      `<div class="ss-ecology-item">▸ ${this._esc(e)}</div>`
    ).join('');

    const quotesArr = result.quotes || [];
    const quotesInline = quotesArr.length > 0
      ? quotesArr.map(q => `「${this._esc(q.replace(/^「|」$/g, ''))}」`).join('、')
      : '';

    const imgSrc = result.image || '';
    const imgInner = imgSrc
      ? `<img src="${imgSrc}" alt="${this._esc(result.name)}" class="ss-char-img" onerror="this.parentElement.innerHTML='<span class=ss-emoji-fb>${result.emoji || '👶'}</span>'">`
      : `<span class="ss-emoji-fb">${result.emoji || '👶'}</span>`;

    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.className = 'screenshot-overlay';
    overlay.innerHTML = `
      <div class="ss-card">
        <p class="ss-app-title">👨‍👩‍👧 子育て親タイプ診断</p>
        <div class="ss-img-wrap">${imgInner}</div>
        <p class="ss-type-label">あなたのタイプは...</p>
        <h2 class="ss-name">${this._esc(result.name)}</h2>
        ${result.catchphrase ? `<p class="ss-catch">"${this._esc(result.catchphrase)}"</p>` : ''}
        ${statsHtml ? `<div class="ss-stats-section"><p class="ss-section-label">▸ 特 徴</p>${statsHtml}</div>` : ''}
        ${ecologyHtml ? `<div class="ss-ecology-section"><p class="ss-section-label">🌿 生 態</p>${ecologyHtml}</div>` : ''}
        ${quotesInline ? `<div class="ss-quotes-section"><p class="ss-section-label">💬 口 癖</p><p class="ss-quotes-item">${quotesInline}</p></div>` : ''}
        <p class="ss-hashtag">#子育て親タイプ診断 #育児あるある #子育てあるある</p>
      </div>
      <button class="ss-close-btn" id="ss-close-btn">✕ 閉じる</button>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('ss-close-btn');
    overlay.addEventListener('click', (e) => {
      if (e.target === closeBtn) return;
      closeBtn.classList.toggle('visible');
    });
    closeBtn.addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
  }

  _statToPercent(val) {
    const v = String(val).trim();
    if (/∞|MAX|SSS|神|9999|全員|完了|常時|核融合|削除済み|光速|無限/.test(v)) return 100;
    if (/高い|異常|鋼鉄|ダイヤ|^高$|最強|最速|灼熱/.test(v)) return 93;
    const pctMatch = v.match(/^(\d+\.?\d*)\s*%/);
    if (pctMatch) return Math.min(100, Math.round(parseFloat(pctMatch[1])));
    const intMatch = v.match(/^(\d+)/);
    if (intMatch) {
      const n = parseInt(intMatch[1]);
      if (n >= 9999) return 100;
      if (n >= 999) return 95;
      if (n === 0) return 4;
      if (n <= 5) return Math.max(6, n * 15);
      return Math.min(90, n);
    }
    if (/^なし$|検出不能|なし$/.test(v)) return 4;
    if (/低下中|低い|少なめ|遅い|極小|不明|^低$|不足|枯渇/.test(v)) return 18;
    if (/普通|気分次第|運次第|未計測|ほどほど/.test(v)) return 50;
    if (/あるはずなのに/.test(v)) return 35;
    if (/なぜか毎日/.test(v)) return 75;
    return 72;
  }

  _renderStars(n) {
    const filled = Math.min(5, Math.max(0, Math.round(n)));
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }

  _renderNextQuizzes() {
    const currentTitle = this.data.title;
    const others = QUIZ_LIST.filter(q => q.title !== currentTitle);
    const picked = others.sort(() => Math.random() - 0.5).slice(0, 3);
    return `
      <div class="next-quiz-section">
        <h3 class="next-quiz-title">👨‍👩‍👧 この診断もやってみて！</h3>
        <div class="next-quiz-grid">
          ${picked.map(q => `
            <a href="${q.href}" class="next-quiz-card">
              <span class="next-quiz-emoji">${q.emoji}</span>
              <span class="next-quiz-name">${q.title}</span>
              <span class="next-quiz-label">${q.label}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  _renderCrossAppBanners() {
    return `
      <div class="next-quiz-section" style="background:linear-gradient(135deg,#fff5f7 0%,#f0f8ff 100%);margin-top:8px;">
        <h3 class="next-quiz-title">🌟 他のジャンルも診断しよう！</h3>
        <div class="next-quiz-grid">
          <a href="../workplace_app/index.html" class="next-quiz-card" style="border-top:3px solid #1a537a;">
            <span class="next-quiz-emoji">🏢</span>
            <span class="next-quiz-name">職場診断ラボ</span>
            <span class="next-quiz-label">モンスター度を診断</span>
          </a>
          <a href="../psychology_app/index.html" class="next-quiz-card" style="border-top:3px solid #c471ed;">
            <span class="next-quiz-emoji">💖</span>
            <span class="next-quiz-name">恋愛沼診断ラボ</span>
            <span class="next-quiz-label">恋愛タイプを診断</span>
          </a>
          <a href="../index.html" class="next-quiz-card" style="border-top:3px solid #16a34a;">
            <span class="next-quiz-emoji">🌿</span>
            <span class="next-quiz-name">診断の森トップへ</span>
            <span class="next-quiz-label">全ジャンル一覧</span>
          </a>
        </div>
      </div>
    `;
  }

  _showConfetti() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(wrap);
    const colors = ['#e8436a','#f97316','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6'];
    for (let i = 0; i < 70; i++) {
      const p  = document.createElement('div');
      const sz = 5 + Math.random() * 9;
      p.style.cssText = `position:absolute;top:-${sz*2}px;left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${colors[i%colors.length]};border-radius:${Math.random()>.5?'50%':'3px'};animation:confettiFall ${1.4+Math.random()*1.6}s ${Math.random()*0.8}s ease-in forwards;transform:rotate(${Math.random()*360}deg);`;
      wrap.appendChild(p);
    }
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, 4000);
  }

  _showLoading() {
    this.mountEl.innerHTML = `<div class="loading-wrap"><div class="loading-spinner"></div><p>診断を読み込み中...</p></div>`;
  }

  _showError(msg) {
    this.mountEl.innerHTML = `<div class="error-wrap"><p>⚠️ ${this._esc(msg)}</p><a href="index.html">トップへ戻る</a></div>`;
  }

  _esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('quiz-app');
  if (!el) return;
  const src = el.dataset.quiz || '';
  const engine = new QuizEngine(src);
  engine.init();
});
