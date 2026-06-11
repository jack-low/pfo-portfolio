/* ui.js — theme toggle, mobile menu, glitch, back-to-top, footer year,
   optional social link. Accessible: keyboard + ARIA state kept in sync. */
(function () {
  const root = document.documentElement;
  const cfg = window.SITE_CONFIG || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- theme (persisted) ---- */
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('jacklow-theme');
  if (saved) root.setAttribute('data-theme', saved);

  function syncToggle() {
    if (!toggle) return;
    const light = root.getAttribute('data-theme') === 'light';
    toggle.setAttribute('aria-checked', light ? 'true' : 'false');
  }
  syncToggle();

  function flipTheme() {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('jacklow-theme', next);
    syncToggle();
  }
  if (toggle) {
    toggle.addEventListener('click', flipTheme);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); flipTheme(); }
    });
  }

  /* ---- mobile menu ---- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    }
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (burger) burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  if (menu) menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); burger && burger.focus(); }
  });

  /* ---- glitch on hero name ---- */
  const glitch = document.getElementById('glitch-name');
  if (glitch && !reduce) {
    const fire = () => {
      glitch.setAttribute('data-active', '');
      setTimeout(() => glitch.removeAttribute('data-active'), 800);
    };
    setTimeout(fire, 1400);
    setInterval(fire, 5200);
  }

  /* ---- back to top ---- */
  const toTop = document.getElementById('to-top');
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---- footer year ---- */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---- optional social link (config-driven) ---- */
  const side = document.querySelector('.contact-side');
  const gh = cfg.social && cfg.social.github;
  if (side && gh && gh.enabled && gh.url) {
    const a = document.createElement('a');
    a.className = 'panel contact-card';
    a.href = gh.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/></svg></span>' +
      '<span><span class="lb">GITHUB</span><br><span class="vl">' + (gh.handle || 'GitHub') + '</span></span>';
    side.appendChild(a);
  }
})();
