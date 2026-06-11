/* scroll.js — reveal-on-scroll, scrollspy, counters, nav state (rect-based) */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal */
  const revealEls = document.querySelectorAll('.reveal, .reveal-x');
  if (reduce) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    revealEls.forEach(el => window.onView(el, () => el.classList.add('in'), 0.12));
  }

  /* counters */
  document.querySelectorAll('[data-count]').forEach(el => {
    window.onView(el, () => {
      const target = parseInt(el.dataset.count, 10);
      if (reduce) { el.textContent = target; return; }
      let n = 0; const step = Math.max(1, Math.ceil(target / 30));
      const tick = () => {
        n = Math.min(target, n + step);
        el.textContent = n;
        if (n < target) setTimeout(() => requestAnimationFrame(tick), 28);
      };
      tick();
    }, 0.5);
  });

  /* scrollspy (scroll-position based) */
  const sections = ['top', 'about', 'skills', 'works', 'timeline', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('[data-nav]');
  const railLinks = document.querySelectorAll('[data-rail]');
  let current = '';
  function setActive(id) {
    if (id === current) return; current = id;
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
    railLinks.forEach(a => a.classList.toggle('active', a.dataset.rail === id));
  }
  const nav = document.getElementById('nav');
  function onScroll() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0]?.id;
    for (const s of sections) { if (s.offsetTop <= mid) active = s.id; }
    setActive(active);
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();
})();
