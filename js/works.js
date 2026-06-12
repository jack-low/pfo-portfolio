/* works.js - verified local projects and generated editorial thumbnails. */
(function () {
  const works = [
    {
      title: 'Video Studio Bridge',
      desc: '絵コンテ画像、音声、Wan 2.2をつなぎ、動画生成ジョブを一つのWeb Studioで管理。',
      tags: ['TypeScript', 'React', 'Fastify', 'ComfyUI'],
      image: 'assets/projects/video-studio.png',
      link: ''
    },
    {
      title: 'Codex Remote Support',
      desc: '承認、監査ログ、Telegram画像送受信まで備えた、Codex向けリモート支援基盤。',
      tags: ['TypeScript', 'WebSocket', 'Telegram', 'LM Studio'],
      image: 'assets/projects/remote-support.png',
      link: 'https://github.com/jack-low/codex-remote-support'
    },
    {
      title: 'AI VTuber Control',
      desc: 'LLM、長期記憶、日本語音声、VTube Studioを統合したローカル優先の制御アプリ。',
      tags: ['FastAPI', 'Live2D', 'Irodori-TTS', 'WebSocket'],
      image: 'assets/projects/ai-vtuber.png',
      link: ''
    },
    {
      title: 'FAQ RAG Bot',
      desc: '操作マニュアルを検索し、ローカルLLMで回答を整形する業務FAQボットMVP。',
      tags: ['Python', 'FastAPI', 'RAG', 'Docker'],
      image: 'assets/projects/faq-rag.png',
      link: ''
    },
    {
      title: '研修CBTシステム',
      desc: '動画研修、設問、受講結果を軽量構成で扱う、DBレスの社内研修Webシステム。',
      tags: ['PHP', 'JavaScript', 'Nginx', 'Docker'],
      image: 'assets/projects/training-cbt.png',
      link: ''
    },
    {
      title: 'solo-map AI Commerce',
      desc: 'AIエージェントの導入、権限、購入、履歴を一つの体験にまとめるコマース基盤。',
      tags: ['React', 'FastAPI', 'PostgreSQL', 'Stripe'],
      image: 'assets/projects/solo-map.png',
      link: 'https://demo.solo-map.app'
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
      ? `<a class="work-link" href="${esc(w.link)}" target="_blank" rel="noopener noreferrer">見る <span class="ext" aria-hidden="true">${ext}</span></a>`
      : '';
    const cornerExt = w.link ? `<span class="ext" aria-hidden="true">${ext}</span>` : '';
    return `
    <article class="panel work-card reveal" style="--d:${i * 70}ms">
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
})();
