/* typing.js - fixed-height terminal loop */
(function () {
  const body = document.getElementById('terminal-body');
  if (!body) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let horizontalPosition = 0;
  let pointerScrolling = false;

  body.addEventListener('pointerdown', () => { pointerScrolling = true; });
  window.addEventListener('pointerup', () => { pointerScrolling = false; });
  body.addEventListener('scroll', () => {
    if (pointerScrolling) horizontalPosition = body.scrollLeft;
  }, { passive: true });
  body.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) > 0 || event.shiftKey) {
      requestAnimationFrame(() => { horizontalPosition = body.scrollLeft; });
    }
  }, { passive: true });

  const lines = [
    [{ c: 'tok-com', t: '# 今日も面倒をコードに押しつける' }],
    [{ c: 'tok-kw', t: 'from' }, { c: '', t: ' reality ' }, { c: 'tok-kw', t: 'import' }, { c: 'tok-var', t: ' 面倒' }],
    [{ c: 'tok-kw', t: 'from' }, { c: '', t: ' caffeine ' }, { c: 'tok-kw', t: 'import' }, { c: 'tok-var', t: ' 判断力' }],
    [],
    [{ c: 'tok-kw', t: 'def' }, { c: '', t: ' ' }, { c: 'tok-fn', t: 'work' }, { c: '', t: '(' }, { c: 'tok-var', t: 'request' }, { c: '', t: '):' }],
    [{ c: '', t: '    ' }, { c: 'tok-kw', t: 'while' }, { c: '', t: ' request.' }, { c: 'tok-fn', t: 'is_annoying' }, { c: '', t: '():' }],
    [{ c: '', t: '        request = ' }, { c: 'tok-fn', t: 'automate' }, { c: '', t: '(request)' }],
    [{ c: '', t: '    ' }, { c: 'tok-kw', t: 'return' }, { c: 'tok-str', t: ' "人間はコーヒーを飲む"' }],
    [],
    [{ c: 'tok-var', t: 'deadline' }, { c: '', t: ' = ' }, { c: 'tok-fn', t: 'estimate' }, { c: '', t: '(' }, { c: 'tok-str', t: '"昨日"' }, { c: '', t: ')' }],
    [{ c: 'tok-var', t: 'result' }, { c: '', t: ' = ' }, { c: 'tok-fn', t: 'work' }, { c: '', t: '(' }, { c: 'tok-var', t: '面倒' }, { c: '', t: ')' }],
    [{ c: 'tok-fn', t: 'deploy' }, { c: '', t: '(' }, { c: 'tok-var', t: 'result' }, { c: '', t: ', ' }, { c: 'tok-var', t: 'tests' }, { c: '', t: '=' }, { c: 'tok-kw', t: 'True' }, { c: '', t: ')' }],
  ];

  const caret = document.createElement('span');
  caret.className = 'caret';

  function makeLine(idx) {
    const div = document.createElement('div');
    div.className = 'code-line';
    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.textContent = String(idx + 1).padStart(2, ' ');
    div.appendChild(ln);
    return div;
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function followOutput() {
    body.scrollTop = body.scrollHeight;
    body.scrollLeft = horizontalPosition;
  }

  async function type() {
    if (reduce) { renderInstant(); return; }
    body.textContent = '';
    body.scrollTo(0, 0);
    for (let i = 0; i < lines.length; i++) {
      const lineEl = makeLine(i);
      body.appendChild(lineEl);
      lineEl.appendChild(caret);
      followOutput();
      for (const tok of lines[i]) {
        const span = document.createElement('span');
        if (tok.c) span.className = tok.c;
        lineEl.insertBefore(span, caret);
        for (const ch of tok.t) {
          span.textContent += ch;
          followOutput();
          await sleep(10 + Math.random() * 18);
        }
      }
      await sleep(45);
    }
    caret.remove();
    // output block
    const out = document.createElement('div');
    out.className = 'term-out';
    out.innerHTML = '<span class="pfx">$</span> python main.py --no-meetings';
    body.appendChild(out);
    followOutput();
    await sleep(400);
    const ok = document.createElement('div');
    ok.className = 'term-out';
    ok.style.color = 'var(--cyan)';
    ok.textContent = '面倒: 0件 / コーヒー: 1杯 / テスト: PASS';
    body.appendChild(ok);
    followOutput();
    await sleep(300);
    const done = document.createElement('div');
    done.className = 'term-out';
    done.innerHTML = '<span class="pfx">&gt;</span> 定時なので、本番だけ見て帰ります。 ' ;
    done.appendChild(caret);
    body.appendChild(done);
    followOutput();
    await sleep(4200);
    caret.remove();
    type();
  }

  function renderInstant() {
    lines.forEach((toks, i) => {
      const lineEl = makeLine(i);
      toks.forEach(tok => {
        const span = document.createElement('span');
        if (tok.c) span.className = tok.c;
        span.textContent = tok.t;
        lineEl.appendChild(span);
      });
      body.appendChild(lineEl);
    });
    const out = document.createElement('div');
    out.className = 'term-out';
    out.innerHTML = '<span class="pfx">$</span> python main.py --no-meetings<br>面倒: 0件 / コーヒー: 1杯 / テスト: PASS<br><span class="pfx">&gt;</span> 定時なので、本番だけ見て帰ります。';
    body.appendChild(out);
    followOutput();
  }

  // start typing once hero terminal is on screen
  window.onView(body, () => setTimeout(type, 500), 0.25);
})();
