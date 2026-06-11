/* neural.js — animated neural-network "brain" in the hero */
(function () {
  const canvas = document.getElementById('brain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, DPR, nodes = [], edges = [], pulses = [];

  // rough brain hemisphere outline (normalized 0..1)
  const outline = [
    [0.20, 0.55], [0.18, 0.42], [0.24, 0.30], [0.36, 0.22], [0.50, 0.20],
    [0.64, 0.23], [0.74, 0.30], [0.80, 0.40], [0.82, 0.52], [0.78, 0.64],
    [0.70, 0.74], [0.58, 0.80], [0.46, 0.81], [0.34, 0.77], [0.25, 0.68],
  ];

  function inside(px, py) {
    let c = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const xi = outline[i][0], yi = outline[i][1], xj = outline[j][0], yj = outline[j][1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = canvas.width = r.width * DPR;
    H = canvas.height = r.height * DPR;
    build();
  }

  function build() {
    nodes = [];
    let tries = 0;
    const target = 36;
    while (nodes.length < target && tries < 2000) {
      tries++;
      const nx = Math.random(), ny = Math.random();
      if (!inside(nx, ny)) continue;
      let ok = true;
      for (const n of nodes) { if (Math.hypot(n.nx - nx, n.ny - ny) < 0.09) { ok = false; break; } }
      if (ok) nodes.push({ nx, ny, ph: Math.random() * Math.PI * 2 });
    }
    nodes.forEach(n => { n.x = n.nx * W; n.y = n.ny * H; });
    // connect nearest neighbours
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const d = nodes.map((n, j) => ({ j, dist: Math.hypot(n.nx - nodes[i].nx, n.ny - nodes[i].ny) }))
        .filter(o => o.j !== i).sort((a, b) => a.dist - b.dist).slice(0, 3);
      d.forEach(o => { if (i < o.j) edges.push([i, o.j]); });
    }
  }

  function spawnPulse() {
    if (!edges.length) return;
    const e = edges[(Math.random() * edges.length) | 0];
    pulses.push({ a: e[0], b: e[1], t: 0, sp: 0.012 + Math.random() * 0.02 });
  }

  let t = 0;
  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // edges
    for (const [i, j] of edges) {
      const a = nodes[i], b = nodes[j];
      ctx.strokeStyle = 'rgba(52,227,255,0.16)';
      ctx.lineWidth = DPR * 0.7;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // pulses traveling along edges
    for (let k = pulses.length - 1; k >= 0; k--) {
      const p = pulses[k];
      p.t += p.sp;
      const a = nodes[p.a], b = nodes[p.b];
      const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6 * DPR);
      g.addColorStop(0, 'rgba(180,245,255,0.95)');
      g.addColorStop(1, 'rgba(180,245,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 6 * DPR, 0, 7); ctx.fill();
      if (p.t >= 1) pulses.splice(k, 1);
    }

    // nodes
    for (const n of nodes) {
      const glow = 0.6 + Math.sin(t * 2 + n.ph) * 0.4;
      const rr = (1.6 + glow * 1.4) * DPR;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr * 3);
      g.addColorStop(0, `rgba(120,220,255,${0.5 + glow * 0.4})`);
      g.addColorStop(1, 'rgba(120,220,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y, rr * 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#dff6ff';
      ctx.beginPath(); ctx.arc(n.x, n.y, rr * 0.6, 0, 7); ctx.fill();
    }

    if (!reduce) requestAnimationFrame(frame);
  }

  addEventListener('resize', resize, { passive: true });
  resize();
  frame();
  if (!reduce) setInterval(spawnPulse, 260);
})();
