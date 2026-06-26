/* works.js - verified local projects and generated editorial thumbnails. */
(function () {
  const works = [
    {
      title: 'Video Studio Bridge',
      desc: '絵コンテ画像、音声、Wan 2.2をつなぎ、動画生成ジョブを一つのWeb Studioで管理。',
      intro: '画像、音声、生成バックエンドをつなぐ制作管制塔です。素材管理からジョブ投入までを一つにまとめ、動画制作の手戻りを減らします。',
      tags: ['TypeScript', 'React', 'Fastify', 'ComfyUI'],
      image: 'assets/projects/video-studio.png',
      link: ''
    },
    {
      title: 'Codex Remote Support',
      desc: '承認、監査ログ、Telegram画像送受信まで備えた、Codex向けリモート支援基盤。',
      intro: '外出先からでも安全にCodexへ依頼できる支援基盤です。承認、監査、Telegram連携を通し、遠隔作業を実務レベルで扱えます。',
      tags: ['TypeScript', 'WebSocket', 'Telegram', 'LM Studio'],
      image: 'assets/projects/remote-support.png',
      link: 'https://github.com/jack-low/codex-remote-support'
    },
    {
      title: 'AI VTuber Control',
      desc: 'LLM、長期記憶、日本語音声、VTube Studioを統合したローカル優先の制御アプリ。',
      intro: '会話、記憶、音声、表情制御をローカル中心で束ねる実験的な制御アプリです。キャラクター運用を技術側から支える土台です。',
      tags: ['FastAPI', 'Live2D', 'Irodori-TTS', 'WebSocket'],
      image: 'assets/projects/ai-vtuber.png',
      link: ''
    },
    {
      title: 'FAQ RAG Bot',
      desc: '操作マニュアルを検索し、ローカルLLMで回答を整形する業務FAQボットMVP。',
      intro: '社内マニュアルやFAQを検索し、回答を読みやすく整えるRAGボットです。問い合わせ対応を属人化させず、知識を再利用します。',
      tags: ['Python', 'FastAPI', 'RAG', 'Docker'],
      image: 'assets/projects/faq-rag.png',
      link: 'https://faq.solo-map.app'
    },
    {
      title: '研修CBTシステム',
      desc: '動画研修、設問、受講結果を軽量構成で扱う、DBレスの社内研修Webシステム。',
      intro: '動画研修、確認テスト、受講履歴を軽量に扱う社内向けシステムです。小さく始めて運用負荷を抑える設計にしています。',
      tags: ['PHP', 'JavaScript', 'Nginx', 'Docker'],
      image: 'assets/projects/training-cbt.png',
      link: ''
    },
    {
      title: 'solo-map AI Commerce',
      desc: 'AIエージェントの導入、権限、購入、履歴を一つの体験にまとめるコマース基盤。',
      intro: 'AIエージェントが商品やサービスを選び、権限と購入履歴を残せるコマース基盤です。人とAIの購買判断をつなぎます。',
      tags: ['React', 'FastAPI', 'PostgreSQL', 'Stripe'],
      image: 'assets/projects/solo-map.png',
      link: 'https://demo.solo-map.app'
    },
    {
      title: 'Solo Map MCP',
      desc: '住宅ローン借換や商品比較を構造化し、AIエージェントへ提案結果を返す比較エンジン。',
      intro: '自然な相談文を条件、制約、目的へ分解し、候補理由や注意点まで返すAI接続向け比較エンジンです。公開情報は閲覧可能、実行APIはBearerトークンで保護します。',
      tags: ['FastAPI', 'MCP', 'uv', 'Comparison'],
      image: 'assets/projects/solo-map.png',
      link: 'https://mcp.solo-map.app'
    }
  ];

  const ext = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const rail = document.getElementById('works-rail');
  if (!rail) return;

  rail.innerHTML = works.map((w, i) => {
    const tags = w.tags.map((t) => `<span>${esc(t)}</span>`).join('');
    const linkEl = w.link
      ? `<a class="work-link" href="${esc(w.link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(w.title)}を開く">開く <span class="ext" aria-hidden="true">${ext}</span></a>`
      : '';
    const cornerExt = w.link ? `<span class="ext" aria-hidden="true">${ext}</span>` : '';
    return `
    <article class="panel work-card reveal" style="--d:${i * 70}ms" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc(w.title)}の紹介を表示" data-work-index="${i}">
      <div class="work-thumb">
        ${cornerExt}
        <img src="${esc(w.image)}" alt="${esc(w.title)}のコンセプトビジュアル" loading="lazy" width="520" height="325">
      </div>
      <div class="work-body">
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.desc)}</p>
        <div class="work-tags">${tags}</div>
        ${linkEl}
      </div>
    </article>`;
  }).join('');

  const detail = document.createElement('aside');
  detail.className = 'work-floating-card';
  detail.id = 'work-floating-card';
  detail.setAttribute('role', 'dialog');
  detail.setAttribute('aria-modal', 'false');
  detail.setAttribute('aria-hidden', 'true');
  detail.innerHTML = `
    <button class="work-floating-close" type="button" aria-label="紹介枠を閉じる">&times;</button>
    <p class="work-floating-kicker">PROJECT BRIEF</p>
    <h3></h3>
    <p class="work-floating-desc"></p>
    <div class="work-floating-tags"></div>
    <a class="work-floating-link" target="_blank" rel="noopener noreferrer">リンクを開く <span aria-hidden="true">${ext}</span></a>`;
  rail.insertAdjacentElement('afterend', detail);

  const title = detail.querySelector('h3');
  const desc = detail.querySelector('.work-floating-desc');
  const tagBox = detail.querySelector('.work-floating-tags');
  const openLink = detail.querySelector('.work-floating-link');
  const close = detail.querySelector('.work-floating-close');

  function showWork(index) {
    const w = works[index];
    if (!w) return;
    title.textContent = w.title;
    desc.textContent = w.intro || w.desc;
    tagBox.innerHTML = w.tags.map((t) => `<span>${esc(t)}</span>`).join('');
    if (w.link) {
      openLink.href = w.link;
      openLink.hidden = false;
    } else {
      openLink.removeAttribute('href');
      openLink.hidden = true;
    }
    detail.setAttribute('aria-hidden', 'false');
    rail.querySelectorAll('.work-card.is-selected').forEach((card) => card.classList.remove('is-selected'));
    const card = rail.querySelector(`[data-work-index="${index}"]`);
    if (card) card.classList.add('is-selected');
  }

  function hideWork() {
    detail.setAttribute('aria-hidden', 'true');
    rail.querySelectorAll('.work-card.is-selected').forEach((card) => card.classList.remove('is-selected'));
  }

  rail.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    const card = event.target.closest('.work-card');
    if (card) showWork(Number(card.dataset.workIndex));
  });

  rail.addEventListener('keydown', (event) => {
    const card = event.target.closest('.work-card');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      showWork(Number(card.dataset.workIndex));
    }
  });

  close.addEventListener('click', hideWork);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detail.getAttribute('aria-hidden') === 'false') hideWork();
  });
})();
