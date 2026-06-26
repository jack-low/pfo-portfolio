(function () {
  const root = document.documentElement;
  const variantButtons = Array.from(document.querySelectorAll('[data-set-variant]'));
  const langButton = document.querySelector('[data-toggle-lang]');
  const skillList = document.getElementById('skill-list');
  const worksGrid = document.getElementById('works-grid');
  const floating = document.getElementById('floating-card');
  const floatingTitle = floating && floating.querySelector('h3');
  const floatingDesc = floating && floating.querySelector('.floating-desc');
  const floatingTags = floating && floating.querySelector('.floating-tags');
  const floatingLink = floating && floating.querySelector('.floating-link');
  const floatingClose = floating && floating.querySelector('.floating-close');

  const copy = {
    ja: {
      navProfile: 'Profile',
      navSkills: 'Skills',
      navWorks: 'Works',
      navContact: 'Contact',
      eyebrow: 'engineer / creator / problem solver',
      headlineA: 'AI と人間の境界で、',
      headlineB: '面倒を仕組みに変える開発者。',
      lead: 'Python、AI、Docker、Web技術を組み合わせて、日々の「面倒」や「非効率」を価値あるツールと体験に変えるエンジニアです。自動化・効率化・可視化が得意です。',
      knownForLabel: '俺と言えば',
      known1: '自動化',
      known2: 'ガジェット改造',
      known3: 'ゲーム制作',
      known4: 'AI活用',
      focusLabel: '現在の注力',
      focus: 'AI活用 × 業務自動化 × Web アプリ開発',
      viewWorks: '制作物を見る',
      contactMe: '相談する',
      profileKicker: 'profile',
      profileTitle: '古い面倒を、新しい仕組みに変える。',
      profileBody: '設計、実装、運用まで一気通貫で手を動かします。派手な理屈より、動くもの、測れるもの、続けられるものを重視します。伝統的な堅実さを土台にしつつ、AIや自動化で作業の重さを外へ逃がすのが得意です。',
      skillsLabel: 'スキル',
      skillsTitle: '手を動かせる領域',
      skillsLead: '設計から実装、運用まで。道具は目的に合わせて選びます。',
      worksLabel: '制作物',
      worksTitle: 'つくったもの',
      worksLead: 'カードを選択すると、短い紹介をFloating Cardで表示します。',
      contactLabel: 'contact',
      contactTitle: '相談は短くても構いません。',
      openLink: 'リンクを開く'
    },
    en: {
      navProfile: 'Profile',
      navSkills: 'Skills',
      navWorks: 'Works',
      navContact: 'Contact',
      eyebrow: 'engineer / creator / problem solver',
      headlineA: 'Turning friction into systems —',
      headlineB: 'where AI meets people.',
      lead: 'I combine Python, AI, Docker and web tech to turn everyday friction and inefficiency into tools and experiences that matter. Automation, optimization and visualization are my craft.',
      knownForLabel: 'Known for',
      known1: 'automation',
      known2: 'gadget mods',
      known3: 'game dev',
      known4: 'AI',
      focusLabel: 'Current focus',
      focus: 'AI x business automation x web apps',
      viewWorks: 'View works',
      contactMe: 'Contact',
      profileKicker: 'profile',
      profileTitle: 'Turning old friction into new systems.',
      profileBody: 'I work across design, implementation and operations. I value working systems, measurable results and tools that can keep running. The foundation is practical engineering; the leverage comes from AI and automation.',
      skillsLabel: 'skills',
      skillsTitle: 'What I can build',
      skillsLead: 'From design to build to ops. I choose tools by purpose.',
      worksLabel: 'works',
      worksTitle: 'Selected projects',
      worksLead: 'Select a card to open a short Floating Card introduction.',
      contactLabel: 'contact',
      contactTitle: 'A short message is enough.',
      openLink: 'Open link'
    }
  };

  const skills = [
    { n: '01', name: 'Python', ja: 'データ処理・自動化・AI開発まで幅広く対応', en: 'Data processing, automation, and AI development.' },
    { n: '02', name: 'Docker', ja: '環境構築・運用・コンテナ化を最適化', en: 'Environment setup, operations, and containerization.' },
    { n: '03', name: 'JavaScript', ja: 'Webアプリ開発・インタラクティブ実装', en: 'Web applications and interactive front-end work.' },
    { n: '04', name: 'VBA', ja: '業務自動化・効率化・Excel連携を強化', en: 'Business automation and Excel-driven workflows.' },
    { n: '05', name: 'AI / LLM', ja: 'LLM活用・プロンプト設計・RAG構築など', en: 'LLM integration, prompt design, and RAG.' },
    { n: '06', name: 'Web Development', ja: 'FastAPI・Flask・Next.js などモダンな開発を実践', en: 'Modern stacks including FastAPI, Flask, and Next.js.' },
    { n: '07', name: 'Automation', ja: '定型作業の自動化・スケジューリング・効率化設計', en: 'Routine automation, scheduling, and workflow design.' },
    { n: '08', name: 'Game / Creative Tools', ja: 'ゲーム制作・ツール開発・ガジェット改造・デザイン', en: 'Games, tools, gadget mods, and design.' }
  ];

  const works = [
    {
      title: 'Video Studio Bridge',
      desc: '絵コンテ画像、音声、Wan 2.2をつなぎ、動画生成ジョブを一つのWeb Studioで管理。',
      intro: '画像、音声、生成バックエンドをつなぐ制作管制塔です。素材管理からジョブ投入までを一つにまとめ、動画制作の手戻りを減らします。',
      tags: ['TypeScript', 'React', 'Fastify', 'ComfyUI'],
      link: ''
    },
    {
      title: 'Codex Remote Support',
      desc: '承認、監査ログ、Telegram画像送受信まで備えた、Codex向けリモート支援基盤。',
      intro: '外出先からでも安全にCodexへ依頼できる支援基盤です。承認、監査、Telegram連携を通し、遠隔作業を実務レベルで扱えます。',
      tags: ['TypeScript', 'WebSocket', 'Telegram', 'LM Studio'],
      link: 'https://github.com/jack-low/codex-remote-support'
    },
    {
      title: 'FAQ RAG Bot',
      desc: '操作マニュアルを検索し、ローカルLLMで回答を整形する業務FAQボットMVP。',
      intro: '社内マニュアルやFAQを検索し、回答を読みやすく整えるRAGボットです。問い合わせ対応を属人化させず、知識を再利用します。',
      tags: ['Python', 'FastAPI', 'RAG', 'Docker'],
      link: 'https://faq.solo-map.app'
    },
    {
      title: 'solo-map AI Commerce',
      desc: 'AIエージェントの導入、権限、購入、履歴を一つの体験にまとめるコマース基盤。',
      intro: 'AIエージェントが商品やサービスを選び、権限と購入履歴を残せるコマース基盤です。人とAIの購買判断をつなぎます。',
      tags: ['React', 'FastAPI', 'PostgreSQL', 'Stripe'],
      link: 'https://demo.solo-map.app'
    },
    {
      title: 'Solo Map MCP',
      desc: '住宅ローン借換や商品比較を構造化し、AIエージェントへ提案結果を返す比較エンジン。',
      intro: '自然な相談文を条件、制約、目的へ分解し、候補理由や注意点まで返すAI接続向け比較エンジンです。公開情報は閲覧可能、実行APIはBearerトークンで保護します。',
      tags: ['FastAPI', 'MCP', 'uv', 'Comparison'],
      link: 'https://mcp.solo-map.app'
    },
    {
      title: 'Game / Creative Tools',
      desc: 'ゲーム制作、ツール開発、ガジェット改造を横断する個人制作群。',
      intro: 'ゲーム、制作支援ツール、ガジェット改造など、手を動かしながら試すための制作群です。小さな実験を実用品へ寄せていきます。',
      tags: ['Game', 'Tools', 'Design'],
      link: ''
    }
  ];

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function currentLang() {
    return root.lang === 'en' ? 'en' : 'ja';
  }

  function renderCopy() {
    const lang = currentLang();
    const selectedCopy = copy[lang];
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(selectedCopy, key)) node.textContent = selectedCopy[key];
    });
    if (langButton) langButton.textContent = lang === 'ja' ? 'EN' : '日本語';
    if (skillList) {
      skillList.innerHTML = skills.map((skill) => `
        <li data-reveal>
          <span class="num">${esc(skill.n)}</span>
          <strong>${esc(skill.name)}</strong>
          <span>${esc(skill[lang])}</span>
        </li>`).join('');
    }
  }

  function renderWorks() {
    if (!worksGrid) return;
    worksGrid.innerHTML = works.map((work, index) => {
      const tags = work.tags.map((tag) => `<span>${esc(tag)}</span>`).join('');
      const link = work.link ? `<a class="work-link" href="${esc(work.link)}" target="_blank" rel="noopener noreferrer">open -></a>` : '';
      return `
        <article class="work-card" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${esc(work.title)}の紹介を表示" data-work-index="${index}" data-reveal>
          <h3>${esc(work.title)}</h3>
          <p>${esc(work.desc)}</p>
          <div class="tag-list">${tags}</div>
          ${link}
        </article>`;
    }).join('');
  }

  function setVariant(variant) {
    root.dataset.variant = variant;
    try { localStorage.setItem('jl-portfolio-variant', variant); } catch (error) {}
    variantButtons.forEach((button) => {
      const active = button.dataset.setVariant === variant;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function showWork(index) {
    const work = works[index];
    if (!work || !floating) return;
    floatingTitle.textContent = work.title;
    floatingDesc.textContent = work.intro;
    floatingTags.innerHTML = work.tags.map((tag) => `<span>${esc(tag)}</span>`).join('');
    if (work.link) {
      floatingLink.href = work.link;
      floatingLink.hidden = false;
    } else {
      floatingLink.removeAttribute('href');
      floatingLink.hidden = true;
    }
    floating.setAttribute('aria-hidden', 'false');
    floating.classList.add('is-open');
    worksGrid.querySelectorAll('.work-card.is-selected').forEach((card) => card.classList.remove('is-selected'));
    const card = worksGrid.querySelector(`[data-work-index="${index}"]`);
    if (card) card.classList.add('is-selected');
  }

  function hideWork() {
    if (!floating || !worksGrid) return;
    floating.setAttribute('aria-hidden', 'true');
    floating.classList.remove('is-open');
    worksGrid.querySelectorAll('.work-card.is-selected').forEach((card) => card.classList.remove('is-selected'));
  }

  function setupReveal() {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    nodes.forEach((node) => observer.observe(node));
  }

  variantButtons.forEach((button) => {
    button.addEventListener('click', () => setVariant(button.dataset.setVariant));
  });
  if (langButton) {
    langButton.addEventListener('click', () => {
      root.lang = currentLang() === 'ja' ? 'en' : 'ja';
      try { localStorage.setItem('jl-portfolio-lang', root.lang); } catch (error) {}
      renderCopy();
      hideWork();
      setupReveal();
    });
  }
  if (worksGrid) {
    worksGrid.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      const card = event.target.closest('.work-card');
      if (card) showWork(Number(card.dataset.workIndex));
    });
    worksGrid.addEventListener('keydown', (event) => {
      const card = event.target.closest('.work-card');
      if (!card) return;
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        showWork(Number(card.dataset.workIndex));
      }
    });
  }
  if (floatingClose) floatingClose.addEventListener('click', hideWork);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideWork();
  });

  try {
    const savedVariant = localStorage.getItem('jl-portfolio-variant');
    if (['a', 'b', 'c'].includes(savedVariant)) setVariant(savedVariant);
    else setVariant('a');
    const savedLang = localStorage.getItem('jl-portfolio-lang');
    if (['ja', 'en'].includes(savedLang)) root.lang = savedLang;
  } catch (error) {
    setVariant('a');
  }
  renderCopy();
  renderWorks();
  setupReveal();

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
