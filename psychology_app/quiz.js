/**
 * quiz.js - 汎用クイズエンジン v2
 * 恋愛・性格診断ラボ
 */

// アクティブ診断リスト（次の診断レコメンド用）
const QUIZ_LIST = [
  { href: 'mbti.html',            emoji: '🔮', title: '深層心理 性格タイプ診断', label: '10問' },
  { href: 'love_type.html',       emoji: '💘', title: '恋愛タイプ診断',         label: '8問' },
  { href: 'compatibility.html',   emoji: '💕', title: '恋愛相性診断',           label: '8問' },
  { href: 'jealousy.html',        emoji: '😤', title: '恋愛束縛度診断',         label: '8問' },
  { href: 'love_dependency.html', emoji: '💝', title: '恋愛依存度診断',         label: '8問' },
  { href: 'heartbreak.html',      emoji: '💔', title: '失恋回復タイプ診断',     label: '8問' },
  { href: 'ideal_date.html',      emoji: '🌸', title: '理想のデートタイプ診断', label: '8問' },
];

class QuizEngine {
  constructor(jsonPath, mountSelector = '#quiz-app') {
    this.jsonPath      = jsonPath;
    this.mountEl       = document.querySelector(mountSelector);
    this.data          = null;
    this.currentIndex  = 0;
    this.answers       = [];
    this._axisScores   = null;
    this._questionScores = []; // 戻る用：質問ごとの軸スコア寄与
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
      this._validateData(this.data);
      this._renderQuestion();
    } catch (err) {
      console.error('[QuizEngine] Error:', err);
      this._showError(`読み込みエラー: ${err.message}`);
    }
  }

  _validateData(data) {
    if (!data.title)   throw new Error('title が必要です');
    if (!Array.isArray(data.questions) || data.questions.length === 0)
      throw new Error('questions が必要です');
    if (!data.results) throw new Error('results が必要です');
  }

  // ===========================
  //   質問画面
  // ===========================
  _renderQuestion() {
    const q     = this.data.questions[this.currentIndex];
    const total = this.data.questions.length;
    const pct   = Math.round((this.currentIndex / total) * 100);

    this.mountEl.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <h2>${this._esc(this.data.title)}</h2>
        </div>
        <div class="progress-area">
          <div class="progress-label">
            <span>質問 ${this.currentIndex + 1} / ${total}</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
        ${this.currentIndex > 0 ? `
        <div class="back-btn-wrap">
          <button class="back-btn" aria-label="前の質問に戻る">← 前の質問に戻る</button>
        </div>` : ''}
        <div class="question-card" role="region" aria-label="質問 ${this.currentIndex + 1}">
          <p class="question-number">Q${this.currentIndex + 1}</p>
          <p class="question-text">${this._esc(q.text)}</p>
          <div class="choices-list" role="group" aria-label="選択肢">
            ${q.choices.map(c => `
              <button class="choice-btn" data-key="${this._esc(c.key)}"
                aria-label="${this._esc(c.key)}: ${this._esc(c.text)}">
                <span class="choice-label">${this._esc(c.key)}</span>
                <span>${this._esc(c.text)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 戻るボタン
    const backBtn = this.mountEl.querySelector('.back-btn');
    if (backBtn) backBtn.addEventListener('click', () => this._goBack());

    // 選択肢ボタン
    this.mountEl.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this._onChoiceClick(btn));
    });

    // カーソル固定バグ対策：ページ上部にスクロールして次の質問にホバーしないようにする
    requestAnimationFrame(() => {
      const top = this.mountEl.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  }

  _goBack() {
    if (this.currentIndex <= 0 || this._transitioning) return;
    this.answers.pop();
    // axis3 / mbti モードのスコアを巻き戻す
    if (this._questionScores.length > 0) {
      const last = this._questionScores.pop();
      if (this._axisScores && last) {
        Object.entries(last).forEach(([axis, val]) => {
          this._axisScores[axis] = (this._axisScores[axis] || 0) - val;
        });
      }
    }
    this.currentIndex--;
    this._renderQuestion();
  }

  _onChoiceClick(btn) {
    if (this._transitioning) return;
    this._transitioning = true;

    this.mountEl.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add('selected');
    this.answers.push(btn.dataset.key);

    // 軸スコア蓄積（mbti / axis3 モード）＆戻る用に寄与を記録
    if (this.data.mode === 'mbti' || this.data.mode === 'axis3') {
      const q = this.data.questions[this.currentIndex];
      const choice = q.choices.find(c => c.key === btn.dataset.key);
      const contrib = {};
      if (choice && choice.scores) {
        if (!this._axisScores) this._axisScores = {};
        Object.entries(choice.scores).forEach(([axis, val]) => {
          this._axisScores[axis] = (this._axisScores[axis] || 0) + val;
          contrib[axis] = val;
        });
      }
      this._questionScores.push(contrib);
    } else {
      this._questionScores.push({});
    }

    setTimeout(() => {
      this._transitioning = false;
      this.currentIndex++;
      if (this.currentIndex < this.data.questions.length) {
        this._renderQuestion();
      } else {
        this._renderResult();
      }
    }, 420);
  }

  _calcResult() {
    if (this.data.mode === 'mbti') {
      const s = this._axisScores || {};
      return (( s.E||0) >= (s.I||0) ? 'E' : 'I') +
             (( s.S||0) >= (s.N||0) ? 'S' : 'N') +
             (( s.T||0) >= (s.F||0) ? 'T' : 'F') +
             (( s.J||0) >= (s.P||0) ? 'J' : 'P');
    }
    if (this.data.mode === 'axis3') {
      const s = this._axisScores || {};
      return (this.data.axes || []).map(pair => {
        const [l, r] = pair.split('');
        return (s[l] || 0) >= (s[r] || 0) ? l : r;
      }).join('');
    }
    const count = {};
    for (const key of this.answers) count[key] = (count[key] || 0) + 1;
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
  }

  // ===========================
  //   コンフェッティ
  // ===========================
  _showConfetti() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(wrap);
    const colors = ['#ff6eb4','#9b59b6','#ffd700','#ff8c00','#00c8ff','#66bb6a','#ff4081'];
    for (let i = 0; i < 65; i++) {
      const p  = document.createElement('div');
      const sz = 5 + Math.random() * 9;
      p.style.cssText = `position:absolute;top:-${sz * 2}px;left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${colors[i % colors.length]};border-radius:${Math.random()>.5?'50%':'3px'};animation:confettiFall ${1.4+Math.random()*1.6}s ${Math.random()*0.8}s ease-in forwards;transform:rotate(${Math.random()*360}deg);`;
      wrap.appendChild(p);
    }
    setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, 4000);
  }

  // ===========================
  //   次の診断レコメンド
  // ===========================
  _renderNextQuizzes() {
    const currentTitle = this.data.title;
    const others = QUIZ_LIST.filter(q => q.title !== currentTitle);
    const picked = others.sort(() => Math.random() - 0.5).slice(0, 3);
    return `
      <div class="next-quiz-section">
        <h3 class="next-quiz-title">💖 この診断もやってみて！</h3>
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
      <div class="next-quiz-section" style="background:linear-gradient(135deg,#f0fff4 0%,#f5f0ff 100%);margin-top:8px;">
        <h3 class="next-quiz-title">🌟 他のジャンルも診断しよう！</h3>
        <div class="next-quiz-grid">
          <a href="../workplace_app/index.html" class="next-quiz-card" style="border-top:3px solid #1a537a;">
            <span class="next-quiz-emoji">🏢</span>
            <span class="next-quiz-name">職場診断ラボ</span>
            <span class="next-quiz-label">モンスター度を診断</span>
          </a>
          <a href="../kosodate_app/index.html" class="next-quiz-card" style="border-top:3px solid #e8436a;">
            <span class="next-quiz-emoji">👨‍👩‍👧</span>
            <span class="next-quiz-name">子育て親タイプ診断</span>
            <span class="next-quiz-label">育児スタイルを診断</span>
          </a>
        </div>
      </div>
    `;
  }

  // ===========================
  //   シェアセクション
  // ===========================
  _shareSection(tweetText, currentURL, label = '結果') {
    const twitterURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${currentURL}&hashtags=恋愛診断,心理テスト`;
    const lineURL    = `https://social-plugins.line.me/lineit/share?url=${currentURL}`;
    return `
      <div class="share-section-v2">
        <p class="share-lead">📣 友達にシェアして盛り上げよう！</p>
        <div class="share-btns">
          <a href="${twitterURL}" class="share-btn twitter" target="_blank" rel="noopener noreferrer">
            𝕏 Xでシェア
          </a>
          <a href="${lineURL}" class="share-btn line" target="_blank" rel="noopener noreferrer">
            🟢 LINEで送る
          </a>
        </div>
      </div>
    `;
  }

  // ===========================
  //   結果描画（通常）
  // ===========================
  _renderResult() {
    const resultKey = this._calcResult();
    const result    = this.data.results[resultKey];
    if (!result) { this._showError('結果データが見つかりませんでした。'); return; }
    if (this.data.mode === 'mbti') {
      this._renderMbtiResult(resultKey, result);
    } else if (this.data.mode === 'axis3') {
      this._renderAxis3Result(resultKey, result);
    } else if (result.idol) {
      this._renderIdolResult(result);
    } else {
      this._renderNormalResult(result);
    }
  }

  // ===========================
  //   MBTI結果描画
  // ===========================
  _renderMbtiResult(code, result) {
    this._showConfetti();

    const s = this._axisScores || {E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0};
    const tEI = (s.E + s.I) || 1, tSN = (s.S + s.N) || 1;
    const tTF = (s.T + s.F) || 1, tJP = (s.J + s.P) || 1;
    const pE = Math.round(s.E / tEI * 100);
    const pS = Math.round(s.S / tSN * 100);
    const pT = Math.round(s.T / tTF * 100);
    const pJ = Math.round(s.J / tJP * 100);

    // MBTI4軸を★形式に変換（ヒーローグリッド用）
    // 各軸の優勢側とその強度を★で表現
    const pRomantic = Math.min(100, Math.round(((s.N || 0) + (s.F || 0)) / ((tSN + tTF) || 1) * 100));
    const mbtiStarItems = [
      { label: pE >= 50 ? '⚡ 外向傾向'  : '🔇 内向傾向',  filled: this._pctToStarFilled(pE >= 50 ? pE : 100 - pE) },
      { label: pS >= 50 ? '👁 感覚傾向'  : '💡 直感傾向',  filled: this._pctToStarFilled(pS >= 50 ? pS : 100 - pS) },
      { label: pT >= 50 ? '🧠 思考傾向'  : '💗 感情傾向',  filled: this._pctToStarFilled(pT >= 50 ? pT : 100 - pT) },
      { label: pJ >= 50 ? '📋 計画傾向'  : '🎲 柔軟傾向',  filled: this._pctToStarFilled(pJ >= 50 ? pJ : 100 - pJ) },
      { label: '🌹 ロマンチック度',                          filled: this._pctToStarFilled(pRomantic) },
    ];

    // summaryの第1文をクオートバブルに（長文回避）
    const summaryFirst = (result.summary || '').split(/。|！|？|[!?]/)[0];

    // 総合評価ゲージ（恋愛積極度 = E+F スコアから算出）
    const loveActivePct = Math.min(100, Math.round(((s.E || 0) + (s.F || 0)) / ((tEI + tTF) || 1) * 100));
    const laGrade = loveActivePct >= 80 ? { txt: 'かなり高め', col: '#e53935', bg: '#fff5f5' }
                  : loveActivePct >= 60 ? { txt: 'やや高め',   col: '#f57f17', bg: '#fffde7' }
                  : loveActivePct >= 40 ? { txt: '中程度',      col: '#7b1fa2', bg: '#f3e5f5' }
                  :                       { txt: '低め',         col: '#1565c0', bg: '#e3f2fd' };
    const summaryGaugeHtml = `
      <div class="summary-gauge-block" style="background:${laGrade.bg}">
        <div class="summary-gauge-title">📊 総合評価：あなたの恋愛積極度</div>
        <div class="summary-gauge-row">
          <div class="summary-gauge-bar-wrap">
            <div class="summary-gauge-bar" style="width:${loveActivePct}%;background:${laGrade.col}"></div>
          </div>
          <div class="summary-gauge-pct" style="color:${laGrade.col}">${loveActivePct}%</div>
        </div>
        <div class="summary-gauge-grade" style="color:${laGrade.col}">▶ ${laGrade.txt}</div>
      </div>
    `;

    const tweetText  = encodeURIComponent(`私は【${result.name}】でした💘 あなたは何タイプ？→全員やってみて！\n${result.share_text || ''}`);
    const currentURL = encodeURIComponent(window.location.href);
    const tags       = (result.tags || []).map(t => `<span class="result-tag">${this._esc(t)}</span>`).join('');

    // ★セクションとその他を分離
    const { star: statSections, other: textSections } = this._parseStarSections(result.sections || []);
    const sectionsHtml = textSections.map(sec => `
      <div class="result-section">
        <div class="result-section-label">${this._esc(sec.label)}</div>
        <p class="result-section-text">${this._esc(sec.text)}</p>
      </div>
    `).join('');

    const illustration = result.image
      ? `<div class="result-illust-wrap"><img src="${result.image}" class="quiz-char-img" alt="${this._esc(result.name)}"></div>`
      : `<div class="result-illust-wrap">${this._drawMbtiCharacterSVG(code)}</div>`;

    const bgStyle = result.bg ? `style="background:${result.bg}"` : '';

    this.mountEl.innerHTML = `
      <div class="result-container">
        <div class="result-card">
          <div class="result-card-header" ${bgStyle}>
            <p class="result-complete-banner">✨ 診断完了！あなたのタイプが判明しました ✨</p>
            <p class="quiz-psychology-badge">🔬 心理学に基づく深層分析</p>
            ${illustration}
            <p class="result-type-label">あなたのタイプは...</p>
            <div class="result-name-badge">
              <span class="result-type-name">${this._esc(result.name)}</span>
            </div>
            ${this._renderQuoteBubble(summaryFirst)}
            ${this._renderStarGrid(statSections, mbtiStarItems)}
            ${tags ? `<div class="result-tags result-tags-header">${tags}</div>` : ''}
          </div>
          <div class="result-card-body">
            ${result.summary ? `<div class="result-summary-badge">${this._esc(result.summary)}</div>` : ''}
            ${summaryGaugeHtml}
            ${result.compatible_with ? `<div class="result-section compatible-section"><div class="result-section-label">💑 相性の良い異性（こんな人）</div><p class="result-section-text">${this._esc(result.compatible_with)}</p></div>` : ''}
            <div class="mbti-axis-bars">
              <div class="mbti-axis-title">📊 心理学的観点からみたあなたの特性</div>
              ${this._axisBar('E', '外向', pE, 'I', '内向')}
              ${this._axisBar('S', '感覚', pS, 'N', '直感')}
              ${this._axisBar('T', '思考', pT, 'F', '感情')}
              ${this._axisBar('J', '計画', pJ, 'P', '柔軟')}
            </div>
            <p class="result-description">${this._esc(result.description)}</p>
            ${sectionsHtml}
            ${result.advice ? `<div class="result-advice"><span class="advice-icon">💡</span><div><strong>アドバイス</strong><br>${this._esc(result.advice)}</div></div>` : ''}
          </div>
        </div>
        ${this._shareSection(tweetText, currentURL)}
        <div class="affiliate-section">
          <h3>💌 理想の出会いを見つけよう</h3>
          <a href="#AFFILIATE_PAIRS_URL" class="affiliate-banner" target="_blank" rel="noopener noreferrer">💑 Pairs（ペアーズ）で相性のいい相手を探す</a>
          <a href="#AFFILIATE_TAPPLE_URL" class="affiliate-banner secondary" target="_blank" rel="noopener noreferrer">🧡 タップルで同い年の恋人を見つける</a>
        </div>
        <div class="adsense-block">▼ 広告スペース（Google AdSense）▼</div>
        ${this._renderNextQuizzes()}
        ${this._renderCrossAppBanners()}
        <div class="result-action-btns">
          <button class="retry-btn" id="retry-btn">🔄 もう一度診断する</button>
          <a href="index.html" class="back-home-btn">📋 他の診断を見る</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      this.currentIndex = 0; this.answers = []; this._axisScores = null; this._questionScores = [];
      this._renderQuestion();
      this.mountEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  _axisBar(leftKey, leftLabel, pctLeft, rightKey, rightLabel) {
    const pctRight = 100 - pctLeft;
    return `
      <div class="mbti-axis-row">
        <div class="axis-label-group">
          <span class="axis-label ${pctLeft >= 50 ? 'axis-dominant' : ''}">${this._esc(leftLabel)}</span>
        </div>
        <div class="axis-bar">
          <div class="axis-fill-left" style="width:${pctLeft}%"></div>
          <div class="axis-fill-right" style="width:${pctRight}%"></div>
        </div>
        <div class="axis-label-group right">
          <span class="axis-label right ${pctRight > 50 ? 'axis-dominant' : ''}">${this._esc(rightLabel)}</span>
        </div>
      </div>
    `;
  }

  _axisBarLabels(leftLabel, pctLeft, rightLabel) {
    const pctRight = 100 - pctLeft;
    return `
      <div class="mbti-axis-row">
        <div class="axis-label-group">
          <span class="axis-label ${pctLeft >= 50 ? 'axis-dominant' : ''}">${this._esc(leftLabel)}</span>
        </div>
        <div class="axis-bar">
          <div class="axis-fill-left" style="width:${pctLeft}%"></div>
          <div class="axis-fill-right" style="width:${pctRight}%"></div>
        </div>
        <div class="axis-label-group right">
          <span class="axis-label right ${pctRight > 50 ? 'axis-dominant' : ''}">${this._esc(rightLabel)}</span>
        </div>
      </div>
    `;
  }

  // ===========================
  //   SNSヒーロー用ヘルパー
  // ===========================
  _parseStarSections(sections) {
    const star = [], other = [];
    (sections || []).forEach(s => {
      /^[★☆]/.test(s.text) ? star.push(s) : other.push(s);
    });
    return { star, other };
  }

  // starSections: セクションの★テキスト行
  // extraItems: {label, filled} の配列（customGaugesを変換したもの）
  _renderStarGrid(starSections, extraItems = []) {
    const rows = [
      ...extraItems.map(item => {
        const filled = Math.min(Math.max(item.filled, 0), 5);
        return `<div class="stat-row"><span class="stat-label">${this._esc(item.label)}</span><span class="stat-stars">${'★'.repeat(filled) + '☆'.repeat(5 - filled)}</span></div>`;
      }),
      ...starSections.map(s => {
        const filled = Math.min(((s.text.match(/^[★☆]+/) || [''])[0].match(/★/g) || []).length, 5);
        return `<div class="stat-row"><span class="stat-label">${this._esc(s.label)}</span><span class="stat-stars">${'★'.repeat(filled) + '☆'.repeat(5 - filled)}</span></div>`;
      })
    ];
    if (!rows.length) return '';
    return `<div class="result-stats-grid">${rows.join('')}</div>`;
  }

  _pctToStarFilled(pct) {
    if (pct >= 67) return 5;
    if (pct >= 34) return 3;
    return 0;
  }

  _renderQuoteBubble(text) {
    if (!text) return '';
    return `<div class="result-quote-bubble">「${this._esc(text)}」</div>`;
  }

  _renderRankBadge(rank, total) {
    if (!rank || !total) return '';
    return `<div class="result-rank-badge">🏆 恋愛沼ランキング ${rank} / ${total}</div>`;
  }

  // ===========================
  //   3軸診断（axis3）結果描画
  // ===========================
  _renderAxis3Result(code, result) {
    this._showConfetti();

    const s    = this._axisScores || {};
    const axes = this.data.axes || [];
    const lbl  = this.data.axisLabels || {};
    const totalResults = Object.keys(this.data.results).length;

    // ★セクションをヒーローグリッドへ、その他はボディへ
    const { star: statSections, other: textSections } = this._parseStarSections(result.sections || []);

    // customGaugesを★に変換（ヒーロー合体用）
    const customGaugeStarItems = (this.data.customGauges || []).map(cg => {
      const hiVal = (cg.hi || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const loVal = (cg.lo || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const pct = Math.min(100, Math.round(hiVal / (hiVal + loVal || 1) * 100));
      return { label: `${cg.emoji || '📊'} ${cg.label}`, filled: this._pctToStarFilled(pct) };
    });

    // 標準軸バー
    const barsArr = axes.map(pair => {
      const [l, r] = pair.split('');
      const sl = s[l] || 0, sr = s[r] || 0;
      const total = sl + sr || 1;
      const pctL = Math.min(100, Math.round(sl / total * 100));
      return this._axisBarLabels(lbl[l] || l, pctL, lbl[r] || r);
    });

    // 第4軸（派生軸）
    if (this.data.derivedAxis) {
      const da = this.data.derivedAxis;
      const hi = (da.hi || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const lo = (da.lo || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const pctHi = Math.min(100, Math.round(hi / (hi + lo || 1) * 100));
      barsArr.push(this._axisBarLabels(da.label, pctHi, da.labelRight));
    }
    const barsHtml = barsArr.join('');

    // customGaugesはヒーターの★グリッドに統合済み（ボディには表示しない）

    // 総合評価スコア（ゲージ）
    let summaryGaugeHtml = '';
    if (this.data.scoreSummary) {
      const ss  = this.data.scoreSummary;
      const hi  = (ss.hi || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const lo  = (ss.lo || []).reduce((sum, a) => sum + (s[a] || 0), 0);
      const pct = Math.min(100, Math.round(hi / (hi + lo || 1) * 100));
      const grade = pct >= 80 ? { txt: 'かなり高め', col: '#e53935', bg: '#fff5f5' }
                  : pct >= 60 ? { txt: 'やや高め',   col: '#f57f17', bg: '#fffde7' }
                  : pct >= 40 ? { txt: '中程度',      col: '#7b1fa2', bg: '#f3e5f5' }
                  :             { txt: '低め',         col: '#1565c0', bg: '#e3f2fd' };
      summaryGaugeHtml = `
        <div class="summary-gauge-block" style="background:${grade.bg}">
          <div class="summary-gauge-title">📊 総合評価：あなたの${this._esc(ss.label)}</div>
          <div class="summary-gauge-row">
            <div class="summary-gauge-bar-wrap">
              <div class="summary-gauge-bar" style="width:${pct}%;background:${grade.col}"></div>
            </div>
            <div class="summary-gauge-pct" style="color:${grade.col}">${pct}%</div>
          </div>
          <div class="summary-gauge-grade" style="color:${grade.col}">▶ ${grade.txt}</div>
        </div>
      `;
    }

    const illustration = result.image
      ? `<div class="result-illust-wrap"><img src="${result.image}" class="quiz-char-img" alt="${this._esc(result.name)}"></div>`
      : result.characterStyle
        ? `<div class="result-illust-wrap">${this._drawMbtiCharacterSVG(result.characterStyle)}</div>`
        : `<div class="result-emoji-wrap"><span class="result-emoji-big">${result.emoji || '💖'}</span></div>`;

    const tags = (result.tags || []).map(t => `<span class="result-tag">${this._esc(t)}</span>`).join('');
    const sectionsHtml = textSections.map(sec => `
      <div class="result-section">
        <div class="result-section-label">${this._esc(sec.label)}</div>
        <p class="result-section-text">${this._esc(sec.text)}</p>
      </div>
    `).join('');

    const tweetText  = encodeURIComponent(`私は【${result.name}】でした💘 あなたは何タイプ？→全員やってみて！\n${result.share_text || ''}`);
    const currentURL = encodeURIComponent(window.location.href);
    const bgStyle    = result.bg ? `style="background:${result.bg}"` : '';

    this.mountEl.innerHTML = `
      <div class="result-container">
        <div class="result-card">
          <div class="result-card-header" ${bgStyle}>
            <button class="screenshot-btn" id="screenshot-btn">📸 スクショ</button>
            <p class="result-complete-banner">✨ 診断完了！あなたのタイプが判明しました ✨</p>
            <p class="quiz-psychology-badge">🔬 心理学に基づく深層分析</p>
            ${illustration}
            <p class="result-type-label">あなたのタイプは...</p>
            <div class="result-name-badge">
              <span class="result-type-name">${this._esc(result.name)}</span>
            </div>
            ${this._renderQuoteBubble(result.catchphrase)}
            ${this._renderRankBadge(result.rank, totalResults)}
            ${this._renderStarGrid(statSections, customGaugeStarItems)}
            ${tags ? `<div class="result-tags result-tags-header">${tags}</div>` : ''}
          </div>
          <div class="result-card-body">
            ${result.summary ? `<div class="result-summary-badge">${this._esc(result.summary)}</div>` : ''}
            ${summaryGaugeHtml}
            ${result.compatible_with ? `<div class="result-section compatible-section"><div class="result-section-label">💑 相性の良い異性（こんな人）</div><p class="result-section-text">${this._esc(result.compatible_with)}</p></div>` : ''}
            <div class="mbti-axis-bars"><div class="mbti-axis-title">📊 心理学的観点からみたあなたの特性</div>${barsHtml}</div>
            <p class="result-description">${this._esc(result.description)}</p>
            ${sectionsHtml}
            ${result.advice ? `<div class="result-advice"><span class="advice-icon">💡</span><div><strong>アドバイス</strong><br>${this._esc(result.advice)}</div></div>` : ''}
          </div>
        </div>
        ${this._shareSection(tweetText, currentURL)}
        <div class="affiliate-section">
          <h3>💌 理想の出会いを見つけよう</h3>
          <a href="#AFFILIATE_PAIRS_URL" class="affiliate-banner" target="_blank" rel="noopener noreferrer">💑 Pairs（ペアーズ）で相性のいい相手を探す</a>
          <a href="#AFFILIATE_TAPPLE_URL" class="affiliate-banner secondary" target="_blank" rel="noopener noreferrer">🧡 タップルで同い年の恋人を見つける</a>
        </div>
        <div class="adsense-block">▼ 広告スペース（Google AdSense）▼</div>
        ${this._renderNextQuizzes()}
        ${this._renderCrossAppBanners()}
        <div class="result-action-btns">
          <button class="retry-btn" id="retry-btn">🔄 もう一度診断する</button>
          <a href="index.html" class="back-home-btn">📋 他の診断を見る</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      this.currentIndex = 0; this.answers = []; this._axisScores = null; this._questionScores = [];
      this._renderQuestion();
      this.mountEl.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('screenshot-btn').addEventListener('click', () => {
      this._showScreenshotOverlay(result, statSections, customGaugeStarItems);
    });
  }

  _showScreenshotOverlay(result, statSections, extraItems) {
    const existing = document.getElementById('screenshot-overlay');
    if (existing) existing.remove();

    const starRowsHtml = [
      ...(extraItems || []).map(item => {
        const filled = Math.min(Math.max(item.filled, 1), 5);
        return `<div class="ss-star-row"><span class="ss-star-label">${this._esc(item.label)}</span><span class="ss-star-val">${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}</span></div>`;
      }),
      ...(statSections || []).map(s => {
        const filled = Math.min(((s.text.match(/^★+/) || [''])[0].match(/★/g) || []).length, 5);
        return `<div class="ss-star-row"><span class="ss-star-label">${this._esc(s.label)}</span><span class="ss-star-val">${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}</span></div>`;
      })
    ].join('');

    const imgSrc = result.image || '';
    const imgInner = imgSrc
      ? `<img src="${imgSrc}" alt="${this._esc(result.name)}" class="ss-char-img" onerror="this.parentElement.innerHTML='<span class=ss-emoji-fb>${result.emoji || '💖'}</span>'">`
      : `<span class="ss-emoji-fb">${result.emoji || '💖'}</span>`;

    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.className = 'screenshot-overlay';
    if (result.bg) overlay.style.background = result.bg;
    overlay.innerHTML = `
      <button class="ss-close-btn" id="ss-close-btn">✕ 閉じる</button>
      <div class="ss-card">
        <p class="ss-app-title">💖 恋愛沼診断</p>
        <div class="ss-img-wrap ss-img-large">${imgInner}</div>
        <p class="ss-type-label">あなたのタイプは...</p>
        <h2 class="ss-name">${this._esc(result.name)}</h2>
        ${result.catchphrase ? `<p class="ss-catch">"${this._esc(result.catchphrase)}"</p>` : ''}
        ${starRowsHtml ? `<div class="ss-stats-section"><p class="ss-section-label">▸ 特 徴</p>${starRowsHtml}</div>` : ''}
        <p class="ss-hashtag">#恋愛沼診断 #恋愛心理テスト #恋愛依存</p>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    document.getElementById('ss-close-btn').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
  }

  _renderNormalResult(result) {
    this._showConfetti();

    const tweetText  = encodeURIComponent(`私は【${result.name}】でした💘 あなたは何タイプ？→全員やってみて！\n${result.share_text || ''}`);
    const currentURL = encodeURIComponent(window.location.href);
    const tags       = (result.tags || []).map(t => `<span class="result-tag">${this._esc(t)}</span>`).join('');

    const illustration = result.characterStyle
      ? `<div class="result-illust-wrap">${this._drawMbtiCharacterSVG(result.characterStyle)}</div>`
      : result.character
        ? `<div class="result-illust-wrap">${this._drawCharacterSVG(result.character)}</div>`
        : result.animal
          ? `<div class="result-illust-wrap">${this._drawAnimalSVG(result.animal)}</div>`
          : `<div class="result-emoji-wrap"><span class="result-emoji-big">${result.emoji || '💖'}</span></div>`;

    const sectionsHtml = (result.sections || []).map(s => `
      <div class="result-section">
        <div class="result-section-label">${this._esc(s.label)}</div>
        <p class="result-section-text">${this._esc(s.text)}</p>
      </div>
    `).join('');

    // ★セクションをヒーローグリッドへ
    const { star: statSectionsN, other: textSectionsN } = this._parseStarSections(result.sections || []);
    const sectionsHtmlFiltered = textSectionsN.map(s => `
      <div class="result-section">
        <div class="result-section-label">${this._esc(s.label)}</div>
        <p class="result-section-text">${this._esc(s.text)}</p>
      </div>
    `).join('');

    this.mountEl.innerHTML = `
      <div class="result-container">

        <div class="result-card">
          <div class="result-card-header">
            <p class="result-complete-banner">✨ 診断完了！あなたのタイプが判明しました ✨</p>
            <p class="quiz-psychology-badge">🔬 心理学に基づく深層分析</p>
            ${illustration}
            <p class="result-type-label">あなたのタイプは...</p>
            <div class="result-name-badge">
              <span class="result-type-name">${this._esc(result.name)}</span>
            </div>
            ${this._renderQuoteBubble(result.catchphrase)}
            ${this._renderStarGrid(statSectionsN)}
            ${tags ? `<div class="result-tags result-tags-header">${tags}</div>` : ''}
          </div>
          <div class="result-card-body">
            ${result.summary ? `<div class="result-summary-badge">${this._esc(result.summary)}</div>` : ''}
            <p class="result-description">${this._esc(result.description)}</p>
            ${sectionsHtmlFiltered}
            ${result.advice ? `<div class="result-advice"><span class="advice-icon">💡</span><div><strong>アドバイス</strong><br>${this._esc(result.advice)}</div></div>` : ''}
          </div>
        </div>

        ${this._shareSection(tweetText, currentURL)}

        <div class="affiliate-section">
          <h3>💌 理想の出会いを見つけよう</h3>
          <a href="#AFFILIATE_PAIRS_URL" class="affiliate-banner" target="_blank" rel="noopener noreferrer">💑 Pairs（ペアーズ）で理想のパートナーを探す</a>
          <a href="#AFFILIATE_TAPPLE_URL" class="affiliate-banner secondary" target="_blank" rel="noopener noreferrer">🧡 タップルで同い年の恋人を見つける</a>
          <a href="#NOTE_ARTICLE_URL" class="note-link" target="_blank" rel="noopener noreferrer">📝 もっと詳しい恋愛アドバイスはこちら（note有料記事）</a>
        </div>

        <div class="adsense-block">▼ 広告スペース（Google AdSense）▼</div>

        ${this._renderNextQuizzes()}
        ${this._renderCrossAppBanners()}

        <div class="result-action-btns">
          <button class="retry-btn" id="retry-btn">🔄 もう一度診断する</button>
          <a href="index.html" class="back-home-btn">📋 他の診断を見る</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      this.currentIndex = 0; this.answers = []; this._axisScores = null; this._questionScores = [];
      this._renderQuestion();
      this.mountEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===========================
  //   結果描画（推し）
  // ===========================
  _renderIdolResult(result) {
    this._showConfetti();

    const idol       = result.idol;
    const [c1, c2]   = idol.bg_gradient;
    const tweetText  = encodeURIComponent(`私の推しタイプは【${idol.name}】でした💘 あなたは誰？→全員やってみて！\n${result.share_text || ''}`);
    const currentURL = encodeURIComponent(window.location.href);
    const tags  = (result.tags  || []).map(t => `<span class="result-tag oshi-tag">${this._esc(t)}</span>`).join('');
    const charm = (idol.charm   || []).map(c => `<li>✦ ${this._esc(c)}</li>`).join('');

    this.mountEl.innerHTML = `
      <div class="result-container">

        <div class="result-complete-floating">✨ 診断完了！あなたの推しが判明しました ✨</div>

        <div class="oshi-result-card">
          <div class="oshi-card-header" style="background: linear-gradient(160deg, ${c1} 0%, ${c2} 100%)">
            <p class="oshi-found-label">あなたにドンピシャな推しは…</p>
            <div class="oshi-avatar-wrap">${this._drawIdolSVG(idol.color)}</div>
            <p class="oshi-name">${this._esc(idol.name)}</p>
            <p class="oshi-type">${this._esc(idol.type)}</p>
            <p class="oshi-catchphrase">"${this._esc(idol.catchphrase)}"</p>
          </div>
          <div class="oshi-card-body">
            <p class="result-description">${this._esc(result.description)}</p>
            ${tags  ? `<div class="result-tags">${tags}</div>` : ''}
            ${charm ? `<div class="oshi-charm"><p class="oshi-charm-title">✦ 推しポイント</p><ul>${charm}</ul></div>` : ''}
            ${result.advice ? `<div class="result-advice"><span class="advice-icon">💡</span><div><strong>攻略法</strong><br>${this._esc(result.advice)}</div></div>` : ''}
          </div>
        </div>

        ${this._shareSection(tweetText, currentURL, '推し診断')}

        <div class="affiliate-section">
          <h3>🎤 推し活をもっと楽しもう！</h3>
          <a href="#NOTE_ARTICLE_URL" class="note-link" target="_blank" rel="noopener noreferrer">📝 推し活を10倍楽しむ方法（note有料記事）</a>
        </div>

        <div class="adsense-block">▼ 広告スペース（Google AdSense）▼</div>

        ${this._renderNextQuizzes()}
        ${this._renderCrossAppBanners()}

        <div class="result-action-btns">
          <button class="retry-btn" id="retry-btn">🔄 もう一度診断する</button>
          <a href="index.html" class="back-home-btn">📋 他の診断を見る</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      this.currentIndex = 0; this.answers = [];
      this._renderQuestion();
      this.mountEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===========================
  //   オリジナルキャラクターSVG
  // ===========================
  _drawCharacterSVG(type) {
    const chars = {
      hikari: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#FFF3CC"/>
          <!-- 太陽の光線 -->
          <polygon points="60,4 55,20 65,20" fill="#FFD700"/>
          <polygon points="97,14 83,26 89,32" fill="#FFD700"/>
          <polygon points="116,50 100,52 100,62" fill="#FFD700"/>
          <polygon points="97,106 83,94 89,88" fill="#FFD700"/>
          <polygon points="60,116 55,100 65,100" fill="#FFD700"/>
          <polygon points="23,106 37,94 31,88" fill="#FFD700"/>
          <polygon points="4,50 20,52 20,62" fill="#FFD700"/>
          <polygon points="23,14 37,26 31,32" fill="#FFD700"/>
          <!-- トゲ髪（オレンジ） -->
          <polygon points="36,44 40,26 50,40" fill="#FF8C00"/>
          <polygon points="52,34 60,18 68,34" fill="#FF8C00"/>
          <polygon points="70,44 80,26 84,42" fill="#FF8C00"/>
          <!-- 顔 -->
          <circle cx="60" cy="68" r="36" fill="#FFCC80"/>
          <!-- 目 -->
          <ellipse cx="46" cy="64" rx="7" ry="8" fill="#3E1A00"/>
          <circle cx="44" cy="61" r="2.5" fill="white"/>
          <ellipse cx="74" cy="64" rx="7" ry="8" fill="#3E1A00"/>
          <circle cx="72" cy="61" r="2.5" fill="white"/>
          <!-- 眉毛（ハッピーアーチ） -->
          <path d="M40,53 Q46,49 52,53" stroke="#5D3A00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M68,53 Q74,49 80,53" stroke="#5D3A00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- 鼻 -->
          <circle cx="60" cy="72" r="2.5" fill="#FF8C00"/>
          <!-- 大きな笑顔 -->
          <path d="M44,82 Q60,97 76,82" stroke="#D84000" stroke-width="3" fill="none" stroke-linecap="round"/>
          <!-- ほっぺ -->
          <ellipse cx="34" cy="76" rx="10" ry="6" fill="rgba(255,130,30,0.35)"/>
          <ellipse cx="86" cy="76" rx="10" ry="6" fill="rgba(255,130,30,0.35)"/>
          <!-- 星アクセ -->
          <text x="20" y="48" font-size="11" fill="#FFD700">★</text>
          <text x="85" y="46" font-size="11" fill="#FFD700">★</text>
        </svg>`,
      minamo: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#E0F7FA"/>
          <!-- 波型の髪 -->
          <path d="M22,58 Q28,28 60,32 Q92,28 98,58 Q88,42 76,47 Q68,32 60,36 Q52,32 44,47 Q32,42 22,58Z" fill="#4DD0E1"/>
          <!-- 顔 -->
          <circle cx="60" cy="72" r="33" fill="#F0FFFF"/>
          <!-- 波の前髪 -->
          <path d="M30,58 Q38,44 52,50 Q60,40 68,50 Q82,44 90,58" stroke="#00BCD4" stroke-width="3" fill="none"/>
          <!-- 目（しずく型） -->
          <ellipse cx="46" cy="68" rx="6" ry="7.5" fill="#006064"/>
          <circle cx="44" cy="65" r="2.5" fill="white"/>
          <ellipse cx="74" cy="68" rx="6" ry="7.5" fill="#006064"/>
          <circle cx="72" cy="65" r="2.5" fill="white"/>
          <!-- 眉毛 -->
          <path d="M40,58 Q46,55 52,58" stroke="#00838F" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M68,58 Q74,55 80,58" stroke="#00838F" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- 鼻 -->
          <circle cx="60" cy="75" r="2" fill="#80DEEA"/>
          <!-- 穏やかな笑顔 -->
          <path d="M49,84 Q60,92 71,84" stroke="#00838F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- ほっぺ -->
          <ellipse cx="34" cy="78" rx="9" ry="6" fill="rgba(0,188,212,0.28)"/>
          <ellipse cx="86" cy="78" rx="9" ry="6" fill="rgba(0,188,212,0.28)"/>
          <!-- しずくアクセ -->
          <ellipse cx="24" cy="52" rx="4" ry="6" fill="rgba(0,188,212,0.55)"/>
          <ellipse cx="96" cy="52" rx="4" ry="6" fill="rgba(0,188,212,0.55)"/>
        </svg>`,
      konoha: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#EDE7F6"/>
          <!-- 髪 -->
          <ellipse cx="60" cy="40" rx="33" ry="22" fill="#7B1FA2"/>
          <!-- 星ヘアピン -->
          <text x="80" y="30" font-size="14" fill="#FFD700">✦</text>
          <!-- 顔 -->
          <circle cx="60" cy="70" r="32" fill="#F3E5F5"/>
          <!-- 丸メガネ（左） -->
          <circle cx="46" cy="66" r="9.5" fill="none" stroke="#512DA8" stroke-width="2.5"/>
          <!-- 丸メガネ（右） -->
          <circle cx="71" cy="66" r="9.5" fill="none" stroke="#512DA8" stroke-width="2.5"/>
          <!-- メガネブリッジ -->
          <line x1="55.5" y1="66" x2="61.5" y2="66" stroke="#512DA8" stroke-width="2.5"/>
          <!-- メガネアーム -->
          <line x1="36.5" y1="65" x2="30" y2="64" stroke="#512DA8" stroke-width="2"/>
          <line x1="80.5" y1="65" x2="87" y2="64" stroke="#512DA8" stroke-width="2"/>
          <!-- 目 -->
          <circle cx="46" cy="66" r="4.5" fill="#4A148C"/>
          <circle cx="44" cy="64" r="1.8" fill="white"/>
          <circle cx="71" cy="66" r="4.5" fill="#4A148C"/>
          <circle cx="69" cy="64" r="1.8" fill="white"/>
          <!-- 眉毛 -->
          <path d="M38,54 Q46,51 54,54" stroke="#4A148C" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M63,54 Q71,51 79,54" stroke="#4A148C" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- 鼻 -->
          <circle cx="60" cy="74" r="2" fill="#CE93D8"/>
          <!-- 思慮ある微笑み -->
          <path d="M51,83 Q60,89 69,83" stroke="#7B1FA2" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- 本 -->
          <rect x="14" y="82" width="15" height="19" rx="2" fill="#9C27B0"/>
          <rect x="15.5" y="83.5" width="12" height="16" rx="1" fill="#CE93D8"/>
          <line x1="21" y1="87" x2="25" y2="87" stroke="#9C27B0" stroke-width="1"/>
          <line x1="21" y1="90" x2="25" y2="90" stroke="#9C27B0" stroke-width="1"/>
          <line x1="21" y1="93" x2="25" y2="93" stroke="#9C27B0" stroke-width="1"/>
          <!-- ほっぺ -->
          <ellipse cx="34" cy="79" rx="8" ry="5" fill="rgba(156,39,176,0.2)"/>
          <ellipse cx="86" cy="79" rx="8" ry="5" fill="rgba(156,39,176,0.2)"/>
        </svg>`,
      yura: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#1A237E"/>
          <!-- 散らばる星 -->
          <text x="10" y="26" font-size="9" fill="white" opacity="0.8">✦</text>
          <text x="91" y="19" font-size="11" fill="#FFD700" opacity="0.9">★</text>
          <text x="103" y="56" font-size="7" fill="white" opacity="0.7">✦</text>
          <text x="7" y="72" font-size="8" fill="white" opacity="0.65">✦</text>
          <text x="96" y="92" font-size="9" fill="white" opacity="0.7">★</text>
          <text x="15" y="95" font-size="7" fill="#FFD700" opacity="0.6">★</text>
          <!-- 流れる髪 -->
          <path d="M24,58 Q26,24 60,28 Q94,24 96,58 Q90,38 80,44 Q72,26 60,30 Q48,26 40,44 Q30,38 24,58Z" fill="#283593"/>
          <!-- 顔 -->
          <circle cx="60" cy="70" r="33" fill="#E8EAF6"/>
          <!-- 星の瞳（左） -->
          <circle cx="45" cy="65" r="9" fill="#1A237E"/>
          <text x="38.5" y="70" font-size="12" fill="#FFD700">★</text>
          <!-- 星の瞳（右） -->
          <circle cx="75" cy="65" r="9" fill="#1A237E"/>
          <text x="68.5" y="70" font-size="12" fill="#FFD700">★</text>
          <!-- 眉毛（ミステリアス） -->
          <path d="M37,54 Q45,52 53,55" stroke="#3949AB" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M67,55 Q75,52 83,54" stroke="#3949AB" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- 鼻 -->
          <circle cx="60" cy="74" r="1.8" fill="#9FA8DA"/>
          <!-- ミステリアスな微笑み -->
          <path d="M50,84 Q60,91 70,84" stroke="#3949AB" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- ほっぺ -->
          <ellipse cx="33" cy="77" rx="8" ry="5" fill="rgba(63,81,181,0.3)"/>
          <ellipse cx="87" cy="77" rx="8" ry="5" fill="rgba(63,81,181,0.3)"/>
          <!-- 三日月アクセ -->
          <path d="M100,28 Q112,35 100,44 Q110,37 100,28Z" fill="#FFD700"/>
        </svg>`
    };
    return chars[type] || `<div style="font-size:4rem">💖</div>`;
  }

  // ===========================
  //   MBTI性格タイプSVGキャラ
  // ===========================
  _drawMbtiCharacterSVG(code) {
    if (!code || code.length !== 4) return '<div style="font-size:4rem">🔮</div>';
    const ei = code[0], sn = code[1], tf = code[2], jp = code[3];

    const themes = {
      ET: { bg: '#FFF3E0', hair: '#E65100', hairD: '#BF360C', accent: '#FFD54F', cheek: 'rgba(255,120,50,0.35)' },
      EF: { bg: '#FCE4EC', hair: '#C2185B', hairD: '#880E4F', accent: '#F48FB1', cheek: 'rgba(255,80,130,0.32)' },
      IT: { bg: '#E8EAF6', hair: '#1565C0', hairD: '#0D47A1', accent: '#90CAF9', cheek: 'rgba(80,100,220,0.28)' },
      IF: { bg: '#F3E5F5', hair: '#6A1B9A', hairD: '#4A148C', accent: '#CE93D8', cheek: 'rgba(150,60,210,0.28)' }
    };
    const t = themes[ei + tf];

    const hair = sn === 'N' ? `
      <path d="M24,56 Q26,22 60,26 Q94,22 96,56 Q88,36 76,43 Q68,24 60,30 Q52,24 44,43 Q32,36 24,56Z" fill="${t.hair}"/>
      <text x="12" y="27" font-size="11" fill="${t.accent}">✦</text>
      <text x="92" y="22" font-size="10" fill="${t.accent}">★</text>
      <text x="102" y="50" font-size="8" fill="${t.accent}" opacity="0.7">✦</text>` : `
      <ellipse cx="60" cy="40" rx="34" ry="19" fill="${t.hair}"/>
      <rect x="24" y="36" width="72" height="14" rx="7" fill="${t.hair}"/>`;

    const accessory = jp === 'J' ? `
      <path d="M44,34 Q52,26 60,32 Q68,26 76,34 Q68,42 60,36 Q52,42 44,34Z" fill="${t.hairD}" opacity="0.85"/>
      <circle cx="60" cy="34" r="5" fill="${t.hair}"/>
      <circle cx="60" cy="34" r="2.5" fill="${t.accent}"/>` : `
      <circle cx="76" cy="33" r="5.5" fill="${t.hair}" opacity="0.7"/>
      <circle cx="70" cy="27" r="5" fill="${t.hairD}" opacity="0.8"/>
      <circle cx="82" cy="27" r="4.5" fill="${t.hair}" opacity="0.65"/>
      <circle cx="76" cy="33" r="3.5" fill="${t.accent}"/>`;

    const eyeRx = tf === 'T' ? 6.5 : 8;
    const eyeRy = tf === 'T' ? 7.5 : 10;
    const eyeCol = tf === 'T' ? t.hairD : t.hair;
    const browL  = tf === 'T' ? 'M38,56 Q45,53 52,56' : 'M37,57 Q45,53 53,57';
    const browR  = tf === 'T' ? 'M68,56 Q75,53 82,56' : 'M67,57 Q75,53 83,57';
    const lashes = tf === 'F' ? `
      <path d="M37,59 L38,54" stroke="${t.hairD}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M41,56 L42,51" stroke="${t.hairD}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M64,56 L65,51" stroke="${t.hairD}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M68,59 L70,54" stroke="${t.hairD}" stroke-width="1.5" stroke-linecap="round"/>` : '';

    const mouthD = ei === 'E' ? 'M43,84 Q60,99 77,84' : 'M49,86 Q60,93 71,86';
    const mouthW = ei === 'E' ? 3 : 2.5;
    const sparkles = tf === 'F'
      ? `<text x="20" y="52" font-size="10" fill="${t.accent}" opacity="0.75">♡</text><text x="87" y="50" font-size="9" fill="${t.accent}" opacity="0.75">♡</text>`
      : `<text x="18" y="50" font-size="9" fill="${t.accent}" opacity="0.6">◆</text><text x="89" y="48" font-size="8" fill="${t.accent}" opacity="0.6">◇</text>`;

    return `
      <svg viewBox="0 0 120 120" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" fill="${t.bg}"/>
        <circle cx="60" cy="60" r="57" fill="none" stroke="${t.hair}" stroke-width="1" opacity="0.15"/>
        ${hair}
        ${accessory}
        ${sparkles}
        <circle cx="60" cy="70" r="35" fill="#FFE0B2"/>
        <ellipse cx="45" cy="67" rx="${eyeRx}" ry="${eyeRy}" fill="${eyeCol}"/>
        <ellipse cx="75" cy="67" rx="${eyeRx}" ry="${eyeRy}" fill="${eyeCol}"/>
        <circle cx="42" cy="63" r="3" fill="white"/>
        <circle cx="47" cy="71" r="1.5" fill="white" opacity="0.55"/>
        <circle cx="72" cy="63" r="3" fill="white"/>
        <circle cx="77" cy="71" r="1.5" fill="white" opacity="0.55"/>
        ${lashes}
        <path d="${browL}" stroke="${t.hairD}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="${browR}" stroke="${t.hairD}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="75" r="2.2" fill="#FFAB91"/>
        <path d="${mouthD}" stroke="#E64A19" stroke-width="${mouthW}" fill="none" stroke-linecap="round"/>
        <ellipse cx="31" cy="79" rx="11" ry="7" fill="${t.cheek}"/>
        <ellipse cx="89" cy="79" rx="11" ry="7" fill="${t.cheek}"/>
      </svg>`;
  }

  // ===========================
  //   動物SVGイラスト
  // ===========================
  _drawAnimalSVG(type) {
    const animals = {
      rabbit: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#FFD6E7"/>
          <ellipse cx="38" cy="26" rx="12" ry="26" fill="white" transform="rotate(-8,38,26)"/>
          <ellipse cx="38" cy="26" rx="7" ry="19" fill="#FFB7D1" transform="rotate(-8,38,26)"/>
          <ellipse cx="82" cy="26" rx="12" ry="26" fill="white" transform="rotate(8,82,26)"/>
          <ellipse cx="82" cy="26" rx="7" ry="19" fill="#FFB7D1" transform="rotate(8,82,26)"/>
          <circle cx="60" cy="72" r="36" fill="white"/>
          <circle cx="46" cy="66" r="8" fill="#FF69B4"/>
          <circle cx="48" cy="64" r="3" fill="white"/>
          <circle cx="46" cy="66" r="2" fill="#1a1a1a"/>
          <circle cx="74" cy="66" r="8" fill="#FF69B4"/>
          <circle cx="76" cy="64" r="3" fill="white"/>
          <circle cx="74" cy="66" r="2" fill="#1a1a1a"/>
          <ellipse cx="60" cy="78" rx="5" ry="4" fill="#FF9EC5"/>
          <path d="M54,84 Q60,91 66,84" stroke="#FF69B4" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="40" cy="76" rx="9" ry="6" fill="rgba(255,150,180,0.35)"/>
          <ellipse cx="80" cy="76" rx="9" ry="6" fill="rgba(255,150,180,0.35)"/>
        </svg>`,
      cat: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#FFE4B5"/>
          <polygon points="28,45 20,15 48,35" fill="#FFA07A"/>
          <polygon points="30,42 24,20 44,34" fill="#FFD8D0"/>
          <polygon points="92,45 100,15 72,35" fill="#FFA07A"/>
          <polygon points="90,42 96,20 76,34" fill="#FFD8D0"/>
          <circle cx="60" cy="70" r="36" fill="#FFF5E0"/>
          <ellipse cx="46" cy="64" rx="8" ry="9" fill="#7EC8A0"/>
          <ellipse cx="46" cy="64" rx="3" ry="7" fill="#1a1a1a"/>
          <circle cx="44" cy="62" r="2.5" fill="white"/>
          <ellipse cx="74" cy="64" rx="8" ry="9" fill="#7EC8A0"/>
          <ellipse cx="74" cy="64" rx="3" ry="7" fill="#1a1a1a"/>
          <circle cx="72" cy="62" r="2.5" fill="white"/>
          <polygon points="60,74 55,80 65,80" fill="#FFB6C1"/>
          <path d="M55,80 Q60,86 65,80" stroke="#FFA0B0" stroke-width="2" fill="none"/>
          <line x1="20" y1="72" x2="46" y2="76" stroke="#999" stroke-width="1.2"/>
          <line x1="20" y1="78" x2="46" y2="79" stroke="#999" stroke-width="1.2"/>
          <line x1="74" y1="76" x2="100" y2="72" stroke="#999" stroke-width="1.2"/>
          <line x1="74" y1="79" x2="100" y2="78" stroke="#999" stroke-width="1.2"/>
          <ellipse cx="40" cy="74" rx="9" ry="6" fill="rgba(255,160,120,0.35)"/>
          <ellipse cx="80" cy="74" rx="9" ry="6" fill="rgba(255,160,120,0.35)"/>
        </svg>`,
      bear: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#D2955A"/>
          <circle cx="28" cy="32" r="18" fill="#C17F45"/>
          <circle cx="28" cy="32" r="11" fill="#E8B480"/>
          <circle cx="92" cy="32" r="18" fill="#C17F45"/>
          <circle cx="92" cy="32" r="11" fill="#E8B480"/>
          <circle cx="60" cy="68" r="38" fill="#E8B480"/>
          <ellipse cx="60" cy="82" rx="18" ry="14" fill="#D2955A"/>
          <circle cx="46" cy="63" r="9" fill="#1a1a1a"/>
          <circle cx="44" cy="61" r="3" fill="white"/>
          <circle cx="74" cy="63" r="9" fill="#1a1a1a"/>
          <circle cx="72" cy="61" r="3" fill="white"/>
          <ellipse cx="60" cy="75" rx="8" ry="6" fill="#1a1a1a"/>
          <ellipse cx="58" cy="73" rx="3" ry="2" fill="rgba(255,255,255,0.3)"/>
          <path d="M50,84 Q60,93 70,84" stroke="#C17F45" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="38" cy="74" rx="10" ry="7" fill="rgba(210,130,80,0.4)"/>
          <ellipse cx="82" cy="74" rx="10" ry="7" fill="rgba(210,130,80,0.4)"/>
        </svg>`,
      fox: `
        <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" fill="#E8671A"/>
          <polygon points="30,48 18,10 54,38" fill="#E8671A"/>
          <polygon points="32,45 22,16 50,36" fill="white"/>
          <polygon points="33,43 26,20 47,34" fill="#FF9A60"/>
          <polygon points="90,48 102,10 66,38" fill="#E8671A"/>
          <polygon points="88,45 98,16 70,36" fill="white"/>
          <polygon points="87,43 94,20 73,34" fill="#FF9A60"/>
          <ellipse cx="60" cy="72" rx="30" ry="32" fill="white"/>
          <ellipse cx="60" cy="52" rx="28" ry="20" fill="#E8671A"/>
          <ellipse cx="60" cy="78" rx="26" ry="26" fill="white"/>
          <circle cx="46" cy="64" r="8" fill="#D4870A"/>
          <circle cx="46" cy="64" r="4" fill="#1a1a1a"/>
          <circle cx="44" cy="62" r="2" fill="white"/>
          <circle cx="74" cy="64" r="8" fill="#D4870A"/>
          <circle cx="74" cy="64" r="4" fill="#1a1a1a"/>
          <circle cx="72" cy="62" r="2" fill="white"/>
          <polygon points="60,75 55,82 65,82" fill="#1a1a1a"/>
          <path d="M55,82 Q60,89 65,82" stroke="#E8671A" stroke-width="2" fill="none"/>
          <ellipse cx="38" cy="72" rx="9" ry="6" fill="rgba(240,120,50,0.35)"/>
          <ellipse cx="82" cy="72" rx="9" ry="6" fill="rgba(240,120,50,0.35)"/>
        </svg>`
    };
    return animals[type] || `<div style="font-size:4rem">${type}</div>`;
  }

  // ===========================
  //   推しアバターSVG
  // ===========================
  _drawIdolSVG(color) {
    return `
      <svg viewBox="0 0 100 120" width="110" height="130" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="42" rx="30" ry="34" fill="${color}"/>
        <ellipse cx="50" cy="30" rx="28" ry="15" fill="${color}"/>
        <ellipse cx="50" cy="54" rx="22" ry="25" fill="#FFE8D6"/>
        <ellipse cx="40" cy="50" rx="5" ry="6" fill="${color}"/>
        <circle cx="40" cy="49" r="2" fill="white"/>
        <ellipse cx="40" cy="50" rx="2.5" ry="3" fill="#1a1a1a"/>
        <ellipse cx="60" cy="50" rx="5" ry="6" fill="${color}"/>
        <circle cx="60" cy="49" r="2" fill="white"/>
        <ellipse cx="60" cy="50" rx="2.5" ry="3" fill="#1a1a1a"/>
        <line x1="35" y1="44" x2="37" y2="42" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="40" y1="43" x2="40" y2="41" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="45" y1="44" x2="43" y2="42" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="55" y1="44" x2="57" y2="42" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="60" y1="43" x2="60" y2="41" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="65" y1="44" x2="63" y2="42" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="50" cy="58" r="1.8" fill="#FFB8A0"/>
        <path d="M44,65 Q50,71 56,65" stroke="#FF8888" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="35" cy="60" rx="7" ry="5" fill="rgba(255,150,150,0.4)"/>
        <ellipse cx="65" cy="60" rx="7" ry="5" fill="rgba(255,150,150,0.4)"/>
        <rect x="30" y="78" width="40" height="35" rx="8" fill="${color}"/>
        <rect x="43" y="72" width="14" height="12" fill="#FFE8D6"/>
        <text x="8" y="25" font-size="14" fill="gold" opacity="0.9">★</text>
        <text x="78" y="20" font-size="12" fill="gold" opacity="0.9">✦</text>
      </svg>`;
  }

  // ===========================
  //   ユーティリティ
  // ===========================
  _showLoading() {
    this.mountEl.innerHTML = `
      <div class="loading visible">
        <div class="spinner"></div>
        <p>診断を読み込んでいます...</p>
      </div>
    `;
  }

  _showError(msg) {
    this.mountEl.innerHTML = `
      <div class="error-msg visible">
        <p>${this._esc(msg)}</p>
        <a href="index.html" class="back-home-btn" style="margin-top:12px;display:inline-block;">トップへ戻る</a>
      </div>
    `;
  }

  _esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('quiz-app');
  if (!appEl) return;
  const jsonPath = appEl.dataset.quiz;
  if (!jsonPath) return;
  new QuizEngine(jsonPath, '#quiz-app').init();
});
